from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase, override_settings, Client
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from pods.models import Pod, User

# initialize the APIClient app
client = Client()

class PolicyTestCase(TestCase):

    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com")
        self.member_user = User.objects.create_user("member@gmail.com")
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)

    @override_settings(DEBUG=True)
    def test_store_creation_auto_populates_token_user(self):
        response = client.post("http://testserver/api/v1/stores/", {
            "name": store_name,
            "theme_color": "#ffffff",
            "tagline": "The best store you ever did see",
            "channel_set": [self.test_channel.pk]

        }, headers={
            "Authorization": "Token " + self.producer.auth_token.key
        })

        json = response.json()
        self.assertEquals(response.status_code, 201)
        self.assertEquals(json["name"], store_name)
        self.assertEquals(json["owner"], self.producer_profile.pk)