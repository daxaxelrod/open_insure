from policies.models import ClaimApproval
from policies.claims.emails import send_notification_of_new_claim_vote

def conditionally_create_claim_approvals(self, claim):
        policy_type = claim.policy.governance_type
        if policy_type == "direct_democracy" and claim.has_evidence():
            pod_members_except_claimant = claim.policy.pod.members.all().exclude(id=claim.claimant.id)
            approvals = [
                ClaimApproval(claim=claim, approver=user)
                for user in pod_members_except_claimant
            ]
            ClaimApproval.objects.bulk_create(approvals)
            send_notification_of_new_claim_vote(claim, pod_members_except_claimant)
