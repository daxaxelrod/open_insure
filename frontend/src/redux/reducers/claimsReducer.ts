import { AnyAction } from "@reduxjs/toolkit";
import {
    CREATE_CLAIM_PENDING,
    CREATE_CLAIM_SUCCESS,
    CREATE_CLAIM_FAILURE,
} from "../actions/types";
import { Claim, ClaimEvidence, ClaimApproval } from "./commonTypes";

export interface ClaimsState {
    // policyId: number -> Claim[]
    claims: Record<number, Claim[]>;
    claimCreationPending: boolean;
}

const initialState: ClaimsState = {
    claims: {},
    claimCreationPending: false,
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
        default:
            return state;
    }
};
