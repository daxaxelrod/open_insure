from policies.models import ClaimApproval, Claim
from policies.claims.emails import send_notification_of_new_claim_vote
from django.utils import timezone

def conditionally_create_claim_approvals(claim):
        policy_type = claim.policy.governance_type
        if policy_type == "direct_democracy" and claim.has_evidence():
            pod_members_except_claimant = claim.policy.pod.members.all().exclude(id=claim.claimant.id)
            approvals = [
                ClaimApproval(claim=claim, approver=user, approved=None)
                for user in pod_members_except_claimant
            ]
            ClaimApproval.objects.bulk_create(approvals)
            send_notification_of_new_claim_vote(claim, pod_members_except_claimant)

def conditionally_approve_claim(claim: Claim):
    policy_type = claim.policy.governance_type
    if policy_type == "direct_democracy":
        if claim.is_approved(): 
            claim.approved_on = timezone.now()
            claim.save()