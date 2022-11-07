import React from "react";
import QueueAnim from "rc-queue-anim";
import { Row, Col, Card, Typography } from "antd";
import { page1 } from "./data";

import "./static/indexSectionOne.css";
import useWindowSize from "../hooks/useWindowSize";

const { Title, Paragraph } = Typography;

export default function Page1() {
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const children = page1.map((card, i) => (
        <Col
            key={i.toString()}
            lg={{ span: 6, offset: i === 0 ? 3 : 0 }}
            md={{ span: 12, offset: i === 0 ? 2 : 0 }}
            sm={24}
            style={{
                height: "100%",
                justifyContent: "center",
            }}
        >
            <Card
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Title level={3} style={{ textAlign: "center" }}>
                    {card.title}
                </Title>
                
                <div className="card-body">
                    <Paragraph className="description text-secondary">
                        {card.description}
                    </Paragraph>
                </div>
            </Card>
        </Col>
    ));

    return (
        <section
            className="page-wrapper page1"
            style={{
                paddingTop: 35,
                paddingBottom: 50,
            }}
        >
            <QueueAnim
                component={Row}
                type="bottom"
                delay={500}
                componentProps={{ gutter: 16 }}
            >
                {children}
            </QueueAnim>
        </section>
    );
}
