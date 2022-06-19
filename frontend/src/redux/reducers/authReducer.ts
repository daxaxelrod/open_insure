import { AnyAction } from "@reduxjs/toolkit";
import {
    LOGIN,
    LOGOUT,
    REGISTER,
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
    currentUser?: User|null;
    
}
  
const initialState: AuthState = {
    currentUser: null
};

export default (state = initialState, { type, payload }: AnyAction) => {
  switch (type) {

  case LOGIN:
    return {
        currentUser: payload.currentUser
    }
  case LOGOUT:
    return {
        ...state,
        currentUser: null
    }
  case REGISTER: 
    return {
        ...state,
        currentUser: payload.currentUser
    }

  default:
    return state
  }
}
