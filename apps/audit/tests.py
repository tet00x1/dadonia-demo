from django.test import TestCase, Client, RequestFactory
from django.contrib.auth import get_user_model
from django.contrib.admin.sites import AdminSite
from django.urls import reverse
from apps.core.models import Product, Shipment, Inquiry
from apps.audit.models import ActivityLog
from apps.audit.admin import ActivityLogAdmin
from apps.audit.middleware import set_audit_context, clear_audit_context

User = get_user_model()

class AuditLogSignalsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='staff_test',
            password='Password123!',
            first_name='محمود',
            last_name='علي',
            is_staff=True
        )

    def tearDown(self):
        clear_audit_context()

    def test_login_audit_log_created(self):
        login_success = self.client.login(username='staff_test', password='Password123!')
        self.assertTrue(login_success)
        
        # Verify ActivityLog entry created for login
        log = ActivityLog.objects.filter(username_snapshot='staff_test', action='login').first()
        self.assertIsNotNone(log)
        self.assertIn('تسجيل دخول ناجح', log.target_description)

    def test_logout_audit_log_created(self):
        self.client.login(username='staff_test', password='Password123!')
        self.client.logout()

        log = ActivityLog.objects.filter(username_snapshot='staff_test', action='logout').first()
        self.assertIsNotNone(log)
        self.assertIn('تسجيل خروج', log.target_description)

    def test_failed_login_audit_log_created(self):
        # Attempt login with wrong password
        self.client.login(username='staff_test', password='WrongPassword999')

        log = ActivityLog.objects.filter(username_snapshot='staff_test', action='failed login').first()
        self.assertIsNotNone(log)
        self.assertIn('فاشلة', log.target_description)

    def test_core_model_create_signal(self):
        set_audit_context(user=self.user, ip='197.35.10.22', user_agent='TestAgent/1.0')
        
        prod = Product.objects.create(
            name='تمور سيوة طبيعية',
            category='agricultural',
            description='تمور ممتازة للتصدير',
            origin='جمهورية مصر العربية'
        )

        log = ActivityLog.objects.filter(
            action='create',
            target_description__contains='تمور سيوة طبيعية'
        ).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.user, self.user)
        self.assertEqual(log.username_snapshot, 'staff_test')
        self.assertEqual(log.ip_address, '197.35.10.22')

    def test_core_model_update_signal_with_changed_fields_json(self):
        set_audit_context(user=self.user, ip='197.35.10.22', user_agent='TestAgent/1.0')
        
        prod = Product.objects.create(
            name='بصل مصري ذهبي',
            category='vegetables',
            description='وصف مبدئي',
            origin='جمهورية مصر العربية'
        )

        # Update product fields
        prod.name = 'بصل مصري أحمر للتصدير'
        prod.origin = 'محافظة بني سويف - مصر'
        prod.save()

        # Find update log
        update_log = ActivityLog.objects.filter(
            action='update',
            target_description__contains='بصل مصري أحمر للتصدير'
        ).first()

        self.assertIsNotNone(update_log)
        self.assertIn('اسم المنتج', update_log.changed_fields)
        self.assertEqual(update_log.changed_fields['اسم المنتج']['old'], 'بصل مصري ذهبي')
        self.assertEqual(update_log.changed_fields['اسم المنتج']['new'], 'بصل مصري أحمر للتصدير')
        self.assertIn('بلد المنشأ', update_log.changed_fields)

    def test_core_model_delete_signal(self):
        set_audit_context(user=self.user, ip='197.35.10.22')
        
        inquiry = Inquiry.objects.create(
            name='شركة تجريبية',
            phone='+201011111111',
            message='رسالة للتجربة والحذف'
        )

        inquiry.delete()

        del_log = ActivityLog.objects.filter(
            action='delete',
            target_description__contains='شركة تجريبية'
        ).first()
        self.assertIsNotNone(del_log)


class AppendOnlyEnforcementTestCase(TestCase):
    def setUp(self):
        self.log = ActivityLog.objects.create(
            username_snapshot='system_tester',
            action='create',
            target_description='سجل تجريبي لاختبار الحصانة ضد التعديل والحذف'
        )

    def test_cannot_update_existing_activity_log(self):
        self.log.target_description = 'محاولة اختراق وتغيير البيان'
        with self.assertRaises(PermissionError):
            self.log.save()

    def test_cannot_delete_activity_log_instance(self):
        with self.assertRaises(PermissionError):
            self.log.delete()

    def test_cannot_bulk_delete_activity_logs(self):
        with self.assertRaises(PermissionError):
            ActivityLog.objects.filter(id=self.log.id).delete()

    def test_cannot_bulk_update_activity_logs(self):
        with self.assertRaises(PermissionError):
            ActivityLog.objects.filter(id=self.log.id).update(target_description='تعديل جماعي')

    def test_admin_append_only_permissions(self):
        site = AdminSite()
        admin_obj = ActivityLogAdmin(ActivityLog, site)
        rf = RequestFactory()
        
        # Test with superuser request
        super_req = rf.get('/admin/audit/activitylog/')
        super_req.user = User.objects.create_superuser('super_boss', 'boss@test.com', 'BossPass123!')

        self.assertFalse(admin_obj.has_add_permission(super_req))
        self.assertFalse(admin_obj.has_change_permission(super_req, self.log))
        self.assertFalse(admin_obj.has_delete_permission(super_req, self.log))
        self.assertIsNone(admin_obj.actions)


class ActivityDashboardAccessTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.superuser = User.objects.create_superuser(
            username='owner_user',
            password='OwnerPassword123!',
            email='owner@test.com'
        )
        self.staff_user = User.objects.create_user(
            username='regular_staff',
            password='StaffPassword123!',
            is_staff=True,
            is_superuser=False
        )
        # Create sample logs
        ActivityLog.objects.create(
            user=self.staff_user,
            username_snapshot='regular_staff',
            action='login',
            target_description='تسجيل دخول تجريبي',
            ip_address='127.0.0.1'
        )

    def test_anonymous_user_redirected(self):
        response = self.client.get(reverse('activity_dashboard'))
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_non_superuser_staff_forbidden(self):
        self.client.login(username='regular_staff', password='StaffPassword123!')
        response = self.client.get(reverse('activity_dashboard'))
        # Should raise PermissionDenied (403)
        self.assertEqual(response.status_code, 403)

    def test_superuser_allowed_access(self):
        self.client.login(username='owner_user', password='OwnerPassword123!')
        response = self.client.get(reverse('activity_dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'لوحة مراقبة نشاطات الموظفين')
        self.assertContains(response, 'regular_staff')

    def test_csv_export(self):
        self.client.login(username='owner_user', password='OwnerPassword123!')
        response = self.client.get(reverse('activity_dashboard') + '?export=csv')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv; charset=utf-8-sig')
        # Check UTF-8 BOM
        content = response.content
        self.assertTrue(content.startswith(b'\xef\xbb\xbf'))
        self.assertIn('regular_staff'.encode('utf-8'), content)
