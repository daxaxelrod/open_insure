import json
from pods.models import ReputationDetails
from django.utils import timezone
from django.conf import settings
from pods.reputation.activity import get_reputation_from_activity
from pods.reputation.background import get_reputation_from_background
from pods.reputation.claims import get_reputation_from_claims
from pods.reputation.lifestyle import get_reputation_from_lifestyle
from pods.reputation.payments import get_reputation_from_payments
from selenium import webdriver
from linkedin_scraper import Person, actions


linkedin_email = settings.LINKEDIN_EMAIL
linkedin_password = settings.LINKEDIN_PASSWORD


def scrape_linkedin_profile(linkedin_url) -> Person:
    if not linkedin_url:
        return {}
    driver = webdriver.Chrome()
    # login action prevents security check
    actions.login(driver, linkedin_email, linkedin_password)
    person = Person(linkedin_url, driver=driver)
    return person


def determine_reputation_for_user(user):
    try:
        last_reputation: ReputationDetails = user.reputation_results.latest(
            "created_at"
        )
        now = timezone.now()
        if last_reputation and now < last_reputation.next_refresh_available:
            return last_reputation
    except ReputationDetails.DoesNotExist:
        pass

    linkedin_profile = scrape_linkedin_profile(user.linkedin_url)

    payments = get_reputation_from_payments(user)
    claims = get_reputation_from_claims(user)
    background = get_reputation_from_background(user, linkedin_profile)
    activity = get_reputation_from_activity(user)
    lifestyle = get_reputation_from_lifestyle(user, linkedin_profile)

    import pdb; pdb.set_trace()

    with open('./profile.json', 'w') as file:
            json.dump(linkedin_profile.to_dict(), file)


    total_score = (payments + claims + background + activity + lifestyle) / 5

    reputation = ReputationDetails.objects.create(
        user=user,
        calculated_on=timezone.now(),
        next_refresh_available=now
        + timezone.timedelta(days=settings.REPUTATION_REFRESH_COOLDAY_DAYS),
        total_score=total_score,
        payments=payments,
        claims=claims,
        background=background,
        activity=activity,
        lifestyle=lifestyle,
    )

    return reputation
