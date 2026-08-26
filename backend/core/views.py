import csv
from django.http import HttpResponse
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from datetime import timedelta
from rest_framework import viewsets, permissions, status as http_status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Request, RequestImage, RequestStatusHistory, Feedback
from .serializers import RegisterSerializer, RequestSerializer, CitizenSerializer, ContractorSerializer, FeedbackSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        u = self.user
        data['user'] = {
            'id': u.id, 'username': u.username, 'phone': u.phone, 'email': u.email,
            'name': (f"{u.first_name} {u.last_name}".strip() or u.username),
            'role': u.role, 'category': u.category, 'memberCount': u.member_count,
            'status': u.contractor_status if u.role == 'contractor' else ('ACTIVE' if u.is_active else 'BLOCKED'),
        }
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('operator', 'admin')


class RegisterViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        phone = request.data.get('phone') or request.data.get('username')
        if User.objects.filter(username=phone).exists():
            return Response({'detail': 'این شماره قبلاً ثبت شده است.'}, status=400)
        data = dict(request.data)
        data['username'] = phone
        ser = RegisterSerializer(data=data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response({'id': user.id, 'username': user.username, 'phone': user.phone}, status=201)


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        u = self.request.user
        qs = Request.objects.select_related('citizen', 'assigned_to').prefetch_related('images').order_by('-id')
        if u.role == 'citizen':
            qs = qs.filter(citizen=u)
        tracking_code = self.request.query_params.get('tracking_code')
        if tracking_code:
            qs = qs.filter(tracking_code__iexact=tracking_code)
        return qs

    def create(self, request, *args, **kwargs):
        d = request.data
        try:
            lat = float(d.get('lat'))
            lng = float(d.get('lng'))
        except (TypeError, ValueError):
            return Response({'detail': 'موقعیت جغرافیایی نامعتبر است.'}, status=400)
        obj = Request.objects.create(
            citizen=request.user,
            name=d.get('name', ''), phone=d.get('phone', ''),
            category=d.get('category', ''), sub_category=d.get('subCategory', ''),
            description=d.get('description', ''), latitude=lat, longitude=lng,
        )
        for f in request.FILES.getlist('images'):
            RequestImage.objects.create(request=obj, image=f)
        RequestStatusHistory.objects.create(request=obj, status='REGISTERED', changed_by=request.user)
        return Response(self.get_serializer(obj, context={'request': request}).data, status=201)

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        obj = self.get_object()
        u = request.user
        new_status = request.data.get('newStatus') or request.data.get('status')
        if new_status not in dict(Request.STATUS):
            return Response({'detail': 'وضعیت نامعتبر است.'}, status=400)

        if u.role == 'contractor':
            if not obj.assigned_to_id or obj.assigned_to_id != u.id:
                return Response({'detail': 'شما مجاز به تغییر این درخواست نیستید.'}, status=403)
            if new_status not in ('IN_PROGRESS', 'COMPLETED'):
                return Response({'detail': 'این تغییر وضعیت مجاز نیست.'}, status=403)
        elif u.role not in ('operator', 'admin'):
            return Response({'detail': 'دسترسی ندارید.'}, status=403)

        if new_status == 'REJECTED' and not request.data.get('adminComment'):
            return Response({'detail': 'ذکر دلیل رد الزامی است.'}, status=400)

        obj.status = new_status
        if request.data.get('adminComment'):
            obj.admin_comment = request.data.get('adminComment')

        assigned_phone = request.data.get('assignedTo')
        if assigned_phone:
            contractor = User.objects.filter(phone=assigned_phone, role='contractor').first()
            if contractor:
                obj.assigned_to = contractor
                contractor.contractor_status = 'BUSY'
                contractor.save()

        if new_status in ('COMPLETED', 'REJECTED') and obj.assigned_to_id:
            c = obj.assigned_to
            c.contractor_status = 'FREE'
            c.save()

        obj.save()
        RequestStatusHistory.objects.create(request=obj, status=new_status, comment=request.data.get('adminComment', ''), changed_by=u)
        return Response(self.get_serializer(obj, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def submit_feedback(self, request, pk=None):
        """ثبت امتیاز و نظر توسط شهروند پس از اتمام درخواست"""
        obj = self.get_object()
        u = request.user

        # بررسی اینکه آیا درخواست متعلق به همین شهروند است یا خیر
        if u.role != 'citizen' or obj.citizen_id != u.id:
            return Response({'detail': 'شما مجاز به ثبت نظر برای این درخواست نیستید.'}, status=403)

        # بررسی اینکه حتما وضعیت درخواست روی حالت انجام شده باشد
        if obj.status != 'COMPLETED':
            return Response({'detail': 'تنها برای درخواست‌های انجام‌شده می‌توان نظر ثبت کرد.'}, status=400)

        rating = request.data.get('rating')
        comment = request.data.get('comment', '')

        try:
            rating = int(rating)
            if not (1 <= rating <= 5):
                raise ValueError()
        except (TypeError, ValueError):
            return Response({'detail': 'امتیاز باید عددی بین ۱ تا ۵ باشد.'}, status=400)

        # ایجاد یا ویرایش فیدبک برای این درخواست
        feedback, created = Feedback.objects.update_or_create(
            request=obj,
            defaults={'rating': rating, 'comment': comment}
        )

        return Response(FeedbackSerializer(feedback).data, status=201 if created else 200)

    @action(detail=False, methods=['get'], permission_classes=[IsStaff])
    def dashboard(self, request):
        today = now().date()
        qs = Request.objects.all()
        return Response({
            'today': qs.filter(created_at__date=today).count(),
            'yesterday': qs.filter(created_at__date=today - timedelta(days=1)).count(),
            'this_week': qs.filter(created_at__date__gte=today - timedelta(days=7)).count(),
            'by_status': list(qs.values('status').annotate(count=Count('id'))),
        })

    @action(detail=False, methods=['get'], permission_classes=[IsStaff])
    def export_csv(self, request):
        out = HttpResponse(content_type='text/csv; charset=utf-8')
        out['Content-Disposition'] = 'attachment; filename="urbanpulse_requests.csv"'
        w = csv.writer(out)
        w.writerow(['tracking_code', 'category', 'sub_category', 'status', 'name', 'phone', 'created_at'])
        for x in self.get_queryset():
            w.writerow([x.tracking_code, x.category, x.sub_category, x.status, x.name, x.phone, x.created_at])
        return out


class CitizenViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='citizen').order_by('-id')
    serializer_class = CitizenSerializer
    permission_classes = [IsStaff]

    @action(detail=False, methods=['post'])
    def toggle_status(self, request):
        phone = request.data.get('phone')
        u = get_object_or_404(User, phone=phone, role='citizen')
        u.is_active = not u.is_active
        u.save()
        return Response(CitizenSerializer(u).data)


class ContractorViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='contractor').order_by('-id')
    serializer_class = ContractorSerializer
    permission_classes = [IsStaff]

    def create(self, request, *args, **kwargs):
        data = request.data
        phone = data.get('phone') or data.get('username')

        if not phone:
            return Response({'detail': 'شماره تماس الزامی است.'}, status=400)

        if User.objects.filter(username=phone).exists():
            return Response({'detail': 'این شماره قبلاً ثبت شده است.'}, status=400)

        # ساخت کاربر با نقش پیمانکار
        user = User.objects.create_user(
            username=phone,
            phone=phone,
            password=data.get('password') or '12345678', # پسورد پیش‌فرض در صورت خالی بودن
            role='contractor',
            first_name=data.get('headName') or data.get('first_name', ''),
            email=data.get('email', ''),
            national_code=data.get('nationalCode') or data.get('national_code', ''),
            category=data.get('category', ''),
            member_count=data.get('memberCount') or data.get('member_count', 1),
            contractor_status=data.get('status', 'FREE')
        )
        return Response(ContractorSerializer(user, context={'request': request}).data, status=201)

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data

        # آپدیت فیلدها با پشتیبانی از هر دو نام‌گذاری (فرانت و بک)
        if 'headName' in data or 'first_name' in data:
            user.first_name = data.get('headName') or data.get('first_name')
        if 'phone' in data:
            user.phone = data.get('phone')
            user.username = data.get('phone')
        if 'email' in data:
            user.email = data.get('email')
        if 'nationalCode' in data or 'national_code' in data:
            user.national_code = data.get('nationalCode') or data.get('national_code')
        if 'category' in data:
            user.category = data.get('category')
        if 'memberCount' in data or 'member_count' in data:
            user.member_count = data.get('memberCount') or data.get('member_count')
        if 'status' in data:
            user.contractor_status = data.get('status')

        # آپدیت رمز عبور فقط در صورتی که مقدار جدیدی وارد شده باشد
        password = data.get('password')
        if password and password.strip():
            user.set_password(password)

        user.save()
        return Response(ContractorSerializer(user, context={'request': request}).data, status=200)


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data

        # 1. آپدیت نام (پشتیبانی از فرمت‌های مختلف فرانت‌اند)
        if 'headName' in data:
            user.first_name = data['headName']
        elif 'name' in data:
            name_parts = data['name'].split(' ', 1)
            user.first_name = name_parts[0]
            user.last_name = name_parts[1] if len(name_parts) > 1 else ''
        elif 'first_name' in data:
            user.first_name = data['first_name']

        if 'last_name' in data:
            user.last_name = data['last_name']

        # 2. آپدیت رمز عبور به صورت هش شده
        password = data.get('password')
        if password and password.strip():
            user.set_password(password)

        user.save()

        return Response({
            'detail': 'اطلاعات شما با موفقیت بروزرسانی شد.',
            'name': f"{user.first_name} {user.last_name}".strip()
        }, status=http_status.HTTP_200_OK)

    def get_queryset(self):
        return super().get_queryset().filter(request__citizen=self.request.user)
