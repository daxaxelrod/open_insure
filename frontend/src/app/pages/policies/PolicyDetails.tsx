import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Button, Col, Grid, Row, Space, Tabs, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
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
import PolicyPremiums from "../../components/policies/premiums/PolicyPremiums";

import "../../styles/dashboard/PolicyDetails.css";
import PolicyClaimsList from "../../components/policies/claims/list/PolicyClaimsList";
import { setPolicyDetailTabKey } from "../../../redux/actions/ui";
import MobileResponsiveWarningModal from "../../components/policies/utils/MobileResponsiveWarningModal";
import useWindowSize from "../../components/hooks/useWindowSize";
import colors from "../../constants/colors";

const { Title, Paragraph } = Typography;

export default function PolicyDetails() {
    let { id } = useParams();
    let size = useWindowSize();
    const [isMobileWarningModalVisible, setisMobileWarningModalVisible] =
        useState(false);

    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
    const sizes = Grid.useBreakpoint();

    let dispatch = useAppDispatch();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    const isMobile =
        (sizes.sm || sizes.xs) && !sizes.md && !sizes.lg && !sizes.xl;

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

    useEffect(() => {
        if (
            size.width !== undefined &&
            size.width < 768 &&
            !isMobileWarningModalVisible &&
            !hasBeenDismissed
        ) {
            setHasBeenDismissed(true);
            setisMobileWarningModalVisible(true);
        }
    }, [size, setisMobileWarningModalVisible]);

    if (!policy) {
        return <PolicyDetailSkeleton />;
    }

    let isMember =
        currentUser?.id !== undefined &&
        policy?.pod &&
        policy?.pod.members?.some((m: User) => m.id === currentUser?.id);

    let memberHasFilledOutRisk =
        currentUser?.id !== undefined && focusedRisk?.premium_amount;

    const PolicyDetailCol = Col;
    return (
        <div>
            <div>
                <Row>
                    <Col
                        lg={{ span: 19 }}
                        md={{ span: 19 }}
                        sm={{ span: 24 }}
                        xs={{ span: 24 }}
                    >
                        <Title level={2}>{policy?.name}</Title>
                    </Col>
                    <Col
                        lg={{ span: 5 }}
                        md={{ span: 5 }}
                        sm={{ span: 24 }}
                        xs={{ span: 24 }}
                        style={{
                            display: "flex",
                            justifyContent: isMobile
                                ? "flex-start"
                                : "flex-end",
                        }}
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
                                <Link to={`/policy/${policy.id}/settings`}>
                                    <Button type="default">
                                        <Paragraph
                                            style={{ color: colors.gray8 }}
                                        >
                                            <SettingOutlined /> Settings
                                        </Paragraph>
                                    </Button>
                                </Link>
                            )}
                        </Space>
                    </Col>
                </Row>
            </div>
            <Row align="stretch">
                <PolicyDetailCol
                    lg={{ span: 8 }}
                    md={{ span: 12 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
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
            <MobileResponsiveWarningModal
                visible={isMobileWarningModalVisible}
                setVisible={setisMobileWarningModalVisible}
            />
        </div>
    );
}
