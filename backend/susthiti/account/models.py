from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.text import slugify
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')

        return self.create_user(email, password, **extra_fields)

class UserData(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    
    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_active = models.DateTimeField(null=True, blank=True)
    
    is_mediatationTeacher = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_annoymousUser = models.BooleanField(default=False)
    
    objects = UserManager()
    
    def save(self, *args, **kwargs):
        if not (self.is_mediatationTeacher or self.is_annoymousUser or self.is_doctor):
            raise ValidationError("At least user must be user,doctor or mediatation teacher ")
        
        super().save(*args, **kwargs)
                
        if self.is_doctor:
            try:
                DoctorProfile.objects.get(user=self)
            except DoctorProfile.DoesNotExist:
                DoctorProfile.objects.create(user=self)

        elif self.is_annoymousUser:
            try:
                AnnonymousUser.objects.get(user=self)
            except AnnonymousUser.DoesNotExist:
                AnnonymousUser.objects.create(user=self)
                
        elif self.is_annoymousUser:
            try:
                AnnonymousUser.objects.get(user=self)
            except AnnonymousUser.DoesNotExist:
                AnnonymousUser.objects.create(user=self)
                
        elif self.is_mediatationTeacher:
            try:
                MediatatorTeacherProfile.objects.get(user=self)
            except MediatatorTeacherProfile.DoesNotExist:
                MediatatorTeacherProfile.objects.create(user=self)
    
    def delete(self, using=None, keep_parents=False):
        super().delete(using=using, keep_parents=keep_parents)
        
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class DoctorProfile(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name='doctor_profile')
    doctor_id = models.AutoField(primary_key=True, unique=True)
    
    username = models.CharField(max_length=125, unique=True)
    email = models.EmailField(max_length=100)
    first_name = models.CharField(max_length=125)
    last_name = models.CharField(max_length=125)
    rating = models.FloatField(null=True)
    
    password_reset_token = models.CharField(max_length=100, blank=True, null=True)
    password_reset_token_generated_time = models.DateTimeField(blank=True, null=True) 
    password_reset_token_expire = models.DateTimeField(blank=True, null=True)
    
    partnership_number = models.CharField(max_length=50, blank=True, null=True)
    partner_names = models.TextField(blank=True, null=True, help_text="JSON array of partner names")
    
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='user/profile_images/', null=True, blank=True)
    address = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.user.username
        if not self.email:
            self.email = self.user.email
        super().save(*args, **kwargs)


class AnnonymousUser(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name='annonymous_user')
    annonyuser_id = models.AutoField(primary_key=True, unique=True)
    
    username = models.CharField(max_length=125, unique=True)
    email = models.EmailField(max_length=100)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='user/profile_images/', null=True, blank=True)
    address = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    dob = models.DateTimeField(null=True)
    aptitude_test_score = models.FloatField(null=True)
    status = models.CharField(max_length=125, blank=True)
    resume = models.FileField(upload_to='user/resumes/', null=True, blank=True)
    externalURL = models.TextField(max_length=50, blank=True)

    def save(self, *args, **kwargs):
     if not self.username:
        self.username = self.user.username
     if not self.email:
        self.email = self.user.email
     if not self.status:
        # generate a unique status if needed
        import uuid
        self.status = str(uuid.uuid4())[:8]  # Example: short UUID
     super().save(*args, **kwargs)

class MediatatorTeacherProfile(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='mediatator_teacher_profiles')
    teacher_id = models.AutoField(primary_key=True, unique=True)
    
    username = models.CharField(max_length=125, unique=True)
    email = models.EmailField(max_length=100)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='seller/profile_images/', null=True, blank=True)
    company_name = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.user.username
        if not self.email:
            self.email = self.user.email
        super().save(*args, **kwargs)

from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class FreeTimeSlot(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='free_time_slots')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    expired = models.BooleanField(default=False)  # Field to track if the slot is expired

    def __str__(self):
        return f"Free Time Slot for {self.user.username} from {self.start_time} to {self.end_time}"

    def clean(self):
        # Ensure there's at least 1 hour gap between the previous time slot and the new one
        latest_end_time = FreeTimeSlot.objects.filter(
            user=self.user
        ).exclude(id=self.id if self.id else None).order_by('-end_time').values_list('end_time', flat=True).first()

        if latest_end_time:
            # Calculate the minimum allowed start time
            min_allowed_start_time = latest_end_time + timezone.timedelta(hours=1)

            # Check if the current start_time respects the required gap
            if self.start_time < min_allowed_start_time:
                raise ValidationError(_('Start time must be at least 1 hour after the latest end time of existing FreeTimeSlots for the same user.'))

    def save(self, *args, **kwargs):
        # Automatically set expired status based on the end time compared to the current time
        current_time = timezone.now()
        if self.end_time < current_time:
            self.expired = True  # Mark as expired if end_time is past the current time
        else:
            self.expired = False  # Not expired otherwise

        super().save(*args, **kwargs)

    class Meta:
        unique_together = [['user', 'start_time', 'end_time']]
        ordering = ['-start_time']  # Optional: Order time slots by the latest start time


class Appointment(models.Model):
    doctor = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='appointments_as_doctor')
    free_time_slot = models.ForeignKey(FreeTimeSlot, on_delete=models.CASCADE, related_name='appointments')
    booked_datetime = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='appointments')
    booked_startDateTime = models.DateTimeField()
    booked_endDateTime = models.DateTimeField()
    doctor_verify = models.BooleanField(default=False)
    google_meetLink = models.CharField(max_length=500, default="", blank=True)

    def __str__(self):
        return f"Appointment for {self.user.username} with {self.doctor.username} at {self.free_time_slot.start_time}"

    # class Meta:
    #     ordering = ['-']
    

class Notification(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - {self.message}"
    