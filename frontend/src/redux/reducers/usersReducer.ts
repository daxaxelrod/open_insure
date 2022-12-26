import { AnyAction } from "@reduxjs/toolkit";
import {
    GET_AVAILABLE_POLICIES_SUCCESS,
    SET_POLICY_DETAIL_TAB_KEY,
} from "../actions/types";
import { User, Policy } from "./commonTypes";

export interface UIState {
    users: Record<number, User>;
}

const initialState: UIState = {
    users: {},
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case GET_AVAILABLE_POLICIES_SUCCESS:
            // flatten pods into array of users and reduce to id: User
            return {
                ...state,
                users: {
                    ...state.users,
                    ...payload.results
                        .map((p: Policy) => p.pod.members)
                        .flat()
                        .reduce((acc: Record<number, User>, user: User) => {
                            acc[user.id] = user;
                            return acc;
                        }, {}),
                },
            };

        default:
            return state;
    }
};
