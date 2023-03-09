import { Alert, Button, Col, Form, Input, Row, Grid } from "antd";
import { isLoggedIn } from "axios-jwt";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthPending, login } from "../../../redux/actions/onboarding";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

export default function LoginForm() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    const isLoginPending = useAppSelector((state) => state.auth.loginPending);
    const loginError = useAppSelector(
        (state) => state.auth.loginError?.overall
    );
    const dispatch = useAppDispatch();

    const loginUser = ({ email, password }: any) => {
        dispatch(login({ username: email, password }));
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/home");
        }
    }, [isLoginPending]);

    return (
        <Form
            form={form}
            name="onboarding-email-form"
            onFinish={loginUser}
            labelCol={{
                xs: { span: 0 },
                sm: { span: 0 },
                md: { span: 12 },
                lg: { span: 8 },
                xl: { span: 8 },
                xxl: { span: 8 },
            }}
            onFocus={() => dispatch(clearAuthPending())}
            wrapperCol={{
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 12, offset: !screens.lg ? 6 : 0 },
                lg: { span: 16 },
                xl: { span: 16 },
                xxl: { span: 16 },
            }}
            onFinishFailed={() => {
                console.log("Failed");
            }}
            autoComplete="on"
        >
            <Form.Item
                label={isMobile ? null : "Email"}
                name="email"
                rules={[
                    {
                        required: true,
                        type: "email",
                        message: "Please input your email!",
                    },
                ]}
            >
                <Input placeholder="email" type={"email"} />
            </Form.Item>

            <Form.Item
                label={isMobile ? null : "Password"}
                name="password"
                rules={[
                    { required: true, message: "Please input your password!" },
                ]}
            >
                <Input.Password autoComplete="current-password" />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 12, offset: !screens.lg ? 6 : 12 },
                    lg: { span: 0, offset: 8 },
                    xl: { span: 0, offset: 8 },
                    xxl: { span: 0, offset: 8 },
                }}
            >
                <Button
                    block={isMobile ? true : false}
                    type="primary"
                    htmlType="submit"
                    loading={isLoginPending}
                >
                    Login
                </Button>
            </Form.Item>

            {loginError ? (
                <Row style={{ marginBottom: "2rem" }}>
                    <Col xs={{ offset: 0, span: 24 }}>
                        <Alert message={loginError} type="error" />
                    </Col>
                </Row>
            ) : null}
        </Form>
    );
}
