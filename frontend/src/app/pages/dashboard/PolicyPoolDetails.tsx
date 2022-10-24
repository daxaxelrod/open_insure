import React from "react";
import { Alert, Card, Col, Row, Typography } from "antd";

import EscrowPoolChart from "../../components/policies/escrow/EscrowPoolChart";

const { Title: AntTitle } = Typography;

export default function PolicyPoolDetails() {
    return (
        <>
            <AntTitle level={3}>Escrow Pool</AntTitle>
            <Alert
                message="This page is under construction"
                type="error"
                style={{ marginBottom: 20 }}
                showIcon
                closable
            />
            <Row gutter={18}>
                <Col span={16}>
                    <EscrowPoolChart />
                </Col>
                <Col span={7}>
                    <Card style={{ marginBottom: "2rem" }}>
                        Pool Health indicators
                    </Card>
                    <Card>Latest claims info</Card>
                </Col>
            </Row>
        </>
    );
}
