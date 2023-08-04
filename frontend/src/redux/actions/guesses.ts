import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/guesses";

import {
    GET_AVAILABLE_POLICIES_LINES_PENDING,
    GET_AVAILABLE_POLICIES_LINES_SUCCESS,
    GET_AVAILABLE_POLICIES_LINES_FAILURE,
} from "../actions/types";

export const getAvailablePolicyLines =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_AVAILABLE_POLICIES_LINES_PENDING });
        try {
            const response = await API.getAvailablePolicyLines();
            dispatch({
                type: GET_AVAILABLE_POLICIES_LINES_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            dispatch({
                type: GET_AVAILABLE_POLICIES_LINES_FAILURE,
                payload: error,
            });
        }
    };
