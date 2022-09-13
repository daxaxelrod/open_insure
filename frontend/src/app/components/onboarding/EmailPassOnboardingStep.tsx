import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";

import { useWizard } from "react-use-wizard";
import { register } from "../../../redux/actions/onboarding";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { isLoggedIn } from "axios-jwt";
import { useNavigate } from "react-router-dom";

export default function EmailPassOnboardingStep({}) {
    const { handleStep, nextStep, isLastStep } = useWizard();
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();

    handleStep(() => {
        // when we have multiple steps, this will just be a patch to the user
        alert("Going to step 2");
    });

    const isRegisterPending = useAppSelector(
        (state) => state.auth.registerPending
    );
    const navigate = useNavigate();

    const createUser = ({ firstName, lastName, email, password }: any) => {
        dispatch(
            register({
                first_name: firstName,
                last_name: lastName,
                email,
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinishFailed={() => {
                console.log("Failed");
            }}
        >
            <Form.Item label="Full Name" style={{ marginBottom: 0 }}>
                <Form.Item
                    name="firstName"
                    rules={[{ required: true }]}
                    style={{
                        display: "inline-block",
                        width: "calc(50% - 8px)",
                    }}
                >
                    <Input placeholder="First name" />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    rules={[{ required: true }]}
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
                label="Email"
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
                label="Password"
                name="password"
                rules={[
                    { required: true, message: "Please input your password!" },
                ]}
            >
                <Input.Password autoComplete="current-password" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isRegisterPending}
                >
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
}
