import { ThunkAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { RegisterRequest, register as apiRegister } from '../../networking/auth';
import {
    REGISTER_PENDING,
    REGISTER_SUCCESS,
    REGISTER_FAILURE
} from '../actions/types';
import { RootState } from '../store';


export const register = (payload: RegisterRequest): ThunkAction<void, RootState, unknown, AnyAction>  => async dispatch => { 
    dispatch({ type: REGISTER_PENDING });
    try {
        const response = await apiRegister(payload);
        dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: REGISTER_FAILURE, payload: error });
    }
}