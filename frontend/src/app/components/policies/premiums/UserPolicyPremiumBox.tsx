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
}: {
    isMember: boolean;
    memberHasFilledOutRisk: boolean;
    policy: Policy;
}) {
    return (
        <Card>
            {isMember ? (
                <UserMainPremiumObligation />
            ) : memberHasFilledOutRisk ? (
                <ProspectiveMemberPrompt policy={policy} />
            ) : (
                <UserPolicyQuotePrompt />
            )}
        </Card>
    );
}
