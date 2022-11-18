import { SET_POLICY_DETAIL_TAB_KEY } from "./types";

export const setPolicyDetailTabKey = (tabKey: string) => ({
    type: SET_POLICY_DETAIL_TAB_KEY,
    payload: tabKey,
});
