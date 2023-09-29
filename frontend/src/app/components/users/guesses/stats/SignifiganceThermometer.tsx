import { Typography, Progress, Grid } from "antd";

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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: -8,
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
    const grid = Grid.useBreakpoint();
    const isSmallOrBelow =
        (grid.xs || grid.sm) && !grid.md && !grid.lg && !grid.xl && !grid.xxl;
    const percent = Math.min(100, Math.round((count / requiredCount) * 100));
    const quartiles = [25, 50, 75];

    return (
        <div
            className="thermometer"
            style={{
                position: "relative",
            }}
        >
            <MarkersContainer>
                {quartiles.map((q) => {
                    return (
                        <div
                            key={`${q}-markerpoint`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Marker
                                complete={percent >= Math.min(q + 5, 100)}
                                key={q}
                                style={{
                                    fontSize: ".65rem",
                                }}
                            >
                                {`${q}%`}
                            </Marker>
                        </div>
                    );
                })}
            </MarkersContainer>
            <Marker
                complete={percent >= 100}
                style={{
                    position: "absolute",
                    right: isSmallOrBelow ? -18 : 0,
                    top: -8,
                    fontSize: ".85rem",
                    zIndex: 3,
                }}
            >
                🎉
            </Marker>
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
