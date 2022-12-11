import { Card, Skeleton } from "antd";
import React from "react";
import { useAppSelector } from "../../../../redux/hooks";
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
    const riskPending = useAppSelector((state) => state.risk.getRisksPending);

    console.log({ memberHasFilledOutRisk });

    return (
        <Card
            style={{
                display: "flex",
                flex: 1,
            }}
            bodyStyle={{
                display: "flex",
                flex: 1,
            }}
            bordered={false}
        >
            {riskPending ? (
                <Skeleton />
            ) : isMember && memberHasFilledOutRisk ? (
                <UserMainPremiumObligation policy={policy} />
            ) : memberHasFilledOutRisk ? (
                <ProspectiveMemberPrompt
                    policy={policy}
                    openRiskDrawer={openRiskDrawer}
                />
            ) : (
                <UserPolicyQuotePrompt openRiskDrawer={openRiskDrawer} />
            )}
        </Card>
    );
}
