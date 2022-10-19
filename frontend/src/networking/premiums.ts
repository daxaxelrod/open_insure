import { Premium } from "../redux/reducers/commonTypes";
import { axiosInstance } from "./api";

export interface PremiumPatchPayload extends Partial<Premium> {}

export const patchPremium = (
    policyId: number,
    premiumId: number,
    payload: PremiumPatchPayload
) => {
    console.log("patchPremium", policyId, premiumId, payload);

    return axiosInstance.patch(
        `/api/v1/policies/${policyId}/premiums/${premiumId}/`,
        payload
    );
};

export const getPolicyPremiums = (policyId: number) => {
    return axiosInstance.get(`/api/v1/policies/${policyId}/premiums/`);
};
