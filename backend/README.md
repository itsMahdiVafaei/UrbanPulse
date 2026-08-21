# UrbanPulse Django Backend

Backend سامانه شهروند هوشمند بر پایه Django + Django REST Framework.

## اجرا
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API
- `POST /api/register/register/` ثبت‌نام
- `POST /api/auth/token/` دریافت JWT با username/password
- `GET/POST /api/categories/`
- `GET/POST /api/requests/` (شهروند فقط درخواست‌های خودش را می‌بیند)
- `GET /api/requests/?tracking_code=XXXXXXXX` جستجوی کد پیگیری
- `POST /api/requests/{id}/change_status/` تغییر وضعیت توسط اپراتور
- `GET /api/requests/dashboard/` آمار داشبورد
- `GET /api/requests/export_csv/` گزارش CSV
- `GET/POST /api/feedback/` ثبت امتیاز پس از اتمام
- پنل مدیریت: `/admin/`

برای PostgreSQL مقدار DATABASES در `urbanpulse/settings.py` را تغییر دهید و `SECRET_KEY` را در محیط production از متغیر محیطی بخوانید. تصاویر در MEDIA_ROOT ذخیره می‌شوند.
