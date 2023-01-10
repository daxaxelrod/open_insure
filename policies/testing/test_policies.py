import logging
from unittest.mock import patch
from django.core import mail
from django.contrib.auth.models import User
from django.test import TestCase, Client
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
        self.main_user = User.objects.create_user(
            "main@gmail.com", password="password", email="main@gmail.com"
        )
        self.member_user = User.objects.create_user(
            "member@gmail.com", password="password", email="member@gmail.com"
        )
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)

        client.login(username=self.main_user.username, password="password")

    def test_premiums_get_updated_when_the_policy_start_date_changes(self):
        # premiums are created when risk gets created.
        # if coverage_start_date gets populated or changes, premiums should update to match the new start date
        now = timezone.now()
        thirty_days_from_now = now + timezone.timedelta(days=30)
        start_date, policy = create_test_policy(self.pod, thirty_days_from_now)

        delayed_start_date = now + timezone.timedelta(days=90)

        # someone says, "hey actually lets start about 60 days later"
        payload = {"coverage_start_date": delayed_start_date}
        response = client.patch(
            f"/api/v1/policies/{policy.id}/",
            data=payload,
            content_type="application/json",
        )

        policy.refresh_from_db()

        self.assertEquals(response.status_code, HTTP_200_OK)
        self.assertEquals(
            policy.coverage_start_date.timetuple(), delayed_start_date.timetuple()
        )

        for user in policy.pod.members.all():
            # this might become tricky if the user prepaid some of their premiums, shouldnt generally be allowed though. Can be handled in the admin and give the user a refund/credit for months already paid
            user_premiums = Premium.objects.filter(policy=policy, payer=user).order_by(
                "due_date"
            )
            expected_premium_count = (
                policy.coverage_duration / policy.premium_payment_frequency
            )
            self.assertEquals(
                expected_premium_count,
                policy.coverage_duration / policy.premium_payment_frequency,
            )
            for index, premium in enumerate(user_premiums):
                next_due_date = delayed_start_date + relativedelta(
                    months=policy.premium_payment_frequency * index
                )
                self.assertEquals(premium.due_date, next_due_date.date())
                # should be ordered already, assert that all the due dates are delayed_start_date + n

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
        self.assertEquals(len(mail.outbox), 0)  # make sure no emails have been sent yet

        _, policy = create_test_policy(
            self.pod, timezone.now() + timezone.timedelta(days=30)
        )
        new_user = User.objects.create_user(
            "interested_user@gmail.com",
            password="password",
            email="interested_user@gmail.com",
        )

        create_test_user_risk_for_policy(policy, new_user)

        client.login(username=new_user.username, password="password")
        response = client.post(
            f"/api/v1/policies/{policy.id}/join/",
            data={},
            content_type="application/json",
        )

        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(len(mail.outbox), 1)

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

    # semi temporary case, we will eventually want to allow users to vote on who the agent will be
    def test_policy_creator_gets_marked_as_escrow_agent(self):
        payload = {
            "name":"$10 Small electronics policy",
            "description":"No pool cap, $500 claim payout limit",
            "coverage_type":"m_property",
            "premium_pool_type":"perpetual_pool",
            "governance_type":"direct_democracy",
            "available_underlying_insured_types": ["cell_phone"],
            "premium_payment_frequency":1,  # 1 means monthly
            "coverage_duration":12,  # months
            "coverage_start_date":timezone.now() + timezone.timedelta(days=30),
        }

        response = client.post(
            f"/api/v1/policies/",
            data=payload,
            content_type="application/json",
        )
        
        _json = response.json()

        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(_json["escrow_manager"], self.main_user.id)

    def test_policy_renewal_initiation(self):
        # creates a renewal object
        # creates an election for the renewal
        # sends out emails to members about the vote

        # make sure the election is created
        # make sure the policy end date gets pushed back
        self.assertTrue(False)

    def test_on_policy_renewal_acceptance_premiums_get_created(self):
        # creates premiums for the new policy
        self.assertTrue(False)

    def test_only_pod_members_can_initiate_a_renewal(self):
        self.assertTrue(False)



def setUpModule():
    logging.disable()


def tearDownModule():
    logging.disable(logging.NOTSET)
