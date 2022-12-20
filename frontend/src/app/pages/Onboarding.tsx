import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Typography, Grid } from "antd";

import { Wizard } from "react-use-wizard";
import EmailPassOnboardingStep from "../components/onboarding/EmailPassOnboardingStep";

const { Title, Paragraph } = Typography;

export default function Onboarding() {
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    return (
        <div style={{ padding: 24 }}>
            <Row>
                <Col
                    lg={{ span: 6 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                >
                    <Title
                        level={2}
                        style={{ textAlign: isMobile ? "center" : "start" }}
                    >
                        Register
                    </Title>
                </Col>
                <Col
                    lg={{ span: 10 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                >
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
