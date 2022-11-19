import React, { useState } from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Slider,
    Tooltip,
    Typography,
} from "antd";
import { DownSquareOutlined, UpSquareOutlined } from "@ant-design/icons";
import { createClaim } from "../../../../../../redux/actions/claims";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { Policy, Risk } from "../../../../../../redux/reducers/commonTypes";
import colors from "../../../../../constants/colors";
import { getCostPerType } from "../../utils/cost";

const { TextArea } = Input;
const { Paragraph, Title } = Typography;

type ClaimCreationFormProps = {
    policy: Policy;
};

export default function ClaimCreationForm({ policy }: ClaimCreationFormProps) {
    const dispatch = useAppDispatch();
    const [showHelp, setShowHelp] = useState(false);
    const [selectedDamageView, setSelectedDamageView] = useState<string>();
    const [form] = Form.useForm();

    const claimCreationPending = useAppSelector(
        (state) => state.claims.claimCreationPending
    );
    const policyRisks = useAppSelector(
        (state) => state.risk.policyRisks?.[policy.id]
    );
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    const userRiskForPolicy: Risk = policyRisks?.find((risk: Risk) => {
        return risk.user === currentUser?.id;
    });

    const marketValue: number = userRiskForPolicy
        ? Number(userRiskForPolicy?.content_object?.market_value)
        : 0;

    const lossPercentage: number = Form.useWatch("lossPercentage", form);

    const handleOk = () => {
        form.validateFields().then((values) => {
            dispatch(
                createClaim(policy?.id, {
                    ...values,
                    amount: lossPercentage * marketValue,
                    policy: policy?.id,
                })
            );
        });
    };

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={{
                    lossPercentage: 20,
                }}
                title={`Create a claim`}
                onFinish={handleOk}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: "Title required",
                        },
                    ]}
                >
                    <Input placeholder="Cracked phone screen" />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: "Description required",
                        },
                    ]}
                >
                    <TextArea
                        showCount
                        minLength={120}
                        style={{ height: 120 }}
                        placeholder="Give a detailed description as to what happened"
                    />
                </Form.Item>
                <Form.Item name="lossPercentage" required>
                    <Row>
                        <Col span={24}>
                            <Paragraph
                                style={{
                                    fontSize: 14,
                                    color: colors.gray7,
                                    marginBottom: 0,
                                }}
                            >
                                Requested Funds
                            </Paragraph>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={8}>
                            <Title level={2}>
                                $
                                {Math.round(
                                    (lossPercentage * marketValue) / 100
                                ).toLocaleString()}
                            </Title>
                            <Paragraph
                                style={{
                                    fontSize: 14,
                                    color: colors.gray7,
                                    marginBottom: 0,
                                }}
                            >
                                <Tooltip
                                    color="black"
                                    title={`Your ${
                                        userRiskForPolicy?.underlying_insured_type ===
                                        "audio_equipment"
                                            ? "headphone"
                                            : "cell phone"
                                    }'s market value`}
                                >
                                    ${marketValue.toLocaleString()}
                                </Tooltip>{" "}
                                * {lossPercentage}%
                            </Paragraph>
                        </Col>
                        <Col span={16}>
                            <Slider
                                min={1}
                                max={100}
                                defaultValue={20}
                                tipFormatter={(value) => `${value}%`}
                                onChange={(value) =>
                                    form.setFieldsValue({
                                        lossPercentage: value,
                                    })
                                }
                                marks={{
                                    10: "Minor Damage",
                                    100: {
                                        style: {
                                            // color: "#f50",
                                        },
                                        label: <strong>Total Loss</strong>,
                                    },
                                }}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row
                        justify="space-between"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowHelp(!showHelp)}
                    >
                        <Title level={5}>Need Help?</Title>
                        <div
                            style={{
                                cursor: "pointer",
                                padding: "2px 10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                            }}
                        >
                            {!showHelp ? (
                                <DownSquareOutlined />
                            ) : (
                                <UpSquareOutlined />
                            )}
                        </div>
                    </Row>
                    {showHelp && (
                        <div>
                            <Row>
                                <Paragraph
                                    style={{
                                        color: colors.gray7,
                                    }}
                                >
                                    For reference, here's what it costs to
                                    repair various phone damages. Results may
                                    vary, google is your friend.
                                </Paragraph>
                            </Row>
                            <Row
                                justify="space-between"
                                style={{ marginTop: 10 }}
                            >
                                <Paragraph>Prices</Paragraph>
                                <Select
                                    defaultValue="iphone11"
                                    style={{ width: 120 }}
                                    onChange={(val) => {
                                        setSelectedDamageView(val);
                                    }}
                                    options={[
                                        {
                                            value: "iphone11",
                                            label: "Iphone 11",
                                        },
                                        {
                                            value: "iphone14",
                                            label: "Iphone 14",
                                        },
                                        {
                                            value: "airpodsMax",
                                            label: "Airpods Max",
                                        },
                                    ]}
                                />
                            </Row>
                            <table
                                style={{
                                    width: "70%",
                                }}
                            >
                                <tr>
                                    <th style={{ textAlign: "left" }}>
                                        Repair
                                    </th>
                                    <th style={{ textAlign: "left" }}>Cost</th>
                                </tr>
                                <tr>
                                    <td>Battery</td>
                                    <td>
                                        $
                                        {getCostPerType(
                                            "battery",
                                            selectedDamageView
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Screen Replacement</td>
                                    <td>
                                        $
                                        {getCostPerType(
                                            "screen",
                                            selectedDamageView
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Charging Port fix</td>
                                    <td>
                                        $
                                        {getCostPerType(
                                            "chargingPort",
                                            selectedDamageView
                                        )}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
}
