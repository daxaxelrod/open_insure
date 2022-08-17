import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Card, Col, Row, Avatar, Typography, Button } from "antd";
import { Policy, Premium, User } from "../../../redux/reducers/commonTypes";
import { UserOutlined } from "@ant-design/icons";

import moment from "moment-timezone";

import colors from "../../constants/colors";
import PolicyEscrowBalanceChart from "../../components/policies/premiums/PolicyEscrowBalanceChart";
import PolicyQuoteRequestForm from "../../components/policies/quotes/PolicyQuoteRequestBox";
import InviteFriendToPolicy from "../../components/policies/social/InviteFriendToPolicy";
import CoveredItemsTable from "../../components/dashboard/CoveredItemsTable";
import PolicyDetailSkeleton from "../../components/dashboard/PolicyDetailSkeleton";

const { Title, Paragraph } = Typography;

export default function PolicyDetails() {
    let { id } = useParams();
    let policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find(
            (p: Policy) => p.id === parseInt(id || "")
        )
    );
    let currentUser = useAppSelector((state) => state.auth.currentUser);

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

    let totalPremiumsPerMonth =
        policy?.premiums.reduce(
            (acc: number, premium: Premium) => acc + premium.amount,
            0
        ) /
        policy?.coverage_duration /
        100;

    return (
        <div>
            <div>
                <Title style={{ marginBottom: 0 }}>{policy?.name}</Title>
                <Paragraph style={{ color: colors.gray10, fontSize: 12 }}>
                    {hasPolicyStarted ? "Active Policy" : "In setup"}
                </Paragraph>
                <Paragraph style={{ color: colors.gray10, fontSize: 12 }}>
                    {policy.description}
                </Paragraph>
            </div>
            <Row>
                <Col span={12} style={{ padding: 20 }}>
                    <Card
                        title={
                            <Row justify="space-between">
                                <Title level={3}>Policy Members</Title>
                                <Link to={`/policy/${policy.id}/members`}>
                                    <Button type="dashed">
                                        <Paragraph>
                                            ${totalPremiumsPerMonth} total/month
                                        </Paragraph>
                                    </Button>
                                </Link>
                            </Row>
                        }
                    >
                        {policy?.pod?.members?.map((member: User) => {
                            let memberHasName =
                                member.first_name && member.last_name;
                            return (
                                <Link
                                    to={`/members/${member.id}/`}
                                    key={`${member.id}-policy-member-brief`}
                                >
                                    <Row style={{ marginBottom: ".25rem" }}>
                                        <Col span={2}>
                                            <Avatar
                                                key={member?.id}
                                                src={member?.picture}
                                                icon={<UserOutlined />}
                                            />
                                        </Col>
                                        <Col span={4}>
                                            {memberHasName ? (
                                                <Paragraph key={member.id}>
                                                    {member.first_name}{" "}
                                                    {member.last_name}
                                                </Paragraph>
                                            ) : (
                                                <Paragraph key={member.id}>
                                                    {member.email}
                                                </Paragraph>
                                            )}
                                        </Col>
                                    </Row>
                                </Link>
                            );
                        })}
                        <Row justify="end">
                            {!isMember && (
                                <PolicyQuoteRequestForm policy={policy} />
                            )}
                            {isMember && (
                                <InviteFriendToPolicy policy={policy} />
                            )}
                        </Row>
                    </Card>
                </Col>

                <Col span={8} style={{ padding: 20 }}>
                    <Card
                        title={<Title level={3}>Pool Balance</Title>}
                        bodyStyle={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <PolicyEscrowBalanceChart
                            policy={policy}
                            isMember={isMember}
                        />
                    </Card>
                </Col>
            </Row>
            <CoveredItemsTable policy={policy} />
            <div>how much is there premium and when do i pay it</div>
            <div>List of members and what they are paying</div>

            {/* <div>{JSON.stringify(policy)}</div> */}
        </div>
    );
}
