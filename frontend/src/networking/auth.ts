import { isLoggedIn, setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'axios-jwt'
import { axiosInstance } from './api'

export type LoginRequest = {
    username: string;
    password: string;
}


export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// 4. Post email and password and get tokens in return. Call setAuthTokens with the result.
export const login = async (params: LoginRequest) => {
  const response = await axiosInstance.post('/api/token/', params)
  // save tokens to storage
  setAuthTokens({
    accessToken: response.data.access,
    refreshToken: response.data.refresh
  });
  return response
}

export const register = async (params: RegisterRequest) => {
  const response = await axiosInstance.post('/api/v1/users/', {...params, username: params.email});
  setAuthTokens({
    accessToken: response.data.access,
    refreshToken: response.data.refresh
  });
  return response
}

export const getSelf = async () => {
  return axiosInstance.get('/api/v1/users/me/')
}

// 5. Clear the auth tokens from localstorage
export const logout = () => clearAuthTokens()


// Get access to tokens
const accessToken = getAccessToken()
const refreshToken = getRefreshToken()