import React, { useContext } from "react";
import { Avatar, Col, Row, Typography } from "antd";
import moment from "moment-timezone";
import { ClaimComment as ClaimCommentType } from "../../../../../redux/reducers/types/commonTypes";
import { useAppSelector } from "../../../../../redux/hooks";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import styled from "styled-components";
import { getUserPhotoUrl } from "../../utils/photoUtils";

const { Paragraph } = Typography;

const CommentorText = styled.div({
    paddingRight: 8,
    fontSize: 12,
    color: "rgba(0,0,0,.45)",
});

export default function ClaimComment({
    comment,
}: {
    comment: ClaimCommentType;
}) {
    const { policy, claim } = useContext(ClaimDetailContext);
    const commentor = comment?.commenter;

    const commentorProfile = policy?.pod.members.find(
        (m) => m.id === commentor
    );

    return (
        <Row style={{ marginTop: 12, marginBottom: 6 }}>
            <Col
                span={3}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: 12,
                }}
            >
                <Avatar
                    src={getUserPhotoUrl(commentorProfile?.picture)}
                    alt={commentorProfile?.first_name}
                />
            </Col>
            <Col span={21}>
                <Row>
                    <CommentorText
                        style={{
                            paddingRight: 8,
                            fontSize: 12,
                            color: "rgba(0,0,0,.45)",
                        }}
                    >
                        {commentorProfile?.first_name}{" "}
                        {commentorProfile?.last_name}
                    </CommentorText>
                    <CommentorText
                        style={{
                            color: "#ccc",
                        }}
                    >
                        {moment(comment.created_at).fromNow()}
                    </CommentorText>
                </Row>
                <Row>
                    <Col span={24}>
                        <Paragraph>{comment.comment}</Paragraph>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
