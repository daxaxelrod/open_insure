import React from "react";
import { Divider, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { ClaimDetailContext } from "../../components/contexts/ClaimDetailContext";
import { Claim, Policy } from "../../../redux/reducers/commonTypes";
import ClaimSteps from "../../components/policies/claims/detail/ClaimSteps";
import ClaimMetaData from "../../components/policies/claims/detail/ClaimMetaData";
import ClaimVotes from "../../components/policies/claims/detail/ClaimVotes";
import ClaimCommentsList from "../../components/policies/claims/detail/ClaimCommentsList";
import ClaimCommentForm from "../../components/policies/claims/detail/ClaimCommentForm";

export default function ClaimDetails() {
    const { id, claimId } = useParams();
    const policyId = parseInt(id || "");
    const policy: Policy = useAppSelector((state) =>
        state.policies.publicPolicies.find((p: Policy) => p?.id === policyId)
    );
    const claimIdInt = parseInt(claimId || "");
    const claim: Claim = useAppSelector((state) =>
        state.claims.claims?.[policyId]?.find((c: Claim) => c.id === claimIdInt)
    );
    const isClaimApproved = !!claim?.is_approved;
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const claimant = policy?.pod?.members.find(
        (member) => member.id === claim.claimant
    );
    let isClaimant = claim?.claimant === currentUser?.id;

    return (
        <ClaimDetailContext.Provider
            value={{ claim, isClaimApproved, policy, claimant }}
        >
            {isClaimant ? <ClaimSteps /> : null}
            <ClaimMetaData />
            <Divider />
            <ClaimVotes />
            <Divider />
            <ClaimCommentsList />
            <ClaimCommentForm />
        </ClaimDetailContext.Provider>
    );
}
