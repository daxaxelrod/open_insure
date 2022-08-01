from policies.models import Policy, Risk


def compute_risk_score(risk: Risk, policy: Policy):
    """
      A risk score is a number between 0 and 100 that represents the percent chance of a peril for a given user for the duration of the policy
      A premium is then simply the risk_score * loss amount / duration of policy
    """
    return 10
