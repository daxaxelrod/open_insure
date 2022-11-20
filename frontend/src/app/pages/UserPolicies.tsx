import React, { useEffect, useState } from "react";
import {
    Row,
    Typography,
    Col,
    Input,
    Space,
    Button,
    Tabs,
    Badge,
    notification,
} from "antd";
import { SearchOutlined, WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import UserPoliciesOpenClaimsTable from "../components/policies/claims/UserPoliciesOpenClaimsTable";
import { getUserPolicies } from "../../redux/actions/policies";
import UserPoliciesList from "../components/policies/UserPoliciesList";
import UserPolicyCalendar from "../components/policies/UserPolicyCalendar";
import { getUserRisks } from "../../redux/actions/risk";
import { Claim, Policy } from "../../redux/reducers/commonTypes";

const { Title } = Typography;

export default function UserPolicies() {
    const [search, setSearch] = useState("");
    const dispatch = useAppDispatch();
    const userPolicies = useAppSelector((state) => state.policies.userPolicies);

    const numOutstandingClaims = userPolicies
        .reduce(
            (previousValue: Policy[], policy: Policy) => [
                ...previousValue,
                ...policy.claims,
            ],
            []
        )
        .filter(
            (claim: Claim) => !claim.is_claim_invalid && !claim.paid_on
        ).length;

    useEffect(() => {
        dispatch(getUserPolicies());
        dispatch(getUserRisks());
    }, [dispatch]);

    return (
        <div>
            <Row justify="space-between">
                <Title level={3}>My Policies</Title>
                <Col
                    md={8}
                    lg={6}
                    sm={12}
                    style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Space>
                        <Button
                            type="primary"
                            onClick={() =>
                                notification.info({
                                    message: "Web payments are not built yet.",
                                    description:
                                        "Chat with your policy's escrow manager to pay premiums.",
                                })
                            }
                            icon={<WalletOutlined />}
                        >
                            Pay Premiums
                        </Button>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </Space>
                </Col>
            </Row>
            <Row style={{ marginBottom: ".5rem" }}>
                <Col span={24}>
                    <Tabs>
                        <Tabs.TabPane tab="Policies" key="1">
                            <UserPoliciesList policies={userPolicies} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="My Premiums" key="2">
                            <UserPolicyCalendar policies={userPolicies} />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={<ClaimsTab count={numOutstandingClaims} />}
                            key="3"
                        >
                            <UserPoliciesOpenClaimsTable />
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
}

const ClaimsTab = ({ count }: { count: number }) => {
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true);
        }, 600);
    }, []);

    return (
        <Badge count={shouldShow ? count : 0} className="ant-tabs-tab-btn">
            <div style={{ margin: "0 1rem" }}>Claims</div>
        </Badge>
    );
};
