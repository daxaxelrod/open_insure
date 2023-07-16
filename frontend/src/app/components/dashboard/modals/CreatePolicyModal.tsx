import React, { Dispatch, SetStateAction, useState } from "react";
import {
    Form,
    Input,
    Modal,
    Divider,
    Typography,
    InputNumber,
    Select,
    DatePicker,
    Space,
    Checkbox,
    Row,
    Switch,
} from "antd";
import { DownSquareOutlined, UpSquareOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../../redux/hooks";
import { createPolicy } from "../../../../redux/actions/policies";
import { getAvailableUnderlyingInsuredTypesForPolicyType } from "../../../utils/policyUtils";

const { Title } = Typography;
const { TextArea } = Input;

export default function CreatePolicyModal({
    isVisible,
    setIsVisible,
}: {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}) {
    let createPolicyPending = false;
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                dispatch(
                    createPolicy({
                        ...values,
                        coverage_start_date:
                            values.coverage_start_date.format(),
                        premium_pool_type: "perpetual_pool",
                        governance_type: "direct_democracy",
                        ...(!values.available_underlying_insured_types && {
                            available_underlying_insured_types: [
                                "cell_phone",
                                "audio_equipment",
                            ],
                        }),
                    })
                );
                setIsVisible(false);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const toggleAdvanced = () => {
        setShowAdvancedSettings((v) => !v);
    };

    return (
        <Modal
            title="Create a policy"
            open={isVisible}
            onOk={handleOk}
            okText="Create"
            confirmLoading={createPolicyPending}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item label="Policy Name" name="name" required>
                    <Input placeholder="Phone Insurance" />
                </Form.Item>
                <Form.Item label="Description" name="description" required>
                    <TextArea placeholder="A group of friends insuring themselves against..." />
                </Form.Item>
                <Form.Item
                    label="Policy type"
                    name="coverage_type"
                    initialValue={"m_property"}
                    required
                >
                    <Select>
                        <Select.Option value="m_property">
                            Minor Property
                        </Select.Option>
                        <Select.Option value="renters" disabled>
                            Renter's Insurance
                        </Select.Option>
                    </Select>
                </Form.Item>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Space size={16}>
                        <Form.Item
                            label="Coverage start date"
                            name="coverage_start_date"
                            required
                        >
                            <DatePicker format={"MMMM Do, YYYY"} />
                        </Form.Item>
                        <Form.Item
                            label="Coverage length"
                            tooltip="How long coverage lasts from start date"
                            required
                            name="coverage_duration"
                            initialValue={12}
                        >
                            <InputNumber
                                min={3}
                                max={36}
                                placeholder="Months"
                            />
                        </Form.Item>
                    </Space>
                </div>
                <Form.Item
                    label="Make the policy public?"
                    tooltip="Allow other users to view and join the policy"
                    name="is_public"
                    status="success"
                >
                    <Switch
                        checkedChildren={"Yes"}
                        unCheckedChildren={"No"}
                        defaultChecked
                        size="default"
                    />
                </Form.Item>

                <Divider />
                <Row
                    justify="space-between"
                    onClick={toggleAdvanced}
                    style={{
                        cursor: "pointer",
                    }}
                >
                    <Title level={4}>Advanced Settings</Title>
                    <div
                        style={{
                            padding: "2px 10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 5,
                        }}
                    >
                        {showAdvancedSettings ? (
                            <DownSquareOutlined />
                        ) : (
                            <UpSquareOutlined />
                        )}
                    </div>
                </Row>
                {showAdvancedSettings && (
                    <div>
                        <Form.Item
                            label="Insurable Items"
                            name="available_underlying_insured_types"
                        >
                            <Checkbox.Group
                                defaultValue={["cell_phone", "audio_equipment"]}
                                options={getAvailableUnderlyingInsuredTypesForPolicyType(
                                    "m_property" // come back to this, needs to be dynamic based on policy type
                                )}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Governance Type"
                            name="governance_type"
                            initialValue={"direct_democracy"}
                            hidden
                        >
                            <Select>
                                <Select.Option value="direct_democracy">
                                    Direct Democracy
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Premium pool type"
                            name="premium_pool_type"
                            initialValue={"perpetual_pool"}
                            hidden
                        >
                            <Select>
                                <Select.Option value="perpetual_pool">
                                    Perpetual Pool
                                </Select.Option>
                                {/* <Select.Option value="perpetual_pool">Capped Pool</Select.Option> */}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Maximum number of policy members"
                            name={"max_pod_size"}
                            tooltip="Leave blank to allow an unlimited number of people to join."
                        >
                            <InputNumber min={2} />
                        </Form.Item>
                        <Form.Item
                            label="Allow members to join after the policy starts"
                            name={"allow_joiners_after_policy_start"}
                            tooltip="Allow people to join the policy after the start date"
                        >
                            <Checkbox />
                        </Form.Item>
                    </div>
                )}
            </Form>
        </Modal>
    );
}
