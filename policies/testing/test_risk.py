from django.contrib.auth.models import User
from django.test import TestCase, override_settings, Client
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_200_OK

from pods.models import Pod, User
from policies.models import Claim, ClaimApproval
from policies.testing.helpers import create_test_policy


client = Client()


class RiskTestCase(TestCase):
    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user(
            "member@gmail.com", password="password"
        )
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)

        _, self.policy = create_test_policy(self.pod)

    # todo
    # def test_user_not_in_policy_can_create_risk(self):
    #     self.assertTrue(False)

    # def test_premiums_get_created_when_a_user_joins_a_policy_with_a_valid_risk(self):
    #     self.assertTrue(False)
