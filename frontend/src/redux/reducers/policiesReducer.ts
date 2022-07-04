import { AnyAction } from "@reduxjs/toolkit";

import {
    GET_AVAILABLE_POLICIES_PENDING,
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_AVAILABLE_POLICIES_FAILURE
} from '../actions/types';
import { Policy } from "./commonTypes";

export interface AuthState {
    policies: Policy[]; // maybe rename this quotes?
    getPoliciesPending: boolean;
    policiesApartOf: Policy[]; // Ehhhhhhhh. Meaning policies the user is a part of.
    nextPoliciesPage: number | null; // for pagination
}

const initialState: AuthState = {
    policies: [],
    getPoliciesPending: false,
    nextPoliciesPage: null,
    policiesApartOf: [],
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {

        case GET_AVAILABLE_POLICIES_PENDING:
            return {
                ...state,
                getPoliciesPending: true,
            }
        case GET_AVAILABLE_POLICIES_SUCCESS:
            return {
                ...state,
                getPoliciesPending: false,
                policies: payload.results,
                nextPoliciesPage: payload.next,
            }
        case GET_AVAILABLE_POLICIES_FAILURE:
            return {
                ...state,
                getPoliciesPending: false,
            }

        default:
            return state
    }
}
