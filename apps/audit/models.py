from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class ActivityLogQuerySet(models.QuerySet):
    def delete(self):
        raise PermissionError("عمليات الحذف الجماعي محظورة تماماً على سجل النشاطات والرقابة.")

    def update(self, **kwargs):
        raise PermissionError("عمليات التعديل الجماعي محظورة تماماً على سجل النشاطات والرقابة.")

class ActivityLogManager(models.Manager.from_queryset(ActivityLogQuerySet)):
    pass

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('login', 'تسجيل دخول ناجح'),
        ('logout', 'تسجيل خروج'),
        ('failed login', 'محاولة دخول فاشلة'),
        ('create', 'إنشاء سجل جديد'),
        ('update', 'تعديل بيانات'),
        ('delete', 'حذف سجل'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activity_logs',
        verbose_name=_('الموظف المسؤول')
    )
    username_snapshot = models.CharField(
        _('اسم الحساب / المستخدم وقت العملية'),
        max_length=150,
        blank=True,
        default='غير معروف'
    )
    action = models.CharField(
        _('نوع الإجراء'),
        max_length=30,
        choices=ACTION_CHOICES,
        db_index=True
    )
    target_description = models.CharField(
        _('بيان العملية والهدف'),
        max_length=255
    )
    changed_fields = models.JSONField(
        _('تفاصيل التعديل (القيمة السابقة -> القيمة الجديدة)'),
        default=dict,
        blank=True
    )
    ip_address = models.GenericIPAddressField(
        _('عنوان IP'),
        null=True,
        blank=True
    )
    user_agent = models.TextField(
        _('بيانات المتصفح والنظام (User Agent)'),
        blank=True
    )
    timestamp = models.DateTimeField(
        _('توقيت العملية'),
        auto_now_add=True,
        db_index=True
    )

    objects = ActivityLogManager()

    class Meta:
        verbose_name = _('سجل نشاط موظف')
        verbose_name_plural = _('سجل الرقابة وتدقيق حركة الموظفين')
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
        ]

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {self.username_snapshot} - {self.get_action_display()} - {self.target_description[:40]}"

    def save(self, *args, **kwargs):
        # Strict append-only enforcement: existing records can NEVER be updated
        if self.pk is not None:
            # Check if this object already exists in database
            if ActivityLog.objects.filter(pk=self.pk).exists():
                raise PermissionError("سجل النشاطات غير قابل للتعديل بعد إنشائه نهائياً (Append-Only Audit Log)")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Strict append-only enforcement: records can NEVER be deleted
        raise PermissionError("سجل النشاطات محمي ضد الحذف نهائياً لضمان النزاهة القانونية والرقابية")
