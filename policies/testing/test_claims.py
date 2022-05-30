from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase, override_settings, Client
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED

from pods.models import Pod, User
from policies.models import Policy
from policies.premiums import schedule_premiums
from policies.testing.helpers import create_test_policy

# initialize the APIClient app
client = Client()
class ClaimsTestCase(TestCase):

    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user("member@gmail.com", password="password")
        self.member_user_2 = User.objects.create_user("member_2@gmail.com", password="password")
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)
        self.pod.members.add(self.member_user_2)

        _, self.policy = create_test_policy(self.pod)

        client.login(username=self.main_user.username, password="password")

    def test_create_claim_sets_requestor_as_claimant(self):
        self.policy.pool_balance = 5000
        payload = {
            "title": "Test Claim",
            "description": "A claim to test user attribution",
            "policy": self.policy.id,
            "amount": 1000, # $10
        }
        response = client.post("/api/v1/claims/", payload)
        _json = response.json()
        
        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(_json["claimant"], self.main_user.id)
        self.assertEquals(_json["amount"], 1000)
        self.assertEquals(_json["paid_on"], None)
    
    @override_settings(CLAIM_APPROVAL_THRESHOLD_PERCENT=0.5)
    def test_claim_gets_paid_upon_majority_approval(self):
        # the claim gets marked as paid and the policy pool gets debited    
        self.assertTrue(False)

    def test_claim_creation_fails_if_user_is_not_member_of_pod(self):
        intruder = User.objects.create_user("intruder@gmail.com", password="password")
        client.login(username=intruder.username, password="password")

        payload = {
            "policy": self.policy.id,
            "amount": 10000, # $100
        }
        self.assertTrue(False)