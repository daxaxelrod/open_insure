import { Button, Col, Form, Input, Modal, Row, Slider } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { createClaim } from "../../../../redux/actions/claims";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { Policy, Risk } from "../../../../redux/reducers/commonTypes";

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

    console.log({ lossPercentage });

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
                <Form.Item
                    label="Requested Funds"
                    name="lossPercentage"
                    required
                >
                    <Row>
                        <Col span={8}>
                            ${marketValue.toLocaleString()} * {lossPercentage}%
                            = $
                            {Math.round(
                                (lossPercentage * marketValue) / 100
                            ).toLocaleString()}
                        </Col>
                        <Col span={16}>
                            <Slider
                                min={1}
                                max={100}
                                onChange={(value) =>
                                    form.setFieldsValue({
                                        lossPercentage: value,
                                    })
                                }
                            />
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
}
