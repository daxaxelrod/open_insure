import React, { useEffect } from "react";
import { Card } from "antd";
import { useParams } from "react-router-dom";
import { getOrCreateRisk } from "../../../redux/actions/risk";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Policy, User } from "../../../redux/reducers/commonTypes";
import RisksTable from "../../components/policies/members/RisksTable";
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
    const dispatch = useAppDispatch();
    let currentUser: User = useAppSelector((state) => state.auth.currentUser);
    let risk = useAppSelector((state) => state.risk.focusedRisk);

    useEffect(() => {
        // if there is no risk, go and get it
        if (!risk && policy) {
            dispatch(getOrCreateRisk(policy.id, {}));
        }
    }, [risk, policy]);

    let isMember: boolean = isPolicyMember(currentUser, policy);
    return (
        <div>
            <RisksTable policy={policy} />
            <Card>
                {isMember ? <UserMainPremiumObligation /> : <UserPolicyQuote />}
            </Card>
            <div>
                this page should answer the question how much is there premium
                and when do i pay it. Inspired by Julius G
            </div>
        </div>
    );
}
