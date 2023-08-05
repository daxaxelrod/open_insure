import math
from rest_framework.viewsets import ModelViewSet
from gatherer.models import PolicyLineProperty, PropertyLifeExpectancyGuess
from gatherer.serializers import (
    PolicyLinePropertySerializer,
    PropertyLifeExpectancyGuessSerializer,
)
from rest_framework.filters import SearchFilter
from django.utils import timezone
from rest_framework.permissions import AllowAny
from pods.utils.badges import award_badge


class PolicyLinePropertyViewSet(ModelViewSet):
    serializer_class = PolicyLinePropertySerializer

    queryset = PolicyLineProperty.objects.all()

    filter_backends = [SearchFilter]
    search_fields = ["name", "description", "search_tags"]


class PropertyLifeExpectancyGuessViewSet(ModelViewSet):
    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return super().get_permissions()

    serializer_class = PropertyLifeExpectancyGuessSerializer
    queryset = PropertyLifeExpectancyGuess.objects.all()

    def perform_create(self, serializer):
        guess = serializer.save(user=self.request.user)

        # fill out extra fields on guess
        for loss in guess.losses.filter(loss_percent=None):
            # calculate loss percent in basis points
            loss.loss_percent = (loss.loss_amount / guess.purchase_price) * 10000
            loss.save()

        changed = False
        if guess.purchase_date and not guess.age_of_ownership:
            days_from_now = (timezone.now() - guess.purchase_date).days
            guess.age_of_ownership = days_from_now
            changed = True
        if not guess.yearly_loss_rate_bsp:
            losses_grouped_by_year_starting_from_purchase = {}
            years_between_purchase_and_now = math.ceil(guess.age_of_ownership / 365)

            # if the user has owned the property for something like 3 years
            # treat each year and the losses as a separate loss rate
            for year_num in range(0, years_between_purchase_and_now):
                losses_grouped_by_year_starting_from_purchase[year_num] = []
                start_of_year = guess.purchase_date + timezone.timedelta(
                    days=year_num * 365
                )
                end_of_year = start_of_year + timezone.timedelta(days=365)
                losses_grouped_by_year_starting_from_purchase[
                    year_num
                ] = guess.losses.filter(loss_date__range=(start_of_year, end_of_year))

            loss_rates_each_year = []
            for (
                year_num,
                losses,
            ) in losses_grouped_by_year_starting_from_purchase.items():
                total_loss = sum([loss.loss_amount for loss in losses])
                loss_rates_each_year.append(
                    math.ceil((total_loss / guess.purchase_price) * 10000)  # int needed
                )

            if len(loss_rates_each_year) > 0:
                guess.yearly_loss_rate_bsp = sum(loss_rates_each_year) / len(
                    loss_rates_each_year
                )
                changed = True

        if changed:
            guess.save()

        # award a badge if there is an attached user
        if self.request.user.is_authenticated:
            award_badge(self.request.user, "Actuarial Contributor")
