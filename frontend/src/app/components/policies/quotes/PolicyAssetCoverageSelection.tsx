import { Divider, Form, Radio } from "antd";
import React from "react";
import { Typography } from "antd";
import FormItemLabel from "antd/lib/form/FormItemLabel";
const { Title } = Typography;

function getHumanReadableRiskName(type: string) {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");
}

export default function PolicyAssetCoverageSelection({
    editable = true,
    types,
    risk,
    updateRisk,
    formLayout,
}: {
    editable: boolean;
    types: string[];
    risk: any;
    updateRisk: (values: any) => void;
    formLayout: any;
}) {
    return (
        <Form {...formLayout} disabled={!editable}>
            <Form.Item label="Asset Type">
                <Radio.Group
                    defaultValue={risk?.underlying_insured_type}
                    buttonStyle="solid"
                >
                    {types.map((type) => (
                        <Radio.Button
                            key={`coverage-type-${type}`}
                            onClick={() =>
                                updateRisk({
                                    underlying_insured_type: type,
                                })
                            }
                            value={type}
                        >
                            {getHumanReadableRiskName(type)}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </Form.Item>
        </Form>
    );
}

const PolicyAssetCoverageSelectionItem = () => {};
