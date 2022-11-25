import React, { useContext } from "react";
import { Row, Avatar, Form, Button, Input, Col } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { User } from "../../../../../redux/reducers/commonTypes";
import { createClaimComment } from "../../../../../redux/actions/claims";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";

const { TextArea } = Input;

export default function ClaimCommentForm() {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const { policy, claim } = useContext(ClaimDetailContext);
    const postCommentPending = useAppSelector(
        (state) => state.claims.commentsPending
    );
    const currentUser: User = useAppSelector((state) => state.auth.currentUser);

    if (!policy?.id || !claim?.id) {
        return null;
    }

    const postComment = () => {
        form.validateFields().then((values) => {
            dispatch(
                createClaimComment(policy.id, claim.id, {
                    ...values,
                    claim: claim.id,
                })
            );
            form.resetFields();
        });
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
                <Form form={form} requiredMark={true} onFinish={postComment}>
                    <Form.Item
                        name={"comment"}
                        rules={[{ required: true, message: "Type something" }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="I have a question about..."
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={postCommentPending}
                        >
                            Add Comment
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
