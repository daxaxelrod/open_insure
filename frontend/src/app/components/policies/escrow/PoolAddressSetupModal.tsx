import React, { useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Typography,
} from "antd";
import { patchPolicy } from "../../../../redux/actions/policies";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { Policy } from "../../../../redux/reducers/commonTypes";
import colors from "../../../constants/colors";

const { Paragraph } = Typography;

export default function PoolAddressSetupModal({
    visible,
    close,
    policy,
}: {
    visible: boolean;
    close: () => void;
    policy: Policy;
}) {
    const patchPolicyPending = useAppSelector(
        (state) => state.policies.patchPolicyPending
    );
    const [acceptedTerms, setAcceptedTerms] = useState(!!policy?.pool_address);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then((values) => {
            dispatch(
                patchPolicy(policy?.id, {
                    pool_address: values.poolAddress,
                })
            );
            close();
        });
    };

    const handleCancel = () => {
        close();
    };

    return (
        <Modal
            visible={visible}
            title="Edit Escrow Pool Address"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Close
                </Button>,
                <Button
                    disabled={!acceptedTerms}
                    key="submit"
                    type="primary"
                    loading={patchPolicyPending}
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
                disabled={!acceptedTerms}
            >
                <Form.Item label="Funds Location" name="poolAddress" required>
                    <Input placeholder="Your venmo username or your bitcoin wallet address" />
                </Form.Item>
            </Form>
            <Row>
                <Col
                    span={4}
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <Checkbox
                        onChange={(e) => {
                            setAcceptedTerms(e.target.checked);
                        }}
                    />
                    <span style={{ color: colors.gray8 }}>I agree</span>
                </Col>
                <Col span={19}>
                    <Paragraph>
                        You are the escrow agent for {policy?.name}. It's a big
                        responsibilty. Policy members will send YOU their
                        premiums, its your job to safegaurd the funds. If the
                        group votes to do something, whether it's pay a claim or
                        close out the policy, you're responsible for returning
                        the money. You also acknowledge that you are doing this
                        for free, you will not take a cut of anyone's premiums.
                    </Paragraph>
                </Col>
            </Row>
        </Modal>
    );
}
