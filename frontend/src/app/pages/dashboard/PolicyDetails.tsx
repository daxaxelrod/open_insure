import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Card, Col, Row, Avatar, Typography, Button } from "antd";
import { Policy, Premium, User } from "../../../redux/reducers/commonTypes";
import { UserOutlined } from "@ant-design/icons";

import moment from "moment-timezone";

import colors from "../../constants/colors";
import PolicyEscrowBalanceChart from "../../components/policies/premiums/PolicyEscrowBalanceChart";
import PolicyQuoteRequestForm from "../../components/policies/quotes/PolicyQuoteRequestBox";
import InviteFriendToPolicy from "../../components/policies/social/InviteFriendToPolicy";
import PolicyDetailSkeleton from "../../components/dashboard/PolicyDetailSkeleton";
import PolicyDetailMemberList from "../../components/policies/members/PolicyDetailMemberList";
import UserPolicyPremiumBox from "../../components/policies/premiums/UserPolicyPremiumBox";
import PolicyDescriptionRow from "../../components/policies/detail/PolicyDescriptionRow";
import RiskTable from "../../components/policies/quotes/RisksTable";
import PolicyPoolStats from "../../components/policies/premiums/PolicyPoolStats";
import MembersTable from "../../components/policies/members/MembersTable";
import PolicyClaimsBriefCard from "../../components/policies/claims/PolicyClaimsBriefCard";

const { Title, Paragraph } = Typography;

export default function PolicyDetails() {
    let { id } = useParams();
    let navigation = useNavigate();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    let currentUser = useAppSelector((state) => state.auth.currentUser);
    let focusedRisk = useAppSelector((state) => state.risk.focusedRisk);

    let doesPolicyHaveStartDate = policy?.coverage_start_date;
    let hasPolicyStarted = false;
    if (doesPolicyHaveStartDate) {
        hasPolicyStarted = moment().isAfter(moment(policy.coverage_start_date));
    }

    if (!policy) {
        return <PolicyDetailSkeleton />;
    }

    let isMember =
        currentUser.id !== undefined &&
        policy?.pod &&
        policy?.pod.members.some((m: User) => m.id === currentUser.id);

    let memberHasFilledOutRisk =
        currentUser?.id !== undefined && focusedRisk?.premium_amount;

    const goToEscrowDetail = () => {
        navigation("pool");
    };

    return (
        <div>
            <div>
                <Row align="middle">
                    <Col span={21}>
                        <Title style={{ marginBottom: 0 }} level={2}>
                            {policy?.name}
                        </Title>
                        <Paragraph
                            style={{ color: colors.gray10, fontSize: 12 }}
                        >
                            {hasPolicyStarted ? "Active Policy" : "In setup"}
                        </Paragraph>
                    </Col>
                    <Col span={2} style={{ marginRight: 30 }}>
                        {!isMember && (
                            <PolicyQuoteRequestForm policy={policy} />
                        )}
                        {isMember && <InviteFriendToPolicy policy={policy} />}
                    </Col>
                </Row>
            </div>
            <Row align="stretch">
                <Col
                    span={8}
                    style={{
                        padding: 10,
                        background: "red",
                        display: "flex",
                        alignItems: "stretch",
                        flexDirection: "column",
                    }}
                >
                    <UserPolicyPremiumBox
                        policy={policy}
                        isMember={isMember}
                        memberHasFilledOutRisk={memberHasFilledOutRisk}
                    />
                </Col>
                <Col
                    span={8}
                    style={{
                        padding: 10,
                        background: "red",
                        display: "flex",
                        alignItems: "stretch",
                        flexDirection: "column",
                    }}
                >
                    <PolicyClaimsBriefCard policy={policy} />
                </Col>

                <Col
                    span={8}
                    style={{
                        padding: 10,
                        background: "red",
                        display: "flex",
                        alignItems: "stretch",
                        flexDirection: "column",
                    }}
                >
                    <Card
                        title={
                            <Row justify="space-between">
                                <Title level={3}>Pool Info</Title>
                                <Button onClick={goToEscrowDetail}>More</Button>
                            </Row>
                        }
                    >
                        <PolicyPoolStats policy={policy} />
                    </Card>
                </Col>
            </Row>
            <PolicyDescriptionRow policy={policy} />

            <RiskTable policy={policy} />
            <MembersTable policy={policy} />
        </div>
    );
}
