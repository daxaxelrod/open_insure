// stuff to do with profiles

import { axiosInstance } from "./api";

export function uploadProfilePicture(formData: any, config: any) {
    return axiosInstance.patch(`/api/v1/me/`, formData, config);
}

export function joinMailingList(email: string) {
    return axiosInstance.post(`/api/v1/waitlist/`, { email });
}

export function getUserDetail(userId: number) {
    return axiosInstance.get(`/api/v1/users/${userId}/`);
}

export function getUserReputation(userId: number) {
    return axiosInstance.get(`/api/v1/users/${userId}/reputation/`);
}

export function createReputationAudit(userId: number) {
    return axiosInstance.post(`/api/v1/users/${userId}/reputation/audit/`);
}
