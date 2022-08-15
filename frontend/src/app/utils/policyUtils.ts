import { Policy, User } from "../../redux/reducers/commonTypes";

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

export function isPolicyMember(currentUser: User, policy: Policy): boolean {
    return (
        currentUser.id !== undefined &&
        policy?.pod &&
        policy?.pod.members.some((m: User) => m.id === currentUser.id)
    );
}
