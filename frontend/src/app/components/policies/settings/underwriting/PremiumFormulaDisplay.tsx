import React from "react";
import "katex/dist/katex.min.css";
import { Col, Divider, Row, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
    Policy,
    Risk,
    RiskSettings,
    User,
} from "../../../../../redux/reducers/commonTypes";
import colors from "../../../../constants/colors";
import { useAppSelector } from "../../../../../redux/hooks";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";

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
    let { id } = useParams();
    const allPodUsers: User[] = useAppSelector(
        (state) =>
            state.policies.publicPolicies.find(
                (p: Policy) => p.id === parseInt(id || "")
            )?.pod?.members
    );

    const userWhoLastUpdated = allPodUsers.find(
        (user: User) => user.id === riskSettings?.last_updated_by
    );

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Tooltip
                    color="black"
                    placement="leftTop"
                    title={() => (
                        <div style={{ padding: 10 }}>
                            This is how your premiums are calculated
                        </div>
                    )}
                >
                    <QuestionCircleOutlined
                        style={{
                            color: colors.gray7,
                            padding: "3px 10px 10px 3px",
                        }}
                    />
                </Tooltip>
                {riskSettings?.last_updated_by && userWhoLastUpdated && (
                    <Paragraph style={{ color: colors.gray7 }}>
                        Last updated by{" "}
                        {`${userWhoLastUpdated.first_name} ${
                            userWhoLastUpdated.last_name
                        } ${moment(riskSettings.last_updated_at).fromNow()}`}
                    </Paragraph>
                )}
            </div>
            <div
                className="premium-formula-affix-container"
                style={{
                    position: "sticky",
                    top: 10,
                    backgroundColor: "white",
                    padding: ".25rem 0",
                    marginBottom: "-.25rem",
                }}
            >
                <BlockMath
                    math={`Premium = V \\times (${
                        cell_phone_peril_rate || audio_equipment_peril_rate
                            ? `\\colorbox{aqua}{$P$}`
                            : "P"
                    } + ${
                        conservative_factor ? `\\colorbox{aqua}{$C$}` : "C"
                    } - ${
                        cell_phone_screen_protector_discount
                            ? `\\colorbox{aqua}{$D1$}`
                            : "D1"
                    } - ${
                        cell_phone_case_discount
                            ? `\\colorbox{aqua}{$D2$}`
                            : "D2"
                    })

            `}
                />
            </div>
            <div>
                <Paragraph
                    style={{
                        fontSize: "1.2rem",
                        color: colors.gray9,
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                        marginBottom: ".75rem",
                    }}
                >
                    Fundamentals
                </Paragraph>
                <Row style={{ marginBottom: ".5rem" }}>
                    <InlineMath
                        math={`V = \\$${userRisk?.content_object?.market_value}`}
                    />
                    <Paragraph>&nbsp;&nbsp;Your asset's value today</Paragraph>
                </Row>
                <Row style={{ marginBottom: ".5rem" }}>
                    <InlineMath
                        math={`P = ${
                            userRisk.underlying_insured_type === "cell_phone"
                                ? riskSettings?.cell_phone_peril_rate
                                : riskSettings?.audio_equipment_peril_rate
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
                <Row style={{ marginBottom: ".5rem" }}>
                    <InlineMath
                        math={`C = ${riskSettings?.conservative_factor}\\% `}
                        /** now of course there are different probs for different loss events. 
                        A battery replacement is more likely than a total loss.
                        But as long as people view this as a blended weighted average, the math works out to be the same */
                    />
                    <Tooltip
                        title="Added to the probabilty of loss. A higher conservative factor will make it more likely your policy's reserves can cover a loss."
                        color="black"
                    >
                        <Paragraph>&nbsp;&nbsp;Conservative Factor</Paragraph>
                    </Tooltip>
                </Row>
                <div>
                    <Paragraph
                        style={{
                            fontSize: "1.2rem",
                            color: colors.gray9,
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                            marginBottom: ".5rem",
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
                                    riskSettings?.cell_phone_screen_protector_discount /
                                    100
                                }\\% `}
                            />
                            <Paragraph>
                                &nbsp;&nbsp;You are&nbsp;
                                {riskSettings?.cell_phone_screen_protector_discount /
                                    100}
                                % less likely to have a total loss if you have a
                                screen protector
                            </Paragraph>
                        </Row>
                        <Row style={{ marginBottom: ".5rem" }}>
                            <InlineMath
                                math={`D2 = ${
                                    riskSettings?.cell_phone_case_discount / 100
                                }\\%`}
                            />
                            <Paragraph>
                                &nbsp;&nbsp;You are&nbsp;
                                {riskSettings?.cell_phone_case_discount / 100}%
                                less likely to have a total loss if you have a
                                phone case
                            </Paragraph>
                        </Row>
                    </>
                ) : null}
            </div>
        </div>
    );
}
