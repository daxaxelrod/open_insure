from rest_framework.permissions import BasePermission
from policies.models import PolicyRiskSettings

from policies.risk.models import PropertyImage


class InPodAndNotClaimant(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user in obj.claim.policy.pod.members.all()
            and obj.claimant != request.user
        )

class InRiskSettingsPolicyPod(BasePermission):
    def has_object_permission(self, request, view, obj: PolicyRiskSettings):
        return (
            request.user in obj.policy.pod.members.all()
        )


class InPolicyPod(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.pod.members.all()


class InClaimPod(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.policy.pod.members.all()


class IsPhotoOwner(BasePermission):
    def has_object_permission(self, request, view, obj: PropertyImage):
        return request.user and obj.owner == request.user
