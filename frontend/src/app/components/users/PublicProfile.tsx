import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
// import { useAppSelector } from "../../../redux/hooks";
import { Col, Row, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import UserLargeImage from "./profile/UserLargeImage";
import UserHeader from "./profile/UserHeader";
import UserOpenInsureRating from "./profile/UserOpenInsureRating";
import { getDetailedUserProfile } from "../../../redux/actions/users";
import UserPublicPolicyMembershipsCard from "./profile/policies/UserPublicPolicyMembershipsCard";
import PublicProfileProvider from "../contexts/PublicProfileContext";

const { Paragraph } = Typography;

export default function PublicProfile({}) {
    let { id } = useParams();
    const userId = parseInt(id || "");
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const user = useAppSelector((state) => state.users.users[userId]);
    const dispatch = useAppDispatch();
    let isSelf = currentUser.id === userId;

    useEffect(() => {
        if (userId) {
            dispatch(getDetailedUserProfile(userId));
        }
    }, [userId]);

    return (
        <PublicProfileProvider
            user={user}
            policies={user?.policies}
            pods={user?.pods}
            votes={user?.claim_approvals}
            onTimePremiums={user?.on_time_premiums}
            totalPayments={user?.total_payments}
            totalPremiumsScheduled={user?.total_premiums_scheduled}
            claims={user?.claims}
        >
            <Row align="middle">
                <Col span={4}>
                    <UserLargeImage user={user} editable={isSelf} />
                </Col>
                <Col span={8}>
                    <UserHeader user={user} />
                </Col>
                <Col span={8}>
                    <UserOpenInsureRating user={user} />
                </Col>
            </Row>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <UserPublicPolicyMembershipsCard />
                </Col>
            </Row>
            <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Paragraph>Claim history</Paragraph>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Paragraph>Voting history</Paragraph>
                </Col>
            </Row>
        </PublicProfileProvider>
    );
}
