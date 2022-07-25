import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from '../../networking/policies';
import { 
    GET_AVAILABLE_POLICIES_PENDING,
    GET_AVAILABLE_POLICIES_SUCCESS,
    GET_AVAILABLE_POLICIES_FAILURE,
    GET_USER_POLICIES_PENDING,
    GET_USER_POLICIES_SUCCESS,
    GET_USER_POLICIES_FAILURE,
    CREATE_POLICY_PENDING,
    CREATE_POLICY_SUCCESS,
    CREATE_POLICY_FAILURE
} from "./types";


export const getAvailablePolicies = (page: number, perPage: number): ThunkAction<void, RootState, unknown, AnyAction>  => async dispatch => { 
    dispatch({ type: GET_AVAILABLE_POLICIES_PENDING });
    try {
        const response = await API.getAvailablePolicies({page, perPage});
        dispatch({ type: GET_AVAILABLE_POLICIES_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_AVAILABLE_POLICIES_FAILURE, payload: error });
    }
}

export const getUserPolicies = (): ThunkAction<void, RootState, unknown, AnyAction>  => async dispatch => {
    dispatch({ type: GET_USER_POLICIES_PENDING });
    try {
        const response = await API.getUserPolicies();
        dispatch({ type: GET_USER_POLICIES_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_USER_POLICIES_FAILURE, payload: error });
    }
}

export const createPolicy = (values: API.PolicyCreationPayload): ThunkAction<void, RootState, unknown, AnyAction>  => async dispatch => {
    dispatch({ type: CREATE_POLICY_PENDING });
    try {
        debugger;
        const response = await API.createPolicy(values);
        debugger
        dispatch({ type: CREATE_POLICY_SUCCESS, payload: response.data });
    } catch (error) {
        debugger;
        dispatch({ type: CREATE_POLICY_FAILURE, payload: error });
    }
}