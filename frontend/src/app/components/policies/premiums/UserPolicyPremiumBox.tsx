import { Card } from "antd";
import React from "react";
import UserMainPremiumObligation from "../members/UserMainPremiumObligation";
import UserPolicyQuote from "../members/UserPolicyQuote";

export default function UserPolicyPremiumBox({
    isMember,
}: {
    isMember: boolean;
}) {
    return (
        <Card>
            {isMember ? <UserMainPremiumObligation /> : <UserPolicyQuote />}
        </Card>
    );
}
