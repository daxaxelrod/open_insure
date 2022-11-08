import { Avatar, Col, Row } from "antd";
import React from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { Policy, User } from "../../../../redux/reducers/commonTypes";
import { validate_bitcoin_address } from "../../../utils/stringUtils";
import EscrowPoolAddressInlineDisplay from "../premiums/EscrowPoolAddressInlineDisplay";

export default function PolicyEscrowAgentInfo({ policy }: { policy: Policy }) {
    const escrowManagerId = policy.escrow_manager;
    const escrowManager: User | undefined = policy.pod?.members?.find(
        (member) => member.id === escrowManagerId
    );
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    const poolAddress = policy?.pool_address;

    const isUserEscrowManager = escrowManager?.id === currentUser?.id;
    const isValidBtcAddress = validate_bitcoin_address(poolAddress);

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
                    Escrow Agent
                </div>
                <div style={{ fontSize: 24, fontWeight: 500 }}>
                    {escrowManager === undefined
                        ? "Not set"
                        : `${escrowManager?.first_name} ${escrowManager?.last_name}`}
                </div>

                {poolAddress ? (
                    <EscrowPoolAddressInlineDisplay address={poolAddress} />
                ) : (
                    <div />
                )}

                {/* todo: question asked by a user: "how am i gonna get them the money" */}
            </Col>
        </Row>
    );
}
