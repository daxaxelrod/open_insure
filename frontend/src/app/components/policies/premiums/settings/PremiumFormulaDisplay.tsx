import "katex/dist/katex.min.css";
import { Divider, Typography } from "antd";
import React, { useState } from "react";
import { Policy } from "../../../../../redux/reducers/commonTypes";

const { InlineMath, BlockMath } = require("react-katex");
const { Title } = Typography;

export default function PremiumFormulaDisplay({
    policy,
    draggingConvservative,
    draggingCellPhonePerilRate,
}: {
    policy: Policy;
    draggingConvservative: boolean;
    draggingCellPhonePerilRate: boolean;
}) {
    return (
        <div>
            <Title level={5}>Premium Formula</Title>
            <BlockMath
                math={`P = V \\times (${
                    draggingCellPhonePerilRate ? `\\colorbox{aqua}{$P$}` : "P"
                } + ${draggingConvservative ? `\\colorbox{aqua}{$C$}` : "C"})
                
            `}
            />

            <Divider
                orientation="right"
                style={{ fontSize: ".8rem" }}
            ></Divider>
        </div>
    );
}
