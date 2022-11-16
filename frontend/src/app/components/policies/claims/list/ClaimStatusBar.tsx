import React from "react";
import { Claim } from "../../../../../redux/reducers/commonTypes";

export default function ClaimStatusBar({ claim }: { claim: Claim }) {
    let hasEvidence = claim?.evidence?.length > 0;
    if (!hasEvidence) {
        return <div>Setup Mode</div>;
    } else {
        return null;
    }
}
