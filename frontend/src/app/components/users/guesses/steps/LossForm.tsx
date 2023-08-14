import React from "react";
import { Button, Form, Input, Row, Space } from "antd";
import { useWizard } from "react-use-wizard";

export default function LossForm({ submitForm }: { submitForm: () => void }) {
    const { previousStep } = useWizard();
    const form = Form.useFormInstance();

    return (
        <div>
            <h1>Losses</h1>

            <Form.List
                name="losses"
                initialValue={[
                    {
                        date: "",
                        cost: "",
                        description: "",
                    },
                ]}
            >
                {(fields, { add, remove }) => (
                    <div>
                        {fields.map((field) => (
                            <LossRow {...field} />
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                // icon={<PlusOutlined />}
                            >
                                Add another event
                            </Button>
                        </Form.Item>
                    </div>
                )}
            </Form.List>
            <Row
                style={{
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={previousStep} type={"default"}>
                    Back
                </Button>
                <Button onClick={submitForm} type={"default"}>
                    Next
                </Button>
            </Row>
        </div>
    );
}

const LossRow = ({ key, name }: any) => {
    return (
        <Space
            key={key}
            size={"middle"}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
            }}
        >
            <Form.Item name={[name, "date"]}>
                <Input placeholder="Date of loss" />
            </Form.Item>
            <Form.Item name={[name, "cost"]}>
                <Input placeholder="Cost" />
            </Form.Item>
            <Form.Item name={[name, "description"]}>
                <Input placeholder="Water damage" />
            </Form.Item>
        </Space>
    );
};
