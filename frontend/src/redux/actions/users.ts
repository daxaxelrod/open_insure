import { UPDATE_OWN_PROFILE } from "./types";

export const updateProfilePhoto = (photoUrl: string) => ({
    type: UPDATE_OWN_PROFILE,
    payload: photoUrl,
});
