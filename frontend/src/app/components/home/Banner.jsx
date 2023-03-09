import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Space, Row, Typography, Grid } from "antd";
import { Element } from "rc-scroll-anim";
import heroImage from "../../../assets/images/home/hero_v2.png";
import { Link } from "react-router-dom";

const { Title } = Typography;
const Banner = ({ className = "banner" }) => {
    const sizes = Grid.useBreakpoint();

    const isTablet = sizes.md && !sizes.lg;
    const isDesktop = sizes.lg || sizes.xl;
    const isMobile = (sizes.sm || sizes.xs) && !isDesktop;
    const isSmall = sizes.sm;
    const isXSmall = sizes.xs;

    return (
        <Element component="section" className={`${className}-wrapper page`}>
            <Row style={{ padding: "35px" }} justify="start" align="middle">
                <Col
                    xl={{ span: 8, offset: 4 }}
                    lg={{ span: 8, offset: 3 }}
                    md={{ span: 18, offset: 4 }}
                    sm={{ span: 18, offset: 4 }}
                    className={`${className}-text-wrapper`}
                    delay={300}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    <Title
                        style={{
                            fontSize: "2.75rem",
                        }}
                    >
                        Save 30-50% on cell phone insurance
                    </Title>
                    <p
                        className="main-info"
                        key="p"
                        style={{
                            lineHeight: "36px",
                            fontSize: "1.5rem",
                            margin: "30px 0 40px",
                            fontWeight: 300,
                            color: "rgba(0, 0, 0, 0.65)",
                        }}
                    >
                        Create & manage a self insurance policy with people you
                        already trust.
                    </p>

                    <Link to={"/join"} style={{ display: "flex" }}>
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                fontWeight: "bold",
                                width: "100%",
                            }}
                        >
                            Browse Policies
                        </Button>
                    </Link>
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
                        marginTop: 20,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        ...(isDesktop
                            ? {
                                  transform: "translateX(30%)",
                                  marginBottom: "1.5rem",
                              }
                            : isSmall
                            ? {
                                  transform: "translateX(2%)",
                              }
                            : isXSmall
                            ? { transform: "translateX(-2%)" }
                            : {}),
                    }}
                >
                    <img
                        width={
                            isDesktop
                                ? "130%"
                                : isTablet && !isMobile
                                ? "100%"
                                : sizes.xs
                                ? "115%"
                                : "100%"
                        }
                        height={
                            isDesktop
                                ? "125%"
                                : isTablet && !isMobile
                                ? "95%"
                                : sizes.xs
                                ? "115%"
                                : "100%"
                        }
                        style={{
                            marginTop: isTablet
                                ? "2rem"
                                : isMobile
                                ? "1rem"
                                : 0,
                        }}
                        src={heroImage}
                        alt=""
                    />
                </Col>
            </Row>
        </Element>
    );
};

export default Banner;
