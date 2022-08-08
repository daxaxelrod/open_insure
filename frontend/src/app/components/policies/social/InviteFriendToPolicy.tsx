import React, { useState } from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { Button, Input, Modal, notification, Typography } from "antd";
import { inviteUserToPod } from "../../../../networking/pods";
const { Paragraph } = Typography;

export default function InviteFriendToPolicy({ policy }: { policy: Policy }) {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [pending, setPending] = useState(false);

    let podId = policy.pod.id;

    const openModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        // no need for redux here
        if (email !== "") {
            setPending(true);
            try {
                await inviteUserToPod(podId, { email });
                setPending(false);
                setEmail("");
                notification.success({
                    message: "Invitation sent",
                });
            } catch (error: any) {
                setPending(false);
                notification.error({
                    message: "Error",
                    description: error?.message,
                });
            }
        }
    };

    return (
        <div>
            <Modal
                title="Invite a friend to join this policy"
                okText="Send"
                visible={visible}
                onOk={handleOk}
                confirmLoading={pending}
                onCancel={() => setVisible(false)}
            >
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Modal>

            <Button type="primary" onClick={openModal}>
                <Paragraph>Invite a friend</Paragraph>
            </Button>
        </div>
    );
}
