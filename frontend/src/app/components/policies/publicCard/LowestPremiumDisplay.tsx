import React, { useMemo } from "react";
import { Skeleton, Typography } from "antd";
import colors from "../../../constants/colors";
import { maybePluralize } from "../../../utils/stringUtils";

const { Title, Paragraph } = Typography;

// just meant for advertising

export default function LowestPremiumDisplay({
    amount,
    risksPending,
    frequency,
}: {
    amount: number | null;
    frequency: number;
    risksPending: boolean;
}) {
    return (
        <div
            style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
            }}
        >
            {amount ? (
                <>
                    <span
                        style={{
                            textAlign: "right",
                            color: colors.gray7,
                            fontSize: ".75rem",
                        }}
                    >
                        Starting at
                    </span>
                    <Title level={2} style={{ lineHeight: 1, marginBottom: 6 }}>
                        ${amount}
                    </Title>
                    <Title
                        level={5}
                        style={{ lineHeight: 1, color: colors.gray9 }}
                    >
                        &nbsp;/per {frequency === 1 ? "" : `${frequency} `}{" "}
                        {maybePluralize(frequency, "month")}
                    </Title>
                </>
            ) : risksPending ? (
                <Skeleton />
            ) : (
                <div style={{ color: colors.gray5 }}>
                    <Paragraph>No premiums yet</Paragraph>
                    <Paragraph>Be the first one!</Paragraph>
                </div>
            )}
        </div>
    );
}
