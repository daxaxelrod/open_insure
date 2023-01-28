import React from "react";
import { Typography } from "antd";
import colors from "../../constants/colors";

const { Title } = Typography;

export default function BoxWithTitleLine({
    children,
    title,
    level,
    left = false,
}: {
    children: React.ReactNode;
    title: string;
    level: 1 | 5 | 2 | 3 | 4 | undefined;
    left?: Boolean;
}) {
    return (
        <div
            style={{
                borderRadius: 8,
                borderColor: colors.gray4,
                borderWidth: 2,
                borderStyle: "solid",
                padding: ".75rem",
                position: "relative",
                marginBottom: "1.5rem",
            }}
        >
            <Title
                level={level}
                style={{
                    position: "absolute",
                    top: "-1.5rem",
                    [left ? "left" : "right"]: "1rem",
                    padding: ".5rem .75rem",
                    backgroundColor: "white",
                    color: colors.gray8,
                }}
            >
                {title}
            </Title>
            {children}
        </div>
    );
}
