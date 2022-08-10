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

    const onFormChange = (changedValues: any) => {
        updateRisk(changedValues); // this might be too fancy
    };

    const requestAQuote = (changedValues: any) => {
        updateRisk(changedValues);
        // maybe pass a bool to tell it to also run the risk analysis and create a quote?
        // or should we just do that every time the risk is updated?
        // later is better UX
    };

    const areFieldsEmpty = () => {
        return false;
    };

    return (
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
                loading={riskPending}
                disabled={riskPending || areFieldsEmpty()}
            >
                Get Quote
            </Button>
        </Form>
    );
}
