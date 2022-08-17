import { Typography } from "antd";
import React, { useMemo } from "react";
import colors from "../../../constants/colors";
import { maybePluralize } from "../../../utils/stringUtils";

const { Title } = Typography;

export default function PremiumDisplay({
    amount,
    frequency,
}: {
    amount: number;
    frequency: number;
}) {
    let averagePremium = useMemo(
        () => Math.round(Math.random() * 1000) / 100,
        []
    );

    return (
        <div
            style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
            }}
        >
            <Title level={2} style={{ lineHeight: 1, marginBottom: 6 }}>
                ${amount}
            </Title>
            <Title level={5} style={{ lineHeight: 1, color: colors.gray9 }}>
                &nbsp;/per {frequency === 1 ? "" : `${frequency} `}{" "}
                {maybePluralize(frequency, "month")}
            </Title>
        </div>
    );
}
