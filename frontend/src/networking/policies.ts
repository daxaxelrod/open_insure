import { axiosInstance } from './api'
import { PaginatedListViewParams } from './commonTypes';
import { objectToQueryString } from './utils';


export const getAvailablePolicies = (params: PaginatedListViewParams) => {
    return axiosInstance.get(`/api/v1/policies?${objectToQueryString(params)}`);
}

export const getUserPolicies = () => {
  return axiosInstance.get(`/api/v1/policies/`);
}