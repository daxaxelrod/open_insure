from datetime import datetime
from typing import Tuple
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from pods.models import Pod, User
from policies.model_choices import UNDERLYING_INSURED_TYPE
from policies.models import Claim, ClaimApproval, Policy, Risk
from policies.premiums import schedule_premiums
from policies.risk.models import AudioEquipmentRisk, PhoneRisk


def create_test_user_risk_for_policy(
    policy: Policy, user: User, risk_type="cell_phone"
):
    create_kwargs = {
        "make": "Apple",
        "model": "Iphone 13",
        "condition": "new",
        "market_value": "800",
    }
    if risk_type == "cell_phone":
        content_klass = PhoneRisk
    elif risk_type == "audio_equipment":
        content_klass = AudioEquipmentRisk
        create_kwargs["model"] = "Air Pod Max"
    content_object = content_klass.objects.create(**create_kwargs)

    return Risk.objects.create(
        policy=policy,
        user=user,
        risk_score=50,
        value_at_risk=8000,
        premium_amount=590,
        underlying_insured_type=risk_type,
        content_type=ContentType.objects.get_for_model(content_klass),
        object_id=content_object.id,
    )


def create_paid_claim_for_user(user, policy, amount):
    claim = Claim.objects.create(
        policy=policy,
        claimant=user,
        amount=amount,
    )

    other_pod_members = policy.pod.members.exclude(id=user.id)
    for member in other_pod_members:
        ClaimApproval.objects.create(claim=claim, approver=member, approved=True)

    claim.approved_on = timezone.now()
    claim.paid_on = timezone.now()
    claim.save()
    return claim


def prepay_all_premiums_for_user(user, policy):
    for premium in policy.premiums.filter(payer=user):
        premium.paid = True
        premium.save()


def create_test_risks_for_policy_members(policy: Policy):
    for user in policy.pod.members.all():
        existing_risk: Risk = user.risks.filter(policy=policy)
        if existing_risk.count() > 0:
            continue
        else:
            create_test_user_risk_for_policy(policy, user)


def create_test_policy(
    pod: Pod,
    start_date: datetime = timezone.datetime(2022, 5, 29, tzinfo=timezone.utc),
) -> Tuple[datetime, Policy]:
    policy = Policy.objects.create(
        name="$10 Small electronics policy",
        description="No pool cap, $500 claim payout limit",
        pod=pod,
        coverage_type="m_property",
        premium_pool_type="perpetual_pool",
        governance_type="direct_democracy",
        available_underlying_insured_types=[UNDERLYING_INSURED_TYPE[0][0]],
        premium_payment_frequency=1,  # 1 means monthly
        coverage_duration=12,  # months
        coverage_start_date=start_date,
        escrow_manager=pod.creator,
        is_public=True,
    )
    create_test_risks_for_policy_members(policy)
    schedule_premiums(policy)

    return start_date, policy
