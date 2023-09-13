import React, { useState } from "react";
import { Button, Form, Grid, Input, notification } from "antd";
import { joinMailingList } from "../../../networking/users";

export default function InterestedUserForm() {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [pending, setPending] = useState(false);
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md && (screens.sm || screens.xs);

    const submitForm = async () => {
        try {
            setPending(true);
            let values = await form.validateFields();
            try {
                let result = await joinMailingList(values.email);
                if (result.status === 201) {
                    form.resetFields();
                    setPending(false);
                    api.success({
                        message: "Added!",
                        description: `${values.email} has been added to the waitlist`,
                    });
                }
            } catch (error) {
                api.error({
                    message: "Error",
                    description: "Waitlist is full, check back in a few days",
                });
                setPending(false);
            }
        } catch (error) {
            api.error({
                message: "Error",
                description: "Email is invalid",
            });
            setPending(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                form={form}
                name="horizontal_interest_form"
                layout="inline"
                onFinish={submitForm}
                requiredMark={false}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "Enter a valid email",
                        },
                    ]}
                >
                    <Input
                        style={{ minWidth: 230 }}
                        placeholder="Edward@lloyds.com"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={pending}
                        style={{
                            marginTop: isMobile ? 10 : 0,
                        }}
                    >
                        Join waitlist
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
