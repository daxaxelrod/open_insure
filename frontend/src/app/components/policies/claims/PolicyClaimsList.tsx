import { Empty } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import { Claim, Policy } from "../../../../redux/reducers/commonTypes";
import PolicyClaimDetailCard from "./PolicyClaimDetailCard";

export default function PolicyClaimsList() {
    const { id } = useParams();
    let policyId = parseInt(id || "");
    let claims: Claim[] = useAppSelector(
        (state) =>
            state.policies.publicPolicies.find((p: Policy) => p.id === policyId)
                ?.claims
    );

    if (claims?.length === undefined || claims?.length === 0) {
        return (
            <div style={{ marginTop: "1.5rem" }}>
                <Empty description="There have been no claims against this policy" />
            </div>
        );
    }

    return (
        <>
            {claims.map((claim: Claim) => {
                return <PolicyClaimDetailCard claim={claim} />;
            })}
        </>
    );
}
