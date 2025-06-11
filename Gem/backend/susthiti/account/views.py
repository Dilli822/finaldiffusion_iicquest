from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from .models import UserData
from .permissions import *
from rest_framework.generics import RetrieveAPIView
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(ListAPIView):
    queryset = UserData.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retrieve the authenticated user object
        return self.request.user

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = self.get_object()

        if user.is_doctor:
            doctor_profile = DoctorProfile.objects.filter(user=user).first()
            if doctor_profile:
                context['doctor_profile'] = doctor_profile

        elif user.is_annoymousUser:
            annonymous_user = AnnonymousUser.objects.filter(user=user).first()
            if annonymous_user:
                context['annonymous_user'] = annonymous_user

        elif user.is_mediatationTeacher:
            mediatator_teacher_profile = MediatatorTeacherProfile.objects.filter(user=user).first()
            if mediatator_teacher_profile:
                context['mediatator_teacher_profile'] = mediatator_teacher_profile

        return context

class DoctorProfileListCreate(generics.ListCreateAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]



class UserProfileList(generics.ListAPIView):
    serializer_class = AnnonymousUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return AnnonymousUser.objects.filter(user=user)
    

class DoctorProfileList(generics.ListCreateAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return DoctorProfile.objects.filter(user=user)
    
class AnnonymousUserListCreate(generics.ListCreateAPIView):
    queryset = AnnonymousUser.objects.all()
    serializer_class = AnnonymousUserSerializer
    permission_classes = [IsAuthenticated]

class MediatatorTeacherProfileListCreate(generics.ListCreateAPIView):
    queryset = MediatatorTeacherProfile.objects.all()
    serializer_class = MediatatorTeacherProfileSerializer
    permission_classes = [IsAuthenticated]
    
     
class DoctorProfileRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]
    
class AnnonymousUserRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = AnnonymousUser.objects.all()
    serializer_class = AnnonymousUserSerializer
    permission_classes = [IsOwnerOrAdmin, IsAuthenticated]
    
class MediatatorTeacherProfileRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = MediatatorTeacherProfile.objects.all()
    serializer_class = MediatatorTeacherProfileSerializer
    permission_classes = [IsOwnerOrAdmin, IsAuthenticated]
    
    
class UserDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()  # This will delete the user and cascade to related models

        return Response({"message": "Account deleted successfully."})
    
    
# class FreeTimeSlotListCreateAPIView(generics.ListCreateAPIView):
#     serializer_class = FreeTimeSlotSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         if self.request.user.is_doctor:
#             return FreeTimeSlot.objects.filter(user=self.request.user)
#         else:
#             return FreeTimeSlot.objects.all()

#     def perform_create(self, serializer):
#         if self.request.user.is_doctor:
#             serializer.save(user=self.request.user)
#         else:
#             serializer.save()

class FreeTimeSlotListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FreeTimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        current_datetime = timezone.now()
        if self.request.user.is_doctor:
            return FreeTimeSlot.objects.filter(user=self.request.user, end_time__gte=current_datetime)
        else:
            return FreeTimeSlot.objects.filter(end_time__gte=current_datetime)

    def perform_create(self, serializer):
        if self.request.user.is_doctor:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class FreeTimeSlotRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FreeTimeSlot.objects.all()
    serializer_class = FreeTimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

# Appointment Views
# class AppointmentListCreateView(generics.ListCreateAPIView):
#     serializer_class = AppointmentSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Appointment.objects.filter(user=self.request.user)
#         return Appointment.objects.all()

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter appointments where the user is either the doctor or the patient
        return Appointment.objects.filter(
            models.Q(user=user) | models.Q(doctor=user)
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        
# class AppointmentListCreateView(generics.ListCreateAPIView):
#     serializer_class = AppointmentSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Appointment.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         user = self.request.user
#         current_time = timezone.now()
#         # Calculate 12 hours ago from current time
#         twelve_hours_ago = current_time - timedelta(hours=12)
        
#         # Check if the user has any appointments within the last 12 hours on the same day
#         existing_appointments = Appointment.objects.filter(
#             user=user,
#             booked_datetime__gte=twelve_hours_ago.date(),  # Only consider date part
#             booked_datetime__lt=current_time.date(),  # Only consider date part
#         )
        
#         if existing_appointments.exists():
#             return Response({"error": "Cannot place appointment. You already have an appointment within the last 12 hours."}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Proceed to save the new appointment
#         serializer.save(user=user)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.all()
    
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Notification.objects.filter(user_id=user_id).order_by('-created_at')


class NotificationDetailView(generics.RetrieveAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Notification.objects.filter(user_id=user_id)
    
    
class DoctorProfileRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user = self.request.user
        return DoctorProfile.objects.get(user=user)

class DoctorProfileRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return DoctorProfile.objects.get(user=user)
    

from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from .models import UserData
from .serializers import UserSerializer

class UserListAllView(ListAPIView):
    queryset = UserData.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Open to all, no auth required