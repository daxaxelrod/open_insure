import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
// import { useAppSelector } from "../../../redux/hooks";
import { Col, Row, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import UserLargeImage from "./profile/UserLargeImage";
import UserHeader from "./profile/UserHeader";
import UserOpenInsureRating from "./profile/UserOpenInsureRating";
import { getDetailedUserProfile } from "../../../redux/actions/users";

const { Title, Paragraph } = Typography;

export default function PublicProfile({}) {
    let { id } = useParams();
    const userId = parseInt(id || "");
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const user = useAppSelector((state) => state.users.users[userId]);
    const dispatch = useAppDispatch();
    let isSelf = currentUser.id === userId;

    useEffect(() => {
        if (user === undefined) {
            dispatch(getDetailedUserProfile(userId));
        }
    }, [userId]);

    return (
        <>
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
                <Paragraph>Member of which policies</Paragraph>
                <Paragraph>Premiums paid</Paragraph>
            </Row>
            <Row>
                <Paragraph>Claim history</Paragraph>
            </Row>
            <Row>
                <Paragraph>Voting history</Paragraph>
            </Row>
        </>
    );
}
