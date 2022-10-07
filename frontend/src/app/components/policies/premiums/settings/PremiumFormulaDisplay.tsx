import "katex/dist/katex.min.css";
import { Divider, Typography } from "antd";
import React, { useState } from "react";
import { Policy } from "../../../../../redux/reducers/commonTypes";

const { InlineMath, BlockMath } = require("react-katex");
const { Title } = Typography;

export default function PremiumFormulaDisplay({ policy }: { policy: Policy }) {
    return (
        <div>
            <Title level={5}>Premium Formula</Title>
            <BlockMath math={`\\colorbox{aqua}{$F=ma$}`} />

            <Divider
                orientation="right"
                style={{ fontSize: ".8rem" }}
            ></Divider>
        </div>
    );
}
