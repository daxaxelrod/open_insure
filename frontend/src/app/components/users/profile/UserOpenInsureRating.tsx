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
import RatingDetailsBrief from "./ratings/RatingDetailsBrief";
import { getRatingColor } from "./ratings/ratingsUtils";

const { Title, Paragraph, Text } = Typography;

export default function UserOpenInsureRating({ user }: { user: User }) {
    const { reputation } = user;
    const { total_score } = reputation || {};
    const dispatch = useAppDispatch();
    const getReputationPending = useAppSelector(
        (state) => state.users.getUserReputationPending
    );

    const hasScore = !!total_score;

    const scoreLeaderText = useMemo(() => {
        if (total_score) {
            if (total_score >= 90) {
                return "Extremely Trustworthy";
            } else if (total_score >= 80) {
                return "Trustworthy";
            } else if (total_score >= 70) {
                return "Mildly Trustworthy";
            } else if (total_score >= 60) {
                return "Not Trustworthy";
            } else {
                return "Untrustworthy";
            }
        }
        return "No score yet";
    }, [total_score]);

    const getReputation = useCallback(
        (e?: any) => {
            e?.stopPropagation();
            dispatch(getUserRepuation(user.id));
        },
        [dispatch, user.id]
    );

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
                type="circle"
                gapDegree={90}
                gapPosition="bottom"
                strokeLinecap="round"
                percent={total_score || 0}
                strokeColor={getRatingColor(total_score || 0)}
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
            <Flex
                style={{
                    marginLeft: "2.5rem",
                    flexDirection: "column",
                    flex: 1,
                }}
            >
                <Text
                    type="secondary"
                    style={{
                        fontSize: ".8rem",
                    }}
                >
                    Your Rating:
                </Text>
                <Title
                    level={3}
                    style={{ marginTop: 0, marginBottom: "1.5rem" }}
                >
                    {scoreLeaderText}
                </Title>
                {hasScore ? (
                    <RatingDetailsBrief reputation={reputation} />
                ) : (
                    <Paragraph style={{ color: colors.gray8 }}>
                        Seems like you don't have a score yet
                    </Paragraph>
                )}
            </Flex>
        </Flex>
    );

    if (!reputation || !reputation?.components) {
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
