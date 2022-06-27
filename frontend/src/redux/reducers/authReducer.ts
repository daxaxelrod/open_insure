import { AnyAction } from "@reduxjs/toolkit";
import {
  LOGIN,
  LOGOUT,
  REGISTER_PENDING,
  REGISTER_SUCCESS,
  REGISTER_FAILURE
} from '../actions/types';

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  picture: string;
  created_at: string;
  updated_at: string;
  verified_email: boolean;
}

export interface AuthState {
  currentUser?: User | null;
  registerPending: boolean;
  registrationError?: object | null;
}

const initialState: AuthState = {
  currentUser: null,
  registerPending: false,
  registrationError: {},
};

export default (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {

    case LOGIN:
      return {
        ...state,
        currentUser: payload.currentUser
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
