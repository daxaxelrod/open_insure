import React, { useState } from "react";
import moment from "moment-timezone";
import { Button, Empty, notification, Row, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FileAddOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../../../redux/hooks";
import { Claim, Policy } from "../../../../../redux/reducers/commonTypes";
import PolicyClaimCard from "./PolicyClaimCard";

const { Title } = Typography;

export default function PolicyClaimsList() {
    const { id } = useParams();
    const policyId = parseInt(id || "");
    const navigate = useNavigate();
    const [api, notificationContext] = notification.useNotification();
    const policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p.id === policyId)
    );

    const claims = useAppSelector(
        (state) => state.claims.claims?.[policyId]
    )?.sort((a: Claim, b: Claim) => {
        return moment(b.created_at).isBefore(moment(a.created_at));
    });

    const goToClaimSetup = () => {
        let coverageStartDate = moment(policy.coverage_start_date);
        let hasPolicyStarted = moment().isAfter(coverageStartDate);
        if (hasPolicyStarted) {
            navigate("/policy/" + policyId + "/claims/new");
        } else {
            api.warning({
                message: "You cannot file a claim yet",
                description: `Policy starts on ${coverageStartDate.format(
                    "MM-DD-YY"
                )} (${coverageStartDate.fromNow()})`,
            });
        }
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
            {notificationContext}
            <Row justify="space-between" style={{ padding: "0 1rem 0 0" }}>
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
                            <PolicyClaimCard
                                key={`claim-card-${claim.id}`}
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
