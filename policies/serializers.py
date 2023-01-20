from email import policy
import logging
from django.db import IntegrityError
from django.utils import timezone
from rest_framework import serializers
from rest_framework.fields import MultipleChoiceField
from pods.serializers import PodSerializer
from pods.models import Pod
from policies.claims.serializers import FullClaimSerializer
from policies.model_choices import UNDERLYING_INSURED_TYPE

from policies.models import (
    Policy,
    PolicyRiskSettings,
    Premium,
    PolicyCloseout,
    Risk,
)
from policies.perils.models import Peril
from policies.premiums import schedule_premiums

from policies.risk.serializer_fields import RiskContentObjectRelatedField

logger = logging.getLogger(__name__)

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
            "marked_paid_by",
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


# Todo - Fully lock down patching of policy based on policy state
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
    claims = FullClaimSerializer(many=True, read_only=True)
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
            logger.info("creating risk for user", validated_data.get("user"))
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


class PolicyRiskSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyRiskSettings
        fields = "__all__"
        read_only_fields = ("id", "policy", "created_at")
