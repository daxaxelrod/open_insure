import { Col, Row } from "antd";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";

export default function PolicyDescriptionRow({ policy }: { policy: Policy }) {
    return (
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
    );
}
