import { axiosInstance } from "./api";

export interface ClaimCreationPayload {
    title: string;
    description: string;
    amount: number;
}

export const createClaim = (policyId: number, values: ClaimCreationPayload) => {
    return axiosInstance.post(`/api/v1/policies/${policyId}/claims/`, values);
};
