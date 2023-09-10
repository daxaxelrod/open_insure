import React from "react";
import { Col, Grid, Row, Tooltip } from "antd";
import { Typography } from "antd";
import HandDrawnCircle from "../../../assets/images/home/handdrawn_oval.svg";
import HandDrawnOval from "./static/HandDrawnOval";
import heroGraphic from "../../../assets/images/home/hero_v2.png";
import colors from "../../constants/colors";
import { QuestionCircleOutlined } from "@ant-design/icons";
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
                                "rotate(10deg) translateX(85px) translateY(-10px)",
                        }}
                    />
                </div>
                <div>
                    <Paragraph
                        style={{
                            fontSize: "1.25rem",
                            color: colors.gray7,
                            fontWeight: 400,
                            marginTop: ".5rem",
                        }}
                    >
                        Open Insure let's you painlessly self-insure your
                        personal property all on a modern web platform
                    </Paragraph>
                    <div
                        style={{
                            width: "60%",
                            height: 3,
                            background: `linear-gradient(90deg, ${colors.brandTeal} 0%, ${colors.logoTeal} 100%)`,

                            borderRadius: 10,
                        }}
                    />
                    <Row>
                        <Col span={6}>
                            <div>34%</div>
                            <div>Typical Savings</div>
                        </Col>
                        <Col span={6}>
                            <div>34%</div>
                            <div>
                                Typical Savings{" "}
                                <Tooltip
                                    color="black"
                                    placement="rightTop"
                                    overlayStyle={{
                                        minWidth: 320,
                                    }}
                                    title={() => (
                                        <div style={{ padding: 10 }}>
                                            <div>
                                                Refund amount varies by policy
                                                and depends on the cost to cover
                                                claims during the coverage
                                                period. Refunds are not
                                                guaranteed. Policies with more
                                                conservative underwriting
                                                assumptions tend to have higher
                                                premiums and also larger
                                                potential refunds.
                                            </div>
                                        </div>
                                    )}
                                >
                                    <QuestionCircleOutlined
                                        style={{
                                            cursor: "pointer",
                                            color: colors.gray7,
                                            padding: "3px 10px 10px 3px",
                                            marginLeft: 1,
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col
                xl={{ span: 12, offset: 0 }}
                lg={{ span: 10, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                sm={{ span: 24, offset: 0 }}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img
                    src={heroGraphic}
                    alt="Screenshot of Open Insure's web app"
                    style={{
                        marginLeft: "2rem",
                        marginTop: "2rem",
                        marginBottom: "4.7rem",
                        height: "28rem",
                    }}
                />
            </Col>
        </Row>
    );
}
