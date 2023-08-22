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
    SET_HIGHLIGHTED_CONTRIBUTION,
} from "../actions/types";
import { PropertyLifeDatePoint } from "../reducers/commonTypes";

export const getAvailablePolicyLines =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_AVAILABLE_POLICIES_LINES_PENDING });
        try {
            const response = await API.getAvailablePolicyLines();
            dispatch({
                type: GET_AVAILABLE_POLICIES_LINES_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({
                type: GET_AVAILABLE_POLICIES_LINES_FAILURE,
                payload: error,
            });
        }
    };

export const setHighlightedContribution = (
    contribution: PropertyLifeDatePoint
) => {
    return {
        type: SET_HIGHLIGHTED_CONTRIBUTION,
        payload: contribution,
    };
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
