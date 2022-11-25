import React, { useState, KeyboardEvent } from "react";
import moment from "moment";
import { Row, Avatar, Form, Button, Input, Col } from "antd";
import { Comment } from "@ant-design/compatible";
import { useAppSelector } from "../../../../../redux/hooks";

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button
                htmlType="submit"
                loading={submitting}
                onClick={onSubmit}
                type="primary"
            >
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

export default function ClaimCommentForm() {
    const [comment, setComment] = useState();
    const postCommentPending = useAppSelector(
        (state) => state.claims.commentsPending
    );

    return (
        <Row>
            <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
            />
            <Col span={21}>
                <Form>
                    <Form.Item>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            loading={submitting}
                            onClick={onSubmit}
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
