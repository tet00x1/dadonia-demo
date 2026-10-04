from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from apps.core.models import Product, Shipment, Inquiry

def create_staff_groups():
    """
    Creates the required employee groups with strict role-based permissions:
    - Sales: Inquiries + Shipments
    - Operations: Shipments + Products
    - Viewer: Read-only access to all business models
    """
    product_ct = ContentType.objects.get_for_model(Product)
    shipment_ct = ContentType.objects.get_for_model(Shipment)
    inquiry_ct = ContentType.objects.get_for_model(Inquiry)

    def get_perms(ct, actions):
        codenames = [f"{action}_{ct.model}" for action in actions]
        return Permission.objects.filter(content_type=ct, codename__in=codenames)

    # 1. Sales Group
    sales_group, _ = Group.objects.get_or_create(name='Sales')
    sales_perms = list(get_perms(inquiry_ct, ['add', 'change', 'delete', 'view'])) + \
                  list(get_perms(shipment_ct, ['add', 'change', 'view'])) + \
                  list(get_perms(product_ct, ['view']))
    sales_group.permissions.set(sales_perms)

    # 2. Operations Group
    ops_group, _ = Group.objects.get_or_create(name='Operations')
    ops_perms = list(get_perms(shipment_ct, ['add', 'change', 'delete', 'view'])) + \
                list(get_perms(product_ct, ['add', 'change', 'delete', 'view'])) + \
                list(get_perms(inquiry_ct, ['view']))
    ops_group.permissions.set(ops_perms)

    # 3. Viewer Group
    viewer_group, _ = Group.objects.get_or_create(name='Viewer')
    viewer_perms = list(get_perms(product_ct, ['view'])) + \
                   list(get_perms(shipment_ct, ['view'])) + \
                   list(get_perms(inquiry_ct, ['view']))
    viewer_group.permissions.set(viewer_perms)

    return sales_group, ops_group, viewer_group


class Command(BaseCommand):
    help = 'Setup staff groups and role-based permissions (Sales, Operations, Viewer)'

    def handle(self, *args, **options):
        sales, ops, viewer = create_staff_groups()
        self.stdout.write(self.style.SUCCESS('Successfully configured staff permission groups:'))
        self.stdout.write(f"- Sales: {sales.permissions.count()} permissions")
        self.stdout.write(f"- Operations: {ops.permissions.count()} permissions")
        self.stdout.write(f"- Viewer: {viewer.permissions.count()} permissions")
