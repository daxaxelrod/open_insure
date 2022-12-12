import { Col, Row, Typography } from "antd";
import React from "react";

const { Title } = Typography;

export default function AskForEmail() {
    return (
        <div
            style={{
                backgroundColor: "#f8fafe",
            }}
        >
            <Row>
                <Col md={{ span: 12, offset: 4 }} lg={{ span: 8, offset: 4 }}>
                    <Title level={5}>
                        Interested in knowing when we add more insurance
                        categories?
                    </Title>
                </Col>
            </Row>
        </div>
    );
}
