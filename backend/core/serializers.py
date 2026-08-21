from rest_framework import serializers
from .models import User, Request, RequestImage, Feedback
from .jalali import to_farsi_date


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'phone', 'national_code']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(role='citizen', **validated_data)
        user.set_password(password)
        user.save()
        return user


class RequestSerializer(serializers.ModelSerializer):
    trackingCode = serializers.CharField(source='tracking_code', read_only=True)
    subCategory = serializers.CharField(source='sub_category')
    location = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    adminComment = serializers.CharField(source='admin_comment', required=False, allow_blank=True)
    assignedTo = serializers.SerializerMethodField()
    createdAt = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = ['id', 'trackingCode', 'name', 'phone', 'category', 'subCategory', 'description',
                  'location', 'images', 'status', 'adminComment', 'assignedTo', 'createdAt']

    def get_location(self, obj):
        return [obj.latitude, obj.longitude]

    def get_images(self, obj):
        request = self.context.get('request')
        urls = []
        for im in obj.images.all():
            url = im.image.url
            urls.append(request.build_absolute_uri(url) if request else url)
        return urls

    def get_assignedTo(self, obj):
        return obj.assigned_to.phone if obj.assigned_to else None

    def get_createdAt(self, obj):
        return to_farsi_date(obj.created_at)


class CitizenSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    regDate = serializers.SerializerMethodField()
    ticketCount = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'phone', 'email', 'regDate', 'ticketCount', 'status']

    def get_name(self, o):
        full = f"{o.first_name} {o.last_name}".strip()
        return full or o.username

    def get_regDate(self, o):
        return to_farsi_date(o.date_joined)

    def get_ticketCount(self, o):
        return o.requests.count()

    def get_status(self, o):
        return 'ACTIVE' if o.is_active else 'BLOCKED'


class ContractorSerializer(serializers.ModelSerializer):
    headName = serializers.CharField(source='first_name')
    nationalCode = serializers.CharField(source='national_code', required=False, allow_blank=True)
    memberCount = serializers.IntegerField(source='member_count', required=False, default=1)
    status = serializers.CharField(source='contractor_status', required=False)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'headName', 'nationalCode', 'phone', 'email', 'category', 'memberCount', 'status', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None) or validated_data.get('phone')
        validated_data.pop('contractor_status', None)
        user = User(username=validated_data['phone'], role='contractor',
                    first_name=validated_data.get('first_name', ''),
                    national_code=validated_data.get('national_code', ''),
                    email=validated_data.get('email', ''),
                    phone=validated_data['phone'],
                    category=validated_data.get('category', ''),
                    member_count=validated_data.get('member_count', 1))
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'request', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']
