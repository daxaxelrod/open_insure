import React from "react";
import { ReputationDetails } from "../../../../../redux/reducers/types/commonTypes";
import { getRatingGrade, getRatingColor } from "./ratingsUtils";
import { Row, Space, Statistic } from "antd";

export default function RatingDetailsBrief({
    reputation,
}: {
    reputation: ReputationDetails | undefined;
}) {
    if (!reputation || !reputation?.components) return null;

    return (
        <div>
            <Row
                style={{
                    marginBottom: "1rem",
                    display: "flex",
                    width: "100%",
                    flexWrap: "wrap",
                }}
                wrap
            >
                <Space size={"large"}>
                    <Statistic
                        title="Activity"
                        value={getRatingGrade(reputation.components.activity)}
                        valueStyle={{
                            color: getRatingColor(
                                reputation.components.activity
                            ),
                            fontFamily: "Luckiest Guy",
                        }}
                    />
                    <Statistic
                        title="Claims"
                        value={getRatingGrade(reputation.components.claims)}
                        valueStyle={{
                            color: getRatingColor(reputation.components.claims),
                            fontFamily: "Luckiest Guy",
                        }}
                    />
                    <Statistic
                        title="Payments"
                        value={getRatingGrade(reputation.components.payments)}
                        valueStyle={{
                            color: getRatingColor(
                                reputation.components.payments
                            ),
                            fontFamily: "Luckiest Guy",
                        }}
                    />
                    <Statistic
                        title="Background"
                        value={getRatingGrade(reputation.components.background)}
                        valueStyle={{
                            color: getRatingColor(
                                reputation.components.background
                            ),
                            fontFamily: "Luckiest Guy",
                        }}
                    />
                    <Statistic
                        title="Lifestyle"
                        value={getRatingGrade(reputation.components.lifestyle)}
                        valueStyle={{
                            color: getRatingColor(
                                reputation.components.lifestyle
                            ),
                            fontFamily: "Luckiest Guy",
                        }}
                    />
                </Space>
            </Row>
        </div>
    );
}
