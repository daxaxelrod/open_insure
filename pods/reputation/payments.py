from pods.models import User
from django.utils import timezone
from policies.models import Premium

#

def get_reputation_from_payments(user: User):
    all_payments: list[Premium] = user.premiums_paid.filter(
        due_date__lte=timezone.now()
    )

    if len(all_payments) == 0:
        return 100

    on_time_payments = 0
    late_payments = 0
    for payment in all_payments:
        if payment.paid_on_time():
            on_time_payments += 1
        else:
            late_payments += 1

    # the more late payments, the harsher the penalty
    fraction = late_payments / len(all_payments)
    return 100 - fraction * 100
            