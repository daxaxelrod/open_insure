

from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_instance_settings(request):
    """
        Get the settings for the current instance.
        These settings modify behavior of the API.

        !Never! returns private settings
    """
    
    return Response({
        "ESCROW_AGENT": settings.ESCROW_AGENT,
        "CLAIM_APPROVAL_THRESHOLD_PERCENTAGE": float(settings.CLAIM_APPROVAL_THRESHOLD_PERCENTAGE)
    }, status=200)