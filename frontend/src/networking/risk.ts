import { axiosInstance } from "./api";

export interface RiskCreationPayload {} // used to have some stuff

export function getRisksForPolicy(policyId: number) {
    return axiosInstance.get(`/api/v1/policies/${policyId}/risk/`);
}
export function getOrCreateRisk(policyId: number, payload: any) {
    return axiosInstance.post(`/api/v1/policies/${policyId}/risk/`, payload);
}
export function patchRisk(policyId: number, payload: any) {
    return axiosInstance.patch(`/api/v1/policies/${policyId}/risk/`, payload);
}
