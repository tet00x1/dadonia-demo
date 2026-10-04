from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_product_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='inquiry',
            name='ip_address',
            field=models.GenericIPAddressField(blank=True, db_index=True, null=True, verbose_name='عنوان IP للمرسل'),
        ),
    ]
