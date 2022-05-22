from datetime import timedelta
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from pytz import timezone

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
    
    # forced_commitee (Not implemented)
    # Claims are approved by a randomly chosen, timeboxed committee
    # Sort of like jury duty where you get picked
    # ("forced_commitee", "Forced Commitee"),
    
    # voluntary_commitee (Not implemented)
    # People vote at the beginning of the policy for who gets to be the claims officator
    # ("voluntary_commitee", "Voluntary Commitee"),
]

PREMIUM_PAYMENT_FREQUENCY_CHOICES = [
    (0, "Yearly"),
    (1, "Monthly"),
    (2, "Quarterly")
]

class Policy(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    pod = models.OneToOneField(
        "pods.Pod", on_delete=models.CASCADE, related_name="policies"
    )

    coverage_type = models.CharField(choices=COVERAGE_TYPES, max_length=32)
    policy_type = models.CharField(choices=POLICY_TYPES, max_length=32)
    governance_type = models.CharField(choices=POLICY_GOVERNANCE_TYPES, max_length=32)

    coverage_start_date = models.DateTimeField(null=True, blank=True)
    coverage_duration = models.IntegerField(validators=[MinValueValidator(3), MaxValueValidator(36)], default=12, help_text="Duration of policy, in months")

    max_pool_size = models.IntegerField(
        validators=[MinValueValidator(-1)],
        help_text="""
        Only related to Capped Pool policies.
        The maximum size of the collected premiums. Once hit, the policy no longer collects premiums until a claim gets paid out of the pool
        -1 means no limit.
    """,
    )
    # Pool address is the address of this policy stored in the escrow agent that collects premiums
    # Randomly generated but will have to be configured by the user if they're using a none development
    # values can be normal random strings, btc address or a bank wire address of <routing_number>:<account_number>
    pool_address = models.CharField(max_length=200, null=True, blank=True)

    # for now every member pays the same premium amount, set at the policy level.
    # In the future, we will have a premium per member, based on risk of that memeber to the rest of the pod
    premium_amount = models.IntegerField(default=500, validators=[MinValueValidator(100)], help_text="in cents")
    premium_payment_frequency = models.IntegerField(choices=PREMIUM_PAYMENT_FREQUENCY_CHOICES, default=0, help_text="How often premiums are due,")

    # an interface to some finicial provider setup with settings/config
    # actually might be better to have an injected provider, one per instance of the app
    # escrow_agent = models.CharField(choices=ESCROW_AGENT_TYPES, max_length=32, default="logging_escrow_agent")
    
    claim_payout_limit = models.IntegerField(validators=[MinValueValidator(-1)])

    estimated_risk = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    ) # an guess set by how big the current pool and pod are
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_policy_active(self):
        return (
            self.coverage_start_date is not None \
            and self.coverage_start_date < timezone.now() \
            and self.coverage_start_date + timedelta(months=self.coverage_duration) > timezone.now()
        )

class Premium(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='premiums')
    amount = models.IntegerField(validators=[MinValueValidator(1)], help_text='in cents')
    payer = models.ForeignKey('pods.User', on_delete=models.CASCADE, related_name='premiums_paid')
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PolicyCloseout(models.Model):
    """
        A lot of the consumer surplus that comes from this kind of insurance comes from 
        returning unused premiums at the end of the period if they were not used to pay claims.

        We can pay back in a few ways. Take the following scenario
        
        - Policy with 3 users, A, B and C
        - Premiums are $100 each for entire policy
        - 1 claim paid to user A, cost $150.
        - $150 remaining in the pool to be paid

        Now question:
        Do we pay back each user equally, everyone gets $50
        Or do we say that if you filed a claim, thats some kind of 'deductable'
        So user A would get $0 at the end of the period
        User B and C get $75 each

        This punishes User A for getting unlucky but it also helps to disuage people who are claim trigger happy

        For now, going with simple payback, the everyone gets a proportional split. What do you think! Open a github issue with your ideas!
    """

    policy = models.OneToOneField(Policy, related_name="close_out", on_delete=models.CASCADE)
    reason = models.TextField() # for now, policies can only be closed by the policy creator or that they expired
    premiums_returned_amount = models.IntegerField(validators=[MinValueValidator(1)], help_text="in cents") # or satoshis I guess


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