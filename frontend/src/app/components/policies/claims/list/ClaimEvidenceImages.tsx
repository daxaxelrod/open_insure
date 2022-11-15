import { Carousel } from "antd";
import React from "react";
import { Claim } from "../../../../../redux/reducers/commonTypes";

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
    borderRadius: "5px",
};

export default function ClaimEvidenceImages({ claim }: { claim: Claim }) {
    return (
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
    );
}
