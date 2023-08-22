import { axiosInstance } from "./api";

export const getAvailablePolicyLines = () => {
    return axiosInstance.get(`/api/v1/policy-lines/`);
};

export const public_submitActuaryGuess = (data: any) => {
    return axiosInstance.post(`/api/v1/guess/`, data);
};

export const getActuarialStatsForPolicyLine = (policyLineId: number) => {
    return axiosInstance.get(`/api/v1/policy-lines/${policyLineId}/`);
};
