import { Policy, Premium, User } from "../../redux/reducers/commonTypes";

export function getCoverageTypeHumanReadable(coverageType: string): string {
    switch (coverageType) {
        case "m_property":
            return "Minor Property";
        case "renters":
            return "Renter's";
        default:
            return "";
    }
}

export function getGovernanceTypeHumanReadable(coverageType: string): string {
    switch (coverageType) {
        case "direct_democracy":
            return "Direct Democracy";
        case "forced_commitee":
            return "Jury Duty";
        case "voluntary_commitee":
            return "Representative Democracy";
        default:
            return "Not setup";
    }
}

export function isPolicyMember(currentUser: User, policy: Policy): boolean {
    return (
        currentUser.id !== undefined &&
        policy?.pod &&
        policy?.pod?.members?.some((m: User) => m.id === currentUser.id)
    );
}

export function getPremiumsPerMonth(policy: Policy): number {
    return (
        policy?.premiums.reduce(
            (acc: number, premium: Premium) => acc + premium.amount,
            0
        ) /
        policy?.coverage_duration /
        100
    );
}

export function getAvailableUnderlyingInsuredTypesForPolicyType(
    policyType: string
) {
    switch (policyType) {
        case "m_property":
            return [
                { label: "Cell Phones", value: "cell_phone" },
                { label: "Audio Equipment", value: "audio_equipment" },
            ];
        case "renters":
            return [
                { label: "Apartment", value: "apartment" },
                { label: "Condo", value: "condo" },
                { label: "Multi Family", value: "multi_family" },
            ];

        default:
            return [];
    }
}
