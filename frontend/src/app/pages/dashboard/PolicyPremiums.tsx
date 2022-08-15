import { Card } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Policy, User } from "../../../redux/reducers/commonTypes";
import PremiumsTable from "../../components/policies/members/PremiumsTable";
import UserMainPremiumObligation from "../../components/policies/members/UserMainPremiumObligation";
import UserPolicyQuote from "../../components/policies/members/UserPolicyQuote";
import { isPolicyMember } from "../../utils/policyUtils";

// a big box with your premiums, wehter thats getting a quote or you're a member
export default function PolicyPremiums() {
    let { id } = useParams();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    let currentUser: User = useAppSelector((state) => state.auth.currentUser);

    let isMember: boolean = isPolicyMember(currentUser, policy);
    return (
        <div>
            <div>
                this page should answer the question how much is there premium
                and when do i pay it. Inspired by Julius G
            </div>
            <Card>
                {isMember ? <UserMainPremiumObligation /> : <UserPolicyQuote />}
            </Card>
            <PremiumsTable policy={policy} />
        </div>
    );
}
