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