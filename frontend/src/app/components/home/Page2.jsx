import React from "react";
import { Collapse, Row, Col, Typography, Button, Grid } from "antd";
import { RightOutlined } from "@ant-design/icons";

import "./static/indexSectionTwo.css";
import faqs from "../../constants/faqs";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Panel } = Collapse;

export default function Page2() {
    const screens = Grid.useBreakpoint();
    const isMobile = screens.xs || screens.sm || screens.md;
    const isLarge = screens.lg || screens.xl || screens.xxl;
    return (
        <div
            style={{
                backgroundColor: "#f8fafe",
                paddingTop: "4rem",
                paddingBottom: "2rem",
            }}
        >
            <Title
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                    fontSize: "2.2rem",
                }}
            >
                Frequently Asked Questions
            </Title>
            <span key="line" className="separator" />
            <Row justify={isMobile && !isLarge ? "center" : "start"}>
                <Col
                    lg={{ span: 12, offset: 6 }}
                    md={{ span: 20, offset: 2 }}
                    sm={{ span: 22, offset: 1 }}
                >
                    <Collapse>
                        {faqs.slice(0, 3).map((faq, index) => (
                            <Panel
                                header={
                                    <Title
                                        level={4}
                                        style={{ marginBottom: 0 }}
                                    >
                                        {faq.question}
                                    </Title>
                                }
                                key={faq.key}
                            >
                                <p
                                    style={{
                                        fontSize: "1.1rem",
                                        marginBottom: 0,
                                        padding: 6,
                                    }}
                                >
                                    {faq.answer}
                                </p>
                            </Panel>
                        ))}
                    </Collapse>
                    <Row justify={"end"} style={{ padding: "2rem 0 0" }}>
                        <Link to="/faqs">
                            <Button type="text">
                                More FAQs <RightOutlined />
                            </Button>
                        </Link>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
