import { Button, Form, Input, Row, Select, Space, Switch } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../../redux/hooks";
import { Policy } from "../../../../../redux/reducers/commonTypes";
import PropertyImageForm from "./PropertyImageForm";

export default function PhoneRiskForm({
    editable,
    policy,
    updateRisk,
    formLayout,
    closeDrawer,
}: {
    editable: boolean;
    policy: Policy;
    updateRisk: (values: any) => void;
    formLayout: any;
    closeDrawer: () => void;
}) {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const riskPending = useAppSelector((state) => state.risk.modifyRiskPending);
    const risk = useAppSelector((state) => state.risk.focusedRisk);
    const assetRisk = risk.content_object;

    const saveForLater = () => {
        if (form.isFieldsTouched()) {
            form.validateFields()
                .then((values) => {
                    updateRisk(values);
                    closeDrawer();
                })
                .catch((info) => {
                    console.log("Validate Failed:", info);
                });
        } else {
            closeDrawer();
        }
    };

    const requestAQuote = () => {
        form.validateFields()
            .then((values) => {
                updateRisk(values);
                navigate(`/policy/${risk.policy}`);
                closeDrawer();
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
            disabled={!editable}
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
            <PropertyImageForm
                risk={risk}
                policy={policy}
                editable={editable}
            />
            {editable && (
                <Row style={{ marginTop: 10 }}>
                    <Space size={"middle"}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={riskPending}
                            disabled={riskPending}
                        >
                            Find your premium
                        </Button>
                        <Button
                            type="link"
                            // declare const ButtonTypes: ["default", "primary", "ghost", "dashed", "link", "text"];

                            htmlType="button"
                            loading={riskPending}
                            disabled={false}
                            onClick={saveForLater}
                        >
                            Save for later
                        </Button>
                    </Space>
                </Row>
            )}
        </Form>
    );
}
