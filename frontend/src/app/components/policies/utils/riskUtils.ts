import { Policy, Risk } from "../../../../redux/reducers/commonTypes";

export function determineLowestPremium(risks: Risk[]) {
    let lowestPremium = 0;
    if (!risks?.length || risks?.length === 0) {
        return null;
    }
    risks.forEach((risk) => {
        if (risk.premium_amount < lowestPremium || lowestPremium === 0) {
            lowestPremium = risk.premium_amount;
        }
    });
    return lowestPremium;
}

export function getHumanReadablePaymentFrequencyForPolicy(policy: Policy) {
    if (policy.premium_payment_frequency === 1) {
        return "monthly";
    } else if (policy.premium_payment_frequency === 3) {
        return "quarterly";
    } else if (policy.premium_payment_frequency === 6) {
        return "semi annually";
    } else if (policy.premium_payment_frequency === 12) {
        return "annually";
    }
    return "every " + policy.premium_payment_frequency + " months";
}
