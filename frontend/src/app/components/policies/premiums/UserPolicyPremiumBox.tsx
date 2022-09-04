import { Card } from "antd";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import ProspectiveMemberPrompt from "../members/ProspectiveMemberPrompt";
import UserMainPremiumObligation from "../members/UserMainPremiumObligation";
import UserPolicyQuotePrompt from "../members/UserPolicyQuotePrompt";

export default function UserPolicyPremiumBox({
    isMember,
    memberHasFilledOutRisk,
    policy,
    openRiskDrawer,
}: {
    isMember: boolean;
    memberHasFilledOutRisk: boolean;
    policy: Policy;
    openRiskDrawer: () => void;
}) {
    return (
        <Card
            style={{
                display: "flex",
                flex: 1,
            }}
        >
            {isMember ? (
                <UserMainPremiumObligation />
            ) : memberHasFilledOutRisk ? (
                <ProspectiveMemberPrompt
                    policy={policy}
                    openRiskDrawer={openRiskDrawer}
                />
            ) : (
                <UserPolicyQuotePrompt />
            )}
        </Card>
    );
}
