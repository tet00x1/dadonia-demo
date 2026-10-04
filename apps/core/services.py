"""
Business logic shared by the server-rendered pages and the JSON API, so both
entry points behave identically (same limits, same saved data, same alerts).
"""
import logging
import threading
from datetime import timedelta

from django.conf import settings
from django.core.mail import EmailMessage
from django.db import transaction
from django.utils import timezone

from apps.audit.middleware import extract_client_ip
from apps.core.models import Inquiry

logger = logging.getLogger(__name__)

INQUIRY_LIMIT = 5
INQUIRY_WINDOW_MINUTES = 15


def is_ip_rate_limited(ip_address, max_attempts=INQUIRY_LIMIT, window_minutes=INQUIRY_WINDOW_MINUTES):
    """True when this IP already sent `max_attempts` inquiries inside the window."""
    if not ip_address:
        return False
    since = timezone.now() - timedelta(minutes=window_minutes)
    recent = Inquiry.objects.filter(ip_address=ip_address, created_at__gte=since).count()
    return recent >= max_attempts


def _one_line(text, limit=120):
    return ' '.join(str(text).split())[:limit]


def notify_team(inquiry):
    """E-mail the sales team about a new inquiry. Never raises: a mail outage
    must not turn a successfully stored inquiry into an error for the visitor."""
    recipients = settings.INQUIRY_NOTIFY_EMAILS
    if not recipients:
        return
    admin_url = f"{settings.SITE_URL}/admin/core/inquiry/{inquiry.pk}/change/"
    body = (
        f"وصل طلب جديد عبر الموقع - المرجع {inquiry.reference}\n\n"
        f"الاسم: {inquiry.name}\n"
        f"الهاتف / واتساب: {inquiry.phone}\n"
        f"البريد: {inquiry.email or '—'}\n\n"
        f"نص الطلب:\n{inquiry.message}\n\n"
        f"فتح الطلب في لوحة الإدارة:\n{admin_url}\n"
    )
    message = EmailMessage(
        subject=f"طلب جديد {inquiry.reference} - {_one_line(inquiry.name, 60)}",
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=list(recipients),
        reply_to=[inquiry.email] if inquiry.email else None,
    )
    try:
        message.send()
    except Exception:
        logger.exception('Could not send notification e-mail for inquiry %s', inquiry.pk)


def save_inquiry(form, request):
    """Persist a validated InquiryForm, stamp the sender's IP and alert the team
    (in the background, after the row is committed)."""
    inquiry = form.save(commit=False)
    inquiry.ip_address = extract_client_ip(request) or None
    inquiry.save()
    transaction.on_commit(
        lambda: threading.Thread(target=notify_team, args=(inquiry,), daemon=True).start()
    )
    return inquiry
