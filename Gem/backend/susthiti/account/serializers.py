from rest_framework import serializers
from .models import UserData
from .models import *

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserData
        fields = ['id', 'username', 'email', 'password', 'is_annoymousUser', 'is_doctor', 'is_mediatationTeacher', 'last_active']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = UserData.objects.create_user(**validated_data)
        return user

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = '__all__'
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            # If the instance exists (i.e., updating), treat the required fields as optional
            for field_name in self.fields.keys():
                self.fields[field_name].required = False

class AnnonymousUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnonymousUser
        fields = '__all__'
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            # If the instance exists (i.e., updating), treat the required fields as optional
            for field_name in self.fields.keys():
                self.fields[field_name].required = False

class MediatatorTeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediatatorTeacherProfile
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            # If the instance exists (i.e., updating), treat the required fields as optional
            for field_name in self.fields.keys():
                self.fields[field_name].required = False
                
                
from rest_framework import serializers
from .models import *

class FreeTimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreeTimeSlot
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        
        
class AppointmentSerializerForDoctors(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'  # or specify the fields you want to include