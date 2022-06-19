import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor } from 'axios-jwt'
import axios from 'axios'

// maybe this should be in a config file?
const BASE_URL = 'http://localhost:8000'

export const axiosInstance = axios.create({ baseURL: BASE_URL })

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens | string> => {

    // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor (in our case 'axiosInstance')
    // because this will result in an infinite loop when trying to refresh the token.
    // Use the global axios client or a different instance
    const response = await axios.post(`${BASE_URL}/api/token/refresh`, { token: refreshToken })
  
    // If your backend supports rotating refresh tokens, you may also choose to return an object containing both tokens:
    // return {
    //  accessToken: response.data.access_token,
    //  refreshToken: response.data.refresh_token
    //}
  
    return response.data.access_token
  }
  
  // 3. Add interceptor to your axios instance
  applyAuthTokenInterceptor(axiosInstance, { requestRefresh })