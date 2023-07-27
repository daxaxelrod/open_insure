import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Button, Col, Space, Row, Typography, Grid } from "antd";
import { Element } from "rc-scroll-anim";
import heroImage from "../../../assets/images/home/hero_v2.png";
import PerilousPhoneScene from "./getAQuote/three/PerilousPhoneScene";
import DemoQuoteForm from "./getAQuote/form/DemoQuoteForm";
import { PublicQuoteContext } from "../contexts/PublicQuoteContext";
import QuoteComparison from "./getAQuote/result/QuoteComparison";

const { Title, Paragraph } = Typography;
const Banner = ({ className = "banner" }) => {
    const { quote } = useContext(PublicQuoteContext);
    return (
        <Element component="section" className={`${className}-wrapper page`}>
            <Row
                style={{ padding: "0", overflow: "hidden" }}
                justify="start"
                align="middle"
            >
                <Col
                    xl={{ span: 8, offset: 3 }}
                    lg={{ span: 8, offset: 3 }}
                    md={{ span: 18, offset: 3 }}
                    sm={{ span: 18, offset: 3 }}
                    className={`${className}-text-wrapper`}
                    style={{
                        paddingRight: "2rem",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Title
                        style={{
                            marginBottom: "0",
                        }}
                        level={1}
                    >
                        Self Insurance Calculator
                    </Title>
                    <Paragraph
                        type="secondary"
                        style={{
                            marginBottom: "1.5rem",
                        }}
                    >
                        See how much you can save
                    </Paragraph>

                    <DemoQuoteForm />
                </Col>
                {/* <div>
                    {isDesktop && "Desktop"}
                    {isTablet && "Tablet"}
                    {isMobile && "Mobile"}
                </div> */}
                <Col
                    lg={{ span: 12, offset: 0 }}
                    md={{ span: 24, offset: 0 }}
                    sm={{ span: 24, offset: 0 }}
                    style={{
                        minHeight: 650,
                    }}
                >
                    {quote ? <QuoteComparison /> : <PerilousPhoneScene />}
                </Col>
            </Row>
        </Element>
    );
};

export default Banner;
