import { axiosInstance } from './api'

export interface PodCreationPayload {
    name: string;
    description?: string;
    max_pod_size?: number;
    allow_joiners_after_policy_start?: boolean;
}

export const getPodById = (id: number) => {
    return axiosInstance.get(`/api/v1/pods/${id}`);
}

export const createPod = (values: PodCreationPayload) => {
    return axiosInstance.post('/api/v1/pods', values);
}