import { Typography, Progress } from "antd";

import styled from "styled-components";
import { PolicyLine } from "../../../../../redux/reducers/types/actuaryTypes";
import colors from "../../../../constants/colors";

const { Title, Paragraph } = Typography;

const Marker = styled.div<{ complete?: boolean }>(({ complete }) => ({
    height: "40px",
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 1,

    background: colors.gray3five,
    borderRadius: 40,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",

    fontSize: ".65rem",
    color: !complete ? "black" : "white",
}));

const MarkersContainer = styled.div({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 16,
    zIndex: 2,
});

// perhaps this?
// https://dribbble.com/shots/22214407-Magic-in-Progress-bar

export default function SignifiganceThermometer({
    count,
    requiredCount,
}: {
    count: number;
    requiredCount: number;
}) {
    const percent = Math.min(100, Math.round((count / requiredCount) * 100));
    const quartiles = [25, 50, 75, 100];

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
                            <Marker
                                complete={percent >= Math.min(q + 5, 100)}
                                key={q}
                                style={{
                                    fontSize: q === 100 ? ".85rem" : ".65rem",
                                }}
                            >
                                {q === 100 ? `🎉` : `${q}%`}
                            </Marker>
                        </div>
                    );
                })}
            </MarkersContainer>
            <Progress
                strokeWidth={14}
                percent={percent}
                showInfo={false}
                strokeColor={{
                    from: "#0a0a79",
                    to: "#00d4ff",
                }}
                trailColor={colors.gray3five}
            />
        </div>
    );
}
