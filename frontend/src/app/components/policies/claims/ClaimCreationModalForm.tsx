import { Modal } from "antd";
import React from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";

type ClaimCreationModalFormProps = {
    visible: boolean;
    policy: Policy;
    onCreate: (values: any) => void;
    onCancel: () => void;
};

export default function ClaimCreationModalForm({
    visible,
    policy,
    onCreate,
    onCancel,
}: ClaimCreationModalFormProps) {
    const createClaim = () => {
        onCreate([]);
    };

    const handleClose = () => {
        onCancel();
    };

    return (
        <Modal
            title="File Claim"
            visible={visible}
            onOk={createClaim}
            onCancel={handleClose}
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    );
}
