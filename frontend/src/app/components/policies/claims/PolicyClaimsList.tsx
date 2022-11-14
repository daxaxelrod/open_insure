import React, { useState, useEffect } from "react";
import { Button, Empty, Row } from "antd";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import { Claim, Policy } from "../../../../redux/reducers/commonTypes";
import ClaimCreationModalForm from "./ClaimCreationModalForm";
import PolicyClaimDetailCard from "./PolicyClaimDetailCard";

export default function PolicyClaimsList() {
    const { id } = useParams();
    const policyId = parseInt(id || "");
    const policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p.id === policyId)
    );

    const claims = useAppSelector((state) => state.claims.claims?.[policyId]);

    const [isClaimCreationModalVisible, setIsClaimCreationModalVisible] =
        useState(false);

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
                                    onClick={() =>
                                        setIsClaimCreationModalVisible(true)
                                    }
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
            {claims?.length === undefined || claims?.length === 0
                ? renderEmpty()
                : claims.map((claim: Claim) => {
                      return <PolicyClaimDetailCard claim={claim} />;
                  })}
            <ClaimCreationModalForm
                policy={policy}
                visible={isClaimCreationModalVisible}
                close={() => {
                    setIsClaimCreationModalVisible(false);
                }}
            />
        </>
    );
}
