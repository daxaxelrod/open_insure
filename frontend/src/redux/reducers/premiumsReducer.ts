import { AnyAction } from "@reduxjs/toolkit";
import {
    GET_AVAILABLE_POLICIES_SUCCESS,
    PATCH_PREMIUM_PENDING,
    PATCH_PREMIUM_SUCCESS,
    PATCH_PREMIUM_FAILURE,
    GET_POLICY_PREMIUMS_PENDING,
    GET_POLICY_PREMIUMS_SUCCESS,
    GET_POLICY_PREMIUMS_FAILURE,
} from "../actions/types";
import { Policy, Premium } from "./commonTypes";

export interface PremiumsState {
    // policyId: number -> Premium[]
    premiums: Record<number, Premium[]>;
    getPolicyPremiumsPending: boolean;
    pendingPremiums: Record<number, boolean>; // premiumId -> isPending
}

const initialState: PremiumsState = {
    premiums: {},
    getPolicyPremiumsPending: false,
    pendingPremiums: {},
};

export default (
    state = initialState,
    { type, payload, policyId }: AnyAction
) => {
    switch (type) {
        case GET_AVAILABLE_POLICIES_SUCCESS:
            return {
                ...state,
                premiums: {
                    ...state.premiums,
                    ...payload.results.reduce(
                        (acc: Record<number, Premium[]>, policy: Policy) => {
                            acc[policy.id] = policy.premiums;
                            return acc;
                        },
                        {}
                    ),
                },
            };
        case GET_POLICY_PREMIUMS_PENDING:
            return {
                ...state,
                getPolicyPremiumsPending: true,
            };
        case GET_POLICY_PREMIUMS_SUCCESS:
            return {
                ...state,
                premiums: {
                    ...state.premiums,
                    [policyId]: payload,
                },
                getPolicyPremiumsPending: false,
            };
        case GET_POLICY_PREMIUMS_FAILURE:
            return {
                ...state,
                getPolicyPremiumsPending: false,
            };

        case PATCH_PREMIUM_PENDING:
            return {
                ...state,
                pendingPremiums: {
                    ...state.pendingPremiums,
                    [payload.premiumId]: true,
                },
            };
        case PATCH_PREMIUM_SUCCESS:
            return {
                ...state,
                pendingPremiums: {
                    ...state.pendingPremiums,
                    [payload.id]: false,
                },
                premiums: {
                    ...state.premiums,
                    [payload.policy]: state.premiums[payload.policy].map(
                        (premium) => {
                            if (premium.id === payload.id) {
                                return payload;
                            }
                            return premium;
                        }
                    ),
                },
            };
        case PATCH_PREMIUM_FAILURE:
            return {
                ...state,
                pendingPremiums: {
                    ...state.pendingPremiums,
                    [payload.premiumId]: false,
                },
            };

        default:
            return state;
    }
};
