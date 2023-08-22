import operator
import typing
from functools import reduce

import scipy
from gatherer.models import PropertyLifeExpectancyGuess, PolicyLineProperty
import numpy as np
from django.conf import settings


def z_score_from_confidence(confidence):
    z_score = 0

    # Calculate the z-score for the desired confidence level.

    z_score = scipy.stats.norm.ppf(1 - (1 - confidence) / 2)

    return z_score


def calculate_summary_statistics(data):
    data_array = np.array(data)
    data_array = data_array[data_array != None]

    count = len(data_array)
    mean = np.mean(data_array)
    median = np.median(data_array)
    std_dev = np.std(data_array)
    variance = np.var(data_array)
    min_value = np.min(data_array)
    max_value = np.max(data_array)
    quantile_25 = np.percentile(data_array, 25)
    quantile_75 = np.percentile(data_array, 75)
    if std_dev == 0:
        z_scores = np.zeros(len(data_array))
    else:
        z_scores = (data_array - mean) / std_dev

    desired_confidence = settings.DESIRED_CONTRIBUTION_TO_PREMIUM_CONFIDENCE_LEVEL
    desired_z_score = z_score_from_confidence(desired_confidence)

    confidence_interval = (
        mean - desired_z_score * std_dev / np.sqrt(len(data_array)),
        mean + desired_z_score * std_dev / np.sqrt(len(data_array)),
    )

    summary = {
        "count": count,
        "mean": mean,
        "median": median,
        "standard_deviation": std_dev,
        "variance": variance,
        "minimum_value": min_value,
        "maximum_value": max_value,
        "25th_percentile": quantile_25,
        "75th_percentile": quantile_75,
        "z_scores": z_scores,
        "confidence_interval": confidence_interval,
    }

    return summary


def generate_summary_stats_for_policy_line(
    guesses: typing.List[PropertyLifeExpectancyGuess],
):
    count = guesses.count()
    asset_values = [guess.purchase_price for guess in guesses]
    loss_rates = [guess.yearly_loss_rate_bsp for guess in guesses]
    all_manufacturers = [
        guess.property_make for guess in guesses if guess.property_make
    ]
    unique_manufacturers, manufacturer_counts = np.unique(
        all_manufacturers, return_counts=True
    )

    all_ages = [guess.age_of_ownership for guess in guesses]

    total_asset_value = reduce(operator.add, asset_values, 0)

    loss_cost_by_loss_count_by_avg_age = []
    for guess in guesses:
        loss_count = guess.losses.count()
        purchase_date = guess.purchase_date

        loss_days = []
        total_loss_amount = 0

        for loss in guess.losses.all():
            loss_days.append((loss.loss_date - purchase_date).days)
            total_loss_amount += loss.loss_amount

        average_age_of_loss = np.mean(loss_days)
        if np.isnan(average_age_of_loss):
            average_age_of_loss = 0.0
        total_value_lost = total_loss_amount

        loss_cost_by_loss_count_by_avg_age.append(
            {
                "loss_count": loss_count,
                "average_age_of_loss": average_age_of_loss,
                "total_value_lost": total_value_lost,
            }
        )

    return {
        "count": count,
        "total_asset_value": total_asset_value,
        "asset_value_summary": calculate_summary_statistics(asset_values),
        "loss_rate_summary": calculate_summary_statistics(loss_rates),
        "age_summary": calculate_summary_statistics(all_ages),
        "manufacturers": {
            "bins": unique_manufacturers,
            "counts": manufacturer_counts,
            "raw": all_manufacturers,
        },
        "loss_cost_by_loss_count_by_avg_age": loss_cost_by_loss_count_by_avg_age,
    }
