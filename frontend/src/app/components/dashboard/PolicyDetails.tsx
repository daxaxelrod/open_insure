import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Card, Col, Row, Avatar, Typography } from "antd";
import { Policy, User } from "../../../redux/reducers/commonTypes";
import { UserOutlined } from "@ant-design/icons";

import moment from "moment-timezone";

import colors from "../../constants/colors";
import PolicyEscrowBalanceChart from "../policies/premiums/PolicyEscrowBalanceChart";
import PolicyQuoteRequestForm from "../policies/quotes/PolicyQuoteRequestBox";

const { Title, Paragraph } = Typography;

export default function PolicyDetails() {
    let { id } = useParams();
    let policy = useAppSelector((state) =>
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

    let isMemeber =
        currentUser.id &&
        policy?.members.some((m: User) => m.id === currentUser.id);

    return (
        <div>
            <div>
                <Title style={{ marginBottom: 0 }}>{policy?.name}</Title>
                <Paragraph style={{ color: colors.gray10, fontSize: 12 }}>
                    {hasPolicyStarted ? "Active Policy" : "In setup"}
                </Paragraph>
                {!isMemeber && <PolicyQuoteRequestForm policy={policy} />}
            </div>
            <Row>
                <Col span={8} style={{ padding: 20 }}>
                    <Card
                        title={<Title level={3}>Escrow Balance</Title>}
                        bodyStyle={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <PolicyEscrowBalanceChart
                            policy={policy}
                            isMember={isMemeber}
                        />
                    </Card>
                </Col>
                <Col span={8} style={{ padding: 20 }}>
                    <Card title={<Title level={3}>Policy Members</Title>}>
                        {policy?.pod?.members?.map((member: User) => {
                            let memberHasName =
                                member.first_name && member.last_name;
                            return (
                                <Link to={`/members/${member.id}/`}>
                                    <Row style={{ marginBottom: ".25rem" }}>
                                        <Col span={4}>
                                            <Avatar
                                                key={member?.id}
                                                src={member?.picture}
                                                icon={<UserOutlined />}
                                            />
                                        </Col>
                                        <Col span={20}>
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
                    </Card>
                </Col>
                <Col span={8} style={{ padding: 20 }}>
                    <Card title={<Title level={3}>Risk level</Title>}>
                        Risk graphs will be here
                    </Card>
                </Col>
            </Row>
            <div>list of insured things</div>
            <div>how much is there premium and when do i pay it</div>
            <div>List of members and what they are paying</div>

            {/* <div>{JSON.stringify(policy)}</div> */}
        </div>
    );
}
