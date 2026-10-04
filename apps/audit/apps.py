from django.apps import AppConfig

class AuditConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.audit'
    verbose_name = 'سجل الرقابة وتدقيق حركة الموظفين'

    def ready(self):
        import apps.audit.signals  # Register audit signals
