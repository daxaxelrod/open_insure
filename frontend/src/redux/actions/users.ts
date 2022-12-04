import { User } from "../reducers/commonTypes";
import { UPDATE_OWN_PROFILE } from "./types";

export const updateProfile = (payload: Partial<User>) => ({
    type: UPDATE_OWN_PROFILE,
    payload: payload,
});
