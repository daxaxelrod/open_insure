import React from "react";
import { Typography } from "antd";
import { Claim, Policy, User } from "../../../../redux/reducers/commonTypes";
import { maybePluralize } from "../../../utils/stringUtils";

import { AlertOutlined } from "@ant-design/icons";
import colors from "../../../constants/colors";

const { Paragraph } = Typography;

export default function ClaimsStatusInlineDisplay({
    record,
    currentUser,
}: {
    record: Policy;
    currentUser: User;
}) {
    let pendingClaims =
        record?.claims?.filter(
            (claim: Claim) => !claim.is_claim_invalid && !claim.paid_on
        ) || [];
    let pendingClaimsWhereUserVoteNotSubmitted = pendingClaims.filter(
        (claim) => {
            return !claim.approvals.some(
                (approval) => approval.approver === currentUser?.id
            );
        }
    );

    return (
        <div>
            <Paragraph style={{ marginBottom: 2 }}>
                {pendingClaims.length} pending{" "}
                {maybePluralize(pendingClaims.length, "claim")}
            </Paragraph>
            {pendingClaimsWhereUserVoteNotSubmitted.length > 0 && (
                <Paragraph style={{ marginBottom: 2 }}>
                    <AlertOutlined style={{ color: colors.alert1 }} />{" "}
                    {pendingClaimsWhereUserVoteNotSubmitted.length} need your
                    attention
                </Paragraph>
            )}
        </div>
    );
}
