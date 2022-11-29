import { AnyAction } from "@reduxjs/toolkit";
import {
    CREATE_CLAIM_PENDING,
    CREATE_CLAIM_SUCCESS,
    CREATE_CLAIM_FAILURE,
    SET_CLAIMS_FOR_POLICY,
    GET_CLAIMS_FOR_POLICY_PENDING,
    GET_CLAIMS_FOR_POLICY_SUCCESS,
    GET_CLAIMS_FOR_POLICY_FAILURE,
    GET_CLAIM_COMMENTS_PENDING,
    GET_CLAIM_COMMENTS_SUCCESS,
    GET_CLAIM_COMMENTS_FAILURE,
    CREATE_CLAIM_COMMENT_PENDING,
    CREATE_CLAIM_COMMENT_SUCCESS,
    CREATE_CLAIM_COMMENT_FAILURE,
    PATCH_CLAIM_APPROVAL_SUCCESS,
} from "../actions/types";
import {
    Claim,
    ClaimEvidence,
    ClaimApproval,
    ClaimComment,
} from "./commonTypes";

export interface ClaimsState {
    // policyId: number -> Claim[]
    claims: Record<number, Claim[]>;
    claimCreationPending: boolean;
    getClaimsPending: boolean;
    creationError: any;
    comments: Record<number, ClaimComment[]>;
    // we only expect to get one comment set at a time
    // no need for more complex pending states
    commentsPending: boolean;
    createCommentPending: boolean;
}

const initialState: ClaimsState = {
    claims: {},
    claimCreationPending: false,
    getClaimsPending: false,
    creationError: null,
    comments: {},
    commentsPending: false,
    createCommentPending: false,
};

export default (
    state = initialState,
    { type, payload, policyId, claimId }: AnyAction
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
                creationError: {
                    policyId,
                    payload,
                },
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
        case GET_CLAIM_COMMENTS_PENDING:
            return {
                ...state,
                commentsPending: true,
            };
        case GET_CLAIM_COMMENTS_SUCCESS:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [claimId]: payload,
                },
                commentsPending: false,
            };
        case GET_CLAIM_COMMENTS_FAILURE:
            return {
                ...state,
                commentsPending: false,
            };
        case CREATE_CLAIM_COMMENT_PENDING:
            return {
                ...state,
                createCommentPending: true,
            };
        case CREATE_CLAIM_COMMENT_SUCCESS:
            return {
                ...state,
                createCommentPending: false,
                comments: {
                    ...state.comments,
                    [claimId]: [...(state.comments?.[claimId] || {}), payload],
                },
            };
        case CREATE_CLAIM_COMMENT_FAILURE:
            return {
                ...state,
                createCommentPending: false,
            };
        case PATCH_CLAIM_APPROVAL_SUCCESS:
            return {
                ...state,
                claims: {
                    ...state.claims,
                    [policyId]: state.claims?.[policyId]?.map(
                        (claim: Claim) => {
                            if (claim.id === claimId) {
                                return {
                                    ...claim,
                                    approvals: claim.approvals?.map(
                                        (approval) => {
                                            if (approval.id === payload.id) {
                                                return payload;
                                            }
                                            return approval;
                                        }
                                    ),
                                };
                            }
                            return claim;
                        }
                    ),
                },
            };

        default:
            return state;
    }
};
