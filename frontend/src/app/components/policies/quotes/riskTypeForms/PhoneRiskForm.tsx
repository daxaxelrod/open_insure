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
    const requestQuotePending = useAppSelector(
        (state) => state.risk.requestQuotePending
    );

    const onFormChange = (changedValues: any) => {
        updateRisk(changedValues);
    };

    const requestAQuote = () => {
        console.log("requestAQuote");
    };

    const areFieldsEmpty = () => {
        return false;
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
                    <Input placeholder="Apple" />
                </Form.Item>
                <Form.Item label="Model" name={"model"}>
                    <Input placeholder="Iphone 13" />
                </Form.Item>

                <Form.Item label="Condition" name={"condition"}>
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
                    disabled={requestQuotePending || areFieldsEmpty()}
                >
                    Get Quote
                </Button>
            </Form>
        </div>
    );
}
