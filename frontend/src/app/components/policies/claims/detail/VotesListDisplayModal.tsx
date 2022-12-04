import React, { useContext } from "react";
import { Avatar, Button, Col, Divider, Modal, Row, Typography } from "antd";
import { ClaimApproval, User } from "../../../../../redux/reducers/commonTypes";
import { ClaimDetailContext } from "../../../contexts/ClaimDetailContext";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment-timezone";

const { Title, Paragraph } = Typography;

export default function VotesListDisplayModal({
    isOpen,
    close,
}: {
    isOpen: boolean;
    close: () => void;
}) {
    const { claim, policy } = useContext(ClaimDetailContext);

    return (
        <Modal
            title="Votes Cast"
            onOk={close}
            open={isOpen}
            okText="Ok"
            onCancel={close}
            cancelText=""
            footer={[
                <Button key="back" onClick={close}>
                    Close
                </Button>,
            ]}
        >
            <Divider />
            {claim?.approvals
                .filter((approval) => {
                    return approval.approved !== null;
                })
                .map((approval) => {
                    return (
                        <ApprovalListItem
                            approval={approval}
                            podMembers={policy?.pod?.members}
                        />
                    );
                })}
        </Modal>
    );
}

function ApprovalListItem({
    approval,
    podMembers,
}: {
    approval: ClaimApproval;
    podMembers?: User[];
}) {
    let voter = podMembers?.find((member) => {
        return approval.approver === member.id;
    });

    return (
        <Row>
            <Col span={4}>
                <Avatar
                    size={58}
                    src={voter?.picture || "https://joeschmoe.io/api/v1/random"}
                    alt=""
                />
            </Col>
            <Col span={20}>
                <Row style={{ alignItems: "center" }}>
                    <Col span={12}>
                        <Title level={5}>
                            {voter?.first_name} {voter?.last_name}
                        </Title>
                        <Paragraph>
                            Vote cast {moment(approval.updated_at).fromNow()}
                        </Paragraph>
                    </Col>
                    <Col span={12}>
                        {approval.approved ? (
                            <CheckOutlined style={{ fontSize: 30 }} />
                        ) : (
                            <CloseOutlined />
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
