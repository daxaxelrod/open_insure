import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as API from "../../networking/claims";

import {
    CREATE_CLAIM_PENDING,
    CREATE_CLAIM_SUCCESS,
    CREATE_CLAIM_FAILURE,
} from "../actions/types";

export const createClaim =
    (
        policyId: number,
        values: API.ClaimCreationPayload
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch({ type: CREATE_CLAIM_PENDING });
        try {
            const response = await API.createClaim(policyId, values);
            dispatch({
                type: CREATE_CLAIM_SUCCESS,
                payload: response.data,
                policyId,
            });
        } catch (error) {
            dispatch({ type: CREATE_CLAIM_FAILURE, payload: error, policyId });
        }
    };
