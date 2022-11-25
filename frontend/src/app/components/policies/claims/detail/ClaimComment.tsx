import React from "react";
import { Col, Row, Typography } from "antd";
import moment from "moment-timezone";
import { ClaimComment as ClaimCommentType } from "../../../../../redux/reducers/commonTypes";

const { Paragraph } = Typography;

export default function ClaimComment({
    comment,
}: {
    comment: ClaimCommentType;
}) {
    return (
        <div>
            <Row>
                <Col span={24}>
                    <div>{comment.commenter}</div>
                    <div>{moment(comment.created_at).fromNow()}</div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Paragraph>{comment.comment}</Paragraph>
                </Col>
            </Row>
        </div>
    );
}
