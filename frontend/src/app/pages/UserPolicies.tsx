import React, { useEffect, useState } from "react";
import { Row, Typography, Col, Input, Space, Button, Tabs } from "antd";
import { SearchOutlined, WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import UserPoliciesOpenClaimsTable from "../components/policies/claims/UserPoliciesOpenClaimsTable";
import { getUserPolicies } from "../../redux/actions/policies";
import UserPoliciesList from "../components/policies/UserPoliciesList";
import UserPolicyCalendar from "../components/policies/UserPolicyCalendar";
import { getUserRisks } from "../../redux/actions/risk";
import { Content } from "antd/lib/layout/layout";

const { Title } = Typography;

export default function UserPolicies() {
    const [search, setSearch] = useState("");
    const dispatch = useAppDispatch();
    const userPolicies = useAppSelector((state) => state.policies.userPolicies);
    const [activeTab, setActiveTab] = useState("Policies");

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
                            onClick={() => null}
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
                <Col style={{ display: "flex" }}>
                    <Tabs>
                        <Tabs.TabPane tab="Policies" key="1">
                            <UserPoliciesList policies={userPolicies} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Schedule" key="2">
                            <UserPolicyCalendar policies={userPolicies} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Claims" key="3">
                            <UserPoliciesOpenClaimsTable />
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
}
