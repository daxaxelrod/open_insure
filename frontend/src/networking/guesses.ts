import { axiosInstance } from "./api";

export const getAvailablePolicyLines = () => {
    return axiosInstance.get(`/api/v1/policy-lines/`);
};
