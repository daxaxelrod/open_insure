
from rest_framework.permissions import BasePermission

from policies.models import Risk

class IsRiskOwner(BasePermission):
    def has_object_permission(self, request, view, obj: Risk):
        return request.user and obj.user == request.user
