/* eslint-disable import/no-anonymous-default-export */
import { AnyAction } from "@reduxjs/toolkit";

import {
    GET_AVAILABLE_POLICIES_PENDING,
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_AVAILABLE_POLICIES_FAILURE,
    CREATE_POLICY_PENDING,
    CREATE_POLICY_SUCCESS,
    CREATE_POLICY_FAILURE,
    GET_USER_POLICIES_PENDING,
    GET_USER_POLICIES_SUCCESS,
    GET_USER_POLICIES_FAILURE,
    
} from '../actions/types';
import { Policy } from "./commonTypes";

export interface PoliciesState {
    publicPolicies: Policy[];
    nextPublicPoliciesPage: number | null; // for pagination
    getPublicPoliciesPending: boolean;
    userPolicies: Policy[];
    getUserPolicysPending: boolean;
    createPolicyPending: boolean;
}

const initialState: PoliciesState = {
    publicPolicies: [],
    getPublicPoliciesPending: false,
    nextPublicPoliciesPage: null,
    userPolicies: [],
    getUserPolicysPending: false,
    createPolicyPending: false,
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {

        case GET_AVAILABLE_POLICIES_PENDING:
            return {
                ...state,
                getPublicPoliciesPending: true,
            }
        case GET_AVAILABLE_POLICIES_SUCCESS:
            return {
                ...state,
                getPublicPoliciesPending: false,
                publicPolicies: payload.results,
                nextPublicPoliciesPage: payload.next,
            }
        case GET_AVAILABLE_POLICIES_FAILURE:
            return {
                ...state,
                getPublicPoliciesPending: false,
            }
        case CREATE_POLICY_PENDING:
            return {
                ...state,
                createPolicyPending: true,
            }
        case CREATE_POLICY_SUCCESS:
            return {
                ...state,
                userPolicies: [...state.userPolicies, payload],
                publicPolicies: [...state.publicPolicies, payload], // hrm
                createPolicyPending: false,
            }
        case CREATE_POLICY_FAILURE:
            return {
                ...state,
                createPolicyPending: false,
            }
        case "shitboxmonetytuoke":
            return {
                ...state,
                getUserPolicysPending: true,
            }
        
        case GET_USER_POLICIES_SUCCESS:
            return {
                ...state,
                userPolicies: payload.results,
                getUserPolicysPending: false,
            }

        case GET_USER_POLICIES_FAILURE:
            return {
                ...state,
                getUserPolicysPending: false,
            }

        default:
            return state
    }
}



