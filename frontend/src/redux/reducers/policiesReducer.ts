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
    PATCH_POLICY_SUCCESS,
    PATCH_POLICY_PENDING,
    PATCH_POLICY_FAILURE,
    INITIATE_POLICY_EXTENSION_PENDING,
    INITIATE_POLICY_EXTENSION_SUCCESS,
    INITIATE_POLICY_EXTENSION_FAILURE,
    GET_RENEWALS_PENDING,
    GET_RENEWALS_SUCCESS,
    GET_RENEWALS_FAILURE,
    CLEAR_RENEWAL_ERROR,
} from "../actions/types";
import { Policy, Renewal } from "./types/commonTypes";

export interface PoliciesState {
    publicPolicies: Policy[];
    nextPublicPoliciesPage: number | null; // for pagination
    getPublicPoliciesPending: boolean;
    userPolicies: Policy[];
    getUserPolicysPending: boolean;
    createPolicyPending: boolean;
    joinPolicyPending: boolean;
    patchPolicyPending: boolean;
    createRenewalPending: boolean;
    renewals: Record<string, Renewal[]>;
    getRenewalsPending: boolean;
    extensionError: any;
}

const initialState: PoliciesState = {
    publicPolicies: [],
    getPublicPoliciesPending: false,
    nextPublicPoliciesPage: null,
    userPolicies: [],
    getUserPolicysPending: false,
    createPolicyPending: false,
    joinPolicyPending: false,
    patchPolicyPending: false,
    createRenewalPending: false,
    renewals: {},
    getRenewalsPending: false,
    extensionError: null,
};

export default (
    state = initialState,
    { type, payload, policyId }: AnyAction
) => {
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
                publicPolicies: [...state.publicPolicies, payload],
                createPolicyPending: false,
            };
        case CREATE_POLICY_FAILURE:
            return {
                ...state,
                createPolicyPending: false,
            };
        case PATCH_POLICY_PENDING:
            return {
                ...state,
                patchPolicyPending: true,
            };
        case PATCH_POLICY_SUCCESS:
            return {
                ...state,
                publicPolicies: state.publicPolicies.map((policy) => {
                    if (policy.id === payload.id) {
                        // keep the deep objects, only change the shallow ones
                        let onlyObjectItems = Object.fromEntries(
                            Object.entries(policy).filter(
                                (pair) =>
                                    pair[1] instanceof Object ||
                                    pair[1] instanceof Array
                            )
                        );
                        return { ...payload, ...onlyObjectItems };
                    }
                    return policy;
                }),
                patchPolicyPending: false,
            };
        case PATCH_POLICY_FAILURE:
            return {
                ...state,
                patchPolicyPending: false,
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
        case INITIATE_POLICY_EXTENSION_PENDING:
            return {
                ...state,
                createRenewalPending: true,
                extensionError: null,
            };
        case INITIATE_POLICY_EXTENSION_FAILURE:
            return {
                ...state,
                createRenewalPending: false,
                extensionError: payload,
            };
        case INITIATE_POLICY_EXTENSION_SUCCESS:
            return {
                ...state,
                createRenewalPending: false,
            };
        case CLEAR_RENEWAL_ERROR:
            return {
                ...state,
                extensionError: null,
            };
        case GET_RENEWALS_PENDING:
            return {
                ...state,
                getRenewalsPending: true,
            };

        case GET_RENEWALS_SUCCESS:
            return {
                ...state,
                renewals: { ...state.renewals, [policyId]: payload },
                getRenewalsPending: false,
            };
        case GET_RENEWALS_FAILURE:
            return {
                ...state,
                getRenewalsPending: false,
            };
        default:
            return state;
    }
};
