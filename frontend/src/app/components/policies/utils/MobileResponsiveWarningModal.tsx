import React, { useEffect, useState } from "react";
import { Modal, Typography, Button } from "antd";
import useWindowSize from "../../hooks/useWindowSize";

const { Title, Paragraph } = Typography;

export default function MobileResponsiveWarningModal() {
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
    let size = useWindowSize();
    const [isMobileWarningModalVisible, setisMobileWarningModalVisible] =
        useState(false);

    useEffect(() => {
        if (
            size.width !== undefined &&
            size.width < 768 &&
            !isMobileWarningModalVisible &&
            !hasBeenDismissed
        ) {
            setisMobileWarningModalVisible(true);
        }
    }, [size, setisMobileWarningModalVisible]);

    const handleOk = () => {
        setisMobileWarningModalVisible(false);
        setHasBeenDismissed(true);
    };

    return (
        <Modal
            title={<Title>🚨 Notice</Title>}
            open={isMobileWarningModalVisible}
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
