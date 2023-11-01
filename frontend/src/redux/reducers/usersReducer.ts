import { AnyAction } from "@reduxjs/toolkit";
import {
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_USER_DETAIL_PENDING,
    GET_USER_DETAIL_SUCCESS,
    GET_USER_DETAIL_FAILURE,
    GET_USER_REPUTATION_PENDING,
    GET_USER_REPUTATION_SUCCESS,
    GET_USER_REPUTATION_FAILURE,
} from "../actions/types";
import { User, Policy } from "./types/commonTypes";

export interface UIState {
    getUserDetailPending: boolean;
    users: Record<number, User>;
    getUserReputationPending: boolean;
}

const initialState: UIState = {
    users: {},
    getUserDetailPending: false,
    getUserReputationPending: false,
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
                            acc[user.id] = { ...state.users[user.id], ...user };
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
        case GET_USER_REPUTATION_PENDING:
            return {
                ...state,
                getUserReputationPending: true,
            };
        case GET_USER_REPUTATION_SUCCESS:
            return {
                ...state,
                getUserReputationPending: false,
                users: {
                    ...state.users,
                    [payload.userId]: {
                        ...state.users[payload.userId],
                        reputation: payload.reputation,
                    },
                },
            };
        case GET_USER_REPUTATION_FAILURE:
            return {
                ...state,
                getUserReputationPending: false,
            };

        default:
            return state;
    }
};
