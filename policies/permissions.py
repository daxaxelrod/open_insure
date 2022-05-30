from rest_framework.permissions import BasePermission
class InPodAndNotClaimant(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.claim.policy.pod.members.all() and obj.claimant != request.user

class InPod(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.pod.members.all()