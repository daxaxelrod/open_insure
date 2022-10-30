import React from "react";
import QueueAnim from "rc-queue-anim";
import { Row, Col, Card, Typography } from "antd";
import { page1 } from "./data";

import "./static/indexSectionOne.css";

const { Title } = Typography;

export default function Page1() {
    const children = page1.map((card, i) => (
        <Col
            key={i.toString()}
            lg={{ span: 6 }}
            style={{
                flex: 1,
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
                    height: "100%",
                }}
            >
                <Title level={3} style={{ textAlign: "center" }}>
                    {card.title}
                </Title>
                <img
                    src={card.img}
                    alt=""
                    style={{
                        margin: "0 auto",
                        width: "100%",
                        height: 60,
                        borderTopLeftRadius: "-0.75rem",
                        borderTopRightRadius: "-0.75rem",
                        marginBottom: "1rem",
                    }}
                />
                <div className="card-body">
                    <span className="description text-secondary">
                        {card.description}
                    </span>
                </div>
            </Card>
        </Col>
    ));

    return (
        <section className="page-wrapper page1" style={{ paddingBottom: 100 }}>
            <QueueAnim
                component={Row}
                type="bottom"
                delay={500}
                componentProps={{ justify: "center", gutter: 16 }}
            >
                {children}
            </QueueAnim>
        </section>
    );
}
