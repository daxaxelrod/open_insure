import React from "react";
import { Col, Collapse, Row, Typography } from "antd";

import OpenInsureFooter from "../../components/home/Footer";
import faqs from "../../constants/faqs";

const { Title } = Typography;
const { Panel } = Collapse;

export default function FAQs() {
    return (
        <>
            <div style={{ padding: 24 }}>
                <Row>
                    <Col lg={{ span: 4 }} sm={{ span: 22, offset: 2 }}>
                        <Title level={2}>Frequently Asked Questions</Title>
                    </Col>
                    <Col lg={{ span: 12 }} sm={{ span: 22, offset: 2 }}>
                        <Collapse defaultActiveKey={faqs.map((f) => f.key)}>
                            {faqs.map((faq) => (
                                <Panel header={faq.question} key={faq.key}>
                                    {faq.answer}
                                </Panel>
                            ))}
                        </Collapse>
                    </Col>
                </Row>
            </div>
            <div style={{ marginTop: 100 }} />
            <OpenInsureFooter key="footer" />
        </>
    );
}
