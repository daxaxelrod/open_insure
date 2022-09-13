// risk is more commonly known as "quotes". It represents the underlying risk of a peril as well as a nested object that contains infromation about the insured asset.

import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/risk";
import {
    GET_RISK_FOR_POLICY_PENDING,
    GET_RISK_FOR_POLICY_SUCCESS,
    GET_RISK_FOR_POLICY_FAILURE,
    GET_RISKS_FOR_USER_PENDING,
    GET_RISKS_FOR_USER_SUCCESS,
    GET_RISKS_FOR_USER_FAILURE,
    CREATE_RISK_PENDING,
    CREATE_RISK_SUCCESS,
    CREATE_RISK_FAILURE,
    PATCH_RISK_PENDING,
    PATCH_RISK_SUCCESS,
    PATCH_RISK_FAILURE,
    GET_QUOTE_PENDING,
    GET_QUOTE_SUCCESS,
    GET_QUOTE_FAILURE,
    UPDATE_RISK_ALBUM,
} from "./types";
import { Risk } from "../reducers/commonTypes";

export const getRisksForPolicy =
    (policyId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        // only gets completed risks for policy members
        // doesnt get risks that people were just trying out the get a quote process
        dispatch({ type: GET_RISK_FOR_POLICY_PENDING });
        try {
            const response = await API.getRisksForPolicy(policyId);
            dispatch({
                type: GET_RISK_FOR_POLICY_SUCCESS,
                payload: {
                    policyId: policyId,
                    risks: response.data,
                },
            });
        } catch (error) {
            dispatch({ type: GET_RISK_FOR_POLICY_FAILURE, payload: error });
        }
    };

export const getOrCreateRisk =
    (
        policyId: number,
        values: API.RiskCreationPayload
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: CREATE_RISK_PENDING });
        try {
            const response = await API.getOrCreateRisk(policyId, values);
            dispatch({ type: CREATE_RISK_SUCCESS, payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: CREATE_RISK_FAILURE, payload: error });
            return null;
        }
    };

export const patchRisk =
    (
        policyId: number,
        riskId: number,
        payload: any,
        fetchQuote: boolean = false
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: PATCH_RISK_PENDING });
        try {
            const response = await API.patchRisk(policyId, riskId, payload);
            dispatch({ type: PATCH_RISK_SUCCESS, payload: response.data });
            if (fetchQuote) {
                dispatch(getQuote(policyId, riskId));
            }
        } catch (error) {
            dispatch({ type: PATCH_RISK_FAILURE, payload: error });
        }
    };

// updates the focused risk
export const updatePhotoSet = (photos: any) => {
    return {
        type: UPDATE_RISK_ALBUM,
        payload: photos,
    };
};

export const getQuote =
    (
        policyId: number,
        riskId: number
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_QUOTE_PENDING });
        try {
            const response = await API.getQuote(policyId, riskId);
            dispatch({ type: GET_QUOTE_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: GET_QUOTE_FAILURE, payload: error });
        }
    };

export const getUserRisks =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_RISKS_FOR_USER_PENDING });
        try {
            const response = await API.getRisksForUser();
            // reshare to {[policyId]: [risks]}
            const risksByPolicy = response.data.reduce(
                (acc: any, risk: Risk) => {
                    if (!acc[risk.policy]) {
                        acc[risk.policy] = [];
                    }
                    acc[risk.policy].push(risk);
                    return acc;
                },
                {}
            );
            dispatch({
                type: GET_RISKS_FOR_USER_SUCCESS,
                payload: risksByPolicy,
            });
        } catch (error) {
            dispatch({ type: GET_RISKS_FOR_USER_FAILURE, payload: error });
        }
    };
