import React from "react";
import { Button, DatePicker, Form, Input, Row, Space } from "antd";
import { useWizard } from "react-use-wizard";

export default function LossForm({ submitForm }: { submitForm: () => void }) {
    const { previousStep } = useWizard();
    const form = Form.useFormInstance();

    return (
        <div>
            <h1>Damage or full losses</h1>

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
                alignItems: "stretch",
                flexDirection: "row",
            }}
        >
            <Form.Item name={[name, "date"]} label="Date">
                <DatePicker placeholder="2023-04-01" />
            </Form.Item>
            <Form.Item name={[name, "cost"]} label="Amount">
                <Input placeholder="Cost" prefix="$" />
            </Form.Item>
            <Form.Item name={[name, "description"]} label="Description">
                <Input.TextArea placeholder="Water damage" />
            </Form.Item>
        </Space>
    );
};
