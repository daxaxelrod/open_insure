// stuff to do with profiles

import { axiosInstance } from "./api";

export function uploadProfilePicture(formData: any, config: any) {
    return axiosInstance.patch(`/api/v1/me/`, formData, config);
}
