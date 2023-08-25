import React, { useEffect } from "react";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Space,
    Typography,
} from "antd";
import { useWizard } from "react-use-wizard";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import colors from "../../../../constants/colors";
import dayjs from "dayjs";
import { LossDataPoint } from "../../../../../redux/reducers/types/actuaryTypes";

const { Title, Paragraph } = Typography;

export interface LossType extends LossDataPoint {
    loss_date: string;
}

export default function LossForm() {
    const { previousStep } = useWizard();
    const form = Form.useFormInstance();

    const losses = Form.useWatch("losses", form) || [];
    const reportedOriginalPurchaseDate = form.getFieldValue("purchase_date");

    const hasAtLeastOneLossFilledOut = losses.some(
        (loss: LossType) =>
            loss.loss_date && loss.loss_amount && loss.loss_reason
    );
    const handleSubmit = async () => {
        if (losses.length === 0) {
            return;
        } else {
            await form.submit();
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e: any) => {
            e.preventDefault();
            e.returnValue = "Click go back if you dont want to lose your data";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

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
                        loss_date: "",
                        loss_amount: "",
                        loss_reason: "",
                    },
                ]}
            >
                {(fields, { add, remove }) => (
                    <div>
                        {fields.map((field, idx, allFields) => (
                            <LossRow
                                {...field}
                                key={idx}
                                reportedOriginalPurchaseDate={
                                    reportedOriginalPurchaseDate
                                }
                                {...(idx === allFields.length - 1 &&
                                allFields.length > 1
                                    ? {
                                          remove,
                                      }
                                    : {})}
                            />
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

const LossRow = ({ key, name, reportedOriginalPurchaseDate, remove }: any) => {
    return (
        <div
            style={{
                position: "relative",
            }}
        >
            <Space
                key={key}
                size={"small"}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    flexDirection: "row",
                }}
            >
                <Form.Item
                    name={[name, "loss_date"]}
                    label="Date"
                    rules={[
                        { required: true, message: "When did this happen" },
                    ]}
                >
                    <DatePicker
                        placeholder="2023-04-01"
                        autoFocus
                        disabledDate={(current) =>
                            current &&
                            (current >= dayjs().endOf("day") ||
                                current <
                                    reportedOriginalPurchaseDate.startOf(
                                        "month"
                                    ))
                        }
                    />
                </Form.Item>
                <Form.Item
                    name={[name, "loss_amount"]}
                    label="Amount"
                    rules={[
                        {
                            required: true,
                            message: "How much did it cost?",
                            type: "number",
                            min: 10,
                        },
                    ]}
                >
                    <InputNumber placeholder="Cost" prefix="$" step={10} />
                </Form.Item>
                <Form.Item
                    name={[name, "loss_reason"]}
                    label="Description"
                    rules={[
                        {
                            required: true,
                            message: "Add a short description of what happened",
                        },
                        {
                            pattern: /^.{0,1000}$/s,
                            message:
                                "Descriptions should be less than 1000 characters",
                        },
                    ]}
                >
                    <Input.TextArea
                        placeholder="Water damage"
                        maxLength={1024}
                    />
                </Form.Item>
            </Space>
            {remove ? (
                <div
                    style={{
                        position: "absolute",
                        top: "20%",
                        right: -70,
                        bottom: "20%",
                        display: "flex",
                    }}
                >
                    <style>
                        {`
                        #remove-loss-item__trash-icon {
                            color: ${colors.alert2}
                        }
                        #remove-loss-item__trash-icon:hover {
                            color: ${colors.alert1}
                        `}
                    </style>
                    <div
                        style={{
                            padding: "10px",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            cursor: "pointer",
                            flex: 1,
                        }}
                        onClick={() => remove(name)}
                    >
                        <DeleteOutlined
                            id="remove-loss-item__trash-icon"
                            size={28}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
};
