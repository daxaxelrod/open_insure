from django.contrib.auth.models import User
from django.test import TestCase, Client

from pods.models import Pod, User
from policies.testing.helpers import create_test_policy

# initialize the APIClient app
client = Client()
class PerilsTestCase(TestCase):

    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user("member@gmail.com", password="password")
        self.member_user_2 = User.objects.create_user("member_2@gmail.com", password="password")
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)
        self.pod.members.add(self.member_user_2)

        _, self.policy = create_test_policy(self.pod)
        client.login(username=self.main_user.username, password="password")

    # def test_perils_cant_be_changed_once_a_policy_has_started(self):
    #     self.assertTrue(False)