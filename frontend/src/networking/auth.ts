import { isLoggedIn, setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'axios-jwt'
import { axiosInstance } from './api'

type ILoginRequest = {
    email: string;
    password: string;
}


export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// 4. Post email and password and get tokens in return. Call setAuthTokens with the result.
export const login = async (params: ILoginRequest) => {
  const response = await axiosInstance.post('/auth/login', params)

  // save tokens to storage
  setAuthTokens({
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token
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

// 5. Clear the auth tokens from localstorage
export const logout = () => clearAuthTokens()


// Get access to tokens
const accessToken = getAccessToken()
const refreshToken = getRefreshToken()