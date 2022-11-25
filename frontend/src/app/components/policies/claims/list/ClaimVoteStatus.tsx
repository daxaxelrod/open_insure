import { Progress } from "antd";
import React from "react";
import {
    Claim,
    ClaimApproval,
    Policy,
} from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";

function ThresholdBar({ location }: { location: number }) {
    return (
        <div
            style={{
                position: "absolute",
                left: `${location * 0.81}%`,
                width: "1px",
                height: "22px",
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
    let approvals = claim.approvals;
    let acceptances = approvals.filter((a: ClaimApproval) => a.approved).length;
    let rejections = approvals.filter((a: ClaimApproval) => !a.approved).length;
    let percent = (acceptances / (acceptances + rejections)) * 100;

    return (
        <div
            style={{
                justifyContent: "center",
                position: "relative",
                flex: 1,
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
