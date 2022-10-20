import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/premiums";
import {
    GET_POLICY_PREMIUMS_PENDING,
    GET_POLICY_PREMIUMS_SUCCESS,
    GET_POLICY_PREMIUMS_FAILURE,
    PATCH_PREMIUM_PENDING,
    PATCH_PREMIUM_SUCCESS,
    PATCH_PREMIUM_FAILURE,
} from "./types";

export const patchPremium =
    (
        policyId: number,
        premiumId: number,
        payload: API.PremiumPatchPayload
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: PATCH_PREMIUM_PENDING, payload: { premiumId } });
        try {
            const response = await API.patchPremium(
                policyId,
                premiumId,
                payload
            );
            dispatch({ type: PATCH_PREMIUM_SUCCESS, payload: response.data });
        } catch (error: any) {
            dispatch({
                type: PATCH_PREMIUM_FAILURE,
                payload: { ...error, premiumId },
            });
        }
    };

export const getPolicyPremiums =
    (policyId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: GET_POLICY_PREMIUMS_PENDING });
        try {
            const response = await API.getPolicyPremiums(policyId);
            dispatch({
                type: GET_POLICY_PREMIUMS_SUCCESS,
                payload: response.data,
                policyId,
            });
        } catch (error) {
            dispatch({ type: GET_POLICY_PREMIUMS_FAILURE, payload: error });
        }
    };
