import React, { useState } from "react";
import { Button, Form, Modal, Row, Typography, Slider } from "antd";
import {
    SettingOutlined,
    FrownOutlined,
    SmileOutlined,
} from "@ant-design/icons";

import { useAppDispatch } from "../../../../../redux/hooks";
import colors from "../../../../constants/colors";

const { Paragraph } = Typography;

const min = 1;
const max = 100;

export default function PolicySettingsModal() {
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            dispatch(getPolicyRiskSettings());
        }
    }, [visible]);

    const handleOk = () => {
        setVisible(false);
    };
    const handleCancel = () => {
        setVisible(false);
    };

    const mid = Number(((max - min) / 2).toFixed(5));
    const preColorCls = value >= mid ? "" : "icon-wrapper-active";
    const nextColorCls = value >= mid ? "icon-wrapper-active" : "";

    return (
        <Row justify="end" align="middle">
            <Modal
                title="Policy Settings"
                okText="Update"
                cancelText={"Close"}
                visible={visible}
                onOk={handleOk}
                confirmLoading={false}
                onCancel={handleCancel}
            >
                <Form form={form}>
                    <Form.Item label="Policy Name"></Form.Item>
                </Form>
                Some gears for changing the policy settings
            </Modal>

            <Button type="dashed" onClick={() => setVisible(true)}>
                <Paragraph style={{ color: colors.gray8 }}>
                    <SettingOutlined /> Settings
                </Paragraph>
            </Button>
        </Row>
    );
}
