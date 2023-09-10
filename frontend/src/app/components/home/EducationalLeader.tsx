import React from "react";
import { Col, Grid, Row } from "antd";
import { Typography } from "antd";
import HandDrawnCircle from "../../../assets/images/home/handdrawn_oval.svg";
import HandDrawnOval from "./static/HandDrawnOval";
import heroGraphic from "../../../assets/images/home/hero_v2.png";
import colors from "../../constants/colors";
const { Title, Paragraph } = Typography;

export default function EducationalLeader() {
    const sizes = Grid.useBreakpoint();
    const isMobile = sizes.xs || (sizes.sm && !sizes.md);
    const isMdOrBelow = sizes.xs || sizes.sm || sizes.md;

    return (
        <Row
            style={{
                backgroundColor: "white",
            }}
        >
            <Col
                xl={{ span: 8, offset: 3 }}
                lg={{ span: 12, offset: 2 }}
                md={{ span: 18, offset: 3 }}
                sm={{ span: 18, offset: 3 }}
                style={{
                    paddingRight: "2rem",
                    ...(isMobile ? { paddingLeft: "2rem" } : {}),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <Title
                        level={1}
                        style={{
                            marginBottom: 0,
                            marginTop: 24,
                            fontSize: "5rem",
                        }}
                    >
                        Insurance should
                    </Title>
                    <Title
                        style={{
                            fontSize: "5rem",
                            marginTop: 0,
                            marginBottom: ".75rem",
                        }}
                    >
                        be&nbsp;&nbsp;Free
                    </Title>
                    <HandDrawnOval
                        pointerEvents="none"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: 250,
                            transform:
                                "rotate(10deg) translateX(85px) translateY(-5px)",
                        }}
                    />
                </div>
                <div>
                    <Paragraph
                        style={{
                            fontSize: "1.25rem",
                            color: colors.gray7,
                            fontWeight: 400,
                        }}
                    >
                        Open Insure lets you painlessly self-insure your
                        personal property all on a modern web platform
                    </Paragraph>
                </div>
            </Col>
            <Col
                xl={{ span: 12, offset: 0 }}
                lg={{ span: 10, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                sm={{ span: 24, offset: 0 }}
            >
                <img
                    src={heroGraphic}
                    style={{
                        marginTop: "2rem",
                        marginBottom: "2rem",
                        height: "80%",
                    }}
                />
            </Col>
        </Row>
    );
}
