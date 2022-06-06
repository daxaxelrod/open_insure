from unicodedata import name
from venv import create
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase, override_settings, Client
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN, HTTP_201_CREATED

from pods.models import Pod, User

# initialize the APIClient app
client = Client()


class PodTestCase(TestCase):
    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com")
        self.member_user = User.objects.create_user("member@gmail.com")
        # self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        # self.pod.members.add(self.member_user)

    @override_settings(DEBUG=True)
    def test_pod_creator_gets_added_to_members(self):
        # should get added on create via signal

        payload = {"name": "Test Pod", "creator": self.main_user.id}

        response = client.post("/api/v1/pods/", payload)

        _json = response.json()
        created_pod = Pod.objects.get(id=_json["id"])

        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertIn(self.main_user, created_pod.members.all())

    def test_block_new_user_can_join_if_pod_is_full(self):
        self.pod = Pod.objects.create(
            name="Test Pod", creator=self.main_user, max_pod_size=2
        )
        self.pod.members.add(self.member_user)
        new_user = User.objects.create_user(usename="interested_user", password="password")
        client.login(username=new_user.username, password="password")


        response = client.post("/api/v1/pods/{self.pod.id}/join", {})

        self.assertEquals(response.status_code, HTTP_403_FORBIDDEN)
        self.assertEquals(self.pod.members.count(), 2)
        self.assertNotIn(new_user, self.pod.members.all())

    def test_pod_member_can_join_if_not_full(self):
        self.pod = Pod.objects.create(
            name="Test Pod", creator=self.main_user, max_pod_size=10
        )
        self.pod.members.add(self.member_user)
        new_user = User.objects.create_user(usename="interested_user", password="password")
        client.login(username=new_user.username, password="password")

        


    # And the award for the worst test name goes to...
    def test_should_block_new_member_if_policy_started_if_pod_blocks_that(self):
        self.assertTrue(False)


allow_joiners_after_policy_start
