import black
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from multiselectfield import MultiSelectField
from policies.model_choices import (
    COVERAGE_TYPES,
    PREMIUM_POOL_TYPE,
    POLICY_GOVERNANCE_TYPES,
    PREMIUM_PAYMENT_FREQUENCY_CHOICES,
    CLAIM_EVIDENCE_TYPE_CHOICES,
    UNDERLYING_INSURED_TYPE,
)
from policies.risk.models import *
from policies.perils.models import *



class Policy(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    pod = models.OneToOneField(
        "pods.Pod", on_delete=models.CASCADE, related_name="policy"
    )
    # fields limiting size of policy pod exist on the pod model

    coverage_type = models.CharField(choices=COVERAGE_TYPES, max_length=32)
    premium_pool_type = models.CharField(choices=PREMIUM_POOL_TYPE, max_length=32)
    governance_type = models.CharField(choices=POLICY_GOVERNANCE_TYPES, max_length=32)

    coverage_start_date = models.DateTimeField(null=True, blank=True)
    coverage_duration = models.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(36)],
        default=12,
        help_text="Duration of policy, in months",
    )
    available_underlying_insured_types = MultiSelectField(
        max_length=256,  # its a charfield under the hood
        max_choices=3,
        choices=UNDERLYING_INSURED_TYPE,
        null=True,
        blank=True,
    )

    max_pool_size = models.IntegerField(
        validators=[MinValueValidator(-1)],
        help_text="""
        Only related to Capped Pool policies.
        The maximum size of the collected premiums. Once hit, the policy no longer collects premiums until a claim gets paid out of the pool
        None means no limit.
        """,
        null=True,
        blank=True,
    )
    # Pool address is the address of this policy stored in the escrow agent that collects premiums
    # Randomly generated but will have to be configured by the user if they're using a none development
    # values can be normal random strings, btc address or a bank wire address of <routing_number>:<account_number>
    pool_address = models.CharField(max_length=200, null=True, blank=True)

    # The amount of premiums collected in the pool
    # The escrow agent will actually manage the balance, this acts as an easily accessible mirror
    pool_balance = models.IntegerField(default=0, help_text="In cents")

    premium_payment_frequency = models.IntegerField(
        choices=PREMIUM_PAYMENT_FREQUENCY_CHOICES,
        default=1,
        help_text="How often premiums are due, in months. 1 means monthly, 3 means quarterly, etc.",
    )
    escrow_manager = models.ForeignKey("pods.User", on_delete=models.CASCADE, null=True, blank=True) # for now anyone in the policy can manage premiums but i expect this to be a dedicated user role.
    

    # an interface to some financial provider setup with settings/config
    # actually might be better to have an injected provider, one per instance of the app
    # escrow_agent = models.CharField(choices=ESCROW_AGENT_TYPES, max_length=32, default="logging_escrow_agent")

    claim_payout_limit = models.IntegerField(
        validators=[MinValueValidator(-1)], null=True, blank=True
    )
    lifetime_payout_limit = models.IntegerField(
        validators=[MinValueValidator(-1)], null=True, blank=True
    )

    estimated_risk = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)], null=True, blank=True
    )  # an guess set by how big the current pool and pod are

    # I'm conflicted as to whether or not to add deductables
    # Pro:
    #       Extra incentive to not make non-serious claims
    #       The user has 'skin in the game'
    # Cons:
    #       Complicates claims process
    #       Encourages claim inflation

    claim_approval_threshold_percentage = models.IntegerField(default=50, help_text="Percentage of members that must vote yes to approve a claim")
    claim_approval_vote_due_number_of_days = models.IntegerField(default=7, help_text="Number of days after a claim is submitted that the vote is due without penalty")
    perils = models.ManyToManyField(Peril, blank=True, related_name="policies")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_public = models.BooleanField(default=False)

    def is_policy_active(self):
        return (
            self.coverage_start_date is not None
            and self.coverage_start_date < timezone.now()
            and self.coverage_start_date + relativedelta(months=self.coverage_duration)
            > timezone.now()
        )

    def __str__(self) -> str:
        return f"{self.name} Policy ({self.pod.name} Pod)"


available_insured_asset_types = models.Q(
    app_label="policies", model="phonerisk"
) | models.Q(app_label="policies", model="audioequipmentrisk")


class Risk(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name="risks")
    user = models.ForeignKey(
        "pods.User",
        related_name="risks",
        on_delete=models.CASCADE,
    )

    # the percent chance that a complete loss will happen for the duration of the policy
    risk_score = models.IntegerField(
        null=True,
        blank=True,
        help_text="In basis points. The percent chance that a complete loss will happen in the period",
        validators=[MinValueValidator(1)],
    )
    value_at_risk = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="The expected dollar amount loss for a given item computed at the beginning of the policy, in cents",
    )

    premium_amount = models.IntegerField(
        validators=[MinValueValidator(100)], help_text="in cents", null=True, blank=True
    )

    # the details of the underlying asset, see risk -> models.py
    underlying_insured_type = models.CharField(
        choices=UNDERLYING_INSURED_TYPE, max_length=32, null=True, blank=True
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to=available_insured_asset_types,
        null=True,
        blank=True,
    )

    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.user}'s' Risk - ({self.policy.name} Policy)"

