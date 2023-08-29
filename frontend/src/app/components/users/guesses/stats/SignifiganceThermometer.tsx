import React from "react";
import {
    Typography,
    Col,
    Progress,
    Row,
    Button,
    Space,
    notification,
} from "antd";

import styled from "styled-components";
import { PolicyLine } from "../../../../../redux/reducers/types/actuaryTypes";
import colors from "../../../../constants/colors";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import ReactGA from "react-ga4";

const { Title, Paragraph } = Typography;

const Marker = styled.div<{ complete?: boolean }>(({ complete }) => ({
    height: "40px",
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 1,

    background: "#0a0a7929",
    borderRadius: 40,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(8.9px)",
    border: "1px solid rgba(255,255,255, 0.39)",
    fontFamily: "math",
    fontSize: ".85rem",
    color: !complete ? "black" : "white",
}));

const MarkersContainer = styled.div({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 14,
    zIndex: 2,
});

export default function SignifiganceThermometer({
    policyLine,
    count,
    requiredCount,
}: {
    policyLine: PolicyLine;
    count: number;
    requiredCount: number;
}) {
    const [api, contextHolder] = notification.useNotification();
    const percent = Math.min(100, Math.round((count / requiredCount) * 100));
    const quartiles = [25, 50, 75];

    const renderRequiredCount = () => {
        if (count < requiredCount) {
            return `${count} of ${requiredCount} contributions`;
        } else {
            return "Every contribution makes premiums more accurate.";
        }
    };

    const renderDescription = () => {
        if (count < requiredCount) {
            return `Once we have ${requiredCount} contributions, you will be able to create a self insurance policy.`;
        } else {
            return `You can now create a self insurance policy with ${policyLine.name}. Share this form with your friends to help us get more data.`;
        }
    };

    const share = () => {
        api.success({
            placement: "topRight",
            message: "Link copied to clipboard",
        });
        navigator?.clipboard?.writeText(window.location.host);
        ReactGA.event({
            category: "Gathering",
            action: "Share policy line loss form",
            nonInteraction: false,
        });
    };

    return (
        <div className="thermometer">
            {contextHolder}
            <MarkersContainer>
                {quartiles.map((q) => {
                    return (
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Marker complete={percent >= q + 5} key={q}>
                                {q}%
                            </Marker>
                        </div>
                    );
                })}
            </MarkersContainer>
            <Progress
                strokeWidth={18}
                percent={percent}
                showInfo={false}
                strokeColor={{
                    from: "#0a0a79",
                    to: "#00d4ff",
                }}
                trailColor="#f3f3f3"
            />
            <Row style={{ marginBottom: "2rem", marginTop: "1rem" }}>
                <Col
                    xl={3}
                    xxl={3}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={4}
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={
                            policyLine.image_url ||
                            require("../../../../../assets/images/logo-512.png")
                        }
                        style={{
                            marginTop: 4,
                            height: 70,
                            width: 70,
                            borderRadius: 40,
                            border: `1px solid ${colors.gray6}`,
                        }}
                        alt="policy line icon"
                    />
                </Col>
                <Col xl={21} xxl={21} lg={20} md={20} sm={20} xs={20}>
                    <Title style={{ marginBottom: 0, marginTop: "1rem" }}>
                        {policyLine.name}
                    </Title>
                    <Title level={4}>
                        Thanks for your submission. {renderRequiredCount()}
                    </Title>
                    <Paragraph>{renderDescription()}</Paragraph>
                    <Space direction="horizontal" size="middle">
                        {count >= requiredCount && (
                            <Link to={`/home`} target="#">
                                <Button type="dashed">
                                    Protect {policyLine.name}
                                </Button>
                            </Link>
                        )}

                        <Button
                            type="dashed"
                            shape="round"
                            onClick={share}
                            icon={<UploadOutlined />}
                            size={"middle"}
                        >
                            Share
                        </Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}
