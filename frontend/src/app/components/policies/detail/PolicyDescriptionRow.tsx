import React from "react";
import { Col, Row, Space, Statistic, Typography } from "antd";
import { Peril, Policy } from "../../../../redux/reducers/commonTypes";
import PerilGridDisplay from "./PerilGridDisplay";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment-timezone";

const { Title, Paragraph } = Typography;

const mockPerils: Peril[] = [
    {
        name: "Water Damage",
        id: 1,
        description:
            "Spilled water on it or dropped in the toilet, doesnt matter",
        icon_name: "alert",
    },
    {
        id: 2,
        name: "Broken Screen",
        description: "Screen cracked or broken",
        icon_name: "meh",
    },
    {
        id: 3,
        name: "All others",
        description:
            "This is an extrememly liberal policy. Make your case to the group and let them decide",
        icon_name: "crown",
    },
];

export default function PolicyDescriptionRow({ policy }: { policy: Policy }) {
    return (
        <div
            style={{
                margin: "24px 0px 2rem 3rem",
            }}
        >
            <Row>
                <Col
                    span={12}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingRight: "1.5rem",
                    }}
                >
                    <Title level={4}>Description</Title>
                    <Paragraph>{policy.description}</Paragraph>
                    <Row justify="start">
                        <Space size={50}>
                            <Statistic
                                title="Starts"
                                value={moment(
                                    policy.coverage_start_date
                                ).format("MMMM Do YYYY")}
                                valueStyle={{ fontSize: 14 }}
                                prefix={<CalendarOutlined />}
                            />
                            <Statistic
                                title="Duration"
                                value={policy.coverage_duration}
                                valueStyle={{ fontSize: 14 }}
                                suffix={"Months"}
                            />
                        </Space>
                    </Row>
                </Col>
                <Col span={12}>
                    <Title level={4} style={{ textAlign: "center" }}>
                        Covered Events
                    </Title>
                    <Row>
                        {policy.perils
                            .map((peril) => (
                                <Col
                                    span={12}
                                    style={{ padding: "2rem 0 2rem 0" }}
                                    key={peril.id}
                                >
                                    <PerilGridDisplay peril={peril} />
                                </Col>
                            ))
                            .slice(0, 4)}
                        {policy.perils.length === 0 &&
                            mockPerils.map((peril) => (
                                <Col
                                    span={12}
                                    style={{ padding: "1rem 0 2rem 0" }}
                                    key={`${peril.id}-mock`}
                                >
                                    <PerilGridDisplay peril={peril} />
                                </Col>
                            ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
