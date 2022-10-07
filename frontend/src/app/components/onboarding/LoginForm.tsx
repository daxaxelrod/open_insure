import { Button, Form, Input } from "antd";
import { getAccessToken, isLoggedIn } from "axios-jwt";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../redux/actions/onboarding";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

export default function LoginForm() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const isLoginPending = useAppSelector((state) => state.auth.loginPending);
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinishFailed={() => {
                console.log("Failed");
            }}
            autoComplete="on"
        >
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
                <Input placeholder="email" type={"email"} />
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
                    loading={isLoginPending}
                >
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
}
