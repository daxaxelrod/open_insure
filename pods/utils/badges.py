from django.db import IntegrityError
from pods.models import Badge


def award_badge(user, badge_name):
    try:
        badge = Badge.objects.get(name=badge_name)
    except Badge.DoesNotExist:
        return
    try:
        user.badges.add(badge)
        user.save()
    except IntegrityError:
        return
