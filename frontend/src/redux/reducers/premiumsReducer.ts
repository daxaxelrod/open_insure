import { AnyAction } from "@reduxjs/toolkit";
import { GET_AVAILABLE_POLICIES_SUCCESS } from "../actions/types";
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

export default (state = initialState, { type, payload }: AnyAction) => {
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

        default:
            return state;
    }
};
