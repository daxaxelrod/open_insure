/* eslint-disable import/no-anonymous-default-export */
import { AnyAction } from "@reduxjs/toolkit";

import {
    GET_AVAILABLE_POLICIES_PENDING,
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_AVAILABLE_POLICIES_FAILURE,
    CREATE_POLICY_PENDING,
    CREATE_POLICY_SUCCESS,
    CREATE_POLICY_FAILURE
} from '../actions/types';
import { Policy } from "./commonTypes";

export interface PoliciesState {
    policies: Policy[]; // maybe rename this quotes?
    getPoliciesPending: boolean;
    policiesApartOf: Policy[]; // Ehhhhhhhh. Meaning policies the user is a part of.
    nextPoliciesPage: number | null; // for pagination
    createPolicyPending: boolean;
}

const initialState: PoliciesState = {
    policies: [],
    getPoliciesPending: false,
    nextPoliciesPage: null,
    policiesApartOf: [],
    createPolicyPending: false,
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
        case CREATE_POLICY_PENDING:
            return {
                ...state,
                createPolicyPending: true,
            }
        case CREATE_POLICY_SUCCESS:
            return {
                ...state,
                policies: [...state.policies, payload],
                createPolicyPending: false,
            }
        case CREATE_POLICY_FAILURE:
            return {
                ...state,
                createPolicyPending: false,
            }

        default:
            return state
    }
}
