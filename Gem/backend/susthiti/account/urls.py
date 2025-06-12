from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name="sign_up"),
    path('auth/usersList/', UserListView.as_view(), name="get_users"),
    path('auth/user/', UserView.as_view(), name="user"),
    
    path('doctors/', DoctorProfileListCreate.as_view(), name='doctor-list-create'),
    path('doctors/edit/<int:pk>/', DoctorProfileRetrieveUpdateDestroy.as_view(), name='doctor-detail'),
    
    path('doctors/self',  DoctorProfileList.as_view(), name='doctor-list-create'),
    path('users/self',  UserProfileList.as_view(), name='doctor-list-create'),

    path('anonymous-users/', AnnonymousUserListCreate.as_view(), name='anonymous-user-list-create'),
    path('anonymous-users/<int:pk>/', AnnonymousUserRetrieveUpdateDestroy.as_view(), name='anonymous-user-detail'),
    
    path('mediator-teachers/', MediatatorTeacherProfileListCreate.as_view(), name='mediator-teacher-list-create'),
    path('mediator-teachers/<int:pk>/', MediatatorTeacherProfileRetrieveUpdateDestroy.as_view(), name='mediator-teacher-detail'),
    
    path('doctor/free-time-slots/list/', FreeTimeSlotListCreateAPIView.as_view(), name='free-time-slot-list-create'),
    path('doctor/free-time-slots/create/', FreeTimeSlotListCreateAPIView.as_view(), name='free-time-slot-list-create'),
    path('doctor/free-time-slots/edit/<int:pk>/', FreeTimeSlotRetrieveUpdateDestroyAPIView.as_view(), name='free-time-slot-detail'),
    
    # user place the appointment to the doctor
    path('users/appointments-to-doctor/create/', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('users/appointments-to-doctor/list/', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('users/appointments-to-doctor/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    
    # doctor list the received appoints from the user
    path('appointments-to-doctor/list/', AppointmentListCreateView.as_view(), name='appointment-list-create'),

    
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    ####################


    path('api/doctor-profile/', DoctorProfileRetrieveUpdateDestroy.as_view(), name='doctor-profile-list'),
    
    
     path('user/last-active/', UserListAllView.as_view(), name='user-last-active'),

    
]