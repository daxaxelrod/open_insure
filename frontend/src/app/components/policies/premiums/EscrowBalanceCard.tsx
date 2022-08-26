import React from "react";
import { Button, Card, Row, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";
import PolicyPoolStats from "./PolicyPoolStats";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function EscrowBalanceCard({ policy }: { policy: Policy }) {
    let navigation = useNavigate();
    const goToEscrowDetail = () => {
        navigation("pool");
    };

    return (
        <Card
            title={
                <Row justify="space-between">
                    <Title level={3}>Pool Info</Title>
                    <Button onClick={goToEscrowDetail}>More</Button>
                </Row>
            }
        >
            <PolicyPoolStats policy={policy} />
        </Card>
    );
}
