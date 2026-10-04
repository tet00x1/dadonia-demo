"""
JSON endpoints used by the React front end (reached through the Express proxy
under /api/). They share models, validation, honeypot and rate limiting with
the server-rendered Django pages (see services.py).

Every response, including errors, is JSON with a stable shape so the front end
never has to guess what a failure looks like:

    success  -> {...payload}                      (2xx)
    failure  -> {"ok": false, "error": "<code>"}  (+ "message" / "fields")
"""
import functools
import json
import logging
import re

from django.core.cache import cache
from django.db.models import Count, Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from apps.audit.middleware import extract_client_ip
from apps.core.forms import InquiryForm
from apps.core.models import Product, Shipment
from apps.core.services import INQUIRY_LIMIT, INQUIRY_WINDOW_MINUTES, is_ip_rate_limited, save_inquiry

logger = logging.getLogger(__name__)

MAX_BODY_BYTES = 20_000
TRACK_REF_PATTERN = re.compile(r'^[A-Za-z0-9._/\- ]{3,50}$')


# ---------------------------------------------------------------- helpers

def _error(code, status, **extra):
    return JsonResponse({'ok': False, 'error': code, **extra}, status=status)


def api_endpoint(*methods):
    """Restrict a view to the given HTTP methods and answer others with JSON 405."""
    allowed = {m.upper() for m in methods}
    if 'GET' in allowed:
        allowed.add('HEAD')

    def decorator(view):
        @functools.wraps(view)
        def wrapper(request, *args, **kwargs):
            if request.method not in allowed:
                response = _error('method_not_allowed', 405)
                response['Allow'] = ', '.join(sorted(allowed))
                return response
            return view(request, *args, **kwargs)
        return wrapper
    return decorator


def _throttled(bucket, ip, limit, window_seconds):
    """Small fixed-window counter kept in the Django cache (per process)."""
    key = f'throttle:{bucket}:{ip or "unknown"}'
    if cache.add(key, 1, window_seconds):
        return False
    try:
        return cache.incr(key) > limit
    except ValueError:  # key expired between add() and incr()
        cache.set(key, 1, window_seconds)
        return False


def _product_to_dict(p):
    return {
        'id': p.id,
        'name': p.name,
        'category': p.category,
        'category_label': p.get_category_display(),
        'description': p.description,
        'origin': p.origin,
        'hs_code': p.hs_code,
        'harvest_season': p.harvest_season,
        'packaging_type': p.packaging_type,
        'temperature_range': p.temperature_range,
        'caliber_specs': p.caliber_specs,
        'image': p.image.url if p.image else None,  # relative: served via the /media proxy
    }


# -------------------------------------------------------------- endpoints

@api_endpoint('GET')
def api_products(request):
    active = Product.objects.filter(is_active=True)
    category = request.GET.get('category', '').strip()[:50]
    query = request.GET.get('q', '').strip()[:100]

    qs = active
    if category:
        qs = qs.filter(category=category)
    if query:
        qs = qs.filter(
            Q(name__icontains=query) | Q(description__icontains=query) | Q(origin__icontains=query)
        )

    # one grouped query instead of one COUNT per category
    counts = dict(active.order_by().values_list('category').annotate(n=Count('id')))

    response = JsonResponse({
        'products': [_product_to_dict(p) for p in qs[:60]],
        'categories': [
            {'code': code, 'label': label, 'count': counts.get(code, 0)}
            for code, label in Product.CATEGORY_CHOICES
        ],
        'total': qs.count(),
    })
    response['Cache-Control'] = 'public, max-age=30'
    return response


@api_endpoint('GET')
def api_track(request):
    ip = extract_client_ip(request)
    if _throttled('track', ip, limit=30, window_seconds=60):
        response = _error(
            'rate_limited', 429,
            message='عدد كبير من الاستعلامات في وقت قصير. يرجى الانتظار دقيقة ثم المحاولة مجدداً.',
        )
        response['Retry-After'] = '60'
        return response

    ref = request.GET.get('ref', '').strip()
    if not ref:
        return _error('missing_ref', 400)

    shipment = None
    if TRACK_REF_PATTERN.match(ref):
        shipment = Shipment.objects.filter(reference__iexact=ref).select_related('product').first()

    if shipment is None:
        response = JsonResponse({'found': False, 'ref': ref[:50]}, status=404)
    else:
        response = JsonResponse({
            'found': True,
            'reference': shipment.reference,
            'kind': shipment.kind,
            'kind_label': shipment.get_kind_display(),
            'product': shipment.product.name,
            'country': shipment.country,
            'quantity': shipment.quantity,
            'status': shipment.status,
            'status_label': shipment.get_status_display(),
            'notes': shipment.notes,
            'created_at': shipment.created_at.strftime('%Y-%m-%d %H:%M'),
            'updated_at': shipment.updated_at.strftime('%Y-%m-%d %H:%M'),
        })
    response['Cache-Control'] = 'no-store'
    return response


# Public contact form. It performs no session-based action, so classic CSRF does
# not apply; instead we require a JSON content type (which a cross-site form
# cannot send without a CORS preflight) and keep the honeypot + per-IP limit.
@csrf_exempt
@api_endpoint('POST')
def api_inquiry(request):
    if request.content_type != 'application/json':
        return _error('unsupported_media_type', 415)
    try:
        declared = int(request.META.get('CONTENT_LENGTH') or 0)
    except ValueError:
        declared = 0
    if declared > MAX_BODY_BYTES:
        return _error('payload_too_large', 413)

    try:
        payload = json.loads(request.body.decode('utf-8') or '{}')
    except (ValueError, UnicodeDecodeError):
        return _error('invalid_json', 400)
    if not isinstance(payload, dict):
        return _error('invalid_json', 400)

    def field(name, limit):
        value = payload.get(name, '')
        return value[:limit] if isinstance(value, str) else ''

    ip = extract_client_ip(request)

    # Bots fill the hidden field. Answer "success" so they get no signal to adapt to.
    if field('website_url', 200).strip():
        logger.warning('Honeypot triggered by %s', ip)
        return JsonResponse({'ok': True, 'id': 0, 'reference': ''})

    if is_ip_rate_limited(ip, INQUIRY_LIMIT, INQUIRY_WINDOW_MINUTES):
        response = _error(
            'rate_limited', 429,
            message='تم تجاوز الحد المسموح لإرسال الطلبات مؤقتاً. يرجى الانتظار بضع دقائق ثم المحاولة مجدداً، '
                    'أو التواصل معنا مباشرة عبر الهاتف أو واتساب.',
        )
        response['Retry-After'] = str(INQUIRY_WINDOW_MINUTES * 60)
        return response

    form = InquiryForm({
        'name': field('name', 300),
        'phone': field('phone', 100),
        'email': field('email', 300),
        'message': field('message', 6000),
    })
    if not form.is_valid():
        return _error('validation', 400, fields={k: v[0] for k, v in form.errors.items()})

    inquiry = save_inquiry(form, request)
    return JsonResponse({'ok': True, 'id': inquiry.id, 'reference': inquiry.reference}, status=201)


@api_endpoint('GET')
def api_health(request):
    """Readiness probe for the proxy / hosting platform: confirms the DB answers."""
    try:
        Product.objects.exists()
    except Exception:
        logger.exception('Health check failed')
        return JsonResponse({'status': 'degraded', 'db': 'error'}, status=503)
    response = JsonResponse({'status': 'ok', 'db': 'ok'})
    response['Cache-Control'] = 'no-store'
    return response


@csrf_exempt
def api_not_found(request, *args, **kwargs):
    return _error('not_found', 404)
