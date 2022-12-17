import { Button, Col, Divider, Row, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import colors from "../../constants/colors";
import InterestedUserForm from "./InterestedUserForm";

const { Title, Paragraph } = Typography;

const StyledParagraph = styled(Paragraph)({
    fontSize: "1.1rem",
    lineHeight: "1.8rem",
    marginBottom: 0,
});

export default function AskForEmail() {
    return (
        <div
            style={{
                backgroundColor: "white",
                paddingBottom: "5rem",
                paddingTop: "3rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
            }}
        >
            <Row>
                <Col md={{ span: 12, offset: 4 }} lg={{ span: 8, offset: 4 }}>
                    <Title
                        level={4}
                        style={{ color: colors.linkColor, marginTop: "2.4rem" }}
                    >
                        Early access
                    </Title>
                    <Title style={{ marginTop: 0 }}>Apply to our beta</Title>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 20, offset: 4 }} lg={{ span: 7, offset: 4 }}>
                    <StyledParagraph>
                        Only friends and family of policy members can join
                        existing policies. Sign up for our waitlist to be
                        notified of when we open up to the public. We'll also
                        let you know when we add new policy lines like jewlery,
                        pet, renters, and more.
                    </StyledParagraph>
                </Col>
                <Col
                    md={{ span: 20, offset: 4 }}
                    lg={{ span: 9, offset: 1 }}
                    style={{ marginTop: "1.4rem" }}
                >
                    <InterestedUserForm />

                    {/* <Divider>Or</Divider>

                    <Link to="/join">
                        <Button>Just Browse</Button>
                    </Link> */}
                </Col>
            </Row>
        </div>
    );
}
