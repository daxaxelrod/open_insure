import { Button, Form, Input, Select, Switch } from "antd";
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

    const riskPending = useAppSelector((state) => state.risk.modifyRiskPending);
    const assetRisk = useAppSelector(
        (state) => state.risk.focusedRisk.content_object
    );

    const requestAQuote = () => {
        form.validateFields()
            .then((values) => {
                updateRisk(values);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <Form
            {...formLayout}
            form={form}
            initialValues={assetRisk}
            onFinish={requestAQuote}
            requiredMark={false}
            labelWrap
        >
            <Form.Item
                label="Make"
                name={"make"}
                rules={[{ required: true, message: "Apple, Samsung, Google" }]}
            >
                <Input placeholder="Apple" />
            </Form.Item>
            <Form.Item
                label="Model"
                name={"model"}
                rules={[
                    { required: true, message: "Iphone 13, Google Pixel 6" },
                ]}
            >
                <Input placeholder="Iphone 13" />
            </Form.Item>

            <Form.Item
                label="Condition"
                name={"condition"}
                rules={[
                    {
                        required: true,
                        message: "Condition of the phone required",
                    },
                ]}
            >
                <Select showArrow>
                    <Select.Option value={"new"}>Brand New</Select.Option>
                    <Select.Option value={"near_perfect"}>
                        Near Perfect
                    </Select.Option>
                    <Select.Option value={"great"}>Great</Select.Option>
                    <Select.Option value={"good"}>Good</Select.Option>
                    <Select.Option value={"ok"}>Ok</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Market Value"
                name={"market_value"}
                rules={[{ required: true, message: "Market Value required" }]}
            >
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
                loading={riskPending}
                disabled={riskPending}
            >
                Get Quote
            </Button>
        </Form>
    );
}
