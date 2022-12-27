import React, { useEffect } from "react";
import { Alert, Button, Grid, Col, Form, Input, Row } from "antd";

import { useWizard } from "react-use-wizard";
import { clearAuthPending, register } from "../../../redux/actions/onboarding";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { isLoggedIn } from "axios-jwt";
import { useNavigate } from "react-router-dom";

export default function EmailPassOnboardingStep({}) {
    const { handleStep, nextStep, isLastStep } = useWizard();
    const dispatch = useAppDispatch();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const isMediumOrSmaller = !screens.lg;
    const [form] = Form.useForm();

    handleStep(() => {
        // when we have multiple steps, this will just be a patch to the user
        alert("Going to step 2");
    });

    const isRegisterPending = useAppSelector(
        (state) => state.auth.registerPending
    );
    const registerError = useAppSelector(
        (state) => state.auth.registrationError?.overall
    );

    const navigate = useNavigate();

    const createUser = ({ firstName, lastName, email, password }: any) => {
        dispatch(
            register({
                first_name: firstName,
                last_name: lastName,
                email: email.toLowerCase(),
                password,
            })
        );
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/home");
        }
    }, [isRegisterPending]);

    return (
        <Form
            form={form}
            name="onboarding-email-form"
            onFinish={isLastStep ? createUser : nextStep}
            labelCol={{
                xs: { span: 0 },
                sm: { span: 0 },
                md: { span: 4 },
                lg: { span: 8 },
                xl: { span: 8 },
                xxl: { span: 8 },
            }}
            onFocus={() => dispatch(clearAuthPending())}
            wrapperCol={{
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 20 },
                lg: { span: 16 },
                xl: { span: 16 },
                xxl: { span: 16 },
            }}
            onFinishFailed={() => {
                console.log("Failed");
            }}
        >
            <Form.Item
                label={isMobile ? null : "Full Name"}
                style={{ marginBottom: 0 }}
            >
                <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: "First name required" }]}
                    style={{
                        display: "inline-block",
                        width: "calc(50% - 8px)",
                    }}
                >
                    <Input placeholder="First name" />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: "Last name required" }]}
                    style={{
                        display: "inline-block",
                        width: "calc(50% - 8px)",
                        margin: "0 8px",
                    }}
                >
                    <Input placeholder="Last name" />
                </Form.Item>
            </Form.Item>

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
                <Input placeholder="email" />
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
                    offset: isMediumOrSmaller ? 0 : 8,
                    span: isMediumOrSmaller ? 24 : 16,
                }}
            >
                <Button
                    block={isMediumOrSmaller ? true : false}
                    type="primary"
                    htmlType="submit"
                    loading={isRegisterPending}
                >
                    Register
                </Button>
            </Form.Item>
            {registerError ? (
                <Row style={{ marginBottom: "2rem" }}>
                    <Col xs={{ offset: 0, span: 24 }}>
                        <Alert message={registerError} type="error" />
                    </Col>
                </Row>
            ) : null}
        </Form>
    );
}
