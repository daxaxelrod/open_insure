import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/guesses";

import {
    GET_AVAILABLE_POLICIES_LINES_PENDING,
    GET_AVAILABLE_POLICIES_LINES_SUCCESS,
    GET_AVAILABLE_POLICIES_LINES_FAILURE,
    GET_ACTUARIAL_STATS_FOR_POLICY_LINE_PENDING,
    GET_ACTUARIAL_STATS_FOR_POLICY_LINE_SUCCESS,
    GET_ACTUARIAL_STATS_FOR_POLICY_LINE_FAILURE,
    SET_ACTIVE_PROPERTY_LIFE_DATE_POINT,
} from "../actions/types";
import { LossDataPoint } from "../reducers/types/actuaryTypes";

export const getAvailablePolicyLines =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_AVAILABLE_POLICIES_LINES_PENDING });
        try {
            const response = await API.getAvailablePolicyLines();
            console.log("get available policy lines", response.data);

            dispatch({
                type: GET_AVAILABLE_POLICIES_LINES_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            console.log("get available policy lines error", error);

            dispatch({
                type: GET_AVAILABLE_POLICIES_LINES_FAILURE,
            });
        }
    };

export const getActuarialStatsForPolicyLine =
    (policyLineId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_ACTUARIAL_STATS_FOR_POLICY_LINE_PENDING });
        try {
            const response = await API.getActuarialStatsForPolicyLine(
                policyLineId
            );
            dispatch({
                type: GET_ACTUARIAL_STATS_FOR_POLICY_LINE_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({
                type: GET_ACTUARIAL_STATS_FOR_POLICY_LINE_FAILURE,
                payload: error,
            });
        }
    };

export const setActivePropertyLifeDatePoint =
    (
        contribution: LossDataPoint | null
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    (dispatch) => {
        dispatch({
            type: SET_ACTIVE_PROPERTY_LIFE_DATE_POINT,
            payload: contribution,
        });
    };
