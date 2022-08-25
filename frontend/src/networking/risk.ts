import { axiosInstance } from "./api";

export interface RiskCreationPayload {} // used to have some stuff

export function getRisksForPolicy(policyId: number) {
    return axiosInstance.get(`/api/v1/policies/${policyId}/risk/`);
}
export function getOrCreateRisk(policyId: number, payload: any) {
    return axiosInstance.post(`/api/v1/policies/${policyId}/risk/`, payload);
}
export function patchRisk(policyId: number, riskId: number, payload: any) {
    return axiosInstance.patch(
        `/api/v1/policies/${policyId}/risk/${riskId}/`,
        payload
    );
}
export function getQuote(policyId: number, riskId: number) {
    return axiosInstance.get(
        `/api/v1/policies/${policyId}/risk/${riskId}/quote/`
    );
}

// Can upload just one or multiple, api dont care
export function uploadRiskImage(
    policyId: number,
    riskId: number,
    formData: any,
    config: any
) {
    return axiosInstance.post(
        `/api/v1/policies/${policyId}/risk/${riskId}/upload_image/`,
        formData,
        config
    );
}
