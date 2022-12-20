import React from "react";
import { Col, Row, Typography, Grid } from "antd";
import LoginForm from "../components/onboarding/LoginForm";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function Login() {
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
                        Login
                    </Title>
                </Col>
                <Col
                    lg={{ span: 10 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                >
                    <LoginForm />
                </Col>
            </Row>
            <Row>
                <span>Need an Account?&nbsp;</span>
                <Link to={"/join"}>
                    <span>Register</span>
                </Link>
            </Row>
        </div>
    );
}
