import React from "react";
import PropTypes from "prop-types";
import QueueAnim from "rc-queue-anim";
import { Button, Col, Space, Row, Typography } from "antd";
import { Element } from "rc-scroll-anim";
import BannerImage from "./BannerImage";
import { assets } from "./data";

const { Title, Paragraph } = Typography;
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
        const { className, isMobile, navToShadow } = this.props;
        return (
            <Element
                component="section"
                className={`${className}-wrapper page`}
                onChange={navToShadow}
            >
                <Row>
                    <Col md={12} s={24}>
                        {isMobile ? (
                            <img
                                width="100%"
                                src={`${assets}/image/home/intro-landscape-3a409.svg`}
                                alt=""
                            />
                        ) : (
                            <BannerImage />
                        )}
                    </Col>
                    <Col
                        md={12}
                        s={24}
                        className={`${className}-text-wrapper`}
                        delay={300}
                        style={{
                            display: "flex",
                            justifyContent: "center",

                            flexDirection: "column",
                        }}
                    >
                        <Title>Save 30-50% on Phone Insurance</Title>
                        <p className="main-info" key="p">
                            Insure yourself with friends. Join a group, manage
                            premiums/claims and cut out the middle man
                        </p>
                        <Space size={16}>
                            <Button type="primary" size="large">
                                Sign up
                            </Button>
                            <Button type="primary" size="large">
                                Login
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Element>
        );
    }
}

export default Banner;
