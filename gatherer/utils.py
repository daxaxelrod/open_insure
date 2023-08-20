import operator
import typing
from functools import reduce
from gatherer.models import PropertyLifeExpectancyGuess, PolicyLineProperty
import numpy as np

def calculate_summary_statistics(data):
    data_array = np.array(data)
    
    mean = np.mean(data_array)
    median = np.median(data_array)
    std_dev = np.std(data_array)
    variance = np.var(data_array)
    min_value = np.min(data_array)
    max_value = np.max(data_array)
    quantile_25 = np.percentile(data_array, 25)
    quantile_75 = np.percentile(data_array, 75)
    
    summary = {
        'mean': mean,
        'median': median,
        'standard_deviation': std_dev,
        'variance': variance,
        'minimum_value': min_value,
        'maximum_value': max_value,
        '25th_percentile': quantile_25,
        '75th_percentile': quantile_75
    }
    
    return summary


def generate_summary_stats_for_policy_line(
    property_line: PolicyLineProperty, guesses: typing.List[PropertyLifeExpectancyGuess]
):
    
    count = guesses.count()
    asset_values = [guess.purchase_price for guess in guesses]
    loss_rates = [guess.yearly_loss_rate_bsp for guess in guesses]
    all_manufacturers = [guess.property_make for guess in guesses if guess.property_make]
    manufacturers_bins = np.arange(len(all_manufacturers))
    manufacturers_counts = np.bincount(all_manufacturers, bins=bins)

    all_ages = [guess.age_of_ownership for guess in guesses]
    

    total_asset_value = reduce(operator.add, asset_values, 0)

    return {
        "count": count,
        "total_asset_value": total_asset_value,
        "asset_value_summary": calculate_summary_statistics(asset_values),
        "loss_rate_summary": calculate_summary_statistics(loss_rates),
        "age_summary": calculate_summary_statistics(all_ages),
        "manufacturers": {
            "bins": manufacturers_bins,
            "counts": manufacturers_counts,
            "raw": all_manufacturers
        },
    }