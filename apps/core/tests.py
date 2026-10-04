from django.test import TestCase, Client
from django.urls import reverse
from apps.core.models import Product, Shipment, Inquiry
from apps.core.forms import InquiryForm

class InquiryFormTestCase(TestCase):
    def test_valid_inquiry_form(self):
        form_data = {
            'name': 'شركة الأهرام للتوريدات',
            'phone': '+201012345678',
            'email': 'ahram@trade.com',
            'message': 'طلب توريد حاويتين برتقال صيفي فالنسيا لميناء روتردام',
            'website_url': '',  # Empty honeypot
        }
        form = InquiryForm(data=form_data)
        self.assertTrue(form.is_valid(), form.errors)
        inquiry = form.save()
        self.assertEqual(inquiry.name, 'شركة الأهرام للتوريدات')
        self.assertFalse(inquiry.handled)

    def test_honeypot_spam_detected(self):
        # Spam bots fill hidden fields
        form_data = {
            'name': 'Spam Bot',
            'phone': '+1234567890',
            'email': 'bot@spam.com',
            'message': 'Buy cheap crypto now with fast delivery and great discount',
            'website_url': 'http://spambot-link.com',  # Filled honeypot
        }
        form = InquiryForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('website_url', form.errors)

    def test_short_name_or_message_validation(self):
        form_data = {
            'name': 'A',  # too short
            'phone': '+201012345678',
            'email': '',
            'message': 'Short',  # too short (< 10 chars)
            'website_url': '',
        }
        form = InquiryForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('name', form.errors)
        self.assertIn('message', form.errors)


class PublicPagesTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.product = Product.objects.create(
            name='برتقال فالنسيا مصري درجة أولى',
            category='agricultural',
            description='برتقال للتصدير معتمد بمواصفات الاتحاد الأوروبي',
            origin='جمهورية مصر العربية',
            is_active=True
        )
        self.shipment = Shipment.objects.create(
            reference='TEST-EXP-001',
            kind='export',
            product=self.product,
            country='هولندا',
            quantity='25 طن',
            status='preparing',
            notes='فحص جمركي تمهيدي'
        )

    def test_home_page_loads(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'برتقال فالنسيا مصري')
        self.assertContains(response, 'TEST-EXP-001')

    def test_products_page_filtering(self):
        response = self.client.get(reverse('products'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.product.name)

        # Filter by agricultural category
        response_cat = self.client.get(reverse('products') + '?category=agricultural')
        self.assertEqual(response_cat.status_code, 200)
        self.assertContains(response_cat, self.product.name)

        # Filter by non-matching category
        response_empty = self.client.get(reverse('products') + '?category=industrial')
        self.assertEqual(response_empty.status_code, 200)
        self.assertNotContains(response_empty, self.product.name)

    def test_track_shipment_page(self):
        # Existing reference
        response = self.client.get(reverse('track') + '?ref=TEST-EXP-001')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'TEST-EXP-001')
        self.assertContains(response, 'التجهيز والتعبئة بالمستودع')

        # Non-existing reference
        response_404 = self.client.get(reverse('track') + '?ref=INVALID-999')
        self.assertEqual(response_404.status_code, 200)
        self.assertContains(response_404, 'غير موجود بالسجل')

    def test_contact_submission_success(self):
        post_data = {
            'name': 'مؤسسة الرياض للاستيراد',
            'phone': '+966501234567',
            'email': 'info@riyadh-trade.com',
            'message': 'استفسار عن أسعار شحن وتوريد تمور وبرتقال',
            'website_url': '',
        }
        response = self.client.post(reverse('contact'), data=post_data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Inquiry.objects.filter(name='مؤسسة الرياض للاستيراد').exists())
        self.assertContains(response, 'تم استلام طلبكم بنجاح')


# ---------------------------------------------------------------------------
# JSON API used by the React front end
# ---------------------------------------------------------------------------
import json
from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from apps.core.services import notify_team


