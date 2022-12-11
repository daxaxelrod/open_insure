import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Col, Row, Space, Tabs, Typography } from "antd";
import { Policy, User } from "../../../redux/reducers/commonTypes";

import moment from "moment-timezone";
import PolicyQuoteRequestForm, {
    PolicyQuoteRequestBoxRefType,
} from "../../components/policies/quotes/PolicyQuoteRequestBox";
import InviteFriendToPolicy from "../../components/policies/social/InviteFriendToPolicy";
import PolicyDetailSkeleton from "../../components/dashboard/PolicyDetailSkeleton";
import UserPolicyPremiumBox from "../../components/policies/premiums/UserPolicyPremiumBox";
import PolicyDescriptionRow from "../../components/policies/detail/PolicyDescriptionRow";
import RiskTable from "../../components/policies/quotes/RisksTable";
import MembersTable from "../../components/policies/members/MembersTable";
import PolicyClaimsBriefCard from "../../components/policies/claims/PolicyClaimsBriefCard";
import { getOrCreateRisk } from "../../../redux/actions/risk";
import EscrowBalanceCard from "../../components/policies/premiums/EscrowBalanceCard";
import PolicySettingsModal from "../../components/policies/premiums/settings/PolicySettingsModal";
import PolicyPremiums from "../../components/policies/premiums/PolicyPremiums";

import "../../styles/dashboard/PolicyDetails.css";
import PolicyClaimsList from "../../components/policies/claims/list/PolicyClaimsList";
import { setPolicyDetailTabKey } from "../../../redux/actions/ui";

const { Title } = Typography;

export default function PolicyDetails() {
    let { id } = useParams();

    let dispatch = useAppDispatch();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    const policyDetailTabIndex = useAppSelector(
        (state) => state.ui.policyDetailTabKey
    );
    let policyQuoteDrawerFormRef = useRef<PolicyQuoteRequestBoxRefType>(null);
    let currentUser = useAppSelector((state) => state.auth.currentUser);
    let focusedRisk = useAppSelector((state) => state.risk.focusedRisk);

    let doesPolicyHaveStartDate = policy?.coverage_start_date;
    let hasPolicyStarted = false;
    if (doesPolicyHaveStartDate) {
        hasPolicyStarted = moment().isAfter(moment(policy.coverage_start_date));
    }

    useEffect(() => {
        if (policy && policy?.id && focusedRisk === null) {
            dispatch(getOrCreateRisk(policy?.id, {}));
        }
    }, [policy, focusedRisk]);

    if (!policy) {
        return <PolicyDetailSkeleton />;
    }

    let isMember =
        currentUser?.id !== undefined &&
        policy?.pod &&
        policy?.pod.members?.some((m: User) => m.id === currentUser?.id);

    let memberHasFilledOutRisk =
        currentUser?.id !== undefined && focusedRisk?.premium_amount;

    console.log({ currentUser });

    const PolicyDetailCol = Col;
    return (
        <div>
            <div>
                <Row align="middle">
                    <Col span={19}>
                        <Title style={{ marginBottom: "1.8rem" }} level={2}>
                            {policy?.name}
                        </Title>
                    </Col>
                    <Col
                        span={5}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Space>
                            {(!isMember || !memberHasFilledOutRisk) && (
                                <PolicyQuoteRequestForm
                                    policy={policy}
                                    ref={policyQuoteDrawerFormRef}
                                />
                            )}
                            {isMember && (
                                <InviteFriendToPolicy policy={policy} />
                            )}
                            {isMember && (
                                <PolicySettingsModal policy={policy} />
                            )}
                        </Space>
                    </Col>
                </Row>
            </div>
            <Row align="stretch">
                <PolicyDetailCol
                    span={8}
                    style={{
                        paddingRight: 10,
                        display: "flex",
                        alignItems: "stretch",
                        width: "100%",
                    }}
                >
                    <UserPolicyPremiumBox
                        policy={policy}
                        isMember={isMember}
                        memberHasFilledOutRisk={memberHasFilledOutRisk}
                        openRiskDrawer={() => {
                            policyQuoteDrawerFormRef?.current?.open();
                        }}
                    />
                </PolicyDetailCol>
                <PolicyDetailCol span={16} style={{ flex: 1 }}>
                    <PolicyDescriptionRow
                        policy={policy}
                        hasPolicyStarted={hasPolicyStarted}
                    />
                </PolicyDetailCol>
            </Row>

            <Tabs
                style={{ marginTop: "1.5rem" }}
                size="large"
                type="card"
                className="policyDetailsTabs"
                activeKey={policyDetailTabIndex}
                onTabClick={(key) => dispatch(setPolicyDetailTabKey(key))}
            >
                <Tabs.TabPane tab="Covered Assets" key="1">
                    <RiskTable policy={policy} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Members" key="2" animated>
                    <MembersTable policy={policy} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Premiums" key="3">
                    <PolicyPremiums />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Money Pool" key="4">
                    <EscrowBalanceCard policy={policy} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Claims" key="5">
                    <Row>
                        <PolicyDetailCol span={16}>
                            <PolicyClaimsList />
                        </PolicyDetailCol>
                        <PolicyDetailCol
                            span={8}
                            style={{
                                paddingRight: 10,
                                paddingLeft: 10,
                                display: "flex",
                                alignItems: "stretch",
                                width: "100%",
                            }}
                        >
                            <PolicyClaimsBriefCard policy={policy} />
                        </PolicyDetailCol>
                    </Row>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}
