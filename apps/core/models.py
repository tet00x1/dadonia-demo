from django.db import models
from django.utils.translation import gettext_lazy as _

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('agricultural', 'حاصلات زراعية وفواكه طازجة'),
        ('commodities', 'سلع استراتيجية وسكر أبيض وحبوب تموينية'),
        ('vegetables', 'خضروات مجمدة ومحاصيل تصنيعية'),
        ('cotton_textiles', 'قطن مصري ومنسوجات راقية'),
        ('herbs_spices', 'أعشاب طبية وتوابل عطرية'),
        ('industrial', 'كيماويات وأسمدة ومواد صناعية'),
        ('building_materials', 'سيراميك ومواد عزل وبناء'),
    ]

    name = models.CharField(_('اسم المنتج'), max_length=200)
    category = models.CharField(_('التصنيف'), max_length=50, choices=CATEGORY_CHOICES, db_index=True)
    description = models.TextField(_('الوصف والمواصفات الفنية'))
    origin = models.CharField(_('بلد المنشأ'), max_length=100, default='جمهورية مصر العربية')
    hs_code = models.CharField(_('الرمز الجمركي المنسق (HS Code)'), max_length=20, blank=True, default='')
    harvest_season = models.CharField(_('موسم الحصاد والتصدير الميداني'), max_length=120, blank=True, default='')
    packaging_type = models.CharField(_('مواصفات التعبئة والتغليف التصديري'), max_length=150, blank=True, default='')
    temperature_range = models.CharField(_('درجة حرارة النقل المبرد الموصى بها'), max_length=50, blank=True, default='')
    caliber_specs = models.CharField(_('المعايرة والأحجام التصديرية القياسية'), max_length=150, blank=True, default='')
    image = models.ImageField(_('صورة المنتج'), upload_to='products/', blank=True, null=True)
    is_active = models.BooleanField(_('نشط ومتاح للتوريد'), default=True, db_index=True)
    created_at = models.DateTimeField(_('تاريخ الإضافة'), auto_now_add=True)
    updated_at = models.DateTimeField(_('آخر تحديث'), auto_now=True)

    class Meta:
        verbose_name = _('منتج تجاري')
        verbose_name_plural = _('دليل المنتجات')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Shipment(models.Model):
    KIND_CHOICES = [
        ('export', 'تصدير خارجي'),
        ('import', 'استيراد وارد'),
    ]

    STATUS_CHOICES = [
        ('preparing', 'قيد التجهيز والتعبئة'),
        ('shipped', 'أبحرت / قيد الشحن البحري والجوي'),
        ('customs', 'قيد التخليص الجمركي والفحص الرقابي'),
        ('delivered', 'تم التسليم وإتمام الإفراج النهائي'),
    ]

    reference = models.CharField(_('رقم البوليصة / الشحنة'), max_length=50, unique=True, db_index=True)
    kind = models.CharField(_('نوع العملية'), max_length=20, choices=KIND_CHOICES, default='export')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='shipments', verbose_name=_('المنتج'))
    country = models.CharField(_('دولة الوجهة / المصدر'), max_length=100)
    quantity = models.CharField(_('الكمية وحجم الحاوية'), max_length=150, help_text='مثال: 25 طن - حاوية مبردة 40 قدم')
    status = models.CharField(_('حالة الشحنة'), max_length=30, choices=STATUS_CHOICES, default='preparing', db_index=True)
    notes = models.TextField(_('ملاحظات الميناء والتوثيق'), blank=True)
    created_at = models.DateTimeField(_('تاريخ إنشاء الشحنة'), auto_now_add=True)
    updated_at = models.DateTimeField(_('آخر تحديث'), auto_now=True)

    class Meta:
        verbose_name = _('شحنة لوجستية')
        verbose_name_plural = _('سجل الشحنات والعمليات')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference} - {self.get_kind_display()} ({self.product.name})"


class Inquiry(models.Model):
    name = models.CharField(_('اسم العميل / المؤسسة'), max_length=150)
    phone = models.CharField(_('رقم الهاتف / الواتساب'), max_length=40)
    email = models.EmailField(_('البريد الإلكتروني'), blank=True, null=True)
    message = models.TextField(_('تفاصيل الطلب أو الاستفسار'))
    handled = models.BooleanField(_('تمت المتابعة والمعالجة'), default=False, db_index=True)
    ip_address = models.GenericIPAddressField(_('عنوان IP للمرسل'), blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(_('تاريخ الإرسال'), auto_now_add=True)

    class Meta:
        verbose_name = _('طلب استفسار وتوريد')
        verbose_name_plural = _('طلبات الاستفسار والعملاء')
        ordering = ['-created_at']

    @property
    def reference(self):
        """Human-friendly reference number given to the customer, e.g. DAD-2026-00042."""
        year = self.created_at.year if self.created_at else ''
        return f'DAD-{year}-{self.pk:05d}' if self.pk else ''

    def __str__(self):
        status_text = "تمت المتابعة" if self.handled else "جديد قيد الانتظار"
        return f"طلب من {self.name} ({status_text}) - {self.created_at.strftime('%Y-%m-%d')}"
