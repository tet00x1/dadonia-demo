from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from apps.audit.models import ActivityLog

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = (
        'formatted_timestamp',
        'employee_column',
        'action_badge',
        'target_description_short',
        'ip_address',
    )
    list_filter = ('action', 'timestamp')
    search_fields = ('username_snapshot', 'target_description', 'ip_address', 'changed_fields')
    date_hierarchy = 'timestamp'
    readonly_fields = [f.name for f in ActivityLog._meta.fields]
    actions = None  # Disable all bulk actions including bulk deletion

    # Strict append-only enforcement: no add, change or delete for ANY user (even superusers)
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.display(description=_('التوقيت'), ordering='timestamp')
    def formatted_timestamp(self, obj):
        return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')

    @admin.display(description=_('الموظف المسؤول'))
    def employee_column(self, obj):
        if obj.user:
            name = obj.user.get_full_name() or obj.user.username
            return f"{name} (@{obj.username_snapshot})"
        return obj.username_snapshot

    @admin.display(description=_('الإجراء'))
    def action_badge(self, obj):
        colors = {
            'login': '#2b7a78',
            'logout': '#555555',
            'failed login': '#c0392b',
            'create': '#27ae60',
            'update': '#d35400',
            'delete': '#8e1b1b',
        }
        color = colors.get(obj.action, '#333333')
        label = obj.get_action_display()
        return format_html(
            '<span style="background-color: {}; color: #fff; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: bold;">{}</span>',
            color, label
        )

    @admin.display(description=_('بيان العملية'))
    def target_description_short(self, obj):
        desc = obj.target_description
        if len(desc) > 60:
            return desc[:57] + '...'
        return desc
