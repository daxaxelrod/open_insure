import React from "react";
import "katex/dist/katex.min.css";
import { Divider, Row, Typography } from "antd";
import {
    Policy,
    Risk,
    RiskSettings,
} from "../../../../../redux/reducers/commonTypes";

const { InlineMath, BlockMath } = require("react-katex");
const { Title, Paragraph } = Typography;

export default function PremiumFormulaDisplay({
    riskSettings,
    userRisk,
    conservative_factor,
    cell_phone_peril_rate,
    cell_phone_case_discount,
    cell_phone_screen_protector_discount,
    audio_equipment_peril_rate,
}: {
    riskSettings: RiskSettings;
    userRisk: Risk;
    conservative_factor: boolean;
    cell_phone_peril_rate: boolean;
    cell_phone_case_discount: boolean;
    cell_phone_screen_protector_discount: boolean;
    audio_equipment_peril_rate: boolean;
}) {
    return (
        <div>
            <Title level={5} style={{ marginBottom: 5 }}>
                This is how premiums are calculated
            </Title>
            <BlockMath
                math={`Premium = V \\times (${
                    cell_phone_peril_rate || audio_equipment_peril_rate
                        ? `\\colorbox{aqua}{$P$}`
                        : "P"
                } + ${conservative_factor ? `\\colorbox{aqua}{$C$}` : "C"} - ${
                    cell_phone_screen_protector_discount
                        ? `\\colorbox{aqua}{$D1$}`
                        : "D1"
                } - ${
                    cell_phone_case_discount ? `\\colorbox{aqua}{$D2$}` : "D2"
                })

            `}
            />
            <div>
                <Row style={{ marginBottom: ".5rem" }}>
                    <InlineMath math={`V =  `} />
                    <Paragraph>
                        &nbsp;&nbsp;${userRisk?.content_object?.market_value}{" "}
                        Your asset's value today
                    </Paragraph>
                </Row>
                <Row style={{ marginBottom: ".5rem" }}>
                    <InlineMath
                        math={`P = ${
                            userRisk.content_type === "cell_phone"
                                ? riskSettings.cell_phone_peril_rate
                                : riskSettings.audio_equipment_peril_rate
                        }\\% `}
                        /** now of course there are different probs for different loss events. 
                        A battery replacement is more likely than a total loss.
                        But as long as people view this as a blended weighted average, the math works out to be the same */
                    />
                    <Paragraph>
                        &nbsp;&nbsp;The chance your asset has of being damaged
                        in a year
                    </Paragraph>
                </Row>
                <div>
                    "D" stands for discount. There are{" "}
                    {userRisk.content_type === "cell_phone" ? "2" : "0"}{" "}
                    discounts that are available for{" "}
                    {userRisk.content_type === "cell_phone"
                        ? "cell phones"
                        : "audio equipment"}
                    .
                </div>
                {userRisk?.content_type === "cell_phone" ? (
                    <>
                        <InlineMath
                            math={`D1 = ${riskSettings.cell_phone_screen_protector_discount} You're ${riskSettings.cell_phone_screen_protector_discount}% less likely to break your phone in a given year if you have a screen protector`}
                        />
                        <InlineMath
                            math={`D2 = ${riskSettings.cell_phone_case_discount} You're ${riskSettings.cell_phone_case_discount}% less likely to break your phone in a given year if you have a phone case`}
                        />
                    </>
                ) : null}
            </div>

            <Divider
                orientation="right"
                style={{ fontSize: ".8rem" }}
            ></Divider>
        </div>
    );
}
