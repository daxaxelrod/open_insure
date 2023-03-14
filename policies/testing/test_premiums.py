from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_200_OK

from pods.models import Pod, User
from policies.models import Premium
from policies.testing.helpers import create_test_policy


client = Client()


class PremiumsTestCase(TestCase):
    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user(
            "member@gmail.com", password="password"
        )
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)

        _, self.policy = create_test_policy(self.pod)
        client.login(username=self.main_user.username, password="password")

    def test_marking_a_premium_as_paid_increments_pool_balance(self):
        first_premium = Premium.objects.filter(
            policy=self.policy, payer=self.main_user
        ).first()

        self.assertEquals(first_premium.paid, False)
        self.assertEquals(self.policy.pool_balance, 0)

        client.patch(
            f"/api/v1/policies/{self.policy.id}/premiums/{first_premium.id}/",
            data={"paid": True},
            content_type="application/json",
        )

        # premium is 590 cents from create_test_user_risk_for_policy
        first_premium.refresh_from_db()
        self.policy.refresh_from_db()

        self.assertEquals(first_premium.paid, True)
        self.assertEquals(self.policy.pool_balance, 590)

    def test_unmarking_a_premium_as_paid_decrements_pool_balance(self):
        first_premium = Premium.objects.filter(
            policy=self.policy, payer=self.main_user
        ).first()
        first_premium.paid = True
        first_premium.save()
        self.policy.pool_balance = 590
        self.policy.save()

        client.patch(
            f"/api/v1/policies/{self.policy.id}/premiums/{first_premium.id}/",
            data={"paid": False},
            content_type="application/json",
        )

        first_premium.refresh_from_db()
        self.policy.refresh_from_db()

        self.assertEquals(first_premium.paid, False)
        self.assertEquals(self.policy.pool_balance, 0)
