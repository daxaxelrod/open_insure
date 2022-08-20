import React from "react";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, InsuranceOutlined } from "@ant-design/icons";
import { Policy, Premium, User } from "../../../../redux/reducers/commonTypes";
import { useAppSelector } from "../../../../redux/hooks";

const { Title, Paragraph } = Typography;

export default function PolicyDetailMemberList({ policy }: { policy: Policy }) {
    let totalPremiumsPerMonth =
        policy?.premiums.reduce(
            (acc: number, premium: Premium) => acc + premium.amount,
            0
        ) /
        policy?.coverage_duration /
        100;
    let policyRisks = useAppSelector(
        (state) => state.risk.policyRisks?.[policy?.id]
    );

    console.log({ policyRisks });

    return (
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
                let memberHasName = member.first_name && member.last_name;
                return (
                    <Link
                        to={`/members/${member.id}/`}
                        key={`${member.id}-policy-member-brief`}
                    >
                        <Row style={{ marginBottom: ".25rem" }} align="middle">
                            <Col span={3}>
                                <Avatar
                                    size={{
                                        xs: 24,
                                        sm: 32,
                                        md: 40,
                                    }}
                                    key={member?.id}
                                    src={member?.picture}
                                    icon={<UserOutlined />}
                                />
                            </Col>
                            <Col span={14}>
                                {memberHasName ? (
                                    <Paragraph
                                        key={member.id}
                                        style={{ marginBottom: 0 }}
                                    >
                                        {member.first_name} {member.last_name}
                                    </Paragraph>
                                ) : (
                                    <Paragraph
                                        key={member.id}
                                        style={{ marginBottom: 0 }}
                                    >
                                        {member.email}
                                    </Paragraph>
                                )}
                            </Col>
                            <Col span={4}>
                                <InsuranceOutlined style={{ color: "green" }} />
                            </Col>
                        </Row>
                    </Link>
                );
            })}
        </Card>
    );
}
