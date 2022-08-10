import { Button, Form, Input, Switch } from "antd";
import React from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import { Policy } from "../../../../../redux/reducers/commonTypes";

export default function PhoneRiskForm({
    policy,
    updateRisk,
    formLayout,
}: {
    policy: Policy;
    updateRisk: (values: any) => void;
    formLayout: any;
}) {
    const [form] = Form.useForm();
    const requestQuotePending = useAppSelector(
        (state) => state.risk.requestQuotePending
    );

    const onFormChange = (changedValues: any) => {
        console.log("onFormChange", changedValues);
        // updateRisk(changedValues);
    };

    const requestAQuote = () => {
        console.log("requestAQuote");
    };

    return (
        <div>
            <Form
                {...formLayout}
                form={form}
                onValuesChange={onFormChange}
                onFinish={requestAQuote}
                labelWrap
            >
                <Form.Item label="Make" name={"make"}>
                    <Input />
                </Form.Item>
                <Form.Item label="Model" name={"model"}>
                    <Input />
                </Form.Item>

                <Form.Item label="Condition" name={"condition"}>
                    <Input />
                </Form.Item>
                <Form.Item label="Market Value" name={"market_value"}>
                    <Input type={"number"} />
                </Form.Item>
                <Form.Item
                    label="Has case"
                    name={"has_case"}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                <Form.Item
                    label="Screen protector"
                    name={"has_screen_protector"}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={requestQuotePending}
                >
                    Get Quote
                </Button>
            </Form>
        </div>
    );
}