class PolicyRiskSettings(models.Model):
    policy = models.OneToOneField(Policy, on_delete=models.CASCADE, related_name="risk_settings")

    conservative_factor = models.IntegerField(default=0, help_text="how much do you want to pad the risk score by. The higher it is the more premiums everyone pays")
    
    # todo JSON field with the risk settings for each risk type
    # want to punt on JSON field bc sqlite doesn't support it
    # or at least some kind of polymorphic thing where we can have a different risk settings for each risk type
    cell_phone_peril_rate = models.IntegerField(default=10, help_text="cell_phone base peril rate, percent per year", validators=[MinValueValidator(1), MaxValueValidator(100)])
    cell_phone_case_discount = models.IntegerField(default=100, help_text="cell_phone case discount, absolute basis points",)
    cell_phone_screen_protector_discount = models.IntegerField(default=100, help_text="cell_phone case discount, absolute basis points")
    audio_equipment_peril_rate = models.IntegerField(default=15, help_text="audio_equipment base peril rate", validators=[MinValueValidator(1), MaxValueValidator(100)])

    annual_discount_rate = models.IntegerField(default=0, help_text="Annual interest rate that escrow balance could be invested at, in basis points. 100 = 1%")

    last_updated_by = models.ForeignKey("pods.User", on_delete=models.SET_NULL, null=True, blank=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.policy.name} Risk Settings -- Conservative Factor: {self.conservative_factor}%"

class Premium(models.Model):
    policy = models.ForeignKey(
        Policy, on_delete=models.CASCADE, related_name="premiums"
    )
    amount = models.IntegerField(
        validators=[MinValueValidator(1)], help_text="in cents"
    )
    payer = models.ForeignKey(
        "pods.User", on_delete=models.CASCADE, related_name="premiums_paid"
    )
    due_date = models.DateField(
        null=False, blank=False, help_text="Date premiums are due"
    )
    paid = models.BooleanField(default=False)
    paid_date = models.DateField(null=True, blank=True)
    marked_paid_by = models.ForeignKey("pods.User", on_delete=models.CASCADE, null=True, blank=True, related_name="premiums_marked_paid")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Premium for {self.policy.name} paid by {self.payer}, due on {self.due_date}"


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

    policy = models.OneToOneField(
        Policy, related_name="close_out", on_delete=models.CASCADE
    )
    reason = (
        models.TextField()
    )  # for now, policies can only be closed by the policy creator or that they expired
    premiums_returned_amount = models.IntegerField(
        validators=[MinValueValidator(1)], help_text="in cents"
    )  # or satoshis I guess


class Claim(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name="claims")
    claimant = models.ForeignKey(
        "pods.User", on_delete=models.CASCADE, related_name="claims"
    )
    title = models.CharField(max_length=200)
    description = models.TextField()

    amount = models.IntegerField(
        validators=[MinValueValidator(1)], help_text="in cents"
    )
    paid_on = models.DateField(
        null=True, blank=True, help_text="Null means not paid yet"
    )

    # does this need more context? Maybe another field with an explanation
    # its useful for allowing the system to mark claims as over the limit without having to recompute all the prior payouts each time
    is_claim_invalid = models.BooleanField(
        default=False,
        help_text="If true, claim can't be paid out, regardless of approval status",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_approved(self):
        all_approvals_count = self.approvals.count()
        approved_count = self.approvals.filter(approved=True).count()
        return (approved_count / all_approvals_count) >= float(
            settings.CLAIM_APPROVAL_THRESHOLD_PERCENTAGE
        )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "policy",
                    "claimant",
                    "title",
                    "description",
                    "amount",
                ],
                name="user-claim-unique",
            )
        ]

    def __str__(self) -> str:
        if self.is_approved():
            approval_str = "Approved :"
        else:
            approval_str = "test"
        return f"{approval_str} Claim for {self.policy.name} by {self.claimant}"


class ClaimEvidence(models.Model):
    # Mainly just pictures of what happened. Just links to a url so could also be documents
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name="evidence")
    evidence_type = models.CharField(max_length=16, choices=CLAIM_EVIDENCE_TYPE_CHOICES)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# think of these as votes
class ClaimApproval(models.Model):
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name="approvals")
    approved = models.BooleanField(default=False, blank=True)
    approved_on = models.DateTimeField(null=True, blank=True)
    viewed_on = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the approver viewed the approval. Helpful to nudge those who let stuff pile up. Wuick turnarounds on claims is a better user experience",
    )
    comment = models.TextField(null=True, blank=True)

    # no restrictions at the db level because of the direct democracy OR forced commitee switch
    # checks to be done at the app level
    approver = models.ForeignKey(
        "pods.User", on_delete=models.CASCADE, related_name="approvals"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        if self.approved:
            repr_str = "approved"
        else:
            repr_str = "not approved"
        return f"{self.approver} vote on claim {self.claim} - {repr_str}"
