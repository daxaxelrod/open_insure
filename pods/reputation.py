from pods.models import ReputationDetails
from django.utils import timezone


def determine_reputation_for_user(user):
    last_reputation: ReputationDetails = user.reputation_results.latest("created_at")
    now = timezone.now()
    if now < last_reputation.next_refresh_available:
        return last_reputation
    else:
        # todo
        