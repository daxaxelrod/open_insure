import { Premium } from "../redux/reducers/commonTypes";
import { axiosInstance } from "./api";

export interface PremiumPatchPayload extends Partial<Premium> {}

export const patchPremium = (
    policyId: number,
    premiumId: number,
    payload: PremiumPatchPayload
) => {
    return axiosInstance.patch(
        `/api/v1/policies/${policyId}/premiums/${premiumId}/`,
        payload
    );
};

export const getPolicyPremiums = (policyId: number) => {
    return axiosInstance.get(`/api/v1/policies/${policyId}/premiums/`);
};

export const public_getHypotheticalQuote = (payload: any) => {
    return axiosInstance.post(`/api/v1/public/quote/`, payload);
};
