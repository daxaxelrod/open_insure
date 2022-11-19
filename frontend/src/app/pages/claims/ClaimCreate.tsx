import { Breadcrumb, Row } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { Policy } from "../../../redux/reducers/commonTypes";
import ClaimCreationForm from "../../components/policies/claims/detail/create/ClaimCreationForm";
import ClaimListErrorBar from "../../components/policies/claims/detail/create/ClaimListErrorBar";

export default function ClaimCreate() {
    const { id } = useParams();
    const policyId = parseInt(id || "");
    const policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p.id === policyId)
    );

    return (
        <div>
            <Row>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>{policy.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>Create Claim</Breadcrumb.Item>
                </Breadcrumb>
            </Row>
            <ClaimListErrorBar />
            <ClaimCreationForm policy={policy} />
        </div>
    );
}
