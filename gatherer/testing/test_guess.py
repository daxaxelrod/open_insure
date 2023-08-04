from django.test import TestCase, Client
from rest_framework.status import HTTP_201_CREATED
from django.utils import timezone

from gatherer.models import (
    PolicyLineProperty,
    PropertyLifeExpectancyGuess,
    PropertyLifeLossGuess,
)
from pods.models import User, Badge


client = Client()


class GuessTestCase(TestCase):
    def setUp(self):
        self.handbag_property = PolicyLineProperty.objects.create(
            name="Handbag",
            description="Covers all handbags",
            image_url="http://example.com/handbag.png",
        )
        self.badge = Badge.objects.create(
            name="Actuarial Contributor",
            description="Contribute to the actuarial data of the platform",
            picture="http://example.com/actuary.png",
        )

    def test_anon_can_create_a_guess(self):
        # bag was bought 6 months ago for $1000
        # a partial loss was experienced 3 months ago
        bag_cost = 100000
        assumed_loss_rate = 500  # 5% per year, in basis points
        data = {
            "property_name": "David's Handbag",
            "property_make": "Diore",
            "property_type": self.handbag_property.id,
            "purchase_price": bag_cost,  # $1000
            "purchase_date": (
                timezone.now() - timezone.timedelta(days=30 * 6)
            ).isoformat(),
            "losses": [
                {
                    "loss_date": timezone.now() - timezone.timedelta(days=30 * 3),
                    "loss_reason": "damaged",
                    "loss_amount": bag_cost * assumed_loss_rate / 10000,  # $50
                }
            ],
        }
        response = client.post(
            f"/api/v1/guess/",
            data=data,
            content_type="application/json",
        )

        guesses = PropertyLifeExpectancyGuess.objects.all()
        losses = PropertyLifeLossGuess.objects.all()

        self.assertEquals(response.status_code, HTTP_201_CREATED)

        self.assertEquals(len(guesses), 1)
        self.assertEquals(len(losses), 1)
        self.assertIsNotNone(guesses[0].age_of_ownership)
        self.assertEquals(guesses[0].property_type, self.handbag_property)
        self.assertEquals(guesses[0].yearly_loss_rate_bsp, assumed_loss_rate)

    def test_guess_with_multiple_years_of_history(self):
        # bag was bought 2 years ago for $1000
        # a partial loss was experienced 18 months ago for 2 * loss_rate aka 10%
        # no loss in the second year
        bag_cost = 100000
        assumed_loss_rate_per_year = 500
        purchase_date = timezone.now() - timezone.timedelta(days=365 * 2)

        data = {
            "property_name": "David's older Handbag",
            "property_make": "Birkin",
            "property_type": self.handbag_property.id,
            "purchase_price": bag_cost,  # $1000
            "purchase_date": purchase_date.isoformat(),
            "losses": [
                {
                    "loss_date": timezone.now() - timezone.timedelta(days=365 + 182),
                    "loss_reason": "damaged",
                    "loss_amount": bag_cost
                    * assumed_loss_rate_per_year
                    * 2
                    / 10000,  # $100
                }
            ],
        }

        response = client.post(
            f"/api/v1/guess/",
            data=data,
            content_type="application/json",
        )

        guesses = PropertyLifeExpectancyGuess.objects.all()
        losses = PropertyLifeLossGuess.objects.all()

        self.assertEquals(response.status_code, HTTP_201_CREATED)

        self.assertEquals(len(guesses), 1)
        self.assertEquals(len(losses), 1)
        self.assertIsNotNone(guesses[0].age_of_ownership)
        self.assertEquals(guesses[0].property_type, self.handbag_property)
        self.assertEquals(guesses[0].yearly_loss_rate_bsp, assumed_loss_rate_per_year)

    def test_user_can_create_a_guess(self):
        user = User.objects.create_user("main@gmail.com", password="password")
        client.login(username=user.username, password="password")

        bag_cost = 100000
        purchase_date = timezone.now() - timezone.timedelta(days=365 * 2)
        data = {
            "property_name": "David's older Handbag",
            "property_make": "Birkin",
            "property_type": self.handbag_property.id,
            "purchase_price": bag_cost,  # $1000
            "purchase_date": purchase_date.isoformat(),
            "losses": [],
        }

        response = client.post(
            f"/api/v1/guess/",
            data=data,
            content_type="application/json",
        )

        guesses = PropertyLifeExpectancyGuess.objects.all()
        losses = PropertyLifeLossGuess.objects.all()
        badges = user.badges.all()

        self.assertEquals(response.status_code, HTTP_201_CREATED)

        self.assertEquals(len(guesses), 1)
        self.assertEquals(len(losses), 0)
        self.assertIsNotNone(guesses[0].age_of_ownership)
        self.assertEquals(guesses[0].property_type, self.handbag_property)
        self.assertEquals(guesses[0].guesser, user)

        # make sure the user got their badge
        self.assertEquals(len(badges), 1)
        self.assertEquals(badges[0].name, "Actuarial Contributor")
