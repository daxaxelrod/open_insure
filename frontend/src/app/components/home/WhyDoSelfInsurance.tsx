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
    const isMobile = screens.xs || screens.sm || screens.md;

    return (
        <div style={{ backgroundColor: "white", padding: "35px" }}>
            <Row>
                <Col md={{ span: 12, offset: 4 }} lg={{ span: 8, offset: 4 }}>
                    <Title
                        level={4}
                        style={{ color: colors.linkColor, marginTop: "2.4rem" }}
                    >
                        Why do self-insurance?
                    </Title>
                    <Title style={{ marginTop: 0 }}>Save Money</Title>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 20, offset: 4 }} lg={{ span: 8, offset: 4 }}>
                    <StyledParagraph>
                        A conventional insurance company makes a profit by
                        collecting more in premiums than it pays out in claims.
                    </StyledParagraph>
                </Col>
                <Col md={{ span: 20, offset: 4 }} lg={{ span: 7, offset: 1 }}>
                    <StyledParagraph>
                        Self-insurance is a way of protecting yourself or your
                        things without using an insurance company. Instead of
                        paying someone else to help you if something bad
                        happens, you save up your own money to use in case of an
                        claim.
                    </StyledParagraph>
                </Col>
            </Row>
            <Row align="middle" style={{ marginTop: "2rem" }}>
                <Col
                    md={{ span: 20, offset: isMobile ? 4 : 0 }}
                    lg={{ span: 8, offset: isMobile ? 1 : 0 }}
                >
                    <ImageHeading>Conventional Insurance</ImageHeading>
                    <img
                        src={traditional_companies_sankey}
                        style={{ width: isMobile ? "95%" : "100%" }}
                        alt="Image one"
                    />
                </Col>
                <Col md={{ span: 20, offset: 4 }} lg={{ span: 8, offset: 1 }}>
                    <ImageHeading
                        style={{
                            marginTop: isMobile ? 40 : 0,
                        }}
                    >
                        Open Insure
                    </ImageHeading>
                    <img
                        src={open_insure_sankey}
                        style={{ width: isMobile ? "95%" : "100%", zIndex: 1 }}
                    />
                </Col>
            </Row>
        </div>
    );
}
