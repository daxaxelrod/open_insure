// risk is more commonly known as "quotes". It represents the underlying risk of a peril as well as a nested object that contains infromation about the insured asset.

import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/risk";
import {
    GET_RISK_FOR_POLICY_PENDING,
    GET_RISK_FOR_POLICY_SUCCESS,
    GET_RISK_FOR_POLICY_FAILURE,
    CREATE_RISK_PENDING,
    CREATE_RISK_SUCCESS,
    CREATE_RISK_FAILURE,
    PATCH_RISK_PENDING,
    PATCH_RISK_SUCCESS,
    PATCH_RISK_FAILURE,
} from "./types";

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
                payload: response.data,
            });
        } catch (error) {
            dispatch({ type: GET_RISK_FOR_POLICY_FAILURE, payload: error });
        }
    };

export const getOrCreateRisk =
    (
        values: API.RiskCreationPayload
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: CREATE_RISK_PENDING });
        try {
            const response = await API.createRisk(values);
            dispatch({ type: CREATE_RISK_SUCCESS, payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: CREATE_RISK_FAILURE, payload: error });
            return null;
        }
    };
