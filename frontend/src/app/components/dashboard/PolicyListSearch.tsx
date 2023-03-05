import React, { useEffect, useState } from "react";
import { Button, Col, Grid, Input, Row, Typography } from "antd";

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
    const screens = Grid.useBreakpoint();
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

    const isMobile = !screens.lg;

    return (
        <div>
            <Row justify="space-between">
                <Title level={3}>Find a policy</Title>
                <Col
                    md={8}
                    lg={6}
                    sm={24}
                    style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    {isMobile ? null : (
                        <Button
                            style={{ marginRight: 16 }}
                            type="primary"
                            onClick={() => setIsVisible(true)}
                            icon={<PlusOutlined />}
                        >
                            Create
                        </Button>
                    )}

                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    {!isMobile ? null : (
                        <Button
                            style={{ marginLeft: 16 }}
                            type="primary"
                            onClick={() => setIsVisible(true)}
                            icon={<PlusOutlined />}
                        >
                            Create
                        </Button>
                    )}
                </Col>
            </Row>
            <Row gutter={[{ xs: 4, sm: 8, md: 12, lg: 16 }, 0]}>
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
