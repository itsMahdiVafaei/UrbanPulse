from django.db import migrations


def seed(apps, schema_editor):
    User = apps.get_model('core', 'User')
    from django.contrib.auth.hashers import make_password
    if not User.objects.filter(username='admin').exists():
        User.objects.create(
            username='admin', password=make_password('admin123'),
            first_name='مدیر شهرداری', role='operator', phone='09120000000',
            is_staff=True, is_superuser=True, is_active=True,
        )
    if not User.objects.filter(username='09121112233').exists():
        User.objects.create(
            username='09121112233', password=make_password('123456'),
            first_name='مرتضی حسینی', role='contractor', phone='09121112233',
            email='morteza@mail.com', category='اکیپ آسفالت و لکه‌گیری',
            member_count=2, contractor_status='FREE', is_active=True,
        )


def unseed(apps, schema_editor):
    User = apps.get_model('core', 'User')
    User.objects.filter(username__in=['admin', '09121112233']).delete()


class Migration(migrations.Migration):
    dependencies = [('core', '0001_initial')]
    operations = [migrations.RunPython(seed, unseed)]
