import colors from "../../../../constants/colors";

export function getRatingColor(rating: number): string {
    if (rating >= 90) {
        return colors.good;
    } else if (rating >= 80) {
        return colors.lightGood;
    } else if (rating >= 70) {
        return colors.warning1;
    } else if (rating >= 60) {
        return colors.alert2;
    } else {
        return colors.alert1;
    }
}

export function getRatingGrade(rating: number): string {
    return rating >= 95
        ? "A+"
        : rating >= 93
        ? "A"
        : rating >= 90
        ? "A-"
        : rating >= 87
        ? "B+"
        : rating >= 83
        ? "B"
        : rating >= 80
        ? "B-"
        : rating >= 77
        ? "C+"
        : rating >= 73
        ? "C"
        : rating >= 70
        ? "C-"
        : rating >= 67
        ? "D+"
        : rating >= 63
        ? "D"
        : rating >= 60
        ? "D-"
        : rating >= 0
        ? "F"
        : "N/A";
}
