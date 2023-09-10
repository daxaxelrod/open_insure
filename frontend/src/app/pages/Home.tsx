import GetAQuote from "../components/home/GetAQuote";
import EducationalLeader from "../components/home/EducationalLeader";
import WhyDoSelfInsurance from "../components/home/WhyDoSelfInsurance";
import AskForEmail from "../components/home/AskForEmail";
import Page2 from "../components/home/Page2";
import Page3 from "../components/home/Page3";
import Footer from "../components/home/Footer";
import { Layout } from "antd";
import PublicQuoteProvider from "../components/contexts/PublicQuoteContext";

export default function Home() {
    return (
        <PublicQuoteProvider>
            <Layout>
                <Layout.Content>
                    <EducationalLeader />
                    <GetAQuote key="banner" />
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
