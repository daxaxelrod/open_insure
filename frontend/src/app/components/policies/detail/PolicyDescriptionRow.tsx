import React from "react";
import { Col, Grid, Row, Space, Statistic, Tag, Typography } from "antd";
import { Peril, Policy } from "../../../../redux/reducers/types/commonTypes";
import PerilGridDisplay from "./PerilGridDisplay";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
import colors from "../../../constants/colors";

const { Title, Paragraph } = Typography;

const mockPerils: Peril[] = [
    {
        name: "Water Damage",
        id: 1,
        description:
            "Spilled water on it or dropped in the toilet, doesn't matter",
        icon_name: "alert",
    },
    {
        id: 2,
        name: "Broken Screen",
        description: "Cracked or broken screen",
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

export default function PolicyDescriptionRow({
    policy,
    hasPolicyStarted,
}: {
    policy: Policy;
    hasPolicyStarted: boolean;
}) {
    const sizes = Grid.useBreakpoint();
    const isMedOrBelow =
        (sizes.sm || sizes.xs || sizes.md) && !sizes.lg && !sizes.xl;

    const renderPolicyStatusTag = () => {
        return hasPolicyStarted ? (
            <Tag color="success" style={{ marginLeft: 10 }}>
                Coverage Active
            </Tag>
        ) : (
            <Tag color="warning" style={{ marginLeft: 10 }}>
                In Set up
            </Tag>
        );
    };

    return (
        <div
            style={{
                marginLeft: "1rem",

                display: "flex",
                height: "100%",
            }}
        >
            <Row>
                <Col
                    lg={{ span: 12 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        marginTop: isMedOrBelow ? "1.5rem" : 0,
                    }}
                >
                    <Title
                        level={4}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        Description {renderPolicyStatusTag()}
                    </Title>

                    <Paragraph>{policy.description}</Paragraph>
                    <Row justify="start">
                        <Space size={50}>
                            <Statistic
                                title={
                                    moment(policy.coverage_start_date).isBefore(
                                        moment()
                                    )
                                        ? "Started"
                                        : "Starts"
                                }
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
                <Col
                    lg={{ span: 12 }}
                    md={{ span: 0 }}
                    sm={{ span: 0 }}
                    xs={{ span: 0 }}
                >
                    <Title level={4} style={{ textAlign: "left" }}>
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
