import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Typography } from "antd";

import { Wizard } from "react-use-wizard";
import EmailPassOnboardingStep from "../components/onboarding/EmailPassOnboardingStep";

const { Title, Paragraph } = Typography;

export default function Onboarding() {
    return (
        <div style={{ padding: 24 }}>
            <Row>
                <Col span={4}>
                    <Title level={2}>Register</Title>
                </Col>
                <Col span={12}>
                    <Wizard>
                        <EmailPassOnboardingStep />
                    </Wizard>
                </Col>
            </Row>
            <Paragraph>
                Already have an account? <Link to={"/login"}>Log in</Link>
            </Paragraph>
        </div>
    );
}
