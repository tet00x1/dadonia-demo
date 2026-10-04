from datetime import datetime


def company_context(request):
    return {
        'COMPANY_NAME_AR': 'شركة دادونيا للتجارة الدولية والنقل البحري',
        'COMPANY_NAME_EN': 'Dadonia Trade & Shipping',
        'COMPANY_SLOGAN_AR': 'جسر الصادرات المصرية نحو الأسواق العالمية',
        'COMPANY_PHONE': '+20 101 194 4092',
        'COMPANY_MOBILE': '+20 103 812 2116',
        'COMPANY_EMAIL': 'donovamotors@gmail.com',
        'COMPANY_ADDRESS_AR': 'ميناء الإسكندرية، المجمع اللوجستي التجاري، برج دادونيا، الإسكندرية، مصر',
        'COMPANY_WHATSAPP': '201011944092',
        'CURRENT_YEAR': datetime.now().year,
    }
