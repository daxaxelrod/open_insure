import { Carousel } from "antd";
import React from "react";
import { Claim } from "../../../../../redux/reducers/commonTypes";

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#1d61e5",
    borderRadius: "5px",
};

export default function ClaimEvidenceImages({ claim }: { claim: Claim }) {
    return (
        <div
            style={{ padding: `0 1.25rem 0 0` }}
            onClick={(e) => {
                e.preventDefault();
            }}
        >
            <Carousel>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>
        </div>
    );
}
