from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from apps.core.models import Product, Shipment, Inquiry
from apps.core.management.commands.setup_groups import create_staff_groups
from apps.audit.models import ActivityLog
from apps.audit.middleware import set_audit_context, clear_audit_context

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with realistic demo products, shipments, sample employees and permission groups'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true',
                            help='Allow seeding when DEBUG is off (never do this on the live site).')

    def handle(self, *args, **options):
        from django.conf import settings
        if not settings.DEBUG and not options['force']:
            raise CommandError(
                'seed_demo creates accounts with well-known passwords and sample data. '
                'It only runs in development (DEBUG=True); pass --force to override.'
            )
        self.stdout.write("Initializing groups and role permissions...")
        sales_grp, ops_grp, viewer_grp = create_staff_groups()

        self.stdout.write("Creating employee and owner accounts...")
        # 1. Superuser / Owner
        owner, created = User.objects.get_or_create(username='owner', defaults={
            'email': 'owner@dadonia-trade.eg',
            'first_name': 'فؤاد',
            'last_name': 'المهندس',
            'is_staff': True,
            'is_superuser': True,
        })
        if created:
            owner.set_password('admin1234')
            owner.save()
            self.stdout.write(self.style.SUCCESS("Superuser created: owner / admin1234"))

        # 2. Sales Employee
        sales_emp, created = User.objects.get_or_create(username='ahmed.sales', defaults={
            'email': 'ahmed.kamal@dadonia-trade.eg',
            'first_name': 'أحمد',
            'last_name': 'كمال',
            'is_staff': True,
            'is_superuser': False,
        })
        if created:
            sales_emp.set_password('sales1234')
            sales_emp.save()
            sales_emp.groups.add(sales_grp)
            self.stdout.write(self.style.SUCCESS("Sales employee created: ahmed.sales / sales1234"))

        # 3. Operations Employee
        ops_emp, created = User.objects.get_or_create(username='tarek.ops', defaults={
            'email': 'tarek.salem@dadonia-trade.eg',
            'first_name': 'طارق',
            'last_name': 'سالم',
            'is_staff': True,
            'is_superuser': False,
        })
        if created:
            ops_emp.set_password('ops1234')
            ops_emp.save()
            ops_emp.groups.add(ops_grp)
            self.stdout.write(self.style.SUCCESS("Operations employee created: tarek.ops / ops1234"))

        # 4. Viewer Employee
        viewer_emp, created = User.objects.get_or_create(username='mona.viewer', defaults={
            'email': 'mona.adel@dadonia-trade.eg',
            'first_name': 'منى',
            'last_name': 'عادل',
            'is_staff': True,
            'is_superuser': False,
        })
        if created:
            viewer_emp.set_password('viewer1234')
            viewer_emp.save()
            viewer_emp.groups.add(viewer_grp)
            self.stdout.write(self.style.SUCCESS("Viewer employee created: mona.viewer / viewer1234"))

        # Seed Products with Audit Context simulated as Operations Manager
        set_audit_context(user=ops_emp, ip='197.38.12.84', user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0')

        self.stdout.write("Creating demo trade products...")
        demo_products = [
            {
                'name': 'سكر أبيض نقي مكرر عالي الجودة (ICUMSA 45 Refined White Sugar)',
                'category': 'commodities',
                'description': 'سكر قصب وبنجر نقي مكرر مطابق للمواصفات القياسية الدولية ICUMSA 45، نسبة نقاوة واستقطاب تتجاوز 99.80°Z، رطوبة لا تتجاوز 0.04%، لون أبيض كريستالي براق، معبأ في أكياس بولي بروبيلين مزدوجة 50 كجم للشحن بالبواخر وحاويات الـ 20 قدم (540 كيس / 27 طن للحاوية). مصحوب بشهادة الفحص والتحليل المختبري المعتمدة (COA).',
                'origin': 'مزارع ومصانع تايلاند والبرازيل ومصر (مورد معتمد)',
                'hs_code': '1701.99',
                'harvest_season': 'إنتاج وتوريد سنوي مستمر (شحنات بواخر وحاويات)',
                'packaging_type': 'أكياس منسوجة بولي بروبيلين 50 كجم ببطانة بوليثين داخلية محكمة الخياطة',
                'temperature_range': 'تخزين في مكان جاف بارد (حاويات جافة مهواة Dry Van)',
                'caliber_specs': 'حبيبات بلورية قياسية ناعمة (Fine Crystal Granulation) خالية من الكتل',
            },
            {
                'name': 'قمح وحبوب استراتيجية سائبة للتوريدات الغذائية (Milling Wheat)',
                'category': 'commodities',
                'description': 'حبوب قمح طحن ومحاصيل حبوب استراتيجية للتوريدات الحكومية والتجارية، نسبة بروتين 12.5% - 13.5%، رطوبة أقل من 12%، فحص مخبري شامل ضد الحشرات ومتبقيات الفطريات.',
                'origin': 'شحنات استيرادية معتمدة ومحاصيل محلية مفرزة',
                'hs_code': '1001.99',
                'harvest_season': 'عقود توريد سنوية ممتدة (شحنات كتلية Bulk Carriers)',
                'packaging_type': 'شحن صب بالبواخر (Bulk Vessel) أو أكياس جامبو 1 طن',
                'temperature_range': 'صوامع شحن بحري مهواة ومتبخرة معملياً',
                'caliber_specs': 'وزن نوعي معتمد > 78 كجم/هيكتولتر، درجة نقاوة 99.5%',
            },
            {
                'name': 'برتقال صيفي فالنسيا عالي الجودة (درجة أولى للتصدير)',
                'category': 'agricultural',
                'description': 'محصول مصري طازج معتمد للمواصفات الأوروبية (GlobalGAP)، نسبة عصير تتجاوز 48%، نسبة حلاوة بريكس +11.5، معبأ في كراتين تليسكوبيك 15 كجم معالجة للتبريد المستمر.',
                'origin': 'جمهورية مصر العربية (مزارع النوبارية ووادي النطرون)',
                'hs_code': '0805.10',
                'harvest_season': 'يناير - منتصف يونيو (طازج موسمي)',
                'packaging_type': 'كرتون تلسكوبي مفتوح 15 كجم / صناديق بلاستيكية 10 كجم (80 كرتونة للبالتة)',
                'temperature_range': '+3°C إلى +5°C (رطوبة نسبية 85-90%)',
                'caliber_specs': 'أحجام معايرة: 48 / 56 / 64 / 72 / 80 / 88 / 100 مم',
            },
            {
                'name': 'تمور مجدول فاخرة من واحات سيوة وتوشكى',
                'category': 'agricultural',
                'description': 'تمور مجدول كينغ وسوبر جامبو طبيعية 100% بدون أي إضافات سكرية، نسبة رطوبة منضبطة بين 18-22%، معبأة في عبوات تجزئة فاخرة وكراتين 5 كجم للتصدير المباشر.',
                'origin': 'جمهورية مصر العربية (سيوة / توشكى)',
                'hs_code': '0804.10',
                'harvest_season': 'سبتمبر - ديسمبر (ومتواجد بالمستودعات طوال العام)',
                'packaging_type': 'كرتون تصديري فاخر 5 كجم و 1 كجم معزول بفيلم مانع للأكسدة',
                'temperature_range': '-18°C للتخزين الطويل / 0°C إلى +4°C للنقل البحري',
                'caliber_specs': 'سوبر جامبو (>24 جم)، جامبو (21-23 جم)، لارج (17-20 جم)',
            },
            {
                'name': 'بصل أحمر وذهبي مصري جاف للشحن البحري',
                'category': 'vegetables',
                'description': 'بصل طازج مجفف حقلياً بجودة قياسية للتخزين البحري الطويل، قشرة متماسكة متعددة الطبقات خالية من العفن الأسود والإنبات.',
                'origin': 'جمهورية مصر العربية (محافظات بني سويف والشرقية)',
                'hs_code': '0703.10',
                'harvest_season': 'فبراير - أغسطس (بصل ذهبي وأحمر)',
                'packaging_type': 'أكياس شبكية رافيا مهواة 10 كجم و 25 كجم على طبليات معقمة',
                'temperature_range': 'تهوية طبيعية أو حاويات ريفر مبردة +2°C إلى +4°C',
                'caliber_specs': 'أقطار معايرة: 40-60 مم / 50-70 مم / 70-90 مم',
            },
            {
                'name': 'فراولة مصرية مجمدة بتقنية التجميد الفردي السريع (IQF)',
                'category': 'vegetables',
                'description': 'فراولة صنف فستيفال وفورتونا منتقاة بعناية ومغسولة ومجمدة فورياً في درجات -38 مئوية للحفاظ على الخواص الطبيعية واللون، معبأة في كراتين 10 كجم ببطانة بوليثين غذائي.',
                'origin': 'جمهورية مصر العربية (الإسماعيلية والقليوبية)',
                'hs_code': '0811.10',
                'harvest_season': 'نوفمبر - إبريل (تصنيع فوري مستمر)',
                'packaging_type': 'كرتون مقوى 10 كجم ببطانة بوليثين أزرق مخصص للأغذية',
                'temperature_range': '-18°C إلى -20°C تجميد مستمر في حاويات Reefer',
                'caliber_specs': 'حبات كاملة (15-25 مم / 25-35 مم) ونصفية مقطعة',
            },
            {
                'name': 'قطن مصري طويل التيلة فائق النعومة (جيزة 94)',
                'category': 'cotton_textiles',
                'description': 'بالات قطن خام عالية النقاء والنظافة، متانة خيط استثنائية، خالية من الشوائب ومفحوصة معملياً بواسطة الهيئة العامة للتحكيم واختبارات القطن بالإسكندرية.',
                'origin': 'جمهورية مصر العربية (الدلتا)',
                'hs_code': '5201.00',
                'harvest_season': 'أكتوبر - مارس',
                'packaging_type': 'بالات مكبوسة ومحزمة بأسلاك صلب وكسوة قماش قطني معقمة (وزن 227 كجم)',
                'temperature_range': 'حاويات جافة جيدة التهوية (Dry Van)',
                'caliber_specs': 'طول التيلة: 34-36 مم، نعومة ميكرونير: 3.8-4.2',
            },
            {
                'name': 'زهور البابونج وأعشاب طبية عطرية مجففة',
                'category': 'herbs_spices',
                'description': 'أعشاب عضوية مجففة في غرف هوائية معزولة (شيح، بابونج، نعناع بلدي، ريحان)، خالية من متبقيات المبيدات، مخصصة لصناعات الأدوية والشاي الأوروبية والأمريكية.',
                'origin': 'جمهورية مصر العربية (محافظة الفيوم)',
                'hs_code': '1211.90',
                'harvest_season': 'يناير - مايو',
                'packaging_type': 'أكياس ورقية متعددة الطبقات (Kraft Bags) وأجولة خيش 20 كجم',
                'temperature_range': 'مكان جاف بارد أقل من +20°C',
                'caliber_specs': 'زهور كاملة نقاوة 99% / مسحوق مفروز ومغربل',
            },
            {
                'name': 'كربونات الكالسيوم ومواد عزل صناعية عالية النقاوة',
                'category': 'industrial',
                'description': 'بودرة كربونات كالسيوم ميكرونية فائقة البياض (نقاوة تزيد عن 99.2%)، معبأة في أكياس جامبو باج 1 طن ومخصصة لصناعات البلاستيك والدهانات الدولية.',
                'origin': 'جمهورية مصر العربية (محاجر السويس والمنيا)',
                'hs_code': '2836.50',
                'harvest_season': 'إنتاج صناعي دائم طوال العام',
                'packaging_type': 'أكياس جامبو باج 1.25 طن / شكائر ورقية 25 كجم على بالتات',
                'temperature_range': 'شحن حاويات جافة قياسية (20ft / 40ft)',
                'caliber_specs': 'نعومة حبيبية: من 2 ميكرون وحتى 20 ميكرون معالج وبدون معالجة',
            },
            {
                'name': 'سيراميك وبورسلين تجاري مطابق للمواصفات الدولية ISO 13006',
                'category': 'building_materials',
                'description': 'بلاطات بورسلين وأرضيات للمشروعات التجارية الكبرى والمقاولات الدولية، مقاومة عالية للتآكل وامتصاص منخفض للمياه، معبأة على طبليات مدعمة للشحن بالحاويات.',
                'origin': 'جمهورية مصر العربية (مدينة العين السخنة)',
                'hs_code': '6907.21',
                'harvest_season': 'إنتاج مصنعي مستمر للتصدير الدولي',
                'packaging_type': 'كراتين معالجة على طبليات خشبية متبخرة مطابقة لـ ISPM 15',
                'temperature_range': 'شحن بحري جاف (حاويات 20 قدم عالية الحمولة)',
                'caliber_specs': 'مقاسات: 60×60 سم، 60×120 سم، 80×80 سم، سماكة 9-11 مم',
            }
        ]

        products_created = []
        for pdata in demo_products:
            prod, _ = Product.objects.get_or_create(name=pdata['name'], defaults=pdata)
            products_created.append(prod)

        self.stdout.write(f"Created {len(products_created)} products.")

        # Seed Shipments
        self.stdout.write("Creating demo shipments...")
        demo_shipments = [
            {
                'reference': 'EGY-EXP-2026-089',
                'kind': 'export',
                'product': products_created[0], # Valencia Oranges
                'country': 'مملكة هولندا (ميناء روتردام)',
                'quantity': '108 طن متري (4 حاويات مبردة 40 قدم)',
                'status': 'delivered',
                'notes': 'تم استلام الفحص النهائي من الحجر الزراعي بميناء الإسكندرية والتسليم للعميل بمستودعات روتردام المركزية.',
            },
            {
                'reference': 'EGY-EXP-2026-104',
                'kind': 'export',
                'product': products_created[1], # Medjool Dates
                'country': 'المملكة العربية السعودية (ميناء جدة الإسلامي)',
                'quantity': '24 طن (حاوية 40 قدم مبردة +4م)',
                'status': 'customs',
                'notes': 'أبحرت من ميناء سفاجا البحري ووصلت جدة، بانتظار إنهاء إجراءات الفسح من هيئة الغذاء والدواء السعودية (SFDA).',
            },
            {
                'reference': 'EGY-EXP-2026-118',
                'kind': 'export',
                'product': products_created[2], # Onions
                'country': 'الاتحاد الروسي (ميناء نوفوروسيسك)',
                'quantity': '120 طن (5 حاويات مبردة مهواة)',
                'status': 'shipped',
                'notes': 'على متن سفينة الحاويات CMA CGM، الترانزيت 6 أيام، متوقع الرسو يوم 5 من الشهر الجاري.',
            },
            {
                'reference': 'EGY-IMP-2026-042',
                'kind': 'import',
                'product': products_created[6], # Industrial material
                'country': 'جمهورية ألمانيا الاتحادية (ميناء هامبورغ)',
                'quantity': '48 طن (حاويتان جافتان standard)',
                'status': 'delivered',
                'notes': 'تم الإفراج الجمركي من ميناء دمياط وسداد الرسوم الجمركية وفق نظام التسجيل المسبق للشحنات ACI نافذة.',
            },
            {
                'reference': 'EGY-EXP-2026-135',
                'kind': 'export',
                'product': products_created[3], # Frozen Strawberries
                'country': 'المملكة المتحدة (ميناء فيلكستو)',
                'quantity': '22 طن (حاوية مبردة -18م)',
                'status': 'preparing',
                'notes': 'قيد التعبئة والفحص المخبري النهائي في محطة الفرز المركزية بمدينة الصالحية، حجز الباخرة يوم الثلاثاء.',
            },
            {
                'reference': 'EGY-EXP-2026-141',
                'kind': 'export',
                'product': products_created[4], # Giza 94 Cotton
                'country': 'الجمهورية الإيطالية (ميناء جنوة)',
                'quantity': '45 طن (110 بالة قطن مصري مختوم)',
                'status': 'shipped',
                'notes': 'شهادة الوزن والرطوبة معتمدة من هيئة التحكيم، على خط الملاحة الإيطالي Grimaldi Lines.',
            },
        ]

        for sdata in demo_shipments:
            Shipment.objects.get_or_create(reference=sdata['reference'], defaults=sdata)

        # Seed Inquiries simulated via Sales Rep
        set_audit_context(user=sales_emp, ip='156.208.45.19', user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')

        self.stdout.write("Creating demo client inquiries...")
        demo_inquiries = [
            {
                'name': 'شركة الأندلس للأغذية - دبي',
                'phone': '+971501239874',
                'email': 'procurement@alandalus-food.ae',
                'message': 'نطلب عروض أسعار لتوريد 3 حاويات برتقال صيفي فالنسيا للتسليم CIF ميناء جبل علي خلال شهر إبريل.',
                'handled': True,
            },
            {
                'name': 'Nordic Fresh Imports Ltd - Copenhagen',
                'phone': '+4520987654',
                'email': 'orders@nordicfresh.dk',
                'message': 'We are requesting lab test reports and FOB Alexandria quotation for 2 containers of IQF frozen strawberries.',
                'handled': False,
            },
            {
                'name': 'مؤسسة الرياض للتجارة والمقاولات',
                'phone': '+966551234567',
                'email': 'trade@alriyadh-sa.com',
                'message': 'استفسار عن عينات تمور مجدول سيوة وكتالوج أصناف السيراميك والبورسلين المعد للتصدير مع شروط الدفع LC.',
                'handled': True,
            }
        ]

        for idata in demo_inquiries:
            Inquiry.objects.get_or_create(name=idata['name'], defaults=idata)

        clear_audit_context()
        self.stdout.write(self.style.SUCCESS("All demo data seeded successfully!"))
