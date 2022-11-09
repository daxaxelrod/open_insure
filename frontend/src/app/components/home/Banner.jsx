import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Space, Row, Typography } from "antd";
import { Element } from "rc-scroll-anim";
import heroImage from "../../../assets/images/hero_open_insure.png";
import { Link } from "react-router-dom";

const { Title } = Typography;
class Banner extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        isMobile: PropTypes.bool,
        navToShadow: PropTypes.func,
    };
    static defaultProps = {
        className: "banner",
    };
    render() {
        const { className } = this.props;
        return (
            <Element
                component="section"
                className={`${className}-wrapper page`}
            >
                <Row>
                    <Col
                        xl={{ span: 6, offset: 5 }}
                        lg={{ span: 6, offset: 3 }}
                        md={{ span: 12, offset: 2 }}
                        sm={24}
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
                                fontSize: "3rem",
                            }}
                        >
                            The cheapest insurance legally possible
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
                            Insure yourself with friends. Join a group, manage
                            members, premiums, and claims while cutting out the
                            middle man.
                        </p>
                        <Space size={26}>
                            <Link to={"/join"}>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ fontWeight: "bold" }}
                                >
                                    Sign up
                                </Button>
                            </Link>
                            {/* <Link to={"/login"}>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ fontWeight: "bold" }}
                                >
                                    Login
                                </Button>
                            </Link> */}
                        </Space>
                    </Col>
                    <Col md={10} s={22}>
                        <img width="100%" src={heroImage} alt="" />
                    </Col>
                </Row>
            </Element>
        );
    }
}

export default Banner;
