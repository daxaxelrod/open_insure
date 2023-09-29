import React from "react";
import { Typography } from "antd";
import colors from "../../../constants/colors";

const { Title, Paragraph } = Typography;

export default function AssetGuessFormHeader() {
    const isMdOrBelow = window.innerWidth < 992;
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: isMdOrBelow ? 0 : "2rem",
            }}
        >
            <img
                alt="open insure logo"
                src={require("../../../../assets/images/logo-512.png")}
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
                    textAlign: "center",
                    marginBottom: isMdOrBelow ? "2rem" : 0,
                }}
            >
                {isMdOrBelow
                    ? "Contribute to the community by filling out the form below."
                    : "Share info about your asset to help others"}
            </Title>
            {isMdOrBelow ? null : (
                <Paragraph
                    style={{
                        color: colors.gray7,
                        textAlign: "center",
                        padding: `0 ${isMdOrBelow ? "8px" : "20px"}`,
                    }}
                >
                    Contribute to the community by filling out the form below.
                    Once enough people have contributed, you can create self
                    insurance policies based on the data.
                </Paragraph>
            )}
        </div>
    );
}
