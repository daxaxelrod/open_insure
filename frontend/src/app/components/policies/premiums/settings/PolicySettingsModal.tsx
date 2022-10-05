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
    Table,
    Popconfirm,
    InputNumber,
    Col,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";

import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import colors from "../../../../constants/colors";
import { getPolicyRiskSettings } from "../../../../../redux/actions/policies";
import {
    Risk,
    Policy,
    RiskSettings,
} from "../../../../../redux/reducers/commonTypes";

const { Paragraph } = Typography;

export default function PolicySettingsModal({ policy }: { policy: Policy }) {
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();
    const getRiskSettingsPending = useAppSelector(
        (state) => state.risk.getPolicyRiskSettingsPending
    );
    const riskSettings: RiskSettings = useAppSelector(
        (state) => state.risk.policyRiskSettings?.[policy.id]
    );
    const patchPolicyRiskSettingsPending = useAppSelector(
        (state) => state.risk.patchPolicyRiskSettingsPending
    );
    const policyRisks: Risk[] = useAppSelector(
        (state) => state.risk.policyRisks?.[policy.id]
    );
    const pricedRisks = policyRisks?.filter(
        (r: Risk) => r.premium_amount !== null
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

    const columns = [
        {
            title: "Name",
            render: (text: string, record: Risk) => {
                const user = policy.pod.members.find(
                    (member) => member.id === record.user
                );
                if (user) {
                    const userName = user?.first_name + " " + user?.last_name;
                    return userName;
                }
            },
            key: "name",
        },
        {
            title: "Premium",
            dataIndex: "premium_amount",
            render: (text: string) => `$${parseInt(text) / 100}`,
            key: "premium_amount",
        },
    ];

    return (
        <Row justify="end" align="middle">
            <Modal
                title="Policy Premiums Settings"
                okText="Update"
                cancelText={"Close"}
                visible={visible}
                onOk={handleOk}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Popconfirm
                        title="This will update the premiums for all members of this policy. Are you sure? All members will be emailed about the change."
                        onConfirm={handleOk}
                        onCancel={() => {}}
                        okButtonProps={{
                            loading: patchPolicyRiskSettingsPending,
                        }}
                        okText="Yes, update"
                        cancelText="No"
                    >
                        <Button key="submit">Submit</Button>
                    </Popconfirm>,
                ]}
                confirmLoading={false}
                onCancel={handleCancel}
            >
                <Spin spinning={getRiskSettingsPending}>
                    <Form form={form}>
                        <Form.Item
                            label="Conservative Level"
                            name={"conservative_value"}
                        >
                            <Input
                                defaultValue={riskSettings?.conservative_factor}
                            />
                            <Row>
                                <Col span={12}>
                                    <Slider
                                        min={1}
                                        max={100}
                                        value={form.getFieldValue(
                                            "conservative_value"
                                        )}
                                        defaultValue={
                                            riskSettings?.conservative_factor
                                        }
                                    />
                                </Col>
                                <Col span={4}>
                                    <InputNumber
                                        min={1}
                                        max={20}
                                        style={{ margin: "0 16px" }}
                                        value={form.getFieldValue(
                                            "conservative_value"
                                        )}
                                    />
                                </Col>
                            </Row>
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

                <Table
                    dataSource={pricedRisks}
                    columns={columns}
                    pagination={{ hideOnSinglePage: true }}
                />
            </Modal>

            <Button type="dashed" onClick={() => setVisible(true)}>
                <Paragraph style={{ color: colors.gray8 }}>
                    <SettingOutlined /> Settings
                </Paragraph>
            </Button>
        </Row>
    );
}
