import { Risk } from "../../../../redux/reducers/commonTypes";

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
