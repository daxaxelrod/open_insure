from django.utils import timezone
from pods.models import Pod
from policies.models import Policy
from policies.premiums import schedule_premiums

def create_test_policy(pod: Pod):
    start_date = timezone.datetime(2022, 5, 29, tzinfo=timezone.utc)
    policy = Policy.objects.create(
        name="$10 Small electronics policy",
        description="No pool cap, $500 claim payout limit",
        pod=pod,
        coverage_type='m_property',
        premium_pool_type='perpetual_pool',
        governance_type='direct_democracy',
        premium_amount=1000, # 10 bucks
        premium_payment_frequency=1, # 1 means monthly
        coverage_duration=12, # months
        coverage_start_date=start_date
    )
    schedule_premiums(policy)
    
    return start_date, policy