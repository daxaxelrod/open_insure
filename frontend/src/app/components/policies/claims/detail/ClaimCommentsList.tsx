import React, { useContext, useEffect } from "react";
import { Col, Empty, Row, Skeleton } from "antd";
import { SideText } from "./Styled";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { getClaimComments } from "../../../../../redux/actions/claims";
import {
    ClaimComment as ClaimCommentType,
    Claim,
} from "../../../../../redux/reducers/commonTypes";
import ClaimComment from "./ClaimComment";

export default function ClaimCommentsList() {
    const { claim, policy } = useContext(ClaimDetailContext);

    const dispatch = useAppDispatch();
    const comments = useAppSelector((state) =>
        claim ? state.claims.comments?.[claim?.id] : []
    );
    const getCommentsPending = useAppSelector(
        (state) => state.claims.commentsPending
    );

    useEffect(() => {
        if (claim && claim.id && policy && policy.id) {
            dispatch(getClaimComments(policy.id, claim.id));
        }
    }, [claim, policy]);

    return (
        <Row>
            <Col span={24}>
                {comments?.map((comment: ClaimCommentType) => {
                    return (
                        <ClaimComment
                            key={`claim-comment-${comment.id}`}
                            comment={comment}
                        />
                    );
                })}
                {getCommentsPending ? <Skeleton /> : null}
                {comments?.length === 0 ? (
                    <Empty
                        description="No comments yet"
                        style={{ marginBottom: "2rem" }}
                    />
                ) : null}
            </Col>
        </Row>
    );
}
