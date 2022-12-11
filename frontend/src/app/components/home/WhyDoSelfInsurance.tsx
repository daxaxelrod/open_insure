import React from "react";
import securityOnRe from "../../../assets/images/undraw_security_on_re_e491.svg";
import { Col, Typography, Row } from "antd";
import traditional_companies_sankey from "../../../assets/images/home/traditional_companies_sankey.svg";
import open_insure_sankey from "../../../assets/images/home/open_insure_sankey.svg";
import colors from "../../constants/colors";
import styled from "styled-components";

const { Title, Paragraph } = Typography;

const StyledParagraph = styled(Paragraph)({
    fontSize: "1.2rem",
    lineHeight: "1.8rem",
});

const ImageHeading = styled(Paragraph)({
    fontSize: "1.2rem",
    fontWeight: "bold",
    textAlign: "center",
});

export default function WhyDoSelfInsurance() {
    return (
        <div style={{ backgroundColor: "white" }}>
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
                <Col md={{ span: 12, offset: 4 }} lg={{ span: 8, offset: 4 }}>
                    <StyledParagraph>
                        Self-insurance is a way of protecting yourself or your
                        things without using an insurance company. Instead of
                        paying someone else to help you if something bad
                        happens, you save up your own money to use in case of an
                        claim.
                    </StyledParagraph>
                </Col>
                <Col md={{ span: 12, offset: 1 }} lg={{ span: 7, offset: 0 }}>
                    <StyledParagraph>
                        An insurance company makes a profit by collecting more
                        in premiums than it pays out in claims.
                    </StyledParagraph>
                </Col>
            </Row>
            <Row
                justify={"center"}
                align="middle"
                style={{ marginTop: "2rem" }}
            >
                <Col md={12} lg={{ span: 8, offset: 4 }}>
                    <ImageHeading>Insurance Company</ImageHeading>
                    <img
                        src={traditional_companies_sankey}
                        style={{ width: "100%" }}
                        alt="Image one"
                    />
                </Col>
                <Col md={12} lg={{ span: 8, offset: 1 }}>
                    <ImageHeading>Open Insure</ImageHeading>
                    <img src={open_insure_sankey} style={{ width: "100%" }} />
                </Col>
            </Row>
        </div>
    );
}
