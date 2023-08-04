/* eslint-disable import/no-anonymous-default-export */
import { AnyAction } from "@reduxjs/toolkit";

import {
    GET_AVAILABLE_POLICIES_LINES_PENDING,
    GET_AVAILABLE_POLICIES_LINES_SUCCESS,
    GET_AVAILABLE_POLICIES_LINES_FAILURE,
} from "../actions/types";
import {
    PolicyLine,
    LossDataPoint,
    PropertyLifeDatePoint,
} from "./commonTypes";

export interface ActuaryState {
    policyLines: PolicyLine[];
    getPolicyLinesPending: boolean;
}

const initialState: ActuaryState = {
    policyLines: [],
    getPolicyLinesPending: false,
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
                getPolicyLinesPending: false,
            };

        default:
            return state;
    }
};
