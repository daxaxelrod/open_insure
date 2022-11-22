import { axiosInstance } from "./api";

export interface ClaimCreationPayload {
    title: string;
    description: string;
    amount: number;
}

export const createClaim = (policyId: number, values: ClaimCreationPayload) => {
    return axiosInstance.post(`/api/v1/policies/${policyId}/claims/`, values);
};

export const getClaimsForPolicy = (policyId: number) => {
    return axiosInstance.get(`/api/v1/policies/${policyId}/claims/`);
};

export const createClaimEvidence = (policyId: number, rest: any) => {
    return axiosInstance.post(
        `/api/v1/policies/${policyId}/claim_evidence/`,
        {}
    );
};
