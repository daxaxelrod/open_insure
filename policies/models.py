from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

COVERAGE_TYPES = [
    ("m_property", "Minor Property"),
    ("renters", "Renter's"),
    # ("pet", "Pet"),
]

POLICY_TYPES = [
    ("perpetual_pool", "Perpetual Pool"),
    # ("capped_pool", "Capped Pool"),
    # ("capital_call", "Capital Call"),
]

POLICY_GOVERNANCE_TYPES = [
    # direct_democracy
    # Every claim needs to be voted on by all members of the policy
    ("direct_democracy", "Direct Democracy"),
    # forced_commitee
    # Claims are approved by a randomly chosen, timeboxed committee
    # Sort of like jury duty where you get picked
    ("forced_commitee", "Forced Commitee"),
    # voluntary_commitee
    # People vote at the beginning of the policy for who gets to be the claims officator
    ("voluntary_commitee", "Voluntary Commitee"),
]

# Create your models here.
class Policy(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    pod = models.OneToOneField(
        "pods.Pod", on_delete=models.CASCADE, related_name="policies"
    )

    coverage_type = models.CharField(choices=COVERAGE_TYPES, max_length=32)
    policy_type = models.CharField(choices=POLICY_TYPES, max_length=32)
    governance_type = models.CharField(choices=POLICY_GOVERNANCE_TYPES, max_length=32)

    max_pool_size = models.IntegerField(
        validators=[MinValueValidator(-1)],
        help_text="""
        Only related to Capped Pool policies.
        The maximum size of the collected premiums. Once hit, the policy no longer collects premiums until a claim gets paid out of the pool
        -1 means no limit.
    """,
    )

    # for now every member pays the same premium amount, set at the policy level.
    # In the future, we will have a premium per member, based on risk of that memeber to the rest of the pod
    premium_amount = models.IntegerField(default=500, validators=[MinValueValidator(100)], help_text="in cents")

    # an interface to some finicial provider setup with settings/config
    # actually might be better to have an injected provider, one per instance of the app
    # escrow_agent = models.CharField(choices=ESCROW_AGENT_TYPES, max_length=32, default="logging_escrow_agent")
    
    claim_payout_limit = models.IntegerField(validators=[MinValueValidator(-1)])

    estimated_risk = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    ) # an guess set by how big the current pool and pod are
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Premium(models.Model):
    amount = models.IntegerField(validators=[MinValueValidator(1)], help_text='in cents')
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='premiums')
    payer = models.ForeignKey('pods.User', on_delete=models.CASCADE, related_name='premiums_paid')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Claim(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name="claims")
    claiment = models.ForeignKey(
        "pods.User", on_delete=models.CASCADE, related_name="claims"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ClaimApproval(models.Model):
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name="approvals")
    
    # no restrictions at the db level because of the direct democracy OR forced commitee switch
    # to be done at the app level
    approver = models.ForeignKey(
        "pods.User", on_delete=models.CASCADE, related_name="approvals"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)