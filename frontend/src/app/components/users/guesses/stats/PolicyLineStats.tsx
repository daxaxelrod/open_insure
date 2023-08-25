import React from "react";
import { Typography, Card } from "antd";
import { useAppSelector } from "../../../../../redux/hooks";
const { Title, Paragraph } = Typography;

export default function PolicyLineStats({
    isOnSecondStep,
}: {
    isOnSecondStep: boolean;
}) {
    // const { guess } = useAppSelector((state) => state.actuary.guess);

    const hasContributed = false;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <div
                style={{
                    backgroundImage: `url(https://placekitten.com/200/300)`,
                    backgroundSize: "contain",
                    filter: `blur(${
                        hasContributed ? 0 : isOnSecondStep ? 4 : 16
                    }px)`,
                    height: "100%",
                    width: "100%",
                }}
            ></div>
            <div
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card style={{ marginBottom: 20, height: 90 }}>
                    <Title level={2}>Fill out the form to see data</Title>
                </Card>
            </div>
        </div>
    );
}
