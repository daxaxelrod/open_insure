from rest_framework.serializers import ModelSerializer, ValidationError
from policies.models import Policy
from policies.renewals.models import Renewal
from django.contrib.contenttypes.models import ContentType
from elections.models import Election, Vote
from django.utils import timezone
from dateutil.relativedelta import relativedelta


class RenewalSerializer(ModelSerializer):
    def validate(self, attrs):
        policy_id = self.context["view"].kwargs["policy_pk"]
        if policy := Policy.objects.get(id=policy_id):
            policy_end_date = policy.coverage_start_date + relativedelta(
                months=policy.coverage_duration
            )  # already accounts for the months_extension of prior renewals

            valid_renewal_date = policy_end_date - relativedelta(months=2)
            if timezone.now() < valid_renewal_date:
                raise ValidationError(
                    "Renewal must be within 2 months of policy end date. You can renew on "
                    + valid_renewal_date.strftime("%x")
                )
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        renewal = super().create(dict(**validated_data, initiator=request.user))
        policy: Policy = renewal.policy

        policy.coverage_duration += renewal.months_extension
        policy.save()

        # create an election
        pod = policy.pod
        pod_members = policy.pod.members.all()
        election = Election.objects.create(
            name=f"{renewal.policy.id} Renewal",
            pod=pod,
            start_date=timezone.now(),
            content_type=ContentType.objects.get_for_model(Renewal),
            object_id=renewal.id,
        )

        # add all members to the election
        for member in pod_members:
            Vote.objects.create(election=election, voter=member)

        renewal.election = election
        renewal.save()

        return renewal

    class Meta:
        model = Renewal
        fields = "__all__"
        read_only_fields = ("initiator", "election")
        extra_kwargs = {"policy": {"required": False}}  # passed from url
