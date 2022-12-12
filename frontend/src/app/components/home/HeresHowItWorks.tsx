import React from "react";
import { Col, Row } from "antd";

export default function HeresHowItWorks() {
    return (
        <div
            style={{
                backgroundColor: "#f8fafe",
            }}
        >
            <Row>
                <Col md={{ span: 12, offset: 4 }} lg={{ span: 8, offset: 4 }}>
                    <h2>Here's how it works</h2>
                </Col>
            </Row>
        </div>
    );
}
