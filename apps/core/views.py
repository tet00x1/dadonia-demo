from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from django.db.models import Q
from django.core.paginator import Paginator

from apps.core.models import Product, Shipment, Inquiry
from apps.core.forms import InquiryForm
from apps.audit.middleware import extract_client_ip
from apps.core.services import is_ip_rate_limited, save_inquiry

def home_view(request):
    featured_products = Product.objects.filter(is_active=True)[:6]
    recent_shipments = Shipment.objects.select_related('product')[:6]
    
    # Calculate key metrics
    total_products = Product.objects.filter(is_active=True).count()
    total_shipments = Shipment.objects.count()
    delivered_shipments = Shipment.objects.filter(status='delivered').count()

    context = {
        'featured_products': featured_products,
        'recent_shipments': recent_shipments,
        'stats': {
            'products': total_products,
            'shipments': total_shipments,
            'delivered': delivered_shipments,
            'ports': 6, # Alexandria, Port Said, Damietta, Sokhna, Adabiya, Dekheila
        }
    }
    return render(request, 'core/home.html', context)


def products_view(request):
    queryset = Product.objects.filter(is_active=True)
    category = request.GET.get('category', '').strip()
    query = request.GET.get('q', '').strip()

    if category:
        queryset = queryset.filter(category=category)
    if query:
        queryset = queryset.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(origin__icontains=query)
        )

    categories = Product.CATEGORY_CHOICES
    
    # Count products per category
    category_counts = {}
    for code, label in categories:
        count = Product.objects.filter(is_active=True, category=code).count()
        category_counts[code] = {'label': label, 'count': count}

    paginator = Paginator(queryset, 9)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'categories': categories,
        'category_counts': category_counts,
        'selected_category': category,
        'query': query,
        'total_count': queryset.count(),
    }
    return render(request, 'core/products.html', context)


def about_view(request):
    return render(request, 'core/about.html')


def contact_view(request):
    ip = extract_client_ip(request)

    if request.method == 'POST':
        # Check rate limit
        if is_ip_rate_limited(ip, max_attempts=5, window_minutes=15):
            messages.error(
                request,
                'تم تجاوز الحد المسموح لإرسال الطلبات مؤقتاً لحماية المنظومة. يرجى الانتظار بضع دقائق ثم المحاولة مجدداً.'
            )
            form = InquiryForm(request.POST)
            return render(request, 'core/contact.html', {'form': form})

        form = InquiryForm(request.POST)
        if form.is_valid():
            inquiry = save_inquiry(form, request)
            messages.success(
                request,
                f'تم استلام طلبكم بنجاح ورقم المرجع {inquiry.reference}. سيتواصل معكم مسؤول قسم التجارة الخارجية والعمليات خلال ساعات العمل الرسمية.'
            )
            return redirect('contact')
        else:
            messages.error(request, 'يرجى مراجعة وتصحيح الحقول الموضحة أدناه.')
    else:
        # Pre-fill subject if directed from a product inquiry button
        initial_msg = ''
        product_id = request.GET.get('product')
        if product_id:
            product = Product.objects.filter(id=product_id).first()
            if product:
                initial_msg = f'استفسار بشأن توريد وتصدير: {product.name} ({product.get_category_display()})'
        if not initial_msg:
            initial_msg = request.GET.get('message', '').strip()[:1000]
        form = InquiryForm(initial={'message': initial_msg} if initial_msg else None)

    return render(request, 'core/contact.html', {'form': form})


def track_view(request):
    ref = request.GET.get('ref', '').strip()
    shipment = None
    not_found = False

    if ref:
        shipment = Shipment.objects.filter(reference__iexact=ref).select_related('product').first()
        if not shipment:
            not_found = True

    return render(request, 'core/track.html', {
        'ref': ref,
        'shipment': shipment,
        'not_found': not_found,
    })


