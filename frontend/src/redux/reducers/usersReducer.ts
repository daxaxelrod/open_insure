import { AnyAction } from "@reduxjs/toolkit";
import {
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_USER_DETAIL_PENDING,
    GET_USER_DETAIL_SUCCESS,
    GET_USER_DETAIL_FAILURE,
} from "../actions/types";
import { User, Policy } from "./commonTypes";

export interface UIState {
    getUserDetailPending: boolean;
    users: Record<number, User>;
}

const initialState: UIState = {
    users: {},
    getUserDetailPending: false,
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
        case GET_USER_DETAIL_PENDING:
            return {
                ...state,
                getUserDetailPending: true,
            };
        case GET_USER_DETAIL_SUCCESS:
            return {
                ...state,
                getUserDetailPending: false,
                users: {
                    ...state.users,
                    [payload.id]: payload,
                },
            };
        case GET_USER_DETAIL_FAILURE:
            return {
                ...state,
                getUserDetailPending: false,
            };

        default:
            return state;
    }
};
