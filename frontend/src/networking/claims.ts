import { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./api";

export interface ClaimCreationPayload {
    title: string;
    description: string;
    amount: number;
}

export interface ClaimCommentCreationPayload {
    comment: string;
    claim: number;
}

export const createClaim = (policyId: number, values: ClaimCreationPayload) => {
    return axiosInstance.post(`/api/v1/policies/${policyId}/claims/`, values);
};

export const getClaimsForPolicy = (policyId: number) => {
    return axiosInstance.get(`/api/v1/policies/${policyId}/claims/`);
};

export const createClaimEvidence = (
    policyId: number,
    formData: FormData,
    config: AxiosRequestConfig = {}
) => {
    return axiosInstance.post(
        `/api/v1/policies/${policyId}/claim_evidence/`,
        formData,
        config
    );
};

export const getClaimComments = (policyId: number, claimId: number) => {
    return axiosInstance.get(
        `/api/v1/policies/${policyId}/claims/${claimId}/comments/`
    );
};

export const createClaimComment = (
    policyId: number,
    claimId: number,
    values: ClaimCommentCreationPayload
) => {
    return axiosInstance.post(
        `/api/v1/policies/${policyId}/claims/${claimId}/comments/`,
        values
    );
};

export const deleteClaimComment = (
    policyId: number,
    claimId: number,
    commentId: number
) => {
    return axiosInstance.delete(
        `/api/v1/policies/${policyId}/claims/${claimId}/comments/${commentId}/`
    );
};
