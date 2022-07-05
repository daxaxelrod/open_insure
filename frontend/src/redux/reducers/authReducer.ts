import { AnyAction } from "@reduxjs/toolkit";
import {
  LOGOUT,
  REGISTER_PENDING,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../actions/types';
import { User } from "./commonTypes";

export interface AuthState {
  currentUser?: User | null;
  loginPending: boolean;
  loginError?: object | null;
  registerPending: boolean;
  registrationError?: object | null;
}

const initialState: AuthState = {
  currentUser: null,
  loginPending: false,
  registerPending: false,
  registrationError: {},
};

export default (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {
    case LOGIN_PENDING:
      return {
        ...state,
        loginPending: true,
      }
    case LOGIN_SUCCESS:
      
      return {
        ...state,
        loginPending: false,
        currentUser: payload
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        loginPending: false,
        loginError: payload?.error
      }
    case LOGOUT:
      return {
        ...state,
        currentUser: null
      }
    case REGISTER_PENDING:
      return {
        ...state,
        registerPending: true
      }
    case REGISTER_SUCCESS:
      return {
        ...state,
        registerPending: false,
        currentUser: payload
      }
    case REGISTER_FAILURE:
      return {
        ...state,
        registerPending: false,
        currentUser: null,
      }
    
    default:
      return state
  }
}
