import { Divider, Radio } from "antd";
import React from "react";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;

export default function PolicyAssetCoverageSelection({
    types,
    risk,
    updateRisk,
}: {
    types: string[];
    risk: any;
    updateRisk: (values: any) => void;
}) {
    return (
        <div>
            <Title level={4}>Asset you'd like to insure</Title>
            <Radio.Group defaultValue={types?.[0]} buttonStyle="solid">
                {types.map((type) => (
                    <Radio.Button
                        onClick={() =>
                            updateRisk({
                                underlying_insured_type: type,
                            })
                        }
                        value={type}
                    >
                        {type}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </div>
    );
}

const PolicyAssetCoverageSelectionItem = () => {};
