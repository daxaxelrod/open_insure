import { axiosInstance } from "./api";

export function initatePolicyExtension(
    policyId: number,
    extensionDate: number
) {
    return axiosInstance.post(`/api/v1/policies/${policyId}/renewals/`, {
        months_extension: extensionDate,
    });
}
