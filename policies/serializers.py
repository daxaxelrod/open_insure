from rest_framework import serializers

from policies.models import Claim, Policy


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = [
            "name",
            "description",
            "pod",
            "coverage_type",
            "policy_type",
            "governance_type",
            "max_pool_size",
            "claim_payout_limit",
            "estimated_risk",
            "created_at",
            "updated_at",
        ]


class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = ["id", "policy", "claiment", "created_at", "updated_at"]
