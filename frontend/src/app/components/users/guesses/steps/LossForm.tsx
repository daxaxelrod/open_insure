import React from "react";
import { Button, DatePicker, Form, Input, Row, Space, Typography } from "antd";
import { useWizard } from "react-use-wizard";
import { PlusOutlined } from "@ant-design/icons";
import colors from "../../../../constants/colors";

const { Title, Paragraph } = Typography;

type LossType = {
    date: string;
    cost: string;
    description?: string;
};

export default function LossForm() {
    const { previousStep } = useWizard();
    const form = Form.useFormInstance();

    const losses = Form.useWatch("losses", form);
    const hasAtLeastOneLossFilledOut = losses.some(
        (loss: LossType) => loss.date && loss.cost
    );
    const handleSubmit = async () => {
        if (losses.length === 0) {
            return;
        } else {
            await form.submit();
        }
    };

    return (
        <div>
            <Title level={5}>Damage or full losses</Title>
            <Paragraph
                style={{
                    color: colors.gray8,
                    marginBottom: "2rem",
                }}
            >
                This is so everyone can get a better idea of how often this item
                needs service or replacement.
            </Paragraph>

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
                        {fields.map((field, idx) => (
                            <LossRow {...field} key={idx} />
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
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
                <Button
                    onClick={handleSubmit}
                    type={"default"}
                    disabled={!hasAtLeastOneLossFilledOut}
                >
                    Submit
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
            <Form.Item
                name={[name, "date"]}
                label="Date"
                rules={[{ required: true, message: "When did this happen" }]}
            >
                <DatePicker placeholder="2023-04-01" autoFocus />
            </Form.Item>
            <Form.Item
                name={[name, "cost"]}
                label="Amount"
                rules={[{ required: true, message: "How much did it cost?" }]}
            >
                <Input placeholder="Cost" prefix="$" />
            </Form.Item>
            <Form.Item name={[name, "description"]} label="Description">
                <Input.TextArea placeholder="Water damage" />
            </Form.Item>
        </Space>
    );
};
