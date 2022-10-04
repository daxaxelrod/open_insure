import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Modal,
    Row,
    Typography,
    Slider,
    Input,
    Spin,
} from "antd";
import {
    SettingOutlined,
    FrownOutlined,
    SmileOutlined,
} from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import colors from "../../../../constants/colors";
import { getPolicyRiskSettings } from "../../../../../redux/actions/policies";
import {
    Policy,
    RiskSettings,
} from "../../../../../redux/reducers/commonTypes";

const { Paragraph } = Typography;

const min = 1;
const max = 100;

export default function PolicySettingsModal({ policy }: { policy: Policy }) {
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();
    const getRiskSettingsPending = useAppSelector(
        (state) => state.risk.getPolicyRiskSettingsPending
    );
    const riskSettings: RiskSettings = useAppSelector(
        (state) => state.risk.policyRiskSettings?.[policy.id]
    );
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            dispatch(getPolicyRiskSettings(policy?.id));
        }
    }, [visible, policy?.id]);

    const handleOk = () => {
        setVisible(false);
    };
    const handleCancel = () => {
        setVisible(false);
    };

    // audio_equipment_peril_rate: 20;
    // cell_phone_case_discount: 100;
    // cell_phone_peril_rate: 15;
    // cell_phone_screen_protector_discount: 100;

    const policyHasCellPhoneEnabled =
        policy.available_underlying_insured_types.includes("cell_phone");
    const policyHasAudioEquipmentEnabled =
        policy.available_underlying_insured_types.includes("audio_equipment");

    return (
        <Row justify="end" align="middle">
            <Modal
                title="Policy Premiums Settings"
                okText="Update"
                cancelText={"Close"}
                visible={visible}
                onOk={handleOk}
                confirmLoading={false}
                onCancel={handleCancel}
            >
                <Spin spinning={getRiskSettingsPending}>
                    <Form form={form}>
                        <Form.Item label="Conservative Level">
                            <Input
                                defaultValue={riskSettings.conservative_factor}
                            />
                        </Form.Item>
                        {policyHasCellPhoneEnabled && (
                            <>
                                <Form.Item label="Cell Phone Loss Rate">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Cell Phone Screen Protector Discount">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Cell Phone Case Discount">
                                    <Input />
                                </Form.Item>
                            </>
                        )}
                        {policyHasAudioEquipmentEnabled && (
                            <Form.Item label="Cell Phone Peril Rate">
                                <Input />
                            </Form.Item>
                        )}
                    </Form>
                </Spin>
            </Modal>

            <Button type="dashed" onClick={() => setVisible(true)}>
                <Paragraph style={{ color: colors.gray8 }}>
                    <SettingOutlined /> Settings
                </Paragraph>
            </Button>
        </Row>
    );
}
