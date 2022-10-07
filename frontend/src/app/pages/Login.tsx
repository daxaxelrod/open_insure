import { Col, Row } from "antd";
import React from "react";
import LoginForm from "../components/onboarding/LoginForm";

export default function Login() {
    return (
        <div>
            <Row>
                <Col span={8}>
                    <div>Login</div>
                </Col>
                <Col span={12}>
                    <LoginForm />
                </Col>
            </Row>
        </div>
    );
}
