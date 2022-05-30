import logging
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase, override_settings, Client
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED

from pods.models import Pod, User
from policies.models import Policy, Premium

# initialize the APIClient app
client = Client()
class PolicyTestCase(TestCase):

    def setUp(self):
        self.main_user = User.objects.create_user("main@gmail.com", password="password")
        self.member_user = User.objects.create_user("member@gmail.com", password="password")
        self.pod = Pod.objects.create(name="Test Pod", creator=self.main_user)
        self.pod.members.add(self.member_user)
        
        client.login(username=self.main_user.username, password="password")
        
    def create_test_policy(self):
        start_date = timezone.datetime(2022, 5, 29, tzinfo=timezone.utc)
        policy = Policy.objects.create(
            name="$10 Small electronics policy",
            description="No pool cap, $500 claim payout limit",
            pod=self.pod,
            coverage_type='m_property',
            premium_pool_type='perpetual_pool',
            governance_type='direct_democracy',
            premium_amount=1000, # 10 bucks
            premium_payment_frequency=1, # 1 means monthly
            coverage_duration=12, # months
            coverage_start_date=start_date
        )
        
        return start_date,policy

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
        
        start_date, policy = self.create_test_policy()

        payload = {
            "coverage_start_date": timezone.datetime(2022, 1, 1)
        }
        
        response = client.patch(f"/api/v1/policies/{policy.id}/", data=payload, content_type='application/json')

        policy.refresh_from_db()

        self.assertEquals(response.status_code, HTTP_400_BAD_REQUEST)
        self.assertEquals(policy.coverage_start_date, start_date)

    def test_user_joins_a_policy_after_it_is_activated_that_premiums_get_created_for_new_member(self):
        self.create_test_policy()
        self.assertTrue(False)


def setUpModule():
    logging.disable()

def tearDownModule():
    logging.disable(logging.NOTSET)
