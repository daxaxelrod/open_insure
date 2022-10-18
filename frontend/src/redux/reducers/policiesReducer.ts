import { AnyAction } from "@reduxjs/toolkit";

import {
    GET_AVAILABLE_POLICIES_PENDING,
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_AVAILABLE_POLICIES_FAILURE,
    CREATE_POLICY_PENDING,
    CREATE_POLICY_SUCCESS,
    CREATE_POLICY_FAILURE,
    JOIN_POLICY_PENDING,
    JOIN_POLICY_SUCCESS,
    JOIN_POLICY_FAILURE,
    GET_USER_POLICIES_PENDING,
    GET_USER_POLICIES_SUCCESS,
    GET_USER_POLICIES_FAILURE,
    GET_POLICY_PREMIUMS_PENDING,
    GET_POLICY_PREMIUMS_SUCCESS,
    GET_POLICY_PREMIUMS_FAILURE,
} from "../actions/types";
import { Policy } from "./commonTypes";

export interface PoliciesState {
    publicPolicies: Policy[];
    nextPublicPoliciesPage: number | null; // for pagination
    getPublicPoliciesPending: boolean;
    userPolicies: Policy[];
    getUserPolicysPending: boolean;
    createPolicyPending: boolean;
    joinPolicyPending: boolean;
    getPolicyPremiumsPending: boolean;
}

const initialState: PoliciesState = {
    publicPolicies: [],
    getPublicPoliciesPending: false,
    nextPublicPoliciesPage: null,
    userPolicies: [],
    getUserPolicysPending: false,
    createPolicyPending: false,
    joinPolicyPending: false,
    getPolicyPremiumsPending: false,
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case GET_AVAILABLE_POLICIES_PENDING:
            return {
                ...state,
                getPublicPoliciesPending: true,
            };
        case GET_AVAILABLE_POLICIES_SUCCESS:
            return {
                ...state,
                getPublicPoliciesPending: false,
                publicPolicies: payload.results,
                nextPublicPoliciesPage: payload.next,
            };
        case GET_AVAILABLE_POLICIES_FAILURE:
            return {
                ...state,
                getPublicPoliciesPending: false,
            };
        case CREATE_POLICY_PENDING:
            return {
                ...state,
                createPolicyPending: true,
            };
        case CREATE_POLICY_SUCCESS:
            return {
                ...state,
                userPolicies: [...state.userPolicies, payload],
                publicPolicies: [...state.publicPolicies, payload], // hrm
                createPolicyPending: false,
            };
        case CREATE_POLICY_FAILURE:
            return {
                ...state,
                createPolicyPending: false,
            };
        case GET_USER_POLICIES_PENDING:
            return {
                ...state,
                getUserPolicysPending: true,
            };

        case GET_USER_POLICIES_SUCCESS:
            return {
                ...state,
                userPolicies: payload.results,
                getUserPolicysPending: false,
            };

        case GET_USER_POLICIES_FAILURE:
            return {
                ...state,
                getUserPolicysPending: false,
            };
        case JOIN_POLICY_PENDING:
            return {
                ...state,
                joinPolicyPending: true,
            };
        case JOIN_POLICY_SUCCESS:
            return {
                ...state,
                userPolicies: [...state.userPolicies, payload],
                publicPolicies: state.publicPolicies.map((policy) => {
                    if (policy.id === payload.id) {
                        return payload;
                    }
                    return policy;
                }),
                joinPolicyPending: false,
            };
        case JOIN_POLICY_FAILURE:
            return {
                ...state,
                joinPolicyPending: false,
            };

        case GET_POLICY_PREMIUMS_PENDING:
            return {
                ...state,
                getPolicyPremiumsPending: true,
            };
        case GET_POLICY_PREMIUMS_SUCCESS:
            return {
                ...state,
                getPolicyPremiumsPending: false,
                publicPolicies: state.publicPolicies.map((policy) => {
                    if (policy.id === payload.policyId) {
                        return {
                            ...policy,
                            premiums: payload,
                        };
                    }
                    return policy;
                }),
            };
        case GET_POLICY_PREMIUMS_FAILURE:
            return {
                ...state,
                getPolicyPremiumsPending: false,
            };

        default:
            return state;
    }
};
