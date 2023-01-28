import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/renewals";

import {
    INITIATE_POLICY_EXTENSION_PENDING,
    INITIATE_POLICY_EXTENSION_SUCCESS,
    INITIATE_POLICY_EXTENSION_FAILURE,
    GET_RENEWALS_PENDING,
    GET_RENEWALS_SUCCESS,
    GET_RENEWALS_FAILURE,
    CLEAR_RENEWAL_ERROR,
} from "./types";

export const updatePolicyDuration =
    (
        policyId: number,
        extensionDate: number
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: INITIATE_POLICY_EXTENSION_PENDING });
        try {
            const response = await API.initatePolicyExtension(
                policyId,
                extensionDate
            );
            dispatch({
                type: INITIATE_POLICY_EXTENSION_SUCCESS,
                payload: response.data,
            });
            // fetch the latest renewals
            dispatch(getRenewals(policyId));
            return response.data;
        } catch (error: any) {
            dispatch({
                type: INITIATE_POLICY_EXTENSION_FAILURE,
                payload: error.response.data,
            });
            return null;
        }
    };

export const getRenewals =
    (policyId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_RENEWALS_PENDING });
        try {
            const response = await API.getRenewals(policyId);
            dispatch({
                type: GET_RENEWALS_SUCCESS,
                payload: response.data,
                policyId,
            });
        } catch (error) {
            dispatch({
                type: GET_RENEWALS_FAILURE,
                payload: error,
            });
        }
    };

export const clearRenewalError = () => ({
    type: CLEAR_RENEWAL_ERROR,
});
