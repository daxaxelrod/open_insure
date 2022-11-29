from rest_framework import serializers
from django.utils import timezone
from policies.models import Claim, ClaimApproval, ClaimEvidence, Premium, ClaimComment
from policies.claims.models import ClaimView
from policies.model_choices import CLAIM_EVIDENCE_TYPE_CHOICES
from django.db.utils import IntegrityError

class FullClaimApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimApproval
        fields = "__all__"


class ClaimApprovalSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        if self.instance:
            claim = self.instance.claim
            policy = self.instance.claim.policy

            # if claim.is_approved():
            #     raise serializers.ValidationError("Claim is already approved")

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

class ClaimEvidenceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=True)
    evidence_type = serializers.ChoiceField(choices=CLAIM_EVIDENCE_TYPE_CHOICES)
    photo_order = serializers.IntegerField(required=False)
    class Meta:
        model = ClaimEvidence
        fields = ["id", "evidence_type", 'image', 'photo_order']

class ClaimSerializer(serializers.ModelSerializer):
    claimant = serializers.PrimaryKeyRelatedField(
        read_only=True
    )  # serializers.hiddenfield doesnt work because it doesnt return the representation to the client
    approvals = ClaimApprovalSerializer(many=True, read_only=True)
    evidence = serializers.PrimaryKeyRelatedField(many=True, queryset=ClaimEvidence.objects.all())

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
            missed_premiums = [x.short_description() for x in premiums if not x.paid]
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
            # No one can create a policy on a user's behalf, they must do it themselves
            try:
                return super().create(dict(**validated_data, claimant=request.user))
            except IntegrityError as e:
                raise serializers.ValidationError(
                    {"message": "Cannot create identical claims."}
                )
        else:
            raise serializers.ValidationError(
                {"claimant": "User is not a member of the policy's pod."}
            )

    class Meta:
        model = Claim
        fields = "__all__"
        read_only_fields = ["paid_on"]

class FullClaimSerializer(ClaimSerializer):
    evidence = ClaimEvidenceSerializer(many=True, read_only=True)


class ClaimViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimView
        fields = "__all__"

class ClaimCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimComment
        fields = "__all__"
        read_only_fields = ["commenter"]