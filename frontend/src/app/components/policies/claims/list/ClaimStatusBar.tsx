import React from "react";
import { Tag } from "antd";
import { Claim } from "../../../../../redux/reducers/commonTypes";

export default function ClaimStatusBar({
    claim,
    policyMajorityThreshold,
}: {
    claim: Claim;
    policyMajorityThreshold: number;
}) {
    let hasEvidence = claim?.evidence?.length > 0;
    let approvalsNeeded = Math.ceil(
        claim.approvals.length * (policyMajorityThreshold / 100)
    );
    let denialsNeededToReject = claim.approvals.length - approvalsNeeded || 1;
    let deniedVotes = claim.approvals.filter(
        (a) => a.approved === false
    ).length;

    let isClaimDenied = deniedVotes >= denialsNeededToReject;

    if (!hasEvidence) {
        return <div>Setup Mode</div>;
    } else {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <span>${claim.amount / 100}</span>
                <span>
                    {claim?.paid_on ? (
                        <Tag color="green">Paid</Tag>
                    ) : claim.is_approved ? (
                        <Tag color="purple">Approved</Tag>
                    ) : isClaimDenied ? (
                        <Tag color="red">Rejected</Tag>
                    ) : (
                        <Tag color="blue">Activly Voting</Tag>
                    )}
                </span>
            </div>
        );
    }
}
