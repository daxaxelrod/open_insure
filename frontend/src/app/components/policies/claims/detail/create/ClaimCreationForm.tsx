import React from "react";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Row,
    Slider,
    Tooltip,
    Typography,
    Upload,
} from "antd";

import { createClaim } from "../../../../../../redux/actions/claims";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Policy, Risk } from "../../../../../../redux/reducers/commonTypes";
import colors from "../../../../../constants/colors";
import ClaimEvidencePhotoUpload from "./ClaimEvidencePhotoUpload";
import moment from "moment-timezone";

const { TextArea } = Input;
const { Paragraph, Title } = Typography;

type ClaimCreationFormProps = {
    policy: Policy;
};

export default function ClaimCreationForm({ policy }: ClaimCreationFormProps) {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [alertCounter, setAlertCounter] = React.useState(0);

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
            if (values?.evidence?.length > 0) {
                dispatch(
                    createClaim(policy?.id, {
                        ...values,
                        amount: lossPercentage * marketValue,
                        policy: policy?.id,
                        occurance_date: moment(values.occurance_date).format(
                            "YYYY-MM-DD"
                        ),
                    })
                );
                setAlertCounter(0);
            } else {
                let baseMessage = "At least one photo is required";
                messageApi.error(
                    alertCounter > 5
                        ? "UPLOAD A PHOTO YOU MORON"
                        : alertCounter > 2
                        ? baseMessage.toLocaleUpperCase() + "!"
                        : baseMessage
                );
                setAlertCounter(alertCounter + 1);
            }
        });
    };

    const appendEvidenceIdToForm = (evidenceId: number) => {
        const evidenceIds = form.getFieldValue("evidence");
        form.setFieldsValue({
            evidence: [...evidenceIds, evidenceId],
        });
    };

    const removeEvidenceIdFromForm = (evidenceId: number) => {
        const evidenceIds = form.getFieldValue("evidence");
        form.setFieldsValue({
            evidence: evidenceIds.filter((id: number) => id !== evidenceId),
        });
    };

    // const appendEvidenceIdToForm = (evidenceId: number) => {
    //     setEvidenceIds([...evidenceIds, evidenceId]);
    // };

    // const removeEvidenceIdFromForm = (evidenceId: number) => {
    //     setEvidenceIds(evidenceIds.filter((id: number) => id !== evidenceId));
    // };

    return (
        <div>
            {contextHolder}
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
                            <DatePicker
                                disabledDate={(current) =>
                                    current.isAfter(moment().toDate())
                                }
                                format="YYYY-MM-DD"
                            />
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
                        <Form.Item name="lossPercentage" required>
                            <Slider
                                min={1}
                                max={100}
                                tooltip={{
                                    formatter: (value) =>
                                        `$${Math.round(
                                            ((value ?? 0) * marketValue) / 100
                                        ).toLocaleString()}`,
                                }}
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
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label={
                        <div>
                            Upload Evidence{" "}
                            <Tooltip
                                color="black"
                                placement="top"
                                title={() => (
                                    <div style={{ padding: 10 }}>
                                        Upload photos (videos coming soon) of
                                        the damage. Minimum of{" "}
                                        <strong
                                            style={{ color: colors.alert1 }}
                                        >
                                            1 photo
                                        </strong>{" "}
                                        required.
                                    </div>
                                )}
                            >
                                <QuestionCircleOutlined
                                    style={{
                                        color: colors.gray7,
                                        padding: "0 10px 10px 0",
                                        marginLeft: 4,
                                    }}
                                />
                            </Tooltip>
                        </div>
                    }
                    name={"evidence"}
                >
                    <ClaimEvidencePhotoUpload
                        onUploadSuccess={appendEvidenceIdToForm}
                        removeEvidence={removeEvidenceIdFromForm}
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
