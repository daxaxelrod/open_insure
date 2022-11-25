from rest_framework.permissions import BasePermission

from policies.models import Claim, ClaimApproval, Policy, ClaimComment

class InClaimPod(BasePermission):
    def has_permission(self, request, view):
        policy_id = view.kwargs["policy_pk"]
        policy = Policy.objects.get(id=policy_id)
        return request.user in policy.pod.members.all()

    def has_object_permission(self, request, view, obj: Claim):
        return request.user in obj.policy.pod.members.all()

class InClaimApprovalPod(BasePermission):
    def has_object_permission(self, request, view, obj: ClaimApproval):
        return request.user in obj.claim.policy.pod.members.all()

class IsNotClaimant(BasePermission):
    def has_object_permission(self, request, view, obj: ClaimApproval):
        return obj.claim.claimant != request.user

class IsCommentOwner(BaseException):
    def has_object_permission(self, request, view, obj: ClaimComment):
        return obj.commenter is request.user