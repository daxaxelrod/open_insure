import { AnyAction } from "@reduxjs/toolkit";
import { SET_POLICY_DETAIL_TAB_KEY } from "../actions/types";

export interface UIState {
    policyDetailTabKey: string;
}

const initialState: UIState = {
    policyDetailTabKey: "1",
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case SET_POLICY_DETAIL_TAB_KEY:
            return { ...state, policyDetailTabKey: payload };

        default:
            return state;
    }
};
