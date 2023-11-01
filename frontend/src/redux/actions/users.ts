import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { User } from "../reducers/types/commonTypes";
import { RootState } from "../store";
import {
    UPDATE_OWN_PROFILE,
    GET_USER_DETAIL_PENDING,
    GET_USER_DETAIL_SUCCESS,
    GET_USER_DETAIL_FAILURE,
    GET_USER_REPUTATION_PENDING,
    GET_USER_REPUTATION_SUCCESS,
    GET_USER_REPUTATION_FAILURE,
} from "./types";
import * as API from "../../networking/users";

export const updateProfile = (payload: Partial<User>) => ({
    type: UPDATE_OWN_PROFILE,
    payload: payload,
});

export const getDetailedUserProfile =
    (userId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_USER_DETAIL_PENDING });
        try {
            const response = await API.getUserDetail(userId);
            dispatch({ type: GET_USER_DETAIL_SUCCESS, payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: GET_USER_DETAIL_FAILURE, payload: error });
            return null;
        }
    };

export const getUserRepuation =
    (userId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_USER_REPUTATION_PENDING });
        try {
            const response = await API.getUserReputation(userId);
            debugger;
            dispatch({
                type: GET_USER_REPUTATION_SUCCESS,
                payload: {
                    userId,
                    reputation: response.data,
                },
            });
        } catch (error) {
            dispatch({ type: GET_USER_REPUTATION_FAILURE, payload: error });
        }
    };
