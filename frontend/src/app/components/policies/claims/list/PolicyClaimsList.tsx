import React, { useState } from "react";
import { Button, Empty, Row, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FileAddOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../../../redux/hooks";
import { Claim, Policy } from "../../../../../redux/reducers/commonTypes";
import PolicyClaimDetailCard from "./PolicyClaimDetailCard";

const { Title } = Typography;

export default function PolicyClaimsList() {
    const { id } = useParams();
    const policyId = parseInt(id || "");
    const navigate = useNavigate();
    const policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p.id === policyId)
    );

    const claims = useAppSelector((state) => state.claims.claims?.[policyId]);

    const [isClaimCreationModalVisible, setIsClaimCreationModalVisible] =
        useState(false);

    const goToClaimSetup = () => {
        navigate("/policy/" + policyId + "/claims/new");
    };

    // no need to fetch claims on load, initial policy load already did that

    const renderEmpty = () => {
        return (
            <div style={{ margin: "1.5rem 0" }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: "6rem",
                            }}
                        >
                            <Row style={{ marginBottom: "1rem" }}>
                                <span>
                                    There have been no claims against this
                                    policy
                                </span>
                            </Row>
                            <Row>
                                <Button
                                    type="primary"
                                    onClick={() => goToClaimSetup()}
                                >
                                    File Claim
                                </Button>
                            </Row>
                        </div>
                    }
                />
            </div>
        );
    };

    return (
        <>
            <Row justify="space-between">
                <Title level={4}>Claims</Title>
                {claims?.length > 0 ? (
                    <Button
                        type="primary"
                        onClick={() => goToClaimSetup()}
                        icon={<FileAddOutlined />}
                    >
                        File Claim
                    </Button>
                ) : null}
            </Row>
            {claims?.length === undefined || claims?.length === 0 ? (
                renderEmpty()
            ) : (
                <Row gutter={[16, 16]}>
                    {claims.map((claim: Claim) => {
                        return (
                            <PolicyClaimDetailCard
                                claim={claim}
                                policy={policy}
                            />
                        );
                    })}
                </Row>
            )}
        </>
    );
}
