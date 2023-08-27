import React, { useContext } from "react";
import { Row, Avatar, Form, Button, Input, Col, notification } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { User } from "../../../../../redux/reducers/types/commonTypes";
import { createClaimComment } from "../../../../../redux/actions/claims";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import { getUserPhotoUrl } from "../../utils/photoUtils";

const { TextArea } = Input;

export default function ClaimCommentForm() {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const { policy, claim } = useContext(ClaimDetailContext);
    const [api, contextHolder] = notification.useNotification();
    const postCommentPending = useAppSelector(
        (state) => state.claims.commentsPending
    );
    const currentUser: User = useAppSelector((state) => state.auth.currentUser);

    if (!policy?.id || !claim?.id) {
        return null;
    }

    const isUserPodMember = policy?.pod?.members.some((user: User) => {
        return user.id === currentUser?.id;
    });

    const postComment = () => {
        form.validateFields().then((values) => {
            if (!isUserPodMember) {
                // cant be too careful
                api.warning({
                    message: "You are not a member of this policy",
                });
                return;
            }
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
            {contextHolder}
            <Col
                span={3}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Avatar
                    src={getUserPhotoUrl(currentUser?.picture)}
                    alt="user avatar"
                />
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
                            disabled={!isUserPodMember}
                        >
                            Add Comment
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
