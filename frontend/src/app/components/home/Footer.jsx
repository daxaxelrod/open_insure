import React from "react";
import { Row, Col, Layout, notification } from "antd";
import { Link } from "react-router-dom";

const { Footer } = Layout;

function OpenInsureFooter() {
    const [api, contextHolder] = notification.useNotification();

    return (
        <Footer className="dark" style={{ marginBottom: 60 }}>
            {contextHolder}
            <div className="footer-wrap">
                <Row>
                    <Col
                        lg={{
                            span: 4,
                            offset: 6,
                        }}
                        md={{ span: 4, offset: 6 }}
                        sm={{ span: 12 }}
                        xs={{ span: 12 }}
                    >
                        <div className="footer-center">
                            <h2>Links</h2>
                            <div style={{ marginBottom: 8 }}>
                                <Link to="/login">Login</Link>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <Link to="/join">Sign Up</Link>
                            </div>
                        </div>
                    </Col>

                    <Col lg={4} md={4} sm={{ span: 12 }} xs={{ span: 12 }}>
                        <div className="footer-center">
                            <h2>API</h2>
                            <div style={{ marginBottom: 8 }}>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://github.com/daxaxelrod/open_insure#readme"
                                >
                                    Deployment Instructions
                                </a>
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <a
                                    onClick={() => {
                                        api.info({
                                            placement: "bottomRight",
                                            message: "Interest noted",
                                            description:
                                                "Will build if there is demand",
                                        });
                                    }}
                                >
                                    API Docs
                                </a>
                            </div>
                            <div style={{ marginBottom: 15 }}>
                                <a
                                    onClick={() => {
                                        api.info({
                                            placement: "bottomRight",
                                            message: `The backend is served from ${process.env.REACT_APP_BACKEND_URL}`,
                                        });
                                    }}
                                >
                                    Backend Url
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} sm={24} xs={24}>
                        <div className="footer-center">
                            <h2>Extras</h2>
                            <div style={{ marginBottom: 8 }}>
                                <a
                                    onClick={() => {
                                        api.success({
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
                            <div style={{ marginBottom: 8 }}>
                                <a
                                    target="_blank"
                                    href="https://github.com/daxaxelrod/open_insure"
                                >
                                    Star on Github
                                </a>
                            </div>
                            <div style={{ marginBottom: 8 }}>
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
