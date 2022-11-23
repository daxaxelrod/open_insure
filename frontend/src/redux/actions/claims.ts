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
