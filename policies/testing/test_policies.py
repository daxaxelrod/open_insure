import logging
from unittest.mock import patch
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase, override_settings, Client
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_200_OK

from pods.models import Pod, User
from policies.models import Premium
from policies.testing.helpers import (
    create_test_policy,
    create_test_user_risk_for_policy,
)

# initialize the APIClient app
client = Client()


class PolicyTestCase(TestCase):
    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user(
            "member@gmail.com", password="password"
        )
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)

        client.login(username=self.main_user.username, password="password")

    def test_premiums_get_updated_when_the_policy_start_date_changes(self):
        # premiums are created when risk gets created.
        # if coverage_start_date gets populated or changes, premiums should update to match the new start date
        now = timezone.datetime(2022, 5, 29)
        create_test_policy()
        self.assertTrue(False)

    def test_coverage_start_date_cant_change_after_policy_starts(self):
        # we dont want the policy coverage to move underneith people once they commit.
        # a policy coverate date can change before the policy starts however, people might want to delay starting
        start_date = timezone.datetime(2022, 5, 29, tzinfo=timezone.utc)
        start_date, policy = create_test_policy(self.pod, start_date)

        payload = {
            "coverage_start_date": timezone.datetime(2022, 1, 1)
        }  # deeper in the past

        response = client.patch(
            f"/api/v1/policies/{policy.id}/",
            data=payload,
            content_type="application/json",
        )

        policy.refresh_from_db()

        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEquals(policy.coverage_start_date, start_date)

    def test_coverage_start_date_can_change_before_coverage_starts(self):
        start_date = timezone.now() + timezone.timedelta(days=90)
        start_date, policy = create_test_policy(self.pod, start_date)

        new_start_date = timezone.now() + timezone.timedelta(days=60)
        payload = {"coverage_start_date": new_start_date}  # closer to now by 30 days

        response = client.patch(
            f"/api/v1/policies/{policy.id}/",
            data=payload,
            content_type="application/json",
        )

        policy.refresh_from_db()

        self.assertEquals(response.status_code, HTTP_200_OK)
        self.assertEquals(
            policy.coverage_start_date.timetuple(), new_start_date.timetuple()
        )

    def test_that_premiums_get_created_for_new_user_when_user_joins_a_policy_after_it_is_has_started(
        self,
    ):
        _, policy = create_test_policy(self.pod)
        new_user = User.objects.create_user(
            "interested_user@gmail.com", password="password"
        )
        create_test_user_risk_for_policy(policy, new_user)

        client.login(username=new_user.username, password="password")
        response = client.post(
            f"/api/v1/policies/{policy.id}/join/",
            data={},
            content_type="application/json",
        )

        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(policy.pod.members.count(), 3)
        self.assertEquals(policy.premiums.count(), 36)

    def test_user_gets_confirmation_email_after_joining_policy(self):
        self.assertTrue(False)

    @patch("django.utils.timezone.now")
    def test_user_can_leave_a_policy_after_it_is_activated(self, mock_timezone):
        # and the premiums that are from now until the end of the policy get deleted
        # we should keep all the other premiums, even if they are unpaid
        start_date = timezone.datetime(2022, 1, 1, tzinfo=timezone.utc)
        mock_timezone.return_value = start_date

        _, policy = create_test_policy(self.pod, start_date)

        future_now = timezone.datetime(2022, 1, 2, tzinfo=timezone.utc)
        mock_timezone.return_value = future_now

        client.login(username=self.member_user.username, password="password")
        response = client.post(f"/api/v1/pods/{self.pod.id}/leave/")
        member_user_premiums = Premium.objects.filter(
            payer=self.member_user, policy=policy
        )

        self.assertEquals(response.status_code, HTTP_200_OK)
        self.assertEquals(policy.pod.members.count(), 1)
        self.assertEquals(policy.premiums.count(), 13)
        self.assertEquals(member_user_premiums.count(), 1)
        self.assertEquals(member_user_premiums[0].paid, False)

    @patch("django.utils.timezone.now")
    def test_user_leaving_policy_only_deletes_future_premiums(self, mock_timezone):

        # create a year long policy that starts on jan 1st.
        # patch timezone.now to sometime in march
        # ensure that 3/4th of premiums are deleted, the ones in the first quarter remain
        start_date = timezone.datetime(2022, 1, 1, tzinfo=timezone.utc)
        mock_timezone.return_value = start_date

        _, policy = create_test_policy(self.pod, start_date)

        # fast forward to march 1st, 2022
        future_now = timezone.datetime(2022, 3, 1, tzinfo=timezone.utc)
        mock_timezone.return_value = future_now

        client.login(username=self.member_user.username, password="password")
        response = client.post(f"/api/v1/pods/{self.pod.id}/leave/")
        member_user_premiums = Premium.objects.filter(
            payer=self.member_user, policy=policy
        ).order_by("due_date")

        self.assertEquals(response.status_code, HTTP_200_OK)
        self.assertEquals(policy.pod.members.count(), 1)
        self.assertEquals(member_user_premiums.count(), 3)


def setUpModule():
    logging.disable()


def tearDownModule():
    logging.disable(logging.NOTSET)
