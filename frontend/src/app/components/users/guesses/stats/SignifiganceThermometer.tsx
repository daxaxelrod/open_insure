import React from "react";
import { Progress } from "antd";
import styled from "styled-components";

const Marker = styled.div<{ complete?: boolean }>(({ complete }) => ({
    height: "40px",
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 1,

    background: "#0a0a7929",
    borderRadius: 40,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(8.9px)",
    border: "1px solid rgba(255,255,255, 0.39)",
    fontFamily: "math",
    fontSize: ".85rem",
    color: !complete ? "black" : "white",
}));

const MarkersContainer = styled.div({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 8,
    zIndex: 2,
});

export default function SignifiganceThermometer({
    count,
    requiredCount,
}: {
    count: number;
    requiredCount: number;
}) {
    const percent = Math.min(100, Math.round((count / requiredCount) * 100));
    const quartiles = [25, 50, 75];

    return (
        <div className="thermometer">
            <MarkersContainer>
                {quartiles.map((q) => {
                    return (
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Marker complete={percent >= q + 5} key={q}>
                                {q}%
                            </Marker>
                        </div>
                    );
                })}
            </MarkersContainer>

            <Progress
                strokeWidth={18}
                percent={percent}
                showInfo={false}
                strokeColor={{
                    from: "#0a0a79",
                    to: "#00d4ff",
                }}
                trailColor="#f3f3f3"
            />

            <span className="percent">{percent}%</span>
        </div>
    );
}
