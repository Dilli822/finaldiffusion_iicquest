from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admin users to access.
    """

    def has_object_permission(self, request, view, obj):
        # Allow admins to perform any action
        if request.user.is_staff:
            return True

        # Allow users to perform read-only actions
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user making the request is the owner of the DoctorProfile
        return obj.user == request.user
    
    
from rest_framework import permissions

class IsDoctorOrTeacher(permissions.BasePermission):
    """
    Custom permission to only allow doctors or meditation teachers to access the view.
    """

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and (user.is_doctor or user.is_mediatationTeacher)

