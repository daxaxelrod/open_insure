import React, { useState } from "react";
import { Button, Col, Row, Space, Typography } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { Link } from "react-router-dom";
import Header from "../components/home/Header";
import Banner from "../components/home/Banner";
import Page1 from "../components/home/Page1";
import Page2 from "../components/home/Page2";
import Page3 from "../components/home/Page3";
import Page4 from "../components/home/Page4";
import Page5 from "../components/home/Page5";
import Footer from "../components/home/Footer";

const { Title, Paragraph } = Typography;

export default function Home() {
    const [isMobile, setIsMobile] = useState(false);

    return (
        <Layout>
            <Content>
                <Banner
                    key="banner"
                    isMobile={isMobile}
                    navToShadow={() => {}}
                />
                <Page1 key="page1" />
                <Page2 key="page2" />
                <Page3 key="page3" />
                <Page4 key="page4" isMobile={isMobile} />
                <Page5 key="page5" />
                {/* <Row>
                    <Col span={12}>
                        <Typography>
                            <Title level={2}>Self insure with confidence</Title>
                        </Typography>
                    </Col>
                    <Col span={12}>
                        <Typography>
                            <Paragraph>Search for insurance policies</Paragraph>
                            <Paragraph>Pay Premiums to escrow</Paragraph>
                            <Paragraph>
                                Vote democratically on Premiums
                            </Paragraph>
                        </Typography>
                        <Typography>
                            <Paragraph>Want to know more?</Paragraph>
                        </Typography>
                        <Space size={12}>
                            <Link to={"/join"}>
                                <Button
                                    type="primary"
                                    shape="round"
                                    size={"large"}
                                >
                                    Register
                                </Button>
                            </Link>
                            <Link to={"/login"}>
                                <Button
                                    type="primary"
                                    shape="round"
                                    size={"large"}
                                >
                                    Login
                                </Button>
                            </Link>
                        </Space>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Typography>
                            <Title level={2}>
                                How is open insure different
                            </Title>
                        </Typography>
                    </Col>
                    <Col span={12}>
                        <Typography>
                            <Paragraph>
                                We make money from a small monthly fee.
                                Regardless if you have 1 policy or 100 policies,
                                you pay a flat rate
                            </Paragraph>
                            <Paragraph>Completely Open Source</Paragraph>
                        </Typography>
                    </Col>
                </Row> */}
                <Footer key="footer" />
            </Content>
        </Layout>
    );
}
