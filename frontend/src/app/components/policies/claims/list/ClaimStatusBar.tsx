import React from "react";
import { Claim } from "../../../../../redux/reducers/commonTypes";

export default function ClaimStatusBar({ claim }: { claim: Claim }) {
    let hasEvidence = claim.evidence.length > 0;
    return <div>Setup Mode</div>;
}
