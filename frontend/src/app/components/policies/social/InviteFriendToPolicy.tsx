import React, { KeyboardEvent, useState } from "react";
import { Policy } from "../../../../redux/reducers/commonTypes";
import { Button, Input, Modal, notification, Typography } from "antd";
import { inviteUserToPod } from "../../../../networking/pods";
const { Paragraph } = Typography;

export default function InviteFriendToPolicy({ policy }: { policy: Policy }) {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [sendAtLeastOnce, setSendAtLeastOnce] = useState(false);
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
                setSendAtLeastOnce(true);
            } catch (error: any) {
                setPending(false);
                notification.error({
                    message: "Error",
                    description: error?.message,
                });
            }
        }
    };

    const handleCancel = () => {
        setSendAtLeastOnce(false);
        setVisible(false);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleOk();
        }
    };

    return (
        <div>
            <Modal
                title="Invite a friend to join this policy"
                okText="Send"
                cancelText={sendAtLeastOnce ? "Close" : "Cancel"}
                visible={visible}
                onOk={handleOk}
                confirmLoading={pending}
                onCancel={handleCancel}
            >
                <Input
                    placeholder="Email"
                    type={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={onKeyDown}
                />
            </Modal>

            <Button type="primary" onClick={openModal}>
                <Paragraph style={{ color: "white" }}>
                    Invite a friend
                </Paragraph>
            </Button>
        </div>
    );
}
