from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


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
    pod = models.OneToOneField("pods.Pod", on_delete=models.CASCADE, related_name='policies')
    
    coverage_type = models.CharField(choices=COVERAGE_TYPES, max_length=32)
    policy_type = models.CharField(choices=POLICY_TYPES, max_length=32)
    governance_type = models.CharField(choices=POLICY_GOVERNANCE_TYPES, max_length=32)
    
    max_pool_size = models.IntegerField(validators=[MinValueValidator(-1)], help_text="""
        Only related to Capped Pool policies.
        The maximum size of the collected premiums. Once hit, the policy no longer collects premiums until a claim gets paid out of the pool
        -1 means no limit.
    """)
    # pool_escrow = # an interface to some finicial provider setup with settings/config
    claim_payout_limit = models.IntegerField(validators=[MinValueValidator(-1)])
    
    estimated_risk = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Claim(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='claims')
    claiment = models.ForeignKey("pods.User", on_delete=models.CASCADE, related_name='claims')
