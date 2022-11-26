import React from "react";
import { Col, Row, Typography } from "antd";
import LoginForm from "../components/onboarding/LoginForm";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function Login() {
    return (
        <div style={{ padding: 24 }}>
            <Row>
                <Col span={4}>
                    <Title level={2}>Login</Title>
                </Col>
                <Col span={12}>
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
