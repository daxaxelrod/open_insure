import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { createClaim } from "../../../../redux/actions/claims";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { Policy } from "../../../../redux/reducers/commonTypes";

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
    const claimCreationPending = useAppSelector(
        (state) => state.claims.claimCreationPending
    );
    const [form] = Form.useForm();

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
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item label="Title" name="title" required>
                    <Input placeholder="Cracked phone screen" />
                </Form.Item>
                <Form.Item label="Description" name="description" required>
                    <Input placeholder="Give a detailed description as to what happened" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
