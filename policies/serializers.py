from django.db import IntegrityError
from django.utils import timezone
from rest_framework import serializers
from rest_framework.fields import MultipleChoiceField
from pods.serializers import PodSerializer
from pods.models import Pod
from policies.model_choices import UNDERLYING_INSURED_TYPE

from policies.models import (
    Claim,
    Policy,
    Premium,
    PolicyCloseout,
    Claim,
    ClaimApproval,
    Risk,
)
from policies.perils.models import Peril
from policies.premiums import schedule_premiums

from policies.risk.serializer_fields import RiskContentObjectRelatedField

policy_fields = [
    "id",
    "name",
    "description",
    "pod",
    "coverage_type",
    "premium_pool_type",
    "governance_type",
    "max_pool_size",
    "claim_payout_limit",
    "estimated_risk",
    "created_at",
    "updated_at",
    "coverage_start_date",
    "coverage_end_date",
]


class FullClaimApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimApproval
        fields = "__all__"


class ClaimApprovalSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        if self.instance:
            claim = self.instance.claim
            policy = self.instance.claim.policy

            if claim.is_approved():
                raise serializers.ValidationError("Claim is already approved")

            if claim.is_claim_invalid:
                raise serializers.ValidationError(
                    "Claim is invalid and can't be approved be paid"
                )
            # check that other claims have not exceeded the policy payout limit
            # I dont love this logic, This needs to be a side effect of the claim getting paid out, not at the approval level
            if policy.lifetime_payout_limit:
                all_user_policy_claims = policy.claims.filter(claimant=claim.claimant)
                total_paid_out = sum(
                    c.amount for c in all_user_policy_claims if c.paid_on
                )
                if total_paid_out >= policy.lifetime_payout_limit:
                    # mark all other claims as invalid including this one
                    other_outstanding_claims = Claim.objects.filter(
                        paid_on=None,
                        policy=policy,
                        claimant=claim.claimant,
                    )
                    for c in other_outstanding_claims:
                        c.is_claim_invalid = True
                        c.save()
                    raise serializers.ValidationError("Claim payout limit exceeded")

        return super().validate(attrs)

    class Meta:
        model = ClaimApproval
        fields = "__all__"


class ClaimSerializer(serializers.ModelSerializer):
    claimant = serializers.PrimaryKeyRelatedField(
        read_only=True
    )  # serializers.hiddenfield doesnt work because it doesnt return the representation to the client
    approvals = ClaimApprovalSerializer(many=True, read_only=True)

    def validate(self, attrs):

        # check against policy payout limits
        if policy := attrs.get("policy"):
            if policy.claim_payout_limit:
                if policy.claim_payout_limit < attrs.get("amount"):
                    raise serializers.ValidationError(
                        {"amount": "Claim amount exceeds policy payout limit."}
                    )
            if policy.lifetime_payout_limit:
                claims_for_user = Claim.objects.filter(
                    claimant=self.context["request"].user, policy=policy
                ).prefetch_related("approvals")

                approved_claims = []
                for claim in claims_for_user:
                    if claim.is_approved():
                        approved_claims.append(claim)
                total_paid_out_to_user = sum(
                    [claim.amount for claim in approved_claims]
                )
                if policy.lifetime_payout_limit <= total_paid_out_to_user:
                    raise serializers.ValidationError(
                        {"amount": "Claim amount exceeds policy lifetime payout limit."}
                    )
                if policy.lifetime_payout_limit < total_paid_out_to_user + attrs.get(
                    "amount"
                ):
                    attrs["amount"] = (
                        policy.lifetime_payout_limit - total_paid_out_to_user
                    )

            # check if a user is current on their premiums
            premiums = Premium.objects.filter(
                policy=policy,
                payer=self.context["request"].user,
                due_date__lte=timezone.now(),
            )
            missed_premiums = [x for x in premiums if not x.paid]
            if len(missed_premiums):
                raise serializers.ValidationError(
                    {
                        "premiums": {
                            "message": f"Missed payment on {len(missed_premiums)} premiums",
                            "missed_premiums": missed_premiums,
                        }
                    }
                )

        return attrs

    def create(self, validated_data):
        policy = validated_data.get("policy")
        request = self.context["request"]
        if request.user in policy.pod.members.all():
            claim, _ = Claim.objects.get_or_create(
                **validated_data, claimant=request.user
            )
            return claim
        else:
            raise serializers.ValidationError(
                {"claimant": "User is not a memeber of the policy's pod."}
            )

    class Meta:
        model = Claim
        fields = "__all__"
        read_only_fields = ["paid_on"]


class PremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Premium
        fields = [
            "id",
            "policy",
            "amount",
            "payer",
            "paid",
            "due_date",
            "paid_date",
            "created_at",
            "updated_at",
        ]

        class Meta:
            ordering = ["-due_date"]


class PolicyCloseoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyCloseout
        fields = ["id", "reason", "premiums_returned_amount"]


class PerilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Peril
        fields = "__all__"


class PolicySerializer(serializers.ModelSerializer):
    # Meant to be used for posting/patching
    pod = serializers.PrimaryKeyRelatedField(queryset=Pod.objects.all(), required=False)
    available_underlying_insured_types = MultipleChoiceField(
        choices=UNDERLYING_INSURED_TYPE
    )

    # coverage start date should be immutable
    def validate_coverage_start_date(self, value):
        if (
            self.instance
            and self.instance.coverage_start_date
            and value != self.instance.coverage_start_date
            and self.instance.coverage_start_date <= timezone.now()
        ):
            raise serializers.ValidationError(
                "Cannot change coverage start date once a policy has been started."
            )
        return value

    def update(self, instance, validated_data):
        # if the policy start date gets changed, we need to update the premium due dates
        coverage_start_date_before_update = instance.coverage_start_date
        policy = super().update(instance, validated_data)
        if (
            coverage_start_date_before_update
            and validated_data.get("coverage_start_date")
            and validated_data.get("coverage_start_date")
            != coverage_start_date_before_update
        ):
            policy.premiums.all().delete()
            schedule_premiums(policy)

        return policy

    class Meta:
        model = Policy
        fields = "__all__"


class FullPolicySerializer(serializers.ModelSerializer):
    # meant for get, has a few nested joins
    pod = PodSerializer(read_only=True)
    premiums = PremiumSerializer(many=True, read_only=True)
    claims = ClaimSerializer(many=True, read_only=True)
    close_out = PolicyCloseoutSerializer(many=False, read_only=True)
    available_underlying_insured_types = MultipleChoiceField(
        choices=UNDERLYING_INSURED_TYPE
    )
    perils = PerilSerializer(many=True, read_only=True)

    class Meta:
        model = Policy
        fields = "__all__"


class RiskSerializer(serializers.ModelSerializer):
    content_object = RiskContentObjectRelatedField(read_only=True)

    def create(self, validated_data):
        try:
            risk = Risk.objects.get(
                policy=validated_data.get("policy"), user=validated_data.get("user")
            )  # cant use get_or_create due to other data that comes in validated data
        except Risk.DoesNotExist:
            print("creating risk for user", validated_data.get("user"))
            risk = Risk.objects.create(**validated_data)
        except Risk.MultipleObjectsReturned:
            # this should never happen
            risks = Risk.objects.filter(
                policy=validated_data.get("policy"), user=validated_data.get("user")
            ).order_by("-created_at")
            risk = risks[0]
            for r in risks[1:]:
                r.delete()
        return risk

    class Meta:
        model = Risk
        read_only_fields = (
            "id",
            "policy",
            "user",
            "content_object",
            "premium_amount",
            "risk_score",
        )
        fields = "__all__"
