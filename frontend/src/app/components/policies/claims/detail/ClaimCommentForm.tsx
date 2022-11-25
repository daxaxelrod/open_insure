import React, { useState } from "react";
import moment from "moment";
import { Row, Avatar, Form, Button, Input, Col } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { User } from "../../../../../redux/reducers/commonTypes";

const { TextArea } = Input;

export default function ClaimCommentForm() {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [comment, setComment] = useState();
    const postCommentPending = useAppSelector(
        (state) => state.claims.commentsPending
    );
    const currentUser: User = useAppSelector((state) => state.auth.currentUser);

    const postComment = () => {
        form.validateFields().then((values) => {});
    };

    return (
        <Row gutter={12}>
            <Col
                span={3}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Avatar src={currentUser?.picture} alt="user avatar" />
            </Col>
            <Col span={21}>
                <Form form={form} requiredMark={false}>
                    <Form.Item name={"comment"} required>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            loading={postCommentPending}
                            onClick={postComment}
                            type="primary"
                        >
                            Add Comment
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
