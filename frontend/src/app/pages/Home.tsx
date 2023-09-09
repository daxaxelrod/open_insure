import React, { useState } from "react";
import Banner from "../components/home/Banner";
import Page1 from "../components/home/Page1";
import WhyDoSelfInsurance from "../components/home/WhyDoSelfInsurance";
import AskForEmail from "../components/home/AskForEmail";
import HeresHowItWorks from "../components/home/HeresHowItWorks";
import Page2 from "../components/home/Page2";
import Page3 from "../components/home/Page3";
import Footer from "../components/home/Footer";
import styled from "styled-components";
import { Grid, Layout } from "antd";
import PublicQuoteProvider from "../components/contexts/PublicQuoteContext";

export default function Home() {
    return (
        <PublicQuoteProvider>
            <Layout>
                <Layout.Content>
                    <Banner key="banner" />
                    {/* <Page1 key="page1" /> */}
                    <WhyDoSelfInsurance />

                    <Page2 key="page2" />
                    <AskForEmail />
                    <Page3 key="page3" />
                    <Footer key="footer" />
                </Layout.Content>
            </Layout>
        </PublicQuoteProvider>
    );
}
