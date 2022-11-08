import { RiskSettings } from "../redux/reducers/commonTypes";
import { axiosInstance } from "./api";
import { PaginatedListViewParams } from "./commonTypes";
import { objectToQueryString } from "./utils";

export interface PolicyCreationPayload {
    name: string;
    coverage_type: string;
    coverage_start_date: string;
    coverage_duration: number;
    available_underlying_insured_types: string[];
    pod: number;
}

// only allow patching of a few fields
// of course this needs to be forced by the backend as well
export interface PolicyPatchPayload {
    name?: string;
    pool_address?: string;
}

export const getAvailablePolicies = (params: PaginatedListViewParams) => {
    return axiosInstance.get(
        `/api/v1/policies/?${objectToQueryString(params)}`
    );
};

export const getUserPolicies = () => {
    return axiosInstance.get(`/api/v1/policies/?where_member=true`);
};

export const createPolicy = (values: PolicyCreationPayload) => {
    return axiosInstance.post(`/api/v1/policies/`, values);
};

export const patchPolicy = (policyId: number, payload: PolicyPatchPayload) => {
    return axiosInstance.patch(`/api/v1/policies/${policyId}/`, payload);
};

export const joinPolicy = (policyId: number) => {
    return axiosInstance.post(`/api/v1/policies/${policyId}/join/`);
};

export const getPolicyRiskSettings = (policyId: number) => {
    return axiosInstance.get(`/api/v1/policies/${policyId}/risk_settings/`);
};

export const modifyPolicyRiskSettings = (policyId: number, values: any) => {
    return axiosInstance.patch(
        `/api/v1/policies/${policyId}/risk_settings/`,
        values
    );
};

export const updatePolicyRiskSettings = (
    policyId: number,
    values: Partial<RiskSettings>
) => {
    return axiosInstance.patch(
        `/api/v1/policies/${policyId}/risk_settings/`,
        values
    );
};
