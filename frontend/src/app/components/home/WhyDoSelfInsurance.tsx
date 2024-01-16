import React from "react";
import { Col, Typography, Row, Grid } from "antd";
import traditional_companies_sankey from "../../../assets/images/home/traditional_companies_sankey.svg";
import open_insure_sankey from "../../../assets/images/home/open_insure_sankey.svg";
import colors from "../../constants/colors";
import styled from "styled-components";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const StyledParagraph = styled(Paragraph)({
    fontSize: "1.1rem",
    lineHeight: "1.8rem",
});

const ImageHeading = styled(Paragraph)({
    fontSize: "1.2rem",
    fontWeight: "bold",
    textAlign: "center",
});

export default function WhyDoSelfInsurance() {
    const screens = useBreakpoint();
    const isMobile = !screens.lg;
    const isSmOrBelow = !screens.md && (screens.sm || screens.xs);

    return (
        <div
            style={{
                backgroundColor: "white",
            }}
            id="public-why-do-self-insurance"
        >
            <Row>
                <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 12, offset: 2 }}
                    lg={{ span: 8, offset: 2 }}
                    xl={{ span: 8, offset: 3 }}
                >
                    <Title
                        level={4}
                        style={{ color: colors.linkColor, marginTop: "2.4rem" }}
                    >
                        Why self insure?
                    </Title>
                    <Title style={{ marginTop: 0 }}>Save Money</Title>
                </Col>
            </Row>
            <Row>
                <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 18, offset: 2 }}
                    lg={{ span: 9, offset: 2 }}
                    xl={{ span: 8, offset: 3 }}
                    xxl={{ span: 8, offset: 3 }}
                >
                    <StyledParagraph>
                        A conventional insurance company makes a profit by
                        collecting more in premiums than it pays out in claims.
                    </StyledParagraph>
                </Col>
                <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 18, offset: 2 }}
                    lg={{ span: 9, offset: 2 }}
                    xl={{ span: 8, offset: 2 }}
                    xxl={{ span: 8, offset: 2 }}
                >
                    <StyledParagraph>
                        With self insurance, your money stays between you and
                        your policy group. You manage your premiums and
                        adjudicate claims. When your policy expires, get your
                        <strong> unused premiums back.</strong>
                    </StyledParagraph>
                </Col>
            </Row>
            <Row
                align="middle"
                style={{ marginTop: "2rem", paddingBottom: "1.5rem" }}
            >
                <Col
                    lg={{ span: 8, offset: isMobile ? 1 : 3 }}
                    md={{ span: 18, offset: isMobile ? 4 : 0 }}
                    sm={{ span: 20, offset: 2 }}
                    xs={{ span: 23, offset: 1 }}
                >
                    <ImageHeading>Conventional Insurance</ImageHeading>
                    <img
                        src={traditional_companies_sankey}
                        style={{ width: isMobile ? "95%" : "100%" }}
                        alt="Image one"
                    />
                </Col>
                <Col
                    md={{ span: 18, offset: 4 }}
                    lg={{ span: 8, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    xs={{ span: 23, offset: 1 }}
                >
                    <ImageHeading
                        style={{
                            marginTop: isMobile ? 40 : 0,
                            position: "relative",
                            ...(isMobile ? { zIndex: 10 } : {}),
                        }}
                    >
                        Open Insure
                    </ImageHeading>
                    <img
                        src={open_insure_sankey}
                        style={{
                            width: isMobile ? "95%" : "100%",
                            zIndex: 1,
                            position: "relative",
                            ...(isMobile ? { marginTop: -20 } : {}),
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}
