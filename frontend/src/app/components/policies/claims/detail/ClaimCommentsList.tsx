import { Col, Row } from "antd";
import React from "react";
import { SideText } from "./Styled";

export default function ClaimCommentsList() {
    return (
        <Row>
            <Col span={3}>
                <SideText>Discussion</SideText>
            </Col>
            <Col span={21}>
                <div>ClaimCommentsList</div>
            </Col>
        </Row>
    );
}
