import React from "react";
import { Row, Col, Layout, notification } from "antd";
import { Link } from "react-router-dom";

const { Footer } = Layout;

function OpenInsureFooter() {
    return (
        <Footer className="dark" style={{ marginBottom: 60 }}>
            <div className="footer-wrap">
                <Row>
                    <Col
                        lg={{
                            span: 4,
                            offset: 6,
                        }}
                        sm={24}
                        xs={24}
                    >
                        <div className="footer-center">
                            <h2>Links</h2>
                            <div>
                                <Link to="/login">Login</Link>
                            </div>
                            <div>
                                <Link to="/join">Sign Up</Link>
                            </div>
                        </div>
                    </Col>

                    <Col lg={4} sm={24} xs={24}>
                        <div className="footer-center">
                            <h2>Api</h2>
                            <div>
                                <a
                                    target="_blank"
                                    rel="noopener"
                                    href="https://github.com/daxaxelrod/open_insure"
                                >
                                    Deployment Instructions
                                </a>
                            </div>
                            <div>
                                <a
                                    onClick={() => {
                                        notification.info({
                                            placement: "bottomRight",
                                            message: "Interest noted",
                                            description: "Will build if demand",
                                        });
                                    }}
                                >
                                    Api Docs
                                </a>
                            </div>
                            <div>
                                <a
                                    onClick={() => {
                                        notification.info({
                                            placement: "bottomRight",
                                            message: `The backend is served from ${process.env.REACT_APP_BACKEND_URL}`,
                                        });
                                    }}
                                >
                                    Backend Location
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} sm={24} xs={24}>
                        <div className="footer-center">
                            <h2>Like this project?</h2>
                            <div>
                                <a
                                    onClick={() => {
                                        notification.success({
                                            placement: "bottomRight",
                                            message: "Link copied to clipboard",
                                        });
                                        navigator?.clipboard?.writeText(
                                            window.location.host
                                        );
                                    }}
                                >
                                    Tell your friends!
                                </a>
                            </div>
                            <div>
                                <a
                                    target="_blank"
                                    href="https://github.com/daxaxelrod/open_insure"
                                >
                                    Star on Github
                                </a>
                            </div>
                            <div>
                                <a
                                    href="https://github.com/daxaxelrod/open_insure/graphs/contributors"
                                    target={"_blank"}
                                >
                                    Follow the creators
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}

export default OpenInsureFooter;
