from rest_framework.viewsets import ModelViewSet

from elections.models import Vote, Election
from elections.serializers import VoteSerializer, ElectionSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
class VoteModelViewSet(ModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Vote.objects.filter(voter=user)

    def perform_update(self, serializer):
        vote = serializer.save()
        election = vote.election
        import pdb; pdb.set_trace()
        # determine what side effects to run based on election type
        if election.content_type.model == "renewal":
          # if the vote is an approval, extend the user's premiums
          # if the vote is a rejection, send an email to the escrow agent to refund the user
          
          vote.election.content_object.check_votes()

class ElectionModelViewSet(ModelViewSet):
    serializer_class = ElectionSerializer
    queryset = Election.objects.all()
    permission_classes = [IsAuthenticated]

    # def allowed_methods(self):
    #     return ["GET", "OPTIONS"]

    

      