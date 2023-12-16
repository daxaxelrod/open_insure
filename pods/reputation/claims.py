import math
from pods.models import User


def get_reputation_from_claims(user: User()):

    claims = user.claims.all()
    if len(claims) == 0:
        return 100
    approved_claims = 0
    denied_claims = 0
    pending_claims = 0
    for claim in claims:
        if claim.is_approved():
            approved_claims += 1
        elif claim.is_denied():
            denied_claims += 1
        else:
            pending_claims += 1

    pending_penalty = 8 # 8 points per pending claim
    approved_penalty = 1
    denied_penalty = 20

    total_penalty = pending_penalty * pending_claims + approved_penalty * approved_claims + denied_penalty * denied_claims
    return max(100 - total_penalty, 0)
