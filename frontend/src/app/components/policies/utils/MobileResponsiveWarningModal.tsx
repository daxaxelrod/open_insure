import React from "react";
import { Modal, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

export default function MobileResponsiveWarningModal({
    visible,
    setVisible,
}: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}) {
    const handleOk = () => {
        setVisible(false);
    };

    return (
        <Modal
            title={<Title>🚨 Notice</Title>}
            open={visible}
            onCancel={handleOk}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleOk}
                    size="large"
                >
                    Got it!
                </Button>,
            ]}
        >
            <Paragraph style={{ fontSize: "1.2rem" }}>
                We recommend viewing this page on a laptop or desktop as it has
                not been optimized for mobile yet.
            </Paragraph>
        </Modal>
    );
}
