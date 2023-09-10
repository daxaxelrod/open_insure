import React from "react";
import { Col, Grid, Row } from "antd";
import { Typography } from "antd";
import HandDrawnCircle from "../../../assets/images/home/handdrawn_oval.svg";
import HandDrawnOval from "./static/HandDrawnOval";
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
                }}
            >
                <Title level={1} style={{ marginBottom: 0, marginTop: 24 }}>
                    Insurance Should be
                </Title>
                <Title
                    style={{
                        marginTop: 0,
                    }}
                >
                    Free
                </Title>
                <HandDrawnOval
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                />
            </Col>
            <Col
                xl={{ span: 12, offset: 0 }}
                lg={{ span: 10, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                sm={{ span: 24, offset: 0 }}
            ></Col>
        </Row>
    );
}
