import { Progress } from "antd";
import React from "react";
import {
    Claim,
    ClaimApproval,
    Policy,
} from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";

function ThresholdBar({
    location,
    strokeWidth = 10,
}: {
    location: number;
    strokeWidth?: number;
}) {
    return (
        <div
            style={{
                position: "absolute",
                left: `${location * 0.81}%`,
                width: "1px",
                height: `${strokeWidth * 2}px`,
                top: -0.1 * strokeWidth,
                bottom: 0,
                borderRight: `2px dashed ${colors.alert2}`,
            }}
        />
    );
}

export default function ClaimVoteStatus({
    claim,
    policy,
    strokeWidth = 10,
}: {
    claim: Claim;
    policy: Policy;
    strokeWidth?: number;
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
                strokeWidth={strokeWidth}
                status={
                    percent >= policy.claim_approval_threshold_percentage
                        ? "success"
                        : "normal"
                }
            />
            <ThresholdBar
                strokeWidth={strokeWidth}
                location={policy.claim_approval_threshold_percentage}
            />
        </div>
    );
}
