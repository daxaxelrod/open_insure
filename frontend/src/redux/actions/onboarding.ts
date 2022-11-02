import { ThunkAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import * as API from "../../networking/auth";
import {
    REGISTER_PENDING,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
} from "../actions/types";
import { RootState } from "../store";

export const register =
    (
        payload: API.RegisterRequest
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: REGISTER_PENDING });
        try {
            const response = await API.register(payload);
            dispatch({ type: REGISTER_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: REGISTER_FAILURE, payload: error });
        }
    };

export const login =
    (
        payload: API.LoginRequest
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: LOGIN_PENDING });
        try {
            await API.login(payload); // just handles tokens, need to actually fetch user details as well
            const userResponse = await API.getSelf();
            dispatch({ type: LOGIN_SUCCESS, payload: userResponse.data });
        } catch (error: any) {
            dispatch({ type: LOGIN_FAILURE, payload: error.response.data });
        }
    };
