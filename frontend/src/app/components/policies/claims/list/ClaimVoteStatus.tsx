import { Progress, Tooltip } from "antd";
import React from "react";
import {
    Claim,
    ClaimApproval,
    Policy,
} from "../../../../../redux/reducers/types/commonTypes";
import colors from "../../../../constants/colors";

import "../../../../styles/dashboard/claims/ClaimVoteStatus.css";

function ThresholdBar({
    location,
    strokeWidth = 10,
}: {
    location: number;
    strokeWidth?: number;
}) {
    return (
        <Tooltip color="black" title={`${location}% required to be approved`}>
            <div
                style={{
                    position: "absolute",
                    left: `${location * 0.81}%`,
                    width: "1px",
                    height: `${strokeWidth * 2}px`,
                    top: -0.1 * strokeWidth,
                    bottom: 0,
                    borderRight: `2px dashed ${colors.alert2}`,
                    padding: "10px",
                    cursor: "pointer",
                }}
            />
        </Tooltip>
    );
}

export default function ClaimVoteStatus({
    claim,
    policy,
    strokeWidth = 10,
    withRedLine = true,
}: {
    claim: Claim;
    policy: Policy;
    strokeWidth?: number;
    withRedLine?: boolean;
}) {
    const approvals = claim.approvals;
    const acceptances = approvals.filter(
        (a: ClaimApproval) => a.approved
    ).length;
    const rejections = approvals.filter(
        (a: ClaimApproval) => !a.approved
    ).length;
    const percent = (acceptances / (acceptances + rejections)) * 100;
    const rejectionsPercent = (rejections / (acceptances + rejections)) * 100;

    return (
        <div
            style={{
                justifyContent: "center",
                position: "relative",
                flex: 1,
            }}
        >
            <Progress
                success={{ percent: parseFloat(percent.toFixed(0)) }}
                percent={parseFloat(rejectionsPercent.toFixed(0))}
                strokeWidth={strokeWidth}
                status={
                    percent >= policy.claim_approval_threshold_percentage
                        ? "success"
                        : "exception"
                }
                showInfo={false}
            />
            {withRedLine && (
                <ThresholdBar
                    strokeWidth={strokeWidth}
                    location={policy.claim_approval_threshold_percentage}
                />
            )}
        </div>
    );
}
