import React, { useState } from "react";
import { Avatar, Button, Col, Row, Typography } from "antd";
import { WarningOutlined, EditOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../../redux/hooks";
import { Policy, User } from "../../../../redux/reducers/commonTypes";
import { titleCase } from "../../../utils/stringUtils";
import EscrowPoolAddressInlineDisplay from "../premiums/EscrowPoolAddressInlineDisplay";
import colors from "../../../constants/colors";
import PoolAddressSetupModal from "./PoolAddressSetupModal";

const { Paragraph } = Typography;

// question asked by a user: "how am i gonna get them the money"
// this component is the answer to that question

export default function PolicyEscrowAgentInfo({ policy }: { policy: Policy }) {
    const [poolAddressSetupModalVisible, setPoolAddressSetupModalVisible] =
        useState(false);
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const escrowManagerId = policy.escrow_manager;
    const escrowManager: User | undefined = policy.pod?.members?.find(
        (member) => member.id === escrowManagerId
    );

    const poolAddress = policy?.pool_address;

    const isUserEscrowManager = escrowManager?.id === currentUser?.id;

    return (
        <Row gutter={16} style={{ padding: "0 0 2.5rem 0" }}>
            <Col span={4}>
                <Avatar
                    size={68}
                    src={
                        escrowManager?.picture ||
                        "https://joeschmoe.io/api/v1/random"
                    }
                    alt=""
                />
            </Col>
            <Col span={20}>
                <div
                    style={{
                        color: "rgba(0,0,0,.45)",
                        fontSize: 14,
                    }}
                >
                    Escrow Agent
                </div>
                <div style={{ fontSize: 24, fontWeight: 500 }}>
                    {escrowManager === undefined
                        ? "Not set"
                        : `${titleCase(escrowManager?.first_name)} ${titleCase(
                              escrowManager?.last_name
                          )}`}
                </div>

                {poolAddress ? (
                    <Row>
                        <EscrowPoolAddressInlineDisplay address={poolAddress} />
                        {isUserEscrowManager && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() =>
                                    setPoolAddressSetupModalVisible(true)
                                }
                                shape="round"
                                size="small"
                                style={{
                                    padding: "0 .25rem",
                                    marginLeft: ".4rem",
                                    marginTop: ".20rem",
                                }}
                            />
                        )}
                    </Row>
                ) : isUserEscrowManager ? (
                    <div>
                        <Button
                            type="primary"
                            onClick={() =>
                                setPoolAddressSetupModalVisible(true)
                            }
                        >
                            <EditOutlined /> Setup
                        </Button>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <WarningOutlined
                            style={{ color: colors.alert1, marginRight: 6 }}
                        />
                        <Paragraph style={{ marginBottom: 0, fontSize: 14 }}>
                            Not setup! Tell{" "}
                            {titleCase(escrowManager?.first_name)} to fix this
                        </Paragraph>
                    </div>
                )}
                <PoolAddressSetupModal
                    policy={policy}
                    visible={poolAddressSetupModalVisible}
                    close={() => setPoolAddressSetupModalVisible(false)}
                />
            </Col>
        </Row>
    );
}
