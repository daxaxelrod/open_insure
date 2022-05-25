from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase, override_settings, Client
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from pods.models import Pod, User

# initialize the APIClient app
client = Client()

class PodTestCase(TestCase):

    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com")
        self.member_user = User.objects.create_user("member@gmail.com")
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)

    @override_settings(DEBUG=True)
    def test_pod_creator_gets_added_to_members(self):
        # should get added on create via signal
        self.assertIn(self.main_user, self.pod.members.all())