// get pod by id
// join pod
// leave pod

import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/pods";

import {
    GET_SINGLE_POD_PENDING,
    GET_SINGLE_POD_SUCCESS,
    GET_SINGLE_POD_FAILURE,
} from '../actions/types'

export const getPodById = (id: number): ThunkAction<void, RootState, unknown, AnyAction>  => async dispatch => { 
    dispatch({ type: GET_SINGLE_POD_PENDING });
    try {
        const response = await API.getPodById(id);
        dispatch({ type: GET_SINGLE_POD_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_SINGLE_POD_FAILURE, payload: error });
    }
}