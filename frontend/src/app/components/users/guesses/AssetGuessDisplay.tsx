import React from "react";
import { Typography, Row, Col, Button, Card } from "antd";
const { Title, Paragraph } = Typography;

export default function AssetGuessDisplay() {
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
                    filter: "blur(1px)",
                    height: "100%",
                    width: "100%",
                }}
            ></div>
            <Card
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}
            >
                <Title level={2}>Fill out the form to see data</Title>
            </Card>
        </div>
    );
}
