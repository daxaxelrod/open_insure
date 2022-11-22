import React from "react";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Slider,
    Tooltip,
    Typography,
    Upload,
} from "antd";

import { createClaim } from "../../../../../../redux/actions/claims";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { QuestionCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { Policy, Risk } from "../../../../../../redux/reducers/commonTypes";
import colors from "../../../../../constants/colors";
import ClaimEvidencePhotoUpload from "./ClaimEvidencePhotoUpload";

const { TextArea } = Input;
const { Paragraph, Title } = Typography;

type ClaimCreationFormProps = {
    policy: Policy;
};

export default function ClaimCreationForm({ policy }: ClaimCreationFormProps) {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const claimCreationPending = useAppSelector(
        (state) => state.claims.claimCreationPending
    );
    const policyRisks = useAppSelector(
        (state) => state.risk.policyRisks?.[policy?.id]
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

    const appendEvidenceIdToForm = (evidenceId: number) => {
        const evidenceIds = form.getFieldValue("evidence");
        form.setFieldsValue({
            evidence: [...evidenceIds, evidenceId],
        });
    };

    const handleUpload = (e: any) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={{
                    lossPercentage: 20,
                    evidence: [],
                }}
                title={`Create a claim`}
                onFinish={handleOk}
            >
                <Row>
                    <Col span={16}>
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
                    </Col>
                    <Col span={7} offset={1}>
                        <Form.Item
                            label="Date of loss"
                            name="occurance_date"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter the date of the loss",
                                },
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </Col>
                </Row>

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
                <Form.Item
                    label="Location"
                    name="location_description"
                    rules={[
                        {
                            required: true,
                            message: "",
                        },
                    ]}
                >
                    <Input placeholder="4th & 5th in NYC" />
                </Form.Item>

                <Form.Item name="lossPercentage" required>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Paragraph
                                    style={{
                                        fontSize: 14,
                                        color: colors.gray7,
                                        marginBottom: 0,
                                    }}
                                >
                                    Requested Funds
                                </Paragraph>
                                <Tooltip
                                    color="black"
                                    placement="top"
                                    title={() => (
                                        <div style={{ padding: 10 }}>
                                            Based on how damaged your{" "}
                                            {userRiskForPolicy?.underlying_insured_type ===
                                            "audio_equipment"
                                                ? "headphone"
                                                : "cell phone"}{" "}
                                            is.
                                        </div>
                                    )}
                                >
                                    <QuestionCircleOutlined
                                        style={{
                                            color: colors.gray7,
                                            padding: "3px 10px 10px 3px",
                                            marginLeft: 4,
                                        }}
                                    />
                                </Tooltip>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={8}>
                            <Title level={1}>
                                $
                                {Math.round(
                                    (lossPercentage * marketValue) / 100
                                ).toLocaleString()}
                            </Title>
                        </Col>
                        <Col span={16}>
                            <Slider
                                min={1}
                                max={100}
                                defaultValue={20}
                                tipFormatter={(value) =>
                                    `$${Math.round(
                                        ((value ?? 0) * marketValue) / 100
                                    ).toLocaleString()}`
                                }
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
                </Form.Item>
                <Form.Item label="Upload Evidence">
                    <ClaimEvidencePhotoUpload
                        onUploadSuccess={appendEvidenceIdToForm}
                        onUploadError={() => {}}
                        policy={policy}
                    />
                </Form.Item>
                <Form.Item
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={claimCreationPending}
                    >
                        Create Claim
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
