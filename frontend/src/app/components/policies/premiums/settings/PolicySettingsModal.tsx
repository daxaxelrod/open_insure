import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Modal,
    Row,
    Typography,
    Spin,
    Table,
    Popconfirm,
    Radio,
    RadioChangeEvent,
    Col,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import colors from "../../../../constants/colors";
import { getPolicyRiskSettings } from "../../../../../redux/actions/policies";
import {
    Risk,
    Policy,
    RiskSettings,
} from "../../../../../redux/reducers/commonTypes";
import PremiumFormulaDisplay from "./PremiumFormulaDisplay";
import SlidablePolicyRiskSetting from "./SlidablePolicyRiskSetting";
import { computeHypotheticalPremiums } from "../../../../../networking/risk";

const { Title, Paragraph } = Typography;

export default function PolicySettingsModal({ policy }: { policy: Policy }) {
    const [visible, setVisible] = useState(false);
    const [hypotheticalPremiums, setHypotheticalPremiums] = useState<any>({});
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
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const [chosenPreset, setChosenPreset] = useState("");

    const pricedRisks = policyRisks?.filter(
        (r: Risk) => r.premium_amount !== null
    );
    const userRisk = policyRisks?.find((r: Risk) => r.user === currentUser.id);

    const [form] = Form.useForm();

    const [draggingValue, setDraggingValue] = useState<any>({
        conservative_factor: false,
        cell_phone_peril_rate: false,
        cell_phone_case_discount: false,
        cell_phone_screen_protector_discount: false,
        audio_equipment_peril_rate: false,
    });

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

    const setPresetOption = (option: RadioChangeEvent) => {
        let preset = option.target.value;
        setChosenPreset(preset);
        // is there a cleaner way to do this?
        // definitely a better way
        let conservative_factor =
            preset === "low" ? 50 : preset === "medium" ? 20 : 0;
        let cell_phone_peril_rate =
            preset === "low" ? 30 : preset === "medium" ? 20 : 10;
        let audio_equipment_peril_rate =
            preset === "low" ? 30 : preset === "medium" ? 20 : 10;
        let cell_phone_case_discount =
            preset === "low" ? 0 : preset === "medium" ? 1 : 1.5;
        let cell_phone_screen_protector_discount =
            preset === "low" ? 0 : preset === "medium" ? 1 : 1.5;

        form.setFieldsValue({
            conservative_factor,
            cell_phone_peril_rate,
            cell_phone_case_discount,
            cell_phone_screen_protector_discount,
            audio_equipment_peril_rate,
        });
    };

    async function fetchHypotheticalPremiums() {
        let values = await form.validateFields();

        let response = await computeHypotheticalPremiums(policy.id, values);

        setHypotheticalPremiums(response.data);
    }

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
        {
            title: "Hypothetical Premiums",
            dataIndex: "premium_amount",
            render: (text: string, record: Risk) =>
                `${hypotheticalPremiums[record.user]}`,
            key: "hypothetical_premium_amount",
        },
    ];

    const conservativeValue =
        Form.useWatch("conservative_factor", form) ??
        riskSettings?.conservative_factor;

    const cellPhonePerilRate =
        Form.useWatch("cell_phone_peril_rate", form) ??
        riskSettings?.cell_phone_peril_rate;

    const cellPhoneCaseDiscount =
        Form.useWatch("cell_phone_case_discount", form) ??
        riskSettings?.cell_phone_case_discount;

    const cellPhoneScreenProtectorDiscount =
        Form.useWatch("cell_phone_screen_protector_discount", form) ??
        riskSettings?.cell_phone_screen_protector_discount;

    const audioEquipmentPerilRate =
        Form.useWatch("audio_equipment_peril_rate", form) ??
        riskSettings?.audio_equipment_peril_rate;

    const sliderOnChange = (value: number, identifier: string) => {
        form.setFieldsValue({ [identifier]: value });
        if (!draggingValue?.[identifier]) {
            setDraggingValue({
                ...draggingValue,
                [identifier]: true,
            });
        }
    };

    useEffect(() => {
        if (
            riskSettings &&
            Object.keys(riskSettings).length &&
            !getRiskSettingsPending
        ) {
            Object.keys(riskSettings).forEach((key) => {
                // hacky way to specify basis point form fields
                let divisor = key.includes("discount") ? 100 : 1;

                form.setFieldsValue({ [key]: riskSettings[key] / divisor });
            });
        }
    }, [riskSettings, getRiskSettingsPending]);

    return (
        <Row justify="end" align="middle">
            <Modal
                title="Policy Premiums Settings"
                okText="Update"
                cancelText={"Close"}
                visible={visible}
                width={"50%"}
                onOk={handleOk}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Do nothing & Close
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
                        <Button key="submit" type="primary">
                            Submit
                        </Button>
                    </Popconfirm>,
                ]}
                confirmLoading={false}
                onCancel={handleCancel}
            >
                <PremiumFormulaDisplay
                    riskSettings={riskSettings}
                    userRisk={userRisk}
                    {...draggingValue}
                />
                <Spin spinning={getRiskSettingsPending}>
                    <Row
                        style={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "1rem",
                        }}
                    >
                        <Col span={14}>
                            <Title level={4}>Set policy variables</Title>
                        </Col>
                        <Col span={10}>
                            <Row>
                                <Paragraph style={{ color: colors.gray7 }}>
                                    Presets:&nbsp;
                                </Paragraph>
                                <Radio.Group
                                    options={[
                                        { label: "Low Risk", value: "low" },
                                        { label: "Medium", value: "medium" },
                                        { label: "High Risk", value: "high" },
                                    ]}
                                    onChange={setPresetOption}
                                    value={chosenPreset}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </Row>
                        </Col>
                    </Row>
                    <Form form={form} initialValues={riskSettings}>
                        {policyHasCellPhoneEnabled && (
                            <Form.Item
                                label="Cell Phone Loss Rate"
                                name={"cell_phone_peril_rate"}
                            >
                                <SlidablePolicyRiskSetting
                                    stepSize={0.5}
                                    sliderOnChange={sliderOnChange}
                                    setDraggingValue={setDraggingValue}
                                    draggingValue={draggingValue}
                                    identifier={"cell_phone_peril_rate"}
                                    value={cellPhonePerilRate}
                                />
                            </Form.Item>
                        )}
                        {policyHasAudioEquipmentEnabled && (
                            <Form.Item
                                label="Audio Equipment Claim Probability"
                                name={"audio_equipment_peril_rate"}
                            >
                                <SlidablePolicyRiskSetting
                                    stepSize={0.5}
                                    sliderOnChange={sliderOnChange}
                                    setDraggingValue={setDraggingValue}
                                    draggingValue={draggingValue}
                                    identifier={"audio_equipment_peril_rate"}
                                    value={audioEquipmentPerilRate}
                                />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Conservative Factor"
                            name={"conservative_factor"}
                        >
                            <SlidablePolicyRiskSetting
                                min={0}
                                stepSize={0.5}
                                sliderOnChange={sliderOnChange}
                                setDraggingValue={setDraggingValue}
                                draggingValue={draggingValue}
                                identifier={"conservative_factor"}
                                value={conservativeValue}
                            />
                        </Form.Item>
                        {policyHasCellPhoneEnabled && (
                            <>
                                <Form.Item
                                    label="Screen Protector Discount"
                                    name={
                                        "cell_phone_screen_protector_discount"
                                    }
                                >
                                    <SlidablePolicyRiskSetting
                                        min={0}
                                        max={5}
                                        stepSize={0.05}
                                        sliderOnChange={sliderOnChange}
                                        setDraggingValue={setDraggingValue}
                                        draggingValue={draggingValue}
                                        identifier={
                                            "cell_phone_screen_protector_discount"
                                        }
                                        value={cellPhoneScreenProtectorDiscount}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Case Discount"
                                    name={"cell_phone_case_discount"}
                                >
                                    <SlidablePolicyRiskSetting
                                        min={0}
                                        max={5}
                                        stepSize={0.05}
                                        sliderOnChange={sliderOnChange}
                                        setDraggingValue={setDraggingValue}
                                        draggingValue={draggingValue}
                                        identifier={"cell_phone_case_discount"}
                                        value={cellPhoneCaseDiscount}
                                    />
                                </Form.Item>
                            </>
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
