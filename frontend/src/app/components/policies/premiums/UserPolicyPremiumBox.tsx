import { Card } from "antd";
import React from "react";
import ProspectiveMemberPrompt from "../members/ProspectiveMemberPrompt";
import UserMainPremiumObligation from "../members/UserMainPremiumObligation";
import UserPolicyQuote from "../members/UserPolicyQuote";

export default function UserPolicyPremiumBox({
    isMember,
    memberHasFilledOutRisk,
}: {
    isMember: boolean;
    memberHasFilledOutRisk: boolean;
}) {
    return (
        <Card>
            {isMember ? (
                <UserMainPremiumObligation />
            ) : memberHasFilledOutRisk ? (
                <ProspectiveMemberPrompt />
            ) : (
                <UserPolicyQuote />
            )}
        </Card>
    );
}
