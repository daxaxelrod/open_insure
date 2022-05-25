from rest_framework.permissions import BasePermission
class InPodAndNotPayee(BasePermission):
    def has_permission(self, request, view):
        return request.user in request.policy.pod.members.all()

    def has_object_permission(self, request, view, obj):
        return request.user in obj.policy.pod.members.all() and obj.claiment != request.user