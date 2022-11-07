import { Avatar, Col, Row } from "antd";
import React from "react";
import { Policy, User } from "../../../../redux/reducers/commonTypes";

export default function PolicyEscrowAgentInfo({ policy }: { policy: Policy }) {
    const escrowManagerId = policy.escrow_manager;
    const escrowManager: User | undefined = policy.pod?.members?.find(
        (member) => member.id === escrowManagerId
    );

    return (
        <Row gutter={16} style={{ padding: "0 0 2.5rem 0" }}>
            <Col span={4}>
                <Avatar
                    size={64}
                    src="https://joeschmoe.io/api/v1/random"
                    alt=""
                />
            </Col>
            <Col span={20}>
                <div
                    style={{
                        marginBottom: 4,
                        color: "rgba(0,0,0,.45)",
                        fontSize: 14,
                    }}
                >
                    Agent
                </div>
                <div style={{ fontSize: 24, fontWeight: 500 }}>
                    {escrowManager === undefined
                        ? "Not set"
                        : `${escrowManager?.first_name} ${escrowManager?.last_name}`}
                </div>
                {/* todo: how am i gonna get them the money */}
            </Col>
        </Row>
    );
}
