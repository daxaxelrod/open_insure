import { Carousel, Empty } from "antd";
import React from "react";
import { Claim } from "../../../../../redux/reducers/commonTypes";

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#1d61e5",
    borderRadius: "15px",
};

const imageStyle: React.CSSProperties = {
    borderRadius: "15px",
    objectFit: "cover",
};

export default function ClaimEvidenceImages({ claim }: { claim: Claim }) {
    let evidence = claim.evidence?.filter((e) => e.evidence_type === "photo");

    return (
        <div style={{ padding: `0 1.25rem 0 0` }}>
            <Carousel>
                {evidence?.map((evidence) => (
                    <div key={evidence.id} style={contentStyle}>
                        <img
                            src={evidence.image}
                            alt="evidence"
                            style={imageStyle}
                        />
                    </div>
                ))}
                {!evidence?.length && (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        imageStyle={{
                            height: 40,
                        }}
                        description="Claims require pictures or videos"
                    />
                )}
            </Carousel>
        </div>
    );
}