def seasonality_view(request):
    """
    Interactive Egyptian agricultural export calendar showing
    harvest windows, peak supply, and cold storage availability.
    """
    calendar_data = [
        {
            'crop': 'برتقال صيفي فالنسيا (Valencia Oranges)',
            'category': 'حمضيات وموالح',
            'temp': '+3°C إلى +5°C',
            'hs': '0805.10',
            'months': {
                1: 'start', 2: 'peak', 3: 'peak', 4: 'peak', 5: 'peak', 6: 'end',
                7: 'none', 8: 'none', 9: 'none', 10: 'none', 11: 'none', 12: 'none'
            }
        },
        {
            'crop': 'برتقال أبو سرة (Navel Oranges)',
            'category': 'حمضيات وموالح',
            'temp': '+3°C إلى +5°C',
            'hs': '0805.10',
            'months': {
                1: 'peak', 2: 'end', 3: 'none', 4: 'none', 5: 'none', 6: 'none',
                7: 'none', 8: 'none', 9: 'none', 10: 'none', 11: 'start', 12: 'peak'
            }
        },
        {
            'crop': 'تمور مجدول فاخرة (Medjool Dates)',
            'category': 'فواكه مجففة وتمرية',
            'temp': '-18°C إلى 0°C',
            'hs': '0804.10',
            'months': {
                1: 'storage', 2: 'storage', 3: 'storage', 4: 'storage', 5: 'storage', 6: 'storage',
                7: 'storage', 8: 'none', 9: 'start', 10: 'peak', 11: 'peak', 12: 'storage'
            }
        },
        {
            'crop': 'بصل أحمر وذهبي جاف (Dry Onions)',
            'category': 'خضروات بصلية',
            'temp': '+2°C إلى +4°C',
            'hs': '0703.10',
            'months': {
                1: 'none', 2: 'start', 3: 'peak', 4: 'peak', 5: 'peak', 6: 'peak',
                7: 'peak', 8: 'end', 9: 'storage', 10: 'storage', 11: 'none', 12: 'none'
            }
        },
        {
            'crop': 'فراولة سريعة التجميد (IQF Strawberries)',
            'category': 'خضروات وفواكه مجمدة',
            'temp': '-18°C تجميد مستمر',
            'hs': '0811.10',
            'months': {
                1: 'peak', 2: 'peak', 3: 'peak', 4: 'peak', 5: 'storage', 6: 'storage',
                7: 'storage', 8: 'storage', 9: 'storage', 10: 'storage', 11: 'start', 12: 'peak'
            }
        },
        {
            'crop': 'ثوم مصري أحمر وأبيض (Fresh Garlic)',
            'category': 'خضروات بصلية',
            'temp': '0°C إلى +2°C',
            'hs': '0703.20',
            'months': {
                1: 'none', 2: 'start', 3: 'peak', 4: 'peak', 5: 'end', 6: 'storage',
                7: 'none', 8: 'none', 9: 'none', 10: 'none', 11: 'none', 12: 'none'
            }
        },
        {
            'crop': 'رمان وندرفل تصديري (Wonderful Pomegranate)',
            'category': 'فواكه طازجة',
            'temp': '+5°C إلى +6°C',
            'hs': '0810.90',
            'months': {
                1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none', 6: 'none',
                7: 'none', 8: 'start', 9: 'peak', 10: 'peak', 11: 'end', 12: 'none'
            }
        },
        {
            'crop': 'أعشاب ونباتات طبية وبابونج (Herbs & Spices)',
            'category': 'محاصيل عطرية وطبية',
            'temp': 'جاف مهوى (<20°C)',
            'hs': '1211.90',
            'months': {
                1: 'start', 2: 'peak', 3: 'peak', 4: 'peak', 5: 'peak', 6: 'storage',
                7: 'storage', 8: 'storage', 9: 'storage', 10: 'storage', 11: 'storage', 12: 'storage'
            }
        }
    ]

    months_labels = [
        (1, 'يناير'), (2, 'فبراير'), (3, 'مارس'), (4, 'إبريل'),
        (5, 'مايو'), (6, 'يونيو'), (7, 'يوليو'), (8, 'أغسطس'),
        (9, 'سبتمبر'), (10, 'أكتوبر'), (11, 'نوفمبر'), (12, 'ديسمبر')
    ]

    current_month = timezone.now().month

    return render(request, 'core/seasonality.html', {
        'calendar_data': calendar_data,
        'months_labels': months_labels,
        'current_month': current_month,
    })


def custom_404(request, exception=None):
    return render(request, '404.html', status=404)


def custom_500(request):
    return render(request, '500.html', status=500)
