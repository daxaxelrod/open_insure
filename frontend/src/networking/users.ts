// stuff to do with profiles

import { axiosInstance } from "./api";

export function uploadProfilePicture(formData: any, config: any) {
    return axiosInstance.post(
        `/api/v1/users/me/upload_profile_picture/`,
        formData,
        config
    );
}
