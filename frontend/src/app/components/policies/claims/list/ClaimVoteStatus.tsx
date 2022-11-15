import { Progress } from "antd";
import React from "react";
import { Claim, Policy } from "../../../../../redux/reducers/commonTypes";

function ThresholdBar({ location }: { location: number }) {
    return (
        <div
            style={{
                display: "absolute",
                left: `${location}%`,
            }}
        />
    );
}

export default function ClaimVoteStatus({
    claim,
    policy,
}: {
    claim: Claim;
    policy: Policy;
}) {
    return (
        <div
            style={{
                display: "flex",
            }}
        >
            <ThresholdBar
                location={policy.claim_approval_threshold_percentage}
            />
            <Progress percent={20} />
        </div>
    );
}
