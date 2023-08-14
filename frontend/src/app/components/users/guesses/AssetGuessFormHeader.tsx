import React from "react";
import { Typography } from "antd";
import colors from "../../../constants/colors";
const { Title, Paragraph } = Typography;

export default function AssetGuessFormHeader() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
            }}
        >
            <img
                src="https://placekitten.com/200/300"
                style={{
                    borderRadius: "50%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    height: "100px",
                    marginBottom: "1rem",
                }}
            />
            <Title
                level={3}
                style={{
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                }}
            >
                Create your own insurance policy
            </Title>
            <Paragraph style={{ color: colors.gray7 }}>
                Contribute to the community by filling out the form below
            </Paragraph>
        </div>
    );
}
