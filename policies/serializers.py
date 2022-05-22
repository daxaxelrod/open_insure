from dataclasses import fields
from rest_framework import serializers

from policies.models import Claim, Policy, Premium, PolicyCloseout, Claim, ClaimApproval

policy_fields = [ "name", "description", "pod", "coverage_type", "policy_type", "governance_type", "max_pool_size", "claim_payout_limit", "estimated_risk", "created_at", "updated_at" ]

class ClaimApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimApproval
        fields = ["id", "approver", "created_at", "updated_at"]

class ClaimSerializer(serializers.ModelSerializer):
    approval_statuses = ClaimApprovalSerializer(many=True, read_only=True)

    def create(self, validated_data):
        if policy := validated_data.get("policy"):
            request = self.context['request']
            if request.user in policy.pod.memebers.all():
                claim = Claim.objects.create(**validated_data)
                return claim
            else:
                serializers.ValidationError("User is not a memeber of the policy's pod.")
        else:
            raise serializers.ValidationError("Missing policy")


    class Meta:
        model = Claim
        fields = ["id", "policy", "claiment", "created_at", "updated_at", "approval_status"]

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
    class Meta:
        model = Policy
        fields = [*policy_fields]

class FullPolicySerializer(serializers.ModelSerializer):
    # meant for get, has a few nested joins
    premiums = PremiumSerializer(many=True)
    claims = ClaimSerializer(many=True)
    closeout = PolicyCloseoutSerializer()
    class Meta:
        model = Policy
        fields = [*policy_fields, 'premiums', 'claims', 'closeout']
