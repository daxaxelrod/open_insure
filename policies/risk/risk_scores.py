from email import policy
from math import sqrt
from policies.models import Policy, Risk
from .models import GenericProperty

def get_base_peril_likelihood(property_type):
    if property_type == "cell_phone":
        return 15
    elif property_type == "audio_equipment":
        return 20

def compute_risk_score(risk: Risk):
    """
      A risk score is a number between 0 and 100 that represents the percent chance of a peril for a given user for the duration of the policy
    """
    # many ideas here, lets start with a simple one
    # base_peril_likelihood = ActuarialTable
    base_peril_likelihood = get_base_peril_likelihood(risk.underlying_insured_type) # percent
    policy: Policy = risk.policy
    conservative_factor = policy.risk_settings.conservative_factor # percent
    risk_score = sqrt(base_peril_likelihood * conservative_factor)
    return risk_score

def compute_premium_amount(risk: Risk):
    """
    Returns the total premium needed to cover the risk for the duration of the policy. 
    Aka not divided by the duration of the policy

    # Idea 1
    A premium is then simply the risk_score * loss amount / duration of policy

    # Idea 2
    A policy is similar to a put option.
    Use the Black Scholes model to compute the premium amount
    p(0) = c(0) + e
           −rT K − S(0) = e
           −rT K(1 − N(d2)) − S(0)(1 − N(d1))

    https://www.macroption.com/black-scholes-formula/

    """
    property_details: GenericProperty = risk.content_object

    # TODO
    policy: Policy = risk.policy
    return (risk.risk_score * property_details.market_value) / policy.coverage_duration