class ApiTestCase(TestCase):
    def setUp(self):
        cache.clear()
        self.product = Product.objects.create(
            name='سكر أبيض نقي', category='commodities',
            description='سكر أبيض مكرر للتصدير', is_active=True,
        )
        Shipment.objects.create(
            reference='TEST-EXP-001', product=self.product, country='هولندا', quantity='25 طن',
        )
        self.valid = {
            'name': 'شركة النيل للتوريدات',
            'phone': '+201012345678',
            'email': 'buyer@example.com',
            'message': 'نرغب في عرض سعر لحاويتين من السكر الأبيض',
            'website_url': '',
        }

    def post_inquiry(self, payload, **extra):
        return self.client.post(
            '/api/inquiry/', data=json.dumps(payload), content_type='application/json', **extra,
        )

    # --- products
    def test_products_list_with_category_counts(self):
        data = self.client.get('/api/products/').json()
        self.assertEqual(len(data['products']), 1)
        counts = {c['code']: c['count'] for c in data['categories']}
        self.assertEqual(counts['commodities'], 1)
        self.assertEqual(counts['agricultural'], 0)

    def test_wrong_method_returns_json_405(self):
        response = self.client.post('/api/products/')
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'method_not_allowed')

    def test_unknown_api_path_returns_json_404(self):
        response = self.client.get('/api/does-not-exist/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'not_found')

    def test_health_endpoint(self):
        self.assertEqual(self.client.get('/api/health/').json()['status'], 'ok')

    # --- tracking
    def test_track_found_not_found_and_malformed_reference(self):
        found = self.client.get('/api/track/?ref=test-exp-001')
        self.assertEqual(found.status_code, 200)
        self.assertEqual(found.json()['reference'], 'TEST-EXP-001')
        self.assertNotIn('trace_id', found.json())
        self.assertEqual(self.client.get('/api/track/?ref=NOPE-123').status_code, 404)
        self.assertEqual(self.client.get('/api/track/?ref=<script>alert(1)</script>').status_code, 404)
        self.assertEqual(self.client.get('/api/track/').status_code, 400)

    def test_track_is_throttled_per_ip(self):
        for _ in range(30):
            self.client.get('/api/track/?ref=NOPE-123')
        response = self.client.get('/api/track/?ref=NOPE-123')
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response['Retry-After'], '60')

    # --- inquiry
    def test_inquiry_saved_with_reference_and_ip(self):
        response = self.post_inquiry(self.valid, REMOTE_ADDR='203.0.113.5')
        self.assertEqual(response.status_code, 201)
        body = response.json()
        self.assertTrue(body['ok'])
        self.assertTrue(body['reference'].startswith('DAD-'))
        inquiry = Inquiry.objects.get(pk=body['id'])
        self.assertEqual(inquiry.ip_address, '203.0.113.5')

    def test_inquiry_validation_errors_are_reported_per_field(self):
        response = self.post_inquiry({**self.valid, 'name': 'A', 'message': 'قصير'})
        self.assertEqual(response.status_code, 400)
        body = response.json()
        self.assertEqual(body['error'], 'validation')
        self.assertIn('name', body['fields'])
        self.assertIn('message', body['fields'])
        self.assertEqual(Inquiry.objects.count(), 0)

    def test_inquiry_requires_json_content_type(self):
        response = self.client.post('/api/inquiry/', self.valid)
        self.assertEqual(response.status_code, 415)

    def test_inquiry_rejects_invalid_json(self):
        response = self.client.post('/api/inquiry/', data='{oops', content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'invalid_json')

    def test_honeypot_looks_successful_but_saves_nothing(self):
        response = self.post_inquiry({**self.valid, 'website_url': 'http://spam.example'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['ok'])
        self.assertEqual(Inquiry.objects.count(), 0)

    def test_inquiry_rate_limit_per_ip(self):
        for i in range(5):
            Inquiry.objects.create(name=f'عميل {i}', phone='0100000000', message='طلب سابق للتوريد', ip_address='203.0.113.9')
        blocked = self.post_inquiry(self.valid, REMOTE_ADDR='203.0.113.9')
        self.assertEqual(blocked.status_code, 429)
        self.assertEqual(blocked.json()['error'], 'rate_limited')
        # a different visitor is unaffected
        self.assertEqual(self.post_inquiry(self.valid, REMOTE_ADDR='203.0.113.10').status_code, 201)

    @override_settings(TRUSTED_PROXY_COUNT=1)
    def test_forged_forwarded_for_header_cannot_change_recorded_ip(self):
        # the client forges the first entry; our own proxy appended the real one last
        response = self.post_inquiry(self.valid, HTTP_X_FORWARDED_FOR='1.2.3.4, 198.51.100.7')
        inquiry = Inquiry.objects.get(pk=response.json()['id'])
        self.assertEqual(inquiry.ip_address, '198.51.100.7')

    @override_settings(TRUSTED_PROXY_COUNT=0)
    def test_forwarded_for_ignored_when_no_proxy_is_trusted(self):
        response = self.post_inquiry(self.valid, REMOTE_ADDR='192.0.2.44', HTTP_X_FORWARDED_FOR='1.2.3.4')
        self.assertEqual(Inquiry.objects.get(pk=response.json()['id']).ip_address, '192.0.2.44')

    # --- team notification
    @override_settings(INQUIRY_NOTIFY_EMAILS=['sales@example.com'], DEFAULT_FROM_EMAIL='site@example.com')
    def test_team_is_emailed_with_reply_to_customer(self):
        inquiry = Inquiry.objects.create(**{k: v for k, v in self.valid.items() if k != 'website_url'})
        notify_team(inquiry)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ['sales@example.com'])
        self.assertEqual(message.reply_to, ['buyer@example.com'])
        self.assertIn(inquiry.reference, message.subject)

    @override_settings(INQUIRY_NOTIFY_EMAILS=[])
    def test_no_email_when_no_recipients_configured(self):
        inquiry = Inquiry.objects.create(name='عميل', phone='0100000000', message='طلب توريد جديد')
        notify_team(inquiry)
        self.assertEqual(len(mail.outbox), 0)
