import React from "react";
import { ReputationDetails } from "../../../../../redux/reducers/types/commonTypes";

export default function RatingDetailsBrief({
    reputation,
}: {
    reputation: ReputationDetails | undefined;
}) {
    if (!reputation) return null;

    return <div>{JSON.stringify(reputation)}</div>;
}
