import React from "react";
import { Typography } from "antd";

const { Paragraph } = Typography;

export default function IconWithSubtext({
    icon,
    subtext,
}: {
    icon: React.ReactNode;
    subtext: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {icon}
            <Paragraph
                type="secondary"
                style={{
                    marginBottom: 0,
                }}
            >
                {subtext}
            </Paragraph>
        </div>
    );
}
