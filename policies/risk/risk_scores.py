from email import policy
from math import sqrt
from pods.models import Pod, UserPod
from policies.models import Policy, Risk, PolicyRiskSettings
from policies.risk.discounts import get_audio_equipment_discount, get_phone_discount
from policies.risk.models import AudioEquipmentRisk, GenericProperty, PhoneRisk
from django.contrib.contenttypes.models import ContentType


# now this will get more complex
# not just going to be a simple loss estimate of the entire market value
# but also take into account partial losses such as a battery replacement or a screen repair
def get_base_peril_likelihood(property_type, risk_settings: PolicyRiskSettings):
    return getattr(risk_settings, f"{property_type}_peril_rate")


def get_blended_basis_point_discount(risk: Risk, risk_settings: PolicyRiskSettings):
    content_object = risk.content_object
    content_type = risk.content_type

    # this doesnt scale super well. kinda want a model function thats forcably defined on each Risk type to run this bespoke discount logic
    phone_content_type = ContentType.objects.get_for_model(PhoneRisk)
    audio_equipment_content_type = ContentType.objects.get_for_model(AudioEquipmentRisk)

    if content_type == phone_content_type:
        return get_phone_discount(content_object, risk_settings)
    if content_type == audio_equipment_content_type:
        return get_audio_equipment_discount(content_object, risk_settings)


def compute_risk_score(risk: Risk, risk_settings: PolicyRiskSettings):
    """
    A risk score is a number between 0 and 100 that represents the percent chance of a peril for a given user for the duration of the policy

    Many ideas here, but lets start simple

    Premium modifiers are stored in the PolicyRiskSettings model
    But hope to have more in depth actuarial sub models in the future
    and also hope that its pluggable so that people can create their own risk models
    """

    policy: Policy = risk.policy
    base_peril_likelihood = get_base_peril_likelihood(
        risk.underlying_insured_type, risk_settings
    )

    # apply discounts for various mitigating factors
    blended_basis_point_discount = get_blended_basis_point_discount(risk, risk_settings)
    blended_percent_discount = blended_basis_point_discount / 100
    base_peril_likelihood -= blended_percent_discount

    # the margin of safety that the policy wants to have
    conservative_factor = risk_settings.conservative_factor  # percent

    risk_score = (
        base_peril_likelihood
        * (policy.coverage_duration / 12)  # scale by the duration of the policy
        * (1 + (conservative_factor / 100))  # add a margin of safety
        * 100  # convert to basis points
    )

    # adjust if the specific user is riskier than normal
    try:
        if user_policy_membership_record := UserPod.objects.get(
            pod=policy.pod, user=risk.user
        ):
            risk_score += user_policy_membership_record.risk_penalty
    except (UserPod.DoesNotExist, Pod.DoesNotExist):
        user_policy_membership_record = None

    return risk_score


def compute_premium_amount(risk: Risk):
    """
    Returns the monthly premium needed to cover the risk for the duration of the policy.

    # Idea 1 (dead simple)
    A premium is then simply the risk_score * loss amount / duration of policy
     - maybe introduce the discount rate as models get more sophisticated

    # Idea 2
    A policy is similar to a put option.
    Use the Black Scholes model to compute the premium amount
    p(0) = c(0) + e
           -rT K - S(0) = e
           -rT K(1 - N(d2)) - S(0)(1 - N(d1))

    https://www.macroption.com/black-scholes-formula/

    """
    property_details: GenericProperty = risk.content_object

    expected_loss = risk.risk_score / 100 * property_details.market_value
    monthly_premium_amount = expected_loss / risk.policy.coverage_duration

    return monthly_premium_amount
