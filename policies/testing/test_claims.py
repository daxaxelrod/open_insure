from django.contrib.auth.models import User
from django.test import TestCase, override_settings, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_200_OK, HTTP_403_FORBIDDEN

from pods.models import Pod, User
from policies.models import Claim, ClaimApproval, ClaimEvidence
from policies.testing.helpers import create_test_policy, create_paid_claim_for_user, prepay_all_premiums_for_user

# initialize the APIClient app
client = Client()

small_gif = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
            b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
            b'\x02\x4c\x01\x00\x3b'
        )
class ClaimsTestCase(TestCase):

    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user("member@gmail.com", password="password")
        self.member_user_2 = User.objects.create_user("member_2@gmail.com", password="password")
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)
        self.pod.members.add(self.member_user_2)

        _, self.policy = create_test_policy(self.pod)
        prepay_all_premiums_for_user(self.main_user, self.policy)

        client.login(username=self.main_user.username, password="password")

    def generate_approvals(self, claim):
        pod_members_except_claimant = claim.policy.pod.members.all().exclude(id=claim.claimant.id)
        approvals = [
            ClaimApproval(claim=claim, approver=user)
            for user in pod_members_except_claimant
        ]
        ClaimApproval.objects.bulk_create(approvals)

    def test_create_claim_sets_requestor_as_claimant(self):
        payload = {
            "title": "Test Claim",
            "description": "A claim to test user attribution",
            "policy": self.policy.id,
            "amount": 1000, # $10
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", payload)
        _json = response.json()
        
        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(_json["claimant"], self.main_user.id)
        self.assertEquals(_json["amount"], 1000)
        self.assertEquals(_json["paid_on"], None)
    
    @override_settings(CLAIM_APPROVAL_THRESHOLD_PERCENTAGE=0.10)
    def test_claim_gets_paid_upon_majority_approval(self):
        # the claim gets marked as paid and the policy pool gets debited
        # main user creates a claim, 1 of the other two then approve it
        #   - (main user doesnt get a vote on their claim)
        self.policy.pool_balance = 5000
        self.policy.save()

        evidence = self.create_evidence()
        payload = {
            "title": "Test Claim",
            "description": "A claim to test user attribution",
            "policy": self.policy.id,
            "amount": 1000, # $10
            "evidence": [evidence.id,]
        }

        claim_creation_response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", payload, content_type="application/json")
        try:
            main_user_claim = Claim.objects.get(policy=self.policy, claimant=self.main_user)
        except Claim.DoesNotExist:
            self.assertTrue(False)

        member_claim_approval = ClaimApproval.objects.get(claim=main_user_claim, approver=self.member_user)

        # member 1 approves the claim
        client.login(username=self.member_user.username, password="password")
        
        member_1_approval_response = client.patch(f"/api/v1/claims/{main_user_claim.id}/approvals/{member_claim_approval.id}/", {
            "approved": True,
        }, content_type='application/json')

        self.policy.refresh_from_db()

        self.assertEquals(claim_creation_response.status_code, HTTP_201_CREATED)
        self.assertEquals(member_1_approval_response.status_code, HTTP_200_OK)
        self.assertTrue(main_user_claim.is_approved())
        self.assertEquals(self.policy.pool_balance, 4000)

    def test_claim_creation_fails_if_user_is_not_member_of_pod(self):
        intruder = User.objects.create_user("intruder@gmail.com", password="password")
        client.login(username=intruder.username, password="password")
        payload = {
            "title": "Test Claim",
            "description": "A claim to test user attribution",
            "policy": self.policy.id,
            "amount": 1000, # $10
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", payload)
        
        num_claims_for_policy = Claim.objects.filter(policy=self.policy).count()
        
        self.assertEquals(response.status_code, HTTP_403_FORBIDDEN)
        self.assertEqual(num_claims_for_policy, 0)

    def test_user_cannot_create_claim_if_they_are_not_current_on_their_premiums(self):
        # member_user hasnt paid their premiums yet
        # Should block member_user from creating a claim
        client.login(username=self.member_user, password="password")
        payload = {
            "title": "Test Claim",
            "description": "A claim to test blocking claims",
            "policy": self.policy.id,
            "amount": 1000, # $10
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", payload)
        claims = Claim.objects.filter(policy=self.policy)

        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEqual(claims.count(), 0)
    
    def test_identical_claims_get_rejected(self):
        orignal_claim = Claim.objects.create(
            policy=self.policy,
            claimant=self.main_user,
            title="Test Claim",
            description="Testing no duplicates",
            amount=1000,
        )
        # same title, policy, description and amount
        payload = {
            "title": orignal_claim.title,
            "description": orignal_claim.description,
            "policy": orignal_claim.policy.id,
            "amount": orignal_claim.amount
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", payload)

        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        
    def test_claim_gets_created_with_lower_amount_if_prior_payouts_puts_user_over_lifetime_payout_limit(self):
        # if a policy has a payout limit, 
        # then a user can only create a claim up to the max 
        # taking into account their prior paid out claims plus the theorical payout up to the limit

        # create a policy with a payout limit of $100
        # and a user who has an $80 claim already paid

        # create a claim of $30, the amount should be switched to $20
        self.policy.lifetime_payout_limit = 1000
        self.policy.save()
        
        create_paid_claim_for_user(self.main_user, self.policy, 800)
        claim_over_limit = {
            "policy": self.policy.id,
            "title": "Test Claim",
            "description": "Testing no duplicates",
            "amount": 1000,
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", claim_over_limit)
        _json = response.json()

        # claim got created but amount was lowered
        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(_json["amount"], 200) 

        
    def test_claim_instantly_rejected_if_over_policy_claim_payout_limit(self):
        # a user has already drawn the max they can for the policy
        # Ie policy has limit of $100 and user has $100 paid out already

        self.policy.claim_payout_limit = 500
        self.policy.save()
        
        claim_over_limit = {
            "policy": self.policy.id,
            "title": "Test Claim",
            "description": "Testing no duplicates",
            "amount": 1000,
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", claim_over_limit)
        claims = Claim.objects.filter(policy=self.policy)

        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEquals(claims.count(), 0)
        
    def test_claim_gets_rejected_if_user_at_lifetime_payout_limit(self):
        # a user has already drawn the max they can for the policy
        # Ie policy has limit of $100 and user has $100 paid out already

        self.policy.lifetime_payout_limit = 500
        self.policy.save()
        
        create_paid_claim_for_user(self.main_user, self.policy, 500)

        claim_over_limit = {
            "policy": self.policy.id,
            "title": "Something else happened",
            "description": "I swear, plz pay me",
            "amount": 50,
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", claim_over_limit)
        claims = Claim.objects.filter(policy=self.policy)

        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEquals(claims.count(), 1)

    @override_settings(CLAIM_APPROVAL_THRESHOLD_PERCENTAGE=0.10)
    def test_claim_approval_prevented_if_claimant_is_over_lifetime_policy_limit(self):
        #    ^------------^ 
        # prevents a users from having a bunch of outstanding claims that get past the first over payment filter
        # hopefuly real people notice this but not a bad thing to have the system prevent this kind of thing

        self.policy.lifetime_payout_limit = 5000
        self.policy.save()
        
        evidence = self.create_evidence()
        payload = {
            "policy": self.policy.id,
            "title": "An outstanding claim while the other gets paid",
            "description": "I should be declined",
            "amount": 1000,
            "evidence": [evidence.id,]
        }
        response = client.post(f"/api/v1/policies/{self.policy.id}/claims/", payload, content_type="application/json")

        _json = response.json()
        outstanding_claim_id = _json["id"]
        overage_claim = Claim.objects.get(id=outstanding_claim_id)

        # then that same user makes a claim of $50 which gets instantly paid
        create_paid_claim_for_user(self.main_user, self.policy, 5000)

        
        member_claim_approval = ClaimApproval.objects.get(claim=overage_claim, approver=self.member_user)
        

        # member 1 tries to approves the claim
        client.login(username=self.member_user.username, password="password")
        
        member_1_approval_response = client.patch(f"/api/v1/claims/{outstanding_claim_id}/approvals/{member_claim_approval.id}/", {
            "approved": True,
        }, content_type='application/json')

        member_claim_approval.refresh_from_db()
        self.policy.refresh_from_db()
        overage_claim.refresh_from_db()
        
        self.assertEquals(member_1_approval_response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEquals(member_claim_approval.approved, False)
        self.assertEquals(overage_claim.paid_on, None)
        self.assertEquals(self.policy.pool_balance, 0)

    def create_evidence(self):
        uploaded = SimpleUploadedFile('small.gif', small_gif, content_type='image/gif')
        evidence = ClaimEvidence.objects.create(
            image=uploaded,
            policy=self.policy,
            owner=self.main_user,
            evidence_type='photo'
        )
        
        return evidence
        
        