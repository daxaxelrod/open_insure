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
    const isMobile = sizes.xs || (sizes.sm && !sizes.md);
    const isSmOrBelow = (sizes.xs || sizes.sm) && !sizes.md;

    return (
        <Row
            style={{
                backgroundColor: "white",
            }}
        >
            <Col
                xl={{ span: 8, offset: 3 }}
                lg={{ span: 12, offset: 2 }}
                md={{ span: 18, offset: 3 }}
                sm={{ span: 18, offset: 3 }}
                style={{
                    paddingRight: "2rem",
                    ...(isMobile ? { paddingLeft: "2rem" } : {}),
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
                            fontSize: "5rem",
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
                                fontSize: "5rem",
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
                                height: "9rem",
                                width: 250,
                                transform:
                                    "rotate(10deg) translateX(85px) translateY(-10px)",
                            }}
                        />
                    </div>
                </div>
                <div>
                    <Paragraph
                        style={{
                            fontSize: "1.25rem",
                            color: colors.gray7,
                            fontWeight: 400,
                            marginTop: ".5rem",
                        }}
                    >
                        Open Insure let's you painlessly self-insure your
                        personal property all on a modern web platform
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
                                <Title level={3}>34%</Title>
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
                                <Title level={3}>2</Title>
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
                                                        footer={
                                                            <div>
                                                                <List.Item
                                                                    actions={[
                                                                        <Link
                                                                            to={
                                                                                "contribute"
                                                                            }
                                                                        >
                                                                            <Button>
                                                                                Contribute
                                                                            </Button>
                                                                        </Link>,
                                                                    ]}
                                                                >
                                                                    <div>
                                                                        Want to
                                                                        add
                                                                        more?
                                                                    </div>
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
                                                    padding:
                                                        "3px 10px 10px 3px",
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
                xl={{ span: 12, offset: 0 }}
                lg={{ span: 10, offset: 0 }}
                md={{ span: 24, offset: 0 }}
                sm={{ span: 24, offset: 0 }}
                style={{
                    display: isSmOrBelow ? "none" : "flex",
                    alignItems: "center",
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
