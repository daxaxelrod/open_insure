import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/claims";

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
    DELETE_CLAIM_COMMENT_PENDING,
    DELETE_CLAIM_COMMENT_SUCCESS,
    DELETE_CLAIM_COMMENT_FAILURE,
} from "../actions/types";
import { Claim } from "../reducers/commonTypes";

export const createClaim =
    (
        policyId: number,
        values: API.ClaimCreationPayload,
        callback: (claim: Claim) => void
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: CREATE_CLAIM_PENDING });
        try {
            const response = await API.createClaim(policyId, values);
            dispatch({
                type: CREATE_CLAIM_SUCCESS,
                payload: response.data,
                policyId,
            });
            callback(response.data);
        } catch (error: any) {
            dispatch({
                type: CREATE_CLAIM_FAILURE,
                payload: error?.response?.data,
                policyId,
            });
        }
    };

export const getClaimsForPolicy =
    (policyId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch: any) => {
        try {
            dispatch({ type: GET_CLAIMS_FOR_POLICY_PENDING, policyId });
            const response = await API.getClaimsForPolicy(policyId);
            dispatch({
                type: GET_CLAIMS_FOR_POLICY_SUCCESS,
                payload: response.data,
                policyId,
            });
        } catch (error) {
            dispatch({ type: GET_CLAIMS_FOR_POLICY_FAILURE, policyId });
            console.log(error);
        }
    };

export const setClaimsForPolicy = (policyId: number, claims: Claim[]) => {
    return {
        type: SET_CLAIMS_FOR_POLICY,
        payload: claims,
        policyId,
    };
};

// sometimes I ask myself why I nest the urls like this
// I like to say that it makes it easier to understand the model relationships, even if it has no technical need
export const getClaimComments =
    (
        policyId: number,
        claimId: number
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch: any) => {
        try {
            dispatch({ type: GET_CLAIM_COMMENTS_PENDING });
            const response = await API.getClaimComments(policyId, claimId);
            dispatch({
                type: GET_CLAIM_COMMENTS_SUCCESS,
                payload: response.data,
                claimId,
            });
        } catch (error) {
            dispatch({
                type: GET_CLAIM_COMMENTS_FAILURE,
            });
            console.log("error retrieving claim", claimId, "comments ");
        }
    };

export const createClaimComment = (
    policyId: number,
    claimId: number,
    values: API.ClaimCommentCreationPayload
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch: any) => {
        dispatch({ type: CREATE_CLAIM_COMMENT_PENDING });
        try {
            const response = await API.createClaimComment(
                policyId,
                claimId,
                values
            );
            dispatch({
                type: CREATE_CLAIM_COMMENT_SUCCESS,
                payload: response.data,
                claimId,
            });
        } catch (error) {
            dispatch({
                type: CREATE_CLAIM_COMMENT_FAILURE,
            });
            console.log("error creating claim", claimId, "comment");
        }
    };
};

export const deleteClaimComment = (
    policyId: number,
    claimId: number,
    commentId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch: any) => {
        dispatch({ type: DELETE_CLAIM_COMMENT_PENDING });
        try {
            const response = await API.deleteClaimComment(
                policyId,
                claimId,
                commentId
            );
            dispatch({
                type: DELETE_CLAIM_COMMENT_SUCCESS,
                payload: response.data,
                claimId,
            });
        } catch (error) {
            dispatch({
                type: DELETE_CLAIM_COMMENT_FAILURE,
            });
            console.log("error deleting claim", claimId, "comment");
        }
    };
};
