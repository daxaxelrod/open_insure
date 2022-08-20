import React from "react";
import { Col, Row, Typography } from "antd";
import { Policy } from "../../../../redux/reducers/commonTypes";

const { Title } = Typography;

export default function PolicyDescriptionRow({ policy }: { policy: Policy }) {
    return (
        <div style={{ marginTop: "1rem" }}>
            <Title level={4}>Description</Title>
            <Row>
                <Col span={12}>{policy.description}</Col>
                <Col span={12}>
                    <Row>
                        <Col span={12}>thing 1</Col>
                        <Col span={12}>thing 2</Col>
                        <Col span={12}>thing 3</Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
