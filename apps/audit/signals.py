import logging
from django.contrib.auth import user_logged_in, user_logged_out, user_login_failed
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver

from apps.core.models import Product, Shipment, Inquiry
from apps.audit.models import ActivityLog
from apps.audit.middleware import (
    get_current_user,
    get_current_ip,
    get_current_user_agent,
    extract_client_ip,
)

logger = logging.getLogger(__name__)

CORE_MODELS = (Product, Shipment, Inquiry)


# --- Authentication Signals ---

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    try:
        ip = extract_client_ip(request) if request else get_current_ip()
        ua = (request.META.get('HTTP_USER_AGENT', '') if request else get_current_user_agent())[:500]
        full_name = user.get_full_name() or user.username

        ActivityLog.objects.create(
            user=user,
            username_snapshot=user.get_username(),
            action='login',
            target_description=f"تسجيل دخول ناجح للنظام ({full_name})",
            ip_address=ip,
            user_agent=ua,
        )
    except Exception as e:
        logger.error(f"Error logging user login: {e}")


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    try:
        ip = extract_client_ip(request) if request else get_current_ip()
        ua = (request.META.get('HTTP_USER_AGENT', '') if request else get_current_user_agent())[:500]
        username = user.get_username() if user else 'غير معروف'

        ActivityLog.objects.create(
            user=user if user and getattr(user, 'is_authenticated', False) else None,
            username_snapshot=username,
            action='logout',
            target_description=f"تسجيل خروج من النظام ({username})",
            ip_address=ip,
            user_agent=ua,
        )
    except Exception as e:
        logger.error(f"Error logging user logout: {e}")


@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    try:
        ip = extract_client_ip(request) if request else get_current_ip()
        ua = (request.META.get('HTTP_USER_AGENT', '') if request else get_current_user_agent())[:500]
        username = credentials.get('username', 'مجهول') if credentials else 'مجهول'

        ActivityLog.objects.create(
            user=None,
            username_snapshot=str(username)[:150],
            action='failed login',
            target_description=f"محاولة تسجيل دخول فاشلة بالحساب: '{username}'",
            ip_address=ip,
            user_agent=ua,
        )
    except Exception as e:
        logger.error(f"Error logging login failure: {e}")


# --- Core Models CRUD Signals ---

def _resolve_actor():
    """Resolve acting user, username, IP and user-agent from contextvars."""
    user = get_current_user()
    ip = get_current_ip()
    ua = get_current_user_agent()
    username = user.get_username() if user and user.is_authenticated else 'النظام / زائر عام'
    return user, username, ip, ua


@receiver(pre_save)
def track_pre_save_changes(sender, instance, **kwargs):
    if sender not in CORE_MODELS:
        return

    if instance.pk is not None:
        try:
            old_obj = sender.objects.get(pk=instance.pk)
            changed = {}
            for field in sender._meta.fields:
                field_name = field.name
                if field_name in ('updated_at',):
                    continue
                old_val = getattr(old_obj, field_name)
                new_val = getattr(instance, field_name)
                if old_val != new_val:
                    label = str(field.verbose_name or field_name)
                    changed[label] = {
                        'old': str(old_val) if old_val is not None else '',
                        'new': str(new_val) if new_val is not None else '',
                    }
            instance._audit_changed_fields = changed
            instance._audit_is_new = False
        except sender.DoesNotExist:
            instance._audit_is_new = True
            instance._audit_changed_fields = {}
    else:
        instance._audit_is_new = True
        instance._audit_changed_fields = {}


@receiver(post_save)
def log_core_model_save(sender, instance, created, **kwargs):
    if sender not in CORE_MODELS:
        return

    user, username, ip, ua = _resolve_actor()
    model_name = instance._meta.verbose_name

    if created:
        ActivityLog.objects.create(
            user=user,
            username_snapshot=username,
            action='create',
            target_description=f"إضافة {model_name}: {str(instance)[:150]}",
            ip_address=ip,
            user_agent=ua,
        )
    else:
        changed_fields = getattr(instance, '_audit_changed_fields', {})
        if changed_fields:
            ActivityLog.objects.create(
                user=user,
                username_snapshot=username,
                action='update',
                target_description=f"تعديل {model_name}: {str(instance)[:150]}",
                changed_fields=changed_fields,
                ip_address=ip,
                user_agent=ua,
            )


@receiver(post_delete)
def log_core_model_delete(sender, instance, **kwargs):
    if sender not in CORE_MODELS:
        return

    user, username, ip, ua = _resolve_actor()
    model_name = instance._meta.verbose_name

    ActivityLog.objects.create(
        user=user,
        username_snapshot=username,
        action='delete',
        target_description=f"حذف {model_name}: {str(instance)[:150]}",
        ip_address=ip,
        user_agent=ua,
    )
