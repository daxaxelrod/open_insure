import React from "react";
import { Typography } from "antd";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { ClaimDetailContext } from "../../components/contexts/ClaimDetailContext";
import { Claim } from "../../../redux/reducers/commonTypes";
import ClaimSteps from "../../components/policies/claims/detail/ClaimSteps";
import ClaimMetaData from "../../components/policies/claims/detail/ClaimMetaData";
import ClaimEvidence from "../../components/policies/claims/detail/ClaimEvidence";
import ClaimVotes from "../../components/policies/claims/detail/ClaimVotes";
import ClaimCommentsList from "../../components/policies/claims/detail/ClaimCommentsList";
import ClaimCommentForm from "../../components/policies/claims/detail/ClaimCommentForm";

export default function ClaimDetails() {
    const { id, claimId } = useParams();
    const policyId = parseInt(id || "");
    const claimIdInt = parseInt(claimId || "");
    const claim = useAppSelector((state) =>
        state.claims.claims?.[policyId]?.find((c: Claim) => c.id === claimIdInt)
    );
    const isClaimApproved = !!claim?.is_approved;

    return (
        <ClaimDetailContext.Provider value={{ claim, isClaimApproved }}>
            <ClaimSteps />
            <ClaimMetaData />
            <ClaimEvidence />
            <ClaimVotes />
            <ClaimCommentsList />
            <ClaimCommentForm />
        </ClaimDetailContext.Provider>
    );
}
