import React from "react";
import { Element } from "rc-scroll-anim";
import { Row, Col, Typography, Button } from "antd";
import useWindowSize from "../hooks/useWindowSize";
import { GithubOutlined } from "@ant-design/icons";

import "./static/indexSectionThree.css";

const { Title, Paragraph } = Typography;

export default function Page3() {
    const size = useWindowSize();
    return (
        <Element
            component="section"
            className="page-wrapper page3 text-center"
            style={{ padding: 24 }}
        >
            <Row gutter={16} className="page">
                <Col
                    key={"githubholder"}
                    md={{ span: 4, offset: 5 }}
                    xs={24}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        marginBottom: size.width < 768 ? "2rem" : "0",
                    }}
                >
                    <GithubOutlined
                        style={{ fontSize: "10rem", color: "white" }}
                    />
                </Col>
                <Col
                    key={"githubExplainer"}
                    md={{ span: 11, offset: 1 }}
                    xs={24}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: size.width < 768 ? "2rem" : "0",
                    }}
                >
                    <Title
                        style={{
                            fontSize: "3rem",
                            color: "white",
                        }}
                    >
                        Free & open source
                    </Title>
                    <Paragraph
                        style={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "1.6rem",
                        }}
                    >
                        Transparency is a core tenet of this Open Insure. Our
                        code is open source and available on GitHub.
                    </Paragraph>
                    <a
                        href={"https://github.com/daxaxelrod/open_insure"}
                        target="_blank"
                    >
                        <Button
                            icon={<GithubOutlined />}
                            type={"text"}
                            size="large"
                            style={{ color: "white" }}
                        >
                            View on GitHub
                        </Button>
                    </a>
                </Col>
                <Col md={6} sm={0} />
            </Row>
        </Element>
    );
}
