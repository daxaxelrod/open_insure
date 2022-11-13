import React, { useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Slider,
    Tooltip,
    Typography,
} from "antd";
import { DownSquareOutlined, UpSquareOutlined } from "@ant-design/icons";
import { createClaim } from "../../../../redux/actions/claims";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";
import colors from "../../../constants/colors";

const { Paragraph, Title } = Typography;

type ClaimCreationModalFormProps = {
    policy: Policy;
    visible: boolean;
    close: () => void;
};

export default function ClaimCreationModalForm({
    policy,
    visible,
    close,
}: ClaimCreationModalFormProps) {
    const dispatch = useAppDispatch();
    const [showHelp, setShowHelp] = useState(false);
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
            dispatch(createClaim(policy?.id, values));
            close();
        });
    };

    const handleCancel = () => {
        close();
    };

    return (
        <Modal
            visible={visible}
            title={`${policy?.name}'s Escrow Address`}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Close
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={claimCreationPending}
                    onClick={handleOk}
                >
                    Submit
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={{
                    lossPercentage: 20,
                }}
            >
                <Form.Item label="Title" name="title" required>
                    <Input placeholder="Cracked phone screen" />
                </Form.Item>
                <Form.Item label="Description" name="description" required>
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
                    <Row justify="space-between">
                        <Title level={4}>Need Help?</Title>
                        <div
                            onClick={() => setShowHelp(!showHelp)}
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
                                For reference, heres what it costs to repair
                                various phone damages. Results may vary, google
                                is your friend.
                            </Row>
                        </div>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
}
