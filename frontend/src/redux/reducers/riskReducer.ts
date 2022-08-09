import { AnyAction } from "@reduxjs/toolkit";

import {
    GET_RISK_FOR_POLICY_PENDING,
    GET_RISK_FOR_POLICY_SUCCESS,
    GET_RISK_FOR_POLICY_FAILURE,
    CREATE_RISK_PENDING,
    CREATE_RISK_SUCCESS,
    CREATE_RISK_FAILURE,
    PATCH_RISK_PENDING,
    PATCH_RISK_SUCCESS,
    PATCH_RISK_FAILURE,
} from "../actions/types";
import { Risk } from "./commonTypes";

export interface RiskState {
    focusedRisk: Risk | null;
    getRisksPending: boolean;
    modifyRiskPending: boolean; // used on patch and get
    requestQuotePending: boolean;
    policyRisks: { [policyId: number]: Risk[] };
}

const initialState: RiskState = {
    policyRisks: {},
    focusedRisk: null,
    getRisksPending: false,
    modifyRiskPending: false,
    requestQuotePending: false,
};

export default (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case CREATE_RISK_PENDING:
            return {
                ...state,
                modifyRiskPending: true,
            };
        case CREATE_RISK_SUCCESS:
            return {
                ...state,
                modifyRiskPending: false,
                focusedRisk: payload,
            };
        case CREATE_RISK_FAILURE:
            return {
                ...state,
                modifyRiskPending: false,
                focusedRisk: null,
            };

        case PATCH_RISK_PENDING:
            return {
                ...state,
                modifyRiskPending: true,
            };
        case PATCH_RISK_SUCCESS:
            return {
                ...state,
                focusedRisk: payload,
                modifyRiskPending: false,
            };
        case PATCH_RISK_FAILURE:
            return {
                ...state,
                modifyRiskPending: false,
            };
        case GET_RISK_FOR_POLICY_PENDING:
            return {
                ...state,
                getRisksPending: true,
            };
        case GET_RISK_FOR_POLICY_SUCCESS:
            return {
                ...state,
                getRisksPending: false,
                policyRisks: {
                    ...state.policyRisks,
                    [payload.policyId]: payload.risks,
                },
            };
        case GET_RISK_FOR_POLICY_FAILURE:
            return {
                ...state,
                getRisksPending: false,
            };

        default:
            return state;
    }
};
