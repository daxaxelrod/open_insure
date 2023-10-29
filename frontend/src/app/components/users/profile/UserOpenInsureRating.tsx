import React, { useMemo } from "react";
import { Col, Flex, Progress, Row } from "antd";
import { User } from "../../../../redux/reducers/types/commonTypes";
import colors from "../../../constants/colors";
import { Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function UserOpenInsureRating({ user }: { user: User }) {
    const { reputation } = user;
    const { total_score } = reputation || {};

    const hasScore = !!total_score;

    const scoreLeaderText = useMemo(() => {
        if (total_score) {
            if (total_score >= 80) {
                return "Excellent";
            } else if (total_score >= 60) {
                return "Good";
            } else if (total_score >= 40) {
                return "Fair";
            } else if (total_score >= 20) {
                return "Poor";
            } else {
                return "Very Poor";
            }
        }
        return "No score yet";
    }, [total_score]);

    return (
        <>
            <Flex>
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 1,
                        display: "flex",
                    }}
                >
                    <ReloadOutlined
                        style={{ marginRight: 4, color: colors.gray7 }}
                    />
                    <Paragraph style={{ marginBottom: 0 }}>Refresh</Paragraph>
                </div>
                <Progress
                    type="dashboard"
                    percent={total_score || 0}
                    strokeColor={{
                        "0%": colors.good,
                        "100%": colors.lightGood,
                    }}
                    format={(percent) => (
                        <div>
                            {percent}
                            <div
                                style={{
                                    color: colors.gray8,
                                    fontSize: 12,
                                    marginTop: 4,
                                }}
                            >
                                Score
                            </div>
                        </div>
                    )}
                />
                <Col sm={{ offset: 2 }}>
                    <Title level={4}>{scoreLeaderText}</Title>
                    {hasScore ? (
                        <Paragraph style={{ color: colors.gray8 }}></Paragraph>
                    ) : (
                        <Paragraph style={{ color: colors.gray8 }}>
                            Seems like you dont have a score yet
                        </Paragraph>
                    )}
                </Col>
            </Flex>
        </>
    );
}
