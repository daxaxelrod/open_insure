/* eslint-disable import/no-anonymous-default-export */
import { AnyAction } from "@reduxjs/toolkit";

import {
    GET_AVAILABLE_POLICIES_LINES_PENDING,
    GET_AVAILABLE_POLICIES_LINES_SUCCESS,
    GET_AVAILABLE_POLICIES_LINES_FAILURE,
    GET_ACTUARIAL_STATS_FOR_POLICY_LINE_PENDING,
    GET_ACTUARIAL_STATS_FOR_POLICY_LINE_SUCCESS,
    GET_ACTUARIAL_STATS_FOR_POLICY_LINE_FAILURE,
    SET_ACTIVE_PROPERTY_LIFE_DATE_POINT,
} from "../actions/types";
import {
    PolicyLine,
    PropertyLifeDatePoint,
    PolicyLineStats,
} from "./types/actuaryTypes";

export interface ActuaryState {
    policyLines: PolicyLine[];
    getPolicyLinesPending: boolean;
    activePropertyLifeDatePoint: PropertyLifeDatePoint | null;
    activePolicyLineStats: PolicyLineStats | null;
    getPolicyLineStatsPending: boolean;
}

const initialState: ActuaryState = {
    policyLines: [],
    getPolicyLinesPending: false,
    activePropertyLifeDatePoint: null,
    activePolicyLineStats: null,
    getPolicyLineStatsPending: false,
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case GET_AVAILABLE_POLICIES_LINES_PENDING:
            return {
                ...state,
                getPolicyLinesPending: true,
            };
        case GET_AVAILABLE_POLICIES_LINES_SUCCESS:
            return {
                ...state,
                getPolicyLinesPending: false,
                policyLines: payload,
            };
        case GET_AVAILABLE_POLICIES_LINES_FAILURE:
            return {
                ...state,
                policyLines: [],
                getPolicyLinesPending: false,
            };
        case GET_ACTUARIAL_STATS_FOR_POLICY_LINE_PENDING:
            return {
                ...state,
                getPolicyLineStatsPending: true,
            };
        case GET_ACTUARIAL_STATS_FOR_POLICY_LINE_SUCCESS:
            return {
                ...state,
                getPolicyLineStatsPending: false,
                activePolicyLineStats: payload,
            };
        case GET_ACTUARIAL_STATS_FOR_POLICY_LINE_FAILURE:
            return {
                ...state,
                getPolicyLineStatsPending: false,
                activePolicyLineStats: null,
            };

        case SET_ACTIVE_PROPERTY_LIFE_DATE_POINT:
            return {
                ...state,
                // policyLines: [...state.policyLines.map((p) => ({ ...p }))],
                activePropertyLifeDatePoint: payload,
            };

        default:
            return state;
    }
};
