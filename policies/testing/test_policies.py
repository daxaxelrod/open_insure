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
from policies.testing.helpers import create_test_policy

# initialize the APIClient app
client = Client()
class PolicyTestCase(TestCase):

    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user("member@gmail.com", password="password")
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)
        
        client.login(username=self.main_user.username, password="password")
        
    

    ### Start Tests ###
    def test_premiums_get_created_correctly_when_policy_gets_turned_on(self):
        
        # premiums are created when coverage_start_date gets populated, either on creation or update
        now = timezone.datetime(2022, 5, 29)
        payload = {
            "name": "$10 Small electronics policy",
            "description": "No pool cap, $500 claim payout limit",
            "pod": self.pod.id,
            "coverage_type": 'm_property',
            "premium_pool_type": 'perpetual_pool',
            "governance_type": 'direct_democracy',
            "premium_amount": 1000, # 10 bucks
            "premium_payment_frequency": 1, # 1 means monthly
            "coverage_duration": 12, # months
            "coverage_start_date": now
        }

        response = client.post("/api/v1/policies/", payload)
        _json = response.json()

        # 2 members in the pod, each should have 12 premiums scheduled, one for each month
        premiums = Premium.objects.filter(policy=_json['id']).order_by('due_date')
        users = {x.payer for x in premiums}
        premiums_for_member = [x for x in premiums if x.payer == self.member_user]


        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(_json["name"], "$10 Small electronics policy")
        self.assertEquals(premiums.count(), 24)
        self.assertEquals(len(users), 2)

        # check that the premiums are scheduled correctly
        # first payment should be due on may 29th, 2022 (start of policy)
        # second due on june 29th, 2022 etc.
        for index, premium in enumerate(premiums_for_member):
            relative_date = (now + relativedelta(months=index)).date()
            self.assertEquals(premium.due_date, relative_date)
        
    @override_settings(DEBUG=True)
    def test_coverage_start_date_cant_change_after_being_set(self):
        
        start_date, policy = create_test_policy(self.pod)

        payload = {
            "coverage_start_date": timezone.datetime(2022, 1, 1)
        }
        
        response = client.patch(f"/api/v1/policies/{policy.id}/", data=payload, content_type='application/json')

        policy.refresh_from_db()

        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEquals(policy.coverage_start_date, start_date)

    def test_user_joins_a_policy_after_it_is_activated_that_premiums_get_created_for_new_member(self):
        _, policy = create_test_policy(self.pod)
        new_user = User.objects.create_user("interested_user@gmail.com", password="password")
        client.login(username=new_user.username, password="password")
        response = client.post(f"/api/v1/policies/{policy.id}/join/", data={}, content_type='application/json')

        self.assertEquals(response.status_code, HTTP_201_CREATED)
        self.assertEquals(policy.pod.members.count(), 3)
        self.assertEquals(policy.premiums.count(), 36)
    
    @patch('django.utils.timezone.now')
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
        member_user_premiums = Premium.objects.filter(payer=self.member_user, policy=policy)

        self.assertEquals(response.status_code, HTTP_200_OK)
        self.assertEquals(policy.pod.members.count(), 1)
        self.assertEquals(policy.premiums.count(), 13)
        self.assertEquals(member_user_premiums.count(), 1)
        self.assertEquals(member_user_premiums[0].paid, False)


    @patch('django.utils.timezone.now')
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
        member_user_premiums = Premium.objects.filter(payer=self.member_user, policy=policy).order_by('due_date')
        

        self.assertEquals(response.status_code, HTTP_200_OK)
        self.assertEquals(policy.pod.members.count(), 1)
        self.assertEquals(member_user_premiums.count(), 3)
    
    def test_policy_cannot_start_unless_premiums_have_been_set_for_each_member(self):
        # make sure we cant set a policy_start_date
        self.assertTrue(False)


def setUpModule():
    logging.disable()

def tearDownModule():
    logging.disable(logging.NOTSET)
