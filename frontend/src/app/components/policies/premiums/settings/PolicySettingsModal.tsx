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
    Tooltip,
    notification,
} from "antd";
import {
    SettingOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import colors from "../../../../constants/colors";
import {
    getPolicyRiskSettings,
    updatePolicyRiskSettings,
} from "../../../../../redux/actions/policies";
import {
    Risk,
    Policy,
    RiskSettings,
} from "../../../../../redux/reducers/commonTypes";
import PremiumFormulaDisplay from "./PremiumFormulaDisplay";
import SlidablePolicyRiskSetting from "./SlidablePolicyRiskSetting";
import { computeHypotheticalPremiums } from "../../../../../networking/risk";
import { get_icon_for_insured_asset_type } from "../../quotes/RisksTable";

const { Title, Paragraph } = Typography;

export default function PolicySettingsModal({ policy }: { policy: Policy }) {
    const [visible, setVisible] = useState(false);
    const [hypotheticalPremiums, setHypotheticalPremiums] = useState<any>({});
    const [hypotheticalPremiumsPending, setHypotheticalPremiumsPending] =
        useState(false);
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

    const handleOk = async () => {
        let values = await form.validateFields();
        dispatch(
            updatePolicyRiskSettings(policy?.id, values, () => {
                setVisible(false);
            })
        );
    };
    const handleCancel = () => {
        setVisible(false);
    };

    const setPresetOption = (option: RadioChangeEvent) => {
        let preset = option.target.value;
        setChosenPreset(preset);

        if (preset === "reset") {
            form.setFieldsValue({
                ...riskSettings,
            });
            notification.success({
                message: "Reset to existing settings",
                placement: "top",
            });
        } else {
            // is there a cleaner way to do this?
            // definitely a better way
            let conservative_factor =
                preset === "low" ? 50 : preset === "medium" ? 20 : 0;
            let cell_phone_peril_rate =
                preset === "low" ? 30 : preset === "medium" ? 20 : 10;
            let audio_equipment_peril_rate =
                preset === "low" ? 30 : preset === "medium" ? 20 : 10;
            let cell_phone_case_discount =
                preset === "low" ? 0 : preset === "medium" ? 100 : 150; // discounts in basis points
            let cell_phone_screen_protector_discount =
                preset === "low" ? 0 : preset === "medium" ? 100 : 150;

            form.setFieldsValue({
                conservative_factor,
                cell_phone_peril_rate,
                cell_phone_case_discount,
                cell_phone_screen_protector_discount,
                audio_equipment_peril_rate,
            });
        }

        setHypotheticalPremiums({});
    };

    async function fetchHypotheticalPremiums() {
        let values = await form.validateFields();
        setHypotheticalPremiumsPending(true);
        try {
            let response = await computeHypotheticalPremiums(policy.id, values);
            setHypotheticalPremiums(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setHypotheticalPremiumsPending(false);
        }
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
            key: "user_name",
        },
        {
            title: "Type",
            render: (text: string, record: Risk) => (
                <Tooltip
                    color="black"
                    title={
                        <div style={{ padding: ".5rem .75rem 0" }}>
                            <Paragraph style={{ color: colors.gray1 }}>
                                {record.content_object?.model}
                            </Paragraph>
                            <Paragraph style={{ color: colors.gray1 }}>
                                Worth ${record.content_object?.market_value}
                            </Paragraph>
                            {(record.content_object?.has_case ||
                                record.content_object
                                    ?.has_screen_protector) && (
                                <Paragraph style={{ color: colors.gray1 }}>
                                    {record.content_object
                                        ?.has_screen_protector &&
                                    record.content_object?.has_screen_protector
                                        ? "Has screen protector and case"
                                        : record.content_object
                                              ?.has_screen_protector
                                        ? "Has screen protector"
                                        : record.content_object?.has_case
                                        ? "Has case"
                                        : ""}
                                </Paragraph>
                            )}
                        </div>
                    }
                >
                    {get_icon_for_insured_asset_type(
                        record.underlying_insured_type,
                        false
                    )}
                </Tooltip>
            ),
            key: "asset_type",
        },
        {
            title: "Current Premium",
            dataIndex: "premium_amount",
            render: (text: string) => `$${(parseInt(text) / 100).toFixed(2)}`,
            key: "premium_amount",
        },
        {
            title: "Hypothetical Premiums",
            dataIndex: "premium_amount",
            render: (text: string, record: Risk) => {
                const percentChange =
                    Math.round(
                        ((hypotheticalPremiums?.[record.user] -
                            record.premium_amount) /
                            record.premium_amount) *
                            1000
                    ) / 10;

                const changeIcon =
                    percentChange > 0 ? (
                        <ArrowUpOutlined style={{ marginLeft: 6 }} />
                    ) : (
                        <ArrowDownOutlined style={{ marginLeft: 6 }} />
                    );
                return hypotheticalPremiums[record.user] ? (
                    <div>
                        {`$${
                            Math.round(hypotheticalPremiums[record.user]) / 100
                        }`}{" "}
                        {changeIcon}
                        {percentChange}%
                    </div>
                ) : (
                    <Button
                        type="primary"
                        onClick={fetchHypotheticalPremiums}
                        loading={hypotheticalPremiumsPending}
                    >
                        Get New Premium
                    </Button>
                );
            },
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
        setHypotheticalPremiums({});
        if (chosenPreset) {
            setChosenPreset("");
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
                form.setFieldsValue({ [key]: riskSettings[key] });
            });
        }
    }, [riskSettings, getRiskSettingsPending]);

    const formLayout: any = {
        labelCol: {
            xs: { span: 10 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 14 },
            sm: { span: 18 },
        },
    };

    return (
        <Row justify="end" align="middle">
            <Modal
                title="Policy Premiums Settings"
                okText="Update"
                cancelText={"Close"}
                visible={visible}
                width={"50%"}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Do nothing & Close
                    </Button>,
                    <Popconfirm
                        title="This will update the premiums for all members of this policy. Are you sure? All members will be emailed about the change."
                        onConfirm={handleOk}
                        onCancel={() => {}}
                        okText="Yes, update"
                        cancelText="No"
                    >
                        <Button
                            key="submit"
                            type="primary"
                            loading={patchPolicyRiskSettingsPending}
                        >
                            Submit
                        </Button>
                    </Popconfirm>,
                ]}
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
                            marginBottom: "2rem",
                        }}
                    >
                        <Col span={12}>
                            <Title level={4} style={{ margin: 0 }}>
                                Set policy variables
                            </Title>
                        </Col>
                        <Col span={12}>
                            <Row justify="end">
                                <Paragraph
                                    style={{
                                        color: colors.gray7,
                                        marginRight: ".5rem",
                                        marginBottom: 0,
                                    }}
                                >
                                    Presets:&nbsp;
                                </Paragraph>
                                <Radio.Group
                                    options={[
                                        { label: "Low Risk", value: "low" },
                                        {
                                            label: "Medium",
                                            value: "medium",
                                        },
                                        {
                                            label: "High Risk",
                                            value: "high",
                                        },
                                        { label: "Reset", value: "reset" },
                                    ]}
                                    onChange={setPresetOption}
                                    value={chosenPreset}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </Row>
                        </Col>
                    </Row>
                    <Form
                        form={form}
                        initialValues={riskSettings}
                        {...formLayout}
                    >
                        {policyHasCellPhoneEnabled && (
                            <Form.Item
                                label="Cell Phone Loss Rate"
                                name={"cell_phone_peril_rate"}
                            >
                                <SlidablePolicyRiskSetting
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
                                        inBasisPoints
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
                                        inBasisPoints
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
