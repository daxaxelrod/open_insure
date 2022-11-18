import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Typography } from "antd";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Policy } from "../../../redux/reducers/commonTypes";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreatePolicyModal from "./modals/CreatePolicyModal";
import PolicyCard from "../policies/publicCard/PolicyCard";
import { CLEAR_FOCUSED_RISK } from "../../../redux/actions/types";
import { setPolicyDetailTabKey } from "../../../redux/actions/ui";

const { Title } = Typography;

export default function PolicyListSearch() {
    const [search, setSearch] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useAppDispatch();
    const policies: Policy[] = useAppSelector(
        (state) => state.policies.publicPolicies
    );
    const focusedRisk = useAppSelector((state) => state.risk.focusedRisk);

    useEffect(() => {
        if (focusedRisk) {
            dispatch({ type: CLEAR_FOCUSED_RISK });
        }
        dispatch(setPolicyDetailTabKey("1"));
    }, []);

    return (
        <div>
            <Row justify="space-between">
                <Title level={3}>Find a policy</Title>
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
                    <Button
                        style={{ marginRight: 20 }}
                        type="primary"
                        onClick={() => setIsVisible(true)}
                        icon={<PlusOutlined />}
                    >
                        Create
                    </Button>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {policies.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                ))}
            </Row>
            <CreatePolicyModal
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
        </div>
    );
}
