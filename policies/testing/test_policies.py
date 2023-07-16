import logging
from unittest.mock import patch
from django.core import mail
from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_200_OK,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
)

from pods.models import Pod, User
from policies.models import Premium
from policies.renewals.models import Renewal
from policies.testing.helpers import (
    create_test_policy,
    create_test_user_risk_for_policy,
)
from elections.models import Election, Vote

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
        self.pod.members.add(self.main_user)
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
            "name": "$10 Small electronics policy",
            "description": "No pool cap, $500 claim payout limit",
            "coverage_type": "m_property",
            "premium_pool_type": "perpetual_pool",
            "governance_type": "direct_democracy",
            "available_underlying_insured_types": ["cell_phone"],
            "premium_payment_frequency": 1,  # 1 means monthly
            "coverage_duration": 12,  # months
            "coverage_start_date": timezone.now() + timezone.timedelta(days=30),
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

        _, policy = create_test_policy(
            self.pod, timezone.now() - relativedelta(months=12)
        )

        response = client.post(
            f"/api/v1/policies/{policy.id}/renewals/",
            data={
                "months_extension": 1,
            },
            content_type="application/json",
        )

        policy.refresh_from_db()
        response_json = response.json()
        election = Election.objects.get(id=response_json["election"])
        votes = Vote.objects.filter(election=election)

        # make sure the election is created
        # make sure the policy end date gets pushed back
        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(
            response_json["election"], 1
        )  # should be first election created
        self.assertEquals(votes.count(), policy.pod.members.count())
        self.assertEquals(policy.coverage_duration, 13)

    def test_on_policy_renewal_acceptance_premiums_get_created(self):
        # renewal and attached election are created
        # as each member accepts, their extended premiums get created
        _, policy = create_test_policy(
            self.pod, timezone.now() - relativedelta(months=12)
        )

        inital_premiums = policy.premiums.count()
        self.assertEquals(
            inital_premiums,
            policy.pod.members.count() * policy.coverage_duration,
        )

        num_months_extension = 3

        response = client.post(
            f"/api/v1/policies/{policy.id}/renewals/",
            data={
                "months_extension": num_months_extension,
            },
            content_type="application/json",
        )

        _json = response.json()
        election = Election.objects.get(id=_json["election"])
        vote = Vote.objects.get(election=election, voter=self.main_user)
        policy.refresh_from_db()

        # voter accepts the renewal
        vote_response = client.patch(
            f"/api/v1/elections/{election.id}/votes/{vote.id}/",
            data={"affirmed": True},
            content_type="application/json",
        )
        premiums = Premium.objects.filter(policy=policy, payer=self.main_user).order_by(
            "due_date"
        )

        self.assertEquals(vote_response.status_code, HTTP_200_OK)
        self.assertEquals(
            policy.premiums.count(), inital_premiums + num_months_extension
        )

        # check that the premiums are created for the correct months
        for x in range(policy.coverage_duration):
            self.assertEquals(
                premiums[x].due_date,
                (policy.coverage_start_date + relativedelta(months=x)).date(),
            )

    def test_only_pod_members_can_initiate_a_renewal(self):
        imposter = User.objects.create_user(
            "imposter@gmail.com", password="password", email="imposter@gmail.com"
        )

        _, policy = create_test_policy(self.pod)
        policy.coverage_duration = 6
        policy.save()

        client.login(username=imposter.username, password="password")
        response = client.post(
            f"/api/v1/policies/{policy.id}/renewals/",
            data={
                "months_extension": 1,
            },
            content_type="application/json",
        )
        self.assertEquals(response.status_code, HTTP_403_FORBIDDEN)
        self.assertEquals(Renewal.objects.count(), 0)

    def test_only_pod_members_can_accept_a_renewal(self):
        _, policy = create_test_policy(self.pod)
        policy.coverage_duration = 6
        policy.save()

        response = client.post(
            f"/api/v1/policies/{policy.id}/renewals/",
            data={
                "months_extension": 1,
            },
            content_type="application/json",
        )

        _json = response.json()
        election = Election.objects.get(id=_json["election"])
        vote = Vote.objects.get(election=election, voter=self.main_user)

        imposter = User.objects.create_user(
            "imposter@gmail.com", password="password", email="imposter@gmail.com"
        )
        client.login(username=imposter.username, password="password")

        imposter_vote_response = client.patch(
            f"/api/v1/elections/{election.id}/votes/{vote.id}/",
            data={"affirmed": True},
            content_type="application/json",
        )

        vote.refresh_from_db()

        self.assertEquals(imposter_vote_response.status_code, HTTP_404_NOT_FOUND)
        self.assertEquals(vote.affirmed, None)

    @patch("django.utils.timezone.now")
    def test_can_only_create_renewal_if_policy_is_about_to_expire(self, mock_timezone):
        start_date = timezone.datetime(2022, 1, 1, tzinfo=timezone.utc)
        mock_timezone.return_value = start_date

        _, policy = create_test_policy(self.pod, start_date)

        # attempt to create renewal, shouldnt be allowed

        response = client.post(
            f"/api/v1/policies/{policy.id}/renewals/",
            data={
                "months_extension": 6,
            },
            content_type="application/json",
        )
        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEquals(Renewal.objects.count(), 0)

        # move time forward to 2 months before policy expires
        future_now = timezone.datetime(2022, 11, 2, tzinfo=timezone.utc)
        mock_timezone.return_value = future_now

        # renewal should be allowed now
        response = client.post(
            f"/api/v1/policies/{policy.id}/renewals/",
            data={
                "months_extension": 6,
            },
            content_type="application/json",
        )

        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(Renewal.objects.count(), 1)

    # not gonna need this, each renewal will be a new election
    # def test_policy_renewal_rerequest_updates_existing(self):
    #     # makes sure we dont duplicate elections
    #     _, policy = create_test_policy(self.pod)

    #     response = client.post(
    #         f"/api/v1/policies/{policy.id}/renewals/",
    #         data={
    #             "months_extension": 1,
    #         },
    #         content_type="application/json",
    #     )

    #     _json = response.json()
    #     initial_election = Election.objects.get(id=_json["election"])

    #     second_response = client.post(
    #         f"/api/v1/policies/{policy.id}/renewals/",
    #         data={
    #             "months_extension": 3,
    #         },
    #         content_type="application/json",
    #     )

    #     self.assertTrue(False)


def setUpModule():
    logging.disable()


def tearDownModule():
    logging.disable(logging.NOTSET)
