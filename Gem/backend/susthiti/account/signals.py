# account/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Appointment, Notification

@receiver(post_save, sender=Appointment)
def create_notification(sender, instance, created, **kwargs):
    if created or instance.doctor_verify:
        Notification.objects.create(
            user=instance.user,
            message=f"Appointment with {instance.doctor.username} at {instance.free_time_slot.start_time} has been verified."
        )
