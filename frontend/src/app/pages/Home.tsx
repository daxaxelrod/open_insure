import React, { useState } from "react";
import Layout, { Content } from "antd/lib/layout/layout";
import Banner from "../components/home/Banner";
import Page1 from "../components/home/Page1";
import Page2 from "../components/home/Page2";
import Page3 from "../components/home/Page3";
import Footer from "../components/home/Footer";
import styled from "styled-components";

export default function Home() {
    return (
        <Layout>
            <Content>
                <Banner key="banner" />
                <Page1 key="page1" />
                <Page2 key="page2" />
                <Page3 key="page3" />
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

export const Container = styled.div`
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 576px) {
        max-width: 576px;
    }

    @media (min-width: 768px) {
        max-width: 768px;
    }

    @media (min-width: 992px) {
        max-width: 992px;
    }

    @media (min-width: 1200px) {
        max-width: 2200px;
    }
`;
