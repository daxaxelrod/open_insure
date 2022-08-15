import React, { useEffect, useState } from "react";
import { Row, Typography, Col, Input, Space, Button } from "antd";
import { SearchOutlined, WalletOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import UserPoliciesOpenClaimsTable from "../components/policies/claims/UserPoliciesOpenClaimsTable";
import { getUserPolicies } from "../../redux/actions/policies";
import UserPoliciesList from "../components/policies/UserPoliciesList";
import UserPolicyCalendar from "../components/policies/UserPolicyCalendar";

const { Title } = Typography;

export default function UserPolicies() {
    const [search, setSearch] = useState("");
    const dispatch = useAppDispatch();
    const userPolicies = useAppSelector((state) => state.policies.userPolicies);

    useEffect(() => {
        dispatch(getUserPolicies());
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
            <Row>
                <Col md={18}>
                    <UserPoliciesList policies={userPolicies} />
                </Col>
                <Col md={6} style={{ marginTop: 16 }}>
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ display: "flex" }}
                    >
                        <UserPolicyCalendar policies={userPolicies} />
                        <UserPoliciesOpenClaimsTable />
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
