import React from "react";
import "katex/dist/katex.min.css";
import { Divider, Row, Typography } from "antd";
import {
    Policy,
    Risk,
    RiskSettings,
} from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";

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
                            userRisk.underlying_insured_type === "cell_phone"
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
                    <Paragraph
                        style={{
                            fontSize: "1.2rem",
                            color: colors.gray9,
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                        }}
                    >
                        Discounts
                    </Paragraph>
                    <Paragraph style={{ marginBottom: ".75rem" }}>
                        There are{" "}
                        {userRisk.underlying_insured_type === "cell_phone"
                            ? "2"
                            : "0"}{" "}
                        discounts that are available for{" "}
                        {userRisk.underlying_insured_type === "cell_phone"
                            ? "cell phones"
                            : "audio equipment"}
                        . Discounts are represented as the percent less likely
                        you are to have a full loss a year.
                        {userRisk.underlying_insured_type === "audio_equipment"
                            ? `There are 2 discounts available to those who insure their cell phones. A discount for having a screen protector and another for having a case`
                            : ""}
                    </Paragraph>
                </div>
                {userRisk?.underlying_insured_type === "cell_phone" ? (
                    <>
                        <Row style={{ marginBottom: ".5rem" }}>
                            <InlineMath
                                math={`D1 = ${
                                    riskSettings.cell_phone_screen_protector_discount /
                                    100
                                }\\% `}
                            />
                            <Paragraph>
                                &nbsp;&nbsp;You are $
                                {
                                    riskSettings.cell_phone_screen_protector_discount
                                }
                                % less likely if you have a screen protector
                            </Paragraph>
                        </Row>
                        <Row style={{ marginBottom: ".5rem" }}>
                            <InlineMath
                                math={`D2 = ${
                                    riskSettings.cell_phone_case_discount / 100
                                }\\%`}
                            />
                            <Paragraph>
                                &nbsp;&nbsp;You are $
                                {riskSettings.cell_phone_case_discount}% less
                                likely if you have a phone case
                            </Paragraph>
                        </Row>
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
