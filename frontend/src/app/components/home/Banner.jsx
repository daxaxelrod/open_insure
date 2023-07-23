import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Space, Row, Typography, Grid } from "antd";
import { Element } from "rc-scroll-anim";
import heroImage from "../../../assets/images/home/hero_v2.png";
import PerilousPhoneScene from "./getAQuote/three/PerilousPhoneScene";
import DemoQuoteForm from "./getAQuote/form/DemoQuoteForm";

const { Title } = Typography;
const Banner = ({ className = "banner" }) => {
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
                            fontSize: "2.75rem",
                        }}
                    >
                        See how much you can save
                    </Title>

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
                >
                    <PerilousPhoneScene />
                </Col>
            </Row>
        </Element>
    );
};

export default Banner;
