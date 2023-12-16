import React from "react";
import { ReputationDetails } from "../../../../../redux/reducers/types/commonTypes";

export default function RatingDetails({
    reputation,
}: {
    reputation: ReputationDetails | undefined;
}) {
    if (!reputation) return null;

    return (
        <div>
            <div>RatingDetails</div>
            <div>RatingDetails</div>
            <div>RatingDetails</div>
            <div>RatingDetails</div>
            <div>RatingDetails</div>
            <div>RatingDetails</div>
            <div>RatingDetails</div>
        </div>
    );
}
