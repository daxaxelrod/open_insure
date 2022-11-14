import { AnyAction } from "@reduxjs/toolkit";
import {
    CREATE_CLAIM_PENDING,
    CREATE_CLAIM_SUCCESS,
    CREATE_CLAIM_FAILURE,
    SET_CLAIMS_FOR_POLICY,
    GET_CLAIMS_FOR_POLICY_PENDING,
    GET_CLAIMS_FOR_POLICY_SUCCESS,
    GET_CLAIMS_FOR_POLICY_FAILURE,
} from "../actions/types";
import { Claim, ClaimEvidence, ClaimApproval } from "./commonTypes";

export interface ClaimsState {
    // policyId: number -> Claim[]
    claims: Record<number, Claim[]>;
    claimCreationPending: boolean;
    getClaimsPending: boolean;
}

const initialState: ClaimsState = {
    claims: {},
    claimCreationPending: false,
    getClaimsPending: false,
};

export default (
    state = initialState,
    { type, payload, policyId }: AnyAction
) => {
    switch (type) {
        case CREATE_CLAIM_PENDING:
            return {
                ...state,
                claimCreationPending: true,
            };
        case CREATE_CLAIM_SUCCESS:
            return {
                ...state,
                claims: {
                    ...state.claims,
                    [policyId]: [...(state.claims?.[policyId] || {}), payload],
                },
                claimCreationPending: false,
            };
        case CREATE_CLAIM_FAILURE:
            return {
                ...state,
                claimCreationPending: false,
            };
        case GET_CLAIMS_FOR_POLICY_PENDING:
            return {
                ...state,
                getClaimsPending: true,
            };
        case GET_CLAIMS_FOR_POLICY_SUCCESS:
        case SET_CLAIMS_FOR_POLICY:
            return {
                ...state,
                getClaimsPending: false,
                claims: {
                    ...state.claims,
                    [policyId]: payload, // assume this is called rather early and we don't have to merge with existing claims
                },
            };
        case GET_CLAIMS_FOR_POLICY_FAILURE:
            return {
                ...state,
                getClaimsPending: false,
            };
        default:
            return state;
    }
};
