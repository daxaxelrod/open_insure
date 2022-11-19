import { Progress } from "antd";
import React from "react";
import { Claim, Policy } from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";

function ThresholdBar({ location }: { location: number }) {
    return (
        <div
            style={{
                position: "absolute",
                left: `${location * 0.81}%`,
                width: "1px",
                height: "100%",
                top: 2,
                bottom: 0,
                borderRight: `2px dashed ${colors.alert2}`,
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
    let percent = 70;
    return (
        <div
            style={{
                marginTop: "1rem",
                justifyContent: "center",
                position: "relative",
            }}
        >
            <Progress
                percent={percent}
                status={
                    percent >= policy.claim_approval_threshold_percentage
                        ? "success"
                        : "normal"
                }
            />
            <ThresholdBar
                location={policy.claim_approval_threshold_percentage}
            />
        </div>
    );
}
