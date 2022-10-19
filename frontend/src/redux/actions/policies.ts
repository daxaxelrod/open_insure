import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/policies";
import {
    GET_AVAILABLE_POLICIES_PENDING,
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_AVAILABLE_POLICIES_FAILURE,
    GET_POLICY_RISK_SETTINGS_PENDING,
    GET_POLICY_RISK_SETTINGS_SUCCESS,
    GET_POLICY_RISK_SETTINGS_FAILURE,
    PATCH_POLICY_RISK_SETTINGS_PENDING,
    PATCH_POLICY_RISK_SETTINGS_SUCCESS,
    PATCH_POLICY_RISK_SETTINGS_FAILURE,
    GET_USER_POLICIES_PENDING,
    GET_USER_POLICIES_SUCCESS,
    GET_USER_POLICIES_FAILURE,
    CREATE_POLICY_PENDING,
    CREATE_POLICY_SUCCESS,
    CREATE_POLICY_FAILURE,
    JOIN_POLICY_PENDING,
    JOIN_POLICY_SUCCESS,
    JOIN_POLICY_FAILURE,
} from "./types";
import { getRisksForPolicy } from "./risk";
import { RiskSettings } from "../reducers/commonTypes";

export const getAvailablePolicies =
    (
        page: number,
        perPage: number
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_AVAILABLE_POLICIES_PENDING });
        try {
            const response = await API.getAvailablePolicies({ page, perPage });
            dispatch({
                type: GET_AVAILABLE_POLICIES_SUCCESS,
                payload: response.data,
            });

            for (
                let index = 0;
                index < response.data?.results?.length;
                index++
            ) {
                const policy = response.data?.results[index];
                dispatch(getRisksForPolicy(policy.id));
            }
        } catch (error) {
            dispatch({ type: GET_AVAILABLE_POLICIES_FAILURE, payload: error });
        }
    };

export const getUserPolicies =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_USER_POLICIES_PENDING });
        try {
            const response = await API.getUserPolicies();
            dispatch({
                type: GET_USER_POLICIES_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({ type: GET_USER_POLICIES_FAILURE, payload: error });
        }
    };

export const createPolicy =
    (
        values: API.PolicyCreationPayload
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: CREATE_POLICY_PENDING });
        try {
            const response = await API.createPolicy(values);
            dispatch({ type: CREATE_POLICY_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: CREATE_POLICY_FAILURE, payload: error });
        }
    };

export const joinPolicy =
    (
        policyId: number,
        onSuccess: () => void
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: JOIN_POLICY_PENDING });
        try {
            const response = await API.joinPolicy(policyId);
            dispatch({ type: JOIN_POLICY_SUCCESS, payload: response.data });
            onSuccess();
        } catch (error) {
            dispatch({ type: JOIN_POLICY_FAILURE, payload: error });
        }
    };

export const getPolicyRiskSettings =
    (policyId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_POLICY_RISK_SETTINGS_PENDING });
        try {
            const response = await API.getPolicyRiskSettings(policyId);
            dispatch({
                type: GET_POLICY_RISK_SETTINGS_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({
                type: GET_POLICY_RISK_SETTINGS_FAILURE,
                payload: {
                    error,
                    policy: policyId,
                },
            });
        }
    };

export const updatePolicyRiskSettings =
    (
        policyId: number,
        values: Partial<RiskSettings>,
        onSuccess: () => void
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: PATCH_POLICY_RISK_SETTINGS_PENDING });
        try {
            const response = await API.updatePolicyRiskSettings(
                policyId,
                values
            );
            dispatch({
                type: PATCH_POLICY_RISK_SETTINGS_SUCCESS,
                payload: response.data,
            });
            dispatch(getRisksForPolicy(policyId));
            onSuccess();
        } catch (error) {
            dispatch({
                type: PATCH_POLICY_RISK_SETTINGS_FAILURE,
                payload: {
                    error,
                    policy: policyId,
                },
            });
        }
    };
