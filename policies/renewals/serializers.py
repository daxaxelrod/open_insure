from rest_framework.serializers import ModelSerializer
from policies.renewals.models import Renewal
from django.contrib.contenttypes.models import ContentType
from elections.models import Election, Vote
from django.utils import timezone

class RenewalSerializer(ModelSerializer):

    def create(self, validated_data):
        renewal = super().create(validated_data)

        # create an election
        policy = renewal.policy.prefetch_related("pod__members")
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

        
    

    class Meta:
        model = Renewal
        fields = "__all__"
        