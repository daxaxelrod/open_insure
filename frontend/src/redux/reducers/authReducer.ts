import { AnyAction } from "@reduxjs/toolkit";
import {
    LOGOUT,
    REGISTER_PENDING,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    UPDATE_OWN_PROFILE,
} from "../actions/types";
import { User } from "./commonTypes";

export interface AuthState {
    currentUser?: User | {};
    loginPending: boolean;
    loginError?: any;
    registerPending: boolean;
    registrationError?: any;
}

const initialState: AuthState = {
    currentUser: {},
    loginPending: false,
    registerPending: false,
    registrationError: null,
    loginError: null,
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case LOGIN_PENDING:
            return {
                ...state,
                loginPending: true,
                loginError: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loginPending: false,
                currentUser: payload,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loginPending: false,
                loginError: { overall: payload.detail },
            };
        case LOGOUT:
            return {
                ...state,
                currentUser: {},
                loginError: null,
            };
        case REGISTER_PENDING:
            return {
                ...state,
                registerPending: true,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                registerPending: false,
                currentUser: payload,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                registerPending: false,
                currentUser: {},
                registrationError: { overall: payload },
            };
        case UPDATE_OWN_PROFILE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...payload,
                },
            };

        default:
            return {
                ...state,
                registrationError: {},
                registerPending: false,
                loginPending: false,
            };
    }
};
