import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Space, Row, Typography } from "antd";
import { Element } from "rc-scroll-anim";
import heroImage from "../../../assets/images/home/hero_v2.jpeg";
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
                <Row style={{ padding: "35px" }} justify="start" align="middle">
                    <Col
                        xl={{ span: 8, offset: 4 }}
                        lg={{ span: 8, offset: 3 }}
                        md={{ span: 16, offset: 4 }}
                        sm={{ span: 16, offset: 4 }}
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
                            A free self-insurance platform
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
                            Save 30-50% on cell phone protection plans by
                            insuring yourself with peers.
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
                    <Col
                        lg={{ span: 12, offset: 0 }}
                        md={{ span: 24, offset: 0 }}
                        sm={{ span: 24, offset: 0 }}
                        style={{
                            marginTop: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img width="70%" height="70%" src={heroImage} alt="" />
                    </Col>
                </Row>
            </Element>
        );
    }
}

export default Banner;
