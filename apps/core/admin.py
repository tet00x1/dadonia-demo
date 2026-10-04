from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from apps.core.models import Product, Shipment, Inquiry

# Customize admin site appearance
admin.site.site_header = "شركة دادونيا للتجارة الدولية - الإدارة المركزية"
admin.site.site_title = "منظومة دادونيا التجارية"
admin.site.index_title = "إدارة البيانات والعمليات اللوجستية"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_badge', 'origin', 'is_active_badge', 'created_at_fmt')
    list_filter = ('category', 'is_active', 'origin')
    search_fields = ('name', 'description', 'origin')
    list_per_page = 25
    fieldsets = (
        (_('البيانات الأساسية'), {
            'fields': ('name', 'category', 'origin', 'is_active')
        }),
        (_('المواصفات الفنية'), {
            'fields': ('description', 'image')
        }),
    )

    @admin.display(description=_('التصنيف'), ordering='category')
    def category_badge(self, obj):
        return obj.get_category_display()

    @admin.display(description=_('الحالة'))
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: #2e7d32; font-weight: bold;">● متاح للتوريد</span>')
        return format_html('<span style="color: #c62828; font-weight: bold;">✕ غير متاح</span>')

    @admin.display(description=_('تاريخ الإضافة'), ordering='created_at')
    def created_at_fmt(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'kind_badge', 'product', 'country', 'quantity', 'status_badge', 'created_at_fmt')
    list_filter = ('kind', 'status', 'created_at')
    search_fields = ('reference', 'country', 'product__name', 'notes')
    autocomplete_fields = ('product',)
    list_per_page = 25
    date_hierarchy = 'created_at'

    fieldsets = (
        (_('بيانات الشحنة والتعاقد'), {
            'fields': ('reference', 'kind', 'product', 'country', 'quantity')
        }),
        (_('الحالة والمتابعة اللوجستية'), {
            'fields': ('status', 'notes')
        }),
    )

    @admin.display(description=_('نوع العملية'), ordering='kind')
    def kind_badge(self, obj):
        color = '#1b4965' if obj.kind == 'export' else '#8d5b4c'
        return format_html(
            '<span style="background-color: {}; color: #fff; padding: 2px 7px; border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_kind_display()
        )

    @admin.display(description=_('حالة الشحنة'), ordering='status')
    def status_badge(self, obj):
        colors = {
            'preparing': '#f39c12',
            'shipped': '#2980b9',
            'customs': '#8e44ad',
            'delivered': '#27ae60',
        }
        color = colors.get(obj.status, '#7f8c8d')
        return format_html(
            '<span style="border-right: 3px solid {}; padding-right: 6px; font-weight: 600;">{}</span>',
            color, obj.get_status_display()
        )

    @admin.display(description=_('التاريخ'), ordering='created_at')
    def created_at_fmt(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email_or_dash', 'handled_status', 'created_at_fmt')
    list_filter = ('handled', 'created_at')
    search_fields = ('name', 'phone', 'email', 'message')
    readonly_fields = ('created_at', 'ip_address')
    list_per_page = 25
    actions = ['mark_as_handled', 'mark_as_unhandled']

    @admin.action(description=_('تحديد الطلبات المحددة كـ (تمت المتابعة والمعالجة)'))
    def mark_as_handled(self, request, queryset):
        # We update individually so post_save signals fire and log each audit trail!
        count = 0
        for inquiry in queryset:
            if not inquiry.handled:
                inquiry.handled = True
                inquiry.save()
                count += 1
        self.message_user(request, f"تم تحديث {count} طلب استفسار إلى حالة (تمت المتابعة).")

    @admin.action(description=_('إعادة تعيين كـ (قيد الانتظار لم تتم المتابعة)'))
    def mark_as_unhandled(self, request, queryset):
        count = 0
        for inquiry in queryset:
            if inquiry.handled:
                inquiry.handled = False
                inquiry.save()
                count += 1
        self.message_user(request, f"تمت إعادة تعيين {count} طلب إلى قيد الانتظار.")

    @admin.display(description=_('البريد'))
    def email_or_dash(self, obj):
        return obj.email or '—'

    @admin.display(description=_('حالة المتابعة'), ordering='handled')
    def handled_status(self, obj):
        if obj.handled:
            return format_html('<span style="color: #27ae60; font-weight: bold;">✔ تمت المتابعة</span>')
        return format_html('<span style="color: #e67e22; font-weight: bold;">⏳ قيد المتابعة</span>')

    @admin.display(description=_('تاريخ الاستلام'), ordering='created_at')
    def created_at_fmt(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %H:%M')
