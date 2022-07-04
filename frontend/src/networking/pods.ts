import { axiosInstance } from './api'


export const getPodById = (id: number) => {
    return axiosInstance.get(`/api/v1/pods/${id}`);
}