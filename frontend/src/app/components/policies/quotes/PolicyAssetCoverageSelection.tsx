import { Divider, Radio } from "antd";
import React from "react";

export default function PolicyAssetCoverageSelection({
    types,
    risk,
    updateRisk,
}) {
    return (
        <div>
            <Divider orientation="left">Asset coverage</Divider>
            <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">Hangzhou</Radio.Button>
                <Radio.Button value="b">Shanghai</Radio.Button>

                {types.map((type) => (
                    <Radio.Button value={type}>{type}</Radio.Button>
                ))}
            </Radio.Group>
        </div>
    );
}

const PolicyAssetCoverageSelectionItem = () => {};
