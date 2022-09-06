import React from "react";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, InsuranceOutlined } from "@ant-design/icons";
import { Policy, User } from "../../../../redux/reducers/commonTypes";
import { getPremiumsPerMonth } from "../../../utils/policyUtils";

const { Title, Paragraph } = Typography;

// not used at the moment
export default function PolicyDetailMemberList({ policy }: { policy: Policy }) {
    const totalPremiumsPerMonth = getPremiumsPerMonth(policy);
    return (
        <Card
            title={
                <Row justify="space-between">
                    <Title level={5}>Policy Members</Title>
                    <Link to={`/policy/${policy.id}/members`}>
                        <Button type="dashed">
                            <Paragraph>
                                ${totalPremiumsPerMonth} total/
                                {policy.premium_payment_frequency} months
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
