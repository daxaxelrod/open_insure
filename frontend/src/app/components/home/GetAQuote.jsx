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
const GetAQuote = ({ className = "banner" }) => {
    const { quote } = useContext(PublicQuoteContext);
    const sizes = Grid.useBreakpoint();
    const isMdOrBelow =
        sizes.xs || sizes.sm || sizes.md || window.innerWidth < 768;
    return (
        <Element component="section" className={`${className}-wrapper page`}>
            <Row
                style={{ padding: "0", overflow: "hidden" }}
                justify="start"
                align="middle"
            >
                <Col
                    xl={{ span: 8, offset: 3 }}
                    lg={{ span: 12, offset: 2 }}
                    md={{ span: 18, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    xs={{ span: 20, offset: 2 }}
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
                            marginTop: isMdOrBelow ? "2rem" : "0",
                        }}
                        level={isMdOrBelow ? 2 : 1}
                        id="public-demo-quote-form"
                    >
                        How much can you save?
                    </Title>
                    <Paragraph
                        type="secondary"
                        style={{
                            fontSize: "1.2rem",
                        }}
                    >
                        Get a cell phone protection quote in 30 seconds
                    </Paragraph>

                    <DemoQuoteForm />
                </Col>
                {/* <div>
                    {isDesktop && "Desktop"}
                    {isTablet && "Tablet"}
                    {isMobile && "Mobile"}
                </div> */}
                <Col
                    xl={{ span: 12, offset: 0 }}
                    lg={{ span: 10, offset: 0 }}
                    md={{ span: 24, offset: 0 }}
                    sm={{ span: 24, offset: 0 }}
                    xs={{ span: 24, offset: 0 }}
                    id={"public-demo-quote-explanation"}
                >
                    {quote ? <QuoteComparison /> : <PerilousPhoneScene />}
                </Col>
            </Row>
        </Element>
    );
};

export default GetAQuote;
