import React, { useState } from "react";
import Banner from "../components/home/Banner";
import Page1 from "../components/home/Page1";
import WhyDoSelfInsurance from '../components/home/WhyDoSelfInsurance'
import Page2 from "../components/home/Page2";
import Page3 from "../components/home/Page3";
import Footer from "../components/home/Footer";
import styled from "styled-components";
import { Layout } from "antd";

export default function Home() {
    return (
        <Layout>
            <Layout.Content>
                <Banner key="banner" />
                <Page1 key="page1" />
                <WhyDoSelfInsurance />
                <Page2 key="page2" />
                <Page3 key="page3" />
                <Footer key="footer" />
            </Layout.Content>
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
