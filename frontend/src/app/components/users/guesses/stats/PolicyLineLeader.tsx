import { Button, Col, Row, Space, Typography, notification } from "antd";
import React from "react";
import { PolicyLine } from "../../../../../redux/reducers/types/actuaryTypes";
import colors from "../../../../constants/colors";
import ReactGA from "react-ga4";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import useIsTouchDevice from "../../../hooks/useIsTouchDevice";

const { Title, Paragraph } = Typography;

export default function PolicyLineLeader({
    policyLine,
    count,
    requiredCount,
}: {
    policyLine: PolicyLine;
    count: number;
    requiredCount: number;
}) {
    const [api, contextHolder] = notification.useNotification();
    const isTouchDevice = useIsTouchDevice();

    const openRegisterBottomModal = () => {};
    const openRegisterModal = () => {};

    const renderRequiredCount = () => {
        if (count < requiredCount) {
            return `${count} contributions made`;
        } else {
            return "Every contribution makes premiums more accurate.";
        }
    };

    const renderDescription = () => {
        if (count < requiredCount) {
            return (
                <span>
                    Once we have{" "}
                    <span
                        style={{
                            fontWeight: "bold",
                        }}
                    >
                        {requiredCount}
                    </span>{" "}
                    contributions, you will be able to create a self insurance
                    policy.
                </span>
            );
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
        <Row style={{ marginBottom: "2rem", marginTop: "1rem" }}>
            {contextHolder}
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
                        width: "100%",
                        objectFit: "contain",
                    }}
                    alt="policy line icon"
                />
            </Col>
            <Col
                xl={21}
                xxl={21}
                lg={20}
                md={20}
                sm={20}
                xs={20}
                style={{
                    paddingLeft: "1.25rem",
                }}
            >
                <Paragraph
                    type="secondary"
                    style={{
                        marginBottom: 0,
                        marginTop: -10,
                        fontSize: ".75rem",
                    }}
                >
                    Asset Class
                </Paragraph>
                <Title style={{ marginBottom: 0, marginTop: "0" }}>
                    {policyLine.name}
                </Title>
                <Paragraph
                    style={{ marginTop: ".5rem", marginBottom: ".5rem" }}
                >
                    {renderRequiredCount()}
                </Paragraph>
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
                        size={"large"}
                    >
                        Share
                    </Button>

                    <Button
                        type="dashed"
                        shape="round"
                        onClick={
                            isTouchDevice
                                ? openRegisterBottomModal
                                : openRegisterModal
                        }
                        icon={
                            <img
                                src={`${process.env.REACT_APP_CDN_URL}/badges/guess_contribution_badge.png`}
                                style={{
                                    height: 20,
                                    width: 20,
                                    marginRight: 5,
                                    marginTop: -2,
                                    objectFit: "contain",
                                }}
                                alt="earned badge icon"
                            />
                        }
                        size={"large"}
                    >
                        1x Badge
                    </Button>
                </Space>
            </Col>
        </Row>
    );
}
