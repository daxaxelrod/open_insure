from rest_framework.permissions import BasePermission

from policies.models import Claim

class InClaimPod(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.policy.pod.members.all()


class IsNotClaimant(BasePermission):
    def has_object_permission(self, request, view, obj: Claim):
        return obj.claimant != request.user