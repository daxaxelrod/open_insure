import React, { useCallback, useEffect, useMemo } from "react";
import { Col, Flex, Progress, Row, Spin } from "antd";
import { User } from "../../../../redux/reducers/types/commonTypes";
import colors from "../../../constants/colors";
import { Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getUserRepuation } from "../../../../redux/actions/users";
import { Collapse } from "antd";
import RatingDetails from "./ratings/RatingDetails";

const { Title, Paragraph } = Typography;

export default function UserOpenInsureRating({ user }: { user: User }) {
    const { reputation } = user;
    const { total_score } = reputation || {};
    const dispatch = useAppDispatch();
    const getReputationPending = useAppSelector(
        (state) => state.users.getUserReputationPending
    );

    const hasScore = !!total_score;

    console.log("reputation", reputation);

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

    const getReputation = useCallback(() => {
        dispatch(getUserRepuation(user.id));
    }, [dispatch, user.id]);

    useEffect(() => {
        if (user.id && !reputation) {
            getReputation();
        }
    }, [getReputation, reputation, user]);

    const reputationHeader = (
        <Flex>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 1,
                }}
            >
                <div
                    onClick={getReputation}
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                    }}
                >
                    {getReputationPending ? (
                        <Spin />
                    ) : (
                        <ReloadOutlined style={{ color: colors.gray7 }} />
                    )}
                    <Paragraph
                        style={{
                            marginLeft: 6,
                            marginBottom: 0,
                            color: colors.gray9,
                        }}
                    >
                        Refresh
                    </Paragraph>
                </div>
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
    );

    if (!reputation) {
        return reputationHeader;
    }

    return (
        <Collapse
            ghost
            items={[
                {
                    key: "1",
                    showArrow: false,
                    label: reputationHeader,
                    children: <RatingDetails reputation={reputation} />,
                },
            ]}
        />
    );
}
