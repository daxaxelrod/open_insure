from django.db import IntegrityError
from rest_framework import serializers

from policies.models import Claim, Policy, Premium, PolicyCloseout, Claim, ClaimApproval

policy_fields = ["id", "name", "description", "pod", "coverage_type", "premium_pool_type",
                 "governance_type", "max_pool_size", "claim_payout_limit", "estimated_risk",
                 "created_at", "updated_at", "coverage_start_date", "coverage_end_date" ]


class FullClaimApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimApproval
        fields = "__all__"
class ClaimApprovalSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        if self.instance:
            if self.instance.claim.is_approved():
                raise serializers.ValidationError("Claim is already approved")

        return super().validate(attrs)

    class Meta:
        model = ClaimApproval
        fields = "__all__"


class ClaimSerializer(serializers.ModelSerializer):
    claimant = serializers.PrimaryKeyRelatedField(read_only=True) # serializers.hiddenfield doesnt work because it doesnt return the representation to the client

    def validate(self, attrs):

        # check against policy payout limits
        if policy := attrs.get("policy"):
            if policy.claim_payout_limit:
                if policy.claim_payout_limit < attrs.get("amount"):
                    raise serializers.ValidationError({"amount": "Claim amount exceeds policy payout limit."})
            if policy.lifetime_payout_limit:
                total_paid_out_to_user = Claim.objects.filter(
                    claimant=self.context['request'].user, 
                    policy=policy
                ).select_related("approvals")

                if policy.lifetime_payout_limit < (attrs.get("amount") + policy.total_paid_out):
                    raise serializers.ValidationError({"amount": "Claim amount exceeds policy lifetime payout limit."})
        
    def create(self, validated_data):
        if policy := validated_data.get("policy"):
            request = self.context['request']
            if request.user in policy.pod.members.all():
                claim, _ = Claim.objects.get_or_create(**validated_data, claimant=request.user)
                return claim
            else:
                raise serializers.ValidationError({"claimant": "User is not a memeber of the policy's pod."})
        else:
            raise serializers.ValidationError({"policy": "Missing policy"})

    class Meta:
        model = Claim
        fields = "__all__"
        read_only_fields = ['paid_on']

class PremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Premium
        fields = ["id", "policy", "amount", "payer", "paid", "created_at", "updated_at"]

class PolicyCloseoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyCloseout
        fields = ["id", "reason", "premiums_returned_amount"]
class PolicySerializer(serializers.ModelSerializer):
    # Meant to be used for posting/patching

    # coverage start date should be immutable
    def validate_coverage_start_date(self, value):
        if self.instance and self.instance.coverage_start_date and value != self.instance.coverage_start_date:
            raise serializers.ValidationError("Cannot change coverage start date once a policy has been activated.")
        return value


    class Meta:
        model = Policy
        fields = "__all__"

class FullPolicySerializer(serializers.ModelSerializer):
    # meant for get, has a few nested joins
    premiums = PremiumSerializer(many=True, read_only=True)
    claims = ClaimSerializer(many=True, read_only=True)
    close_out = PolicyCloseoutSerializer(many=False, read_only=True)
    class Meta:
        model = Policy
        fields = "__all__"
