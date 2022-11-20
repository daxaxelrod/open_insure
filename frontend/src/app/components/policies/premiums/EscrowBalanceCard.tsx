import React from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import PolicyPoolStats from "./PolicyPoolStats";
import { useNavigate } from "react-router-dom";
import EscrowPoolChart from "../escrow/EscrowPoolChart";
import PolicyEscrowAgentInfo from "../escrow/PolicyEscrowAgentInfo";

const { Title } = Typography;

// note, this is no longer a card but a tab in the policy details page
export default function EscrowBalanceCard({ policy }: { policy: Policy }) {
    let navigation = useNavigate();
    const goToEscrowDetail = () => {
        navigation("pool");
    };

    return (
        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <Row justify="space-between">
                <Title level={4}>Pool Info</Title>
                {/* <Button onClick={goToEscrowDetail}>More</Button> deprecated? */}
            </Row>
            <Row>
                <Col span={15}>
                    <EscrowPoolChart />
                </Col>
                <Col span={8} offset={1}>
                    <PolicyEscrowAgentInfo policy={policy} />
                    <PolicyPoolStats policy={policy} />
                </Col>
            </Row>
        </div>
    );
}
