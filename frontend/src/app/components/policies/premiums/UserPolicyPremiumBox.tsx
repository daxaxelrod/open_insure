import { Card, Grid, Skeleton } from "antd";
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
    const focusedRiskPending = useAppSelector(
        (state) => state.risk.modifyRiskPending
    );
    const sizes = Grid.useBreakpoint();
    const isMobile = sizes.xs || (sizes.sm && !sizes.md);
    const Container = isMobile ? "div" : Card;

    return (
        <Container
            style={{
                display: "flex",
                flex: 1,
                padding: isMobile ? ".75rem" : 0,
            }}
            bodyStyle={{
                display: "flex",
                flex: 1,
            }}
            bordered={true}
        >
            {focusedRiskPending ? (
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
        </Container>
    );
}
