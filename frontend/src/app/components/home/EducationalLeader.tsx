import React from "react";
import { Button, Col, Grid, List, Row, Tooltip } from "antd";
import { Typography } from "antd";
import HandDrawnCircle from "../../../assets/images/home/handdrawn_oval.svg";
import HandDrawnOval from "./static/HandDrawnOval";
import heroGraphic from "../../../assets/images/home/hero_v2.png";
import colors from "../../constants/colors";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
const { Title, Paragraph } = Typography;

const StatsBox = styled.div({
    paddingTop: 10,
    paddingLeft: 10,
});

export default function EducationalLeader() {
    const sizes = Grid.useBreakpoint();
    const isMobile =
        sizes.xs || (sizes.sm && !sizes.md) || window.innerWidth < 768;
    const isSmOrBelow =
        ((sizes.xs || sizes.sm) && !sizes.md) || window.innerWidth < 768;

    return (
        <Row
            style={{
                backgroundColor: "white",
            }}
        >
            <Col
                xxl={{ span: 10, offset: 0 }}
                xl={{ span: 12, offset: 3 }}
                lg={{ span: 14, offset: 2 }}
                md={{ span: 18, offset: 3 }}
                sm={{ span: 18, offset: 2 }}
                xs={{ span: 22, offset: 2 }}
                style={{
                    ...(isMobile
                        ? { paddingLeft: "0rem", paddingRight: ".25rem" }
                        : { paddingRight: "2rem" }),
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <Title
                        level={1}
                        style={{
                            marginBottom: 0,
                            marginTop: 24,
                            fontSize: isMobile ? "4.5rem" : "5rem",
                        }}
                    >
                        Insurance should
                    </Title>
                    <div
                        style={{
                            position: "relative",
                        }}
                    >
                        <Title
                            style={{
                                fontSize: isMobile ? "4.5rem" : "5rem",
                                marginTop: 0,
                                marginBottom: ".75rem",
                            }}
                        >
                            be&nbsp;&nbsp;Free
                        </Title>
                        <HandDrawnOval
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                top: -30,
                                left: 0,
                                height: "9.25rem",
                                width: 250,
                                transform: isMobile
                                    ? "rotate(10deg) translateX(65px) translateY(-10px)"
                                    : "rotate(10deg) translateX(85px) translateY(-10px)",
                            }}
                        />
                    </div>
                </div>
                <div>
                    <Paragraph
                        style={{
                            fontSize: "1.25rem",
                            color: colors.gray8,
                            fontWeight: 400,
                            marginTop: isMobile ? "1rem" : ".5rem",
                            paddingRight: isMobile ? "1rem" : 0,
                        }}
                    >
                        Open Insure lets you self-insure your personal property
                        on a modern web platform
                    </Paragraph>
                    <div
                        style={{
                            width: "100%",
                            height: 3,
                            background: `linear-gradient(90deg, ${colors.brandTeal} 0%, ${colors.logoTeal} 100%)`,

                            borderRadius: 10,
                        }}
                    />
                    <Row
                        style={{
                            marginTop: isSmOrBelow ? ".75rem" : "1rem",
                            marginBottom: isSmOrBelow ? "1rem" : 0,
                        }}
                    >
                        <Col span={10}>
                            <StatsBox>
                                <Title
                                    level={3}
                                    style={{
                                        marginBottom: 4,
                                    }}
                                >
                                    34%
                                </Title>
                                <Paragraph
                                    style={{
                                        fontSize: ".85rem",
                                        color: colors.gray7,
                                        fontWeight: 400,
                                    }}
                                >
                                    Typical Savings
                                </Paragraph>
                            </StatsBox>
                        </Col>
                        <Col span={14}>
                            <StatsBox>
                                <Title
                                    level={3}
                                    style={{
                                        marginBottom: 4,
                                    }}
                                >
                                    2
                                </Title>
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <Paragraph
                                        style={{
                                            fontSize: ".85rem",
                                            color: colors.gray7,
                                            fontWeight: 400,
                                        }}
                                    >
                                        Property Types
                                        <Tooltip
                                            trigger={
                                                isSmOrBelow ? "click" : "hover"
                                            }
                                            color={colors.gray1}
                                            placement="rightTop"
                                            overlayStyle={{
                                                minWidth: 400,
                                            }}
                                            title={() => (
                                                <div
                                                    style={{
                                                        padding: 10,
                                                        color: colors.black,
                                                    }}
                                                >
                                                    <List
                                                        itemLayout="horizontal"
                                                        dataSource={[
                                                            {
                                                                title: "Cell Phone",
                                                            },
                                                            {
                                                                title: "Headphones/Airpods",
                                                            },
                                                        ]}
                                                        renderItem={(item) => (
                                                            <List.Item>
                                                                <List.Item.Meta
                                                                    title={
                                                                        item.title
                                                                    }
                                                                />
                                                            </List.Item>
                                                        )}
                                                        header={
                                                            <Title
                                                                level={4}
                                                                style={{
                                                                    paddingLeft: 24,
                                                                    paddingRight: 14,
                                                                }}
                                                            >
                                                                Available
                                                                Property Types
                                                            </Title>
                                                        }
                                                        footer={
                                                            <div>
                                                                <List.Item
                                                                    actions={[
                                                                        <Link
                                                                            to={
                                                                                "contribute"
                                                                            }
                                                                        >
                                                                            <Button type="primary">
                                                                                Contribute
                                                                            </Button>
                                                                        </Link>,
                                                                    ]}
                                                                >
                                                                    <Paragraph>
                                                                        Want to
                                                                        add
                                                                        more?
                                                                    </Paragraph>
                                                                </List.Item>
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                            )}
                                        >
                                            <QuestionCircleOutlined
                                                style={{
                                                    cursor: "pointer",
                                                    color: colors.gray7,
                                                    padding: "3px 10px 0px 3px",
                                                    marginLeft: 1,
                                                }}
                                            />
                                        </Tooltip>
                                    </Paragraph>
                                </div>
                            </StatsBox>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col
                xxl={{ span: 10, offset: 0 }}
                xl={{ span: 9, offset: 0 }}
                lg={{ span: 8, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                sm={{ span: 24, offset: 0 }}
                style={{
                    display: isSmOrBelow ? "none" : "flex",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <img
                    src={heroGraphic}
                    alt="Screenshot of Open Insure's web app"
                    style={{
                        marginLeft: "2rem",
                        marginTop: "2rem",
                        marginBottom: "4.7rem",
                        height: "28rem",
                    }}
                />
            </Col>
        </Row>
    );
}
