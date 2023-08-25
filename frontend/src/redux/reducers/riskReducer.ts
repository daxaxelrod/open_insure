import { AnyAction } from "@reduxjs/toolkit";
import { merge } from "../../app/utils/iterUtils";

import {
    GET_RISK_FOR_POLICY_PENDING,
    GET_RISK_FOR_POLICY_SUCCESS,
    GET_RISK_FOR_POLICY_FAILURE,
    GET_RISKS_FOR_USER_PENDING,
    GET_RISKS_FOR_USER_SUCCESS,
    GET_RISKS_FOR_USER_FAILURE,
    GET_POLICY_RISK_SETTINGS_PENDING,
    GET_POLICY_RISK_SETTINGS_SUCCESS,
    GET_POLICY_RISK_SETTINGS_FAILURE,
    PATCH_POLICY_RISK_SETTINGS_PENDING,
    PATCH_POLICY_RISK_SETTINGS_SUCCESS,
    PATCH_POLICY_RISK_SETTINGS_FAILURE,
    CLEAR_FOCUSED_RISK,
    CREATE_RISK_PENDING,
    CREATE_RISK_SUCCESS,
    CREATE_RISK_FAILURE,
    PATCH_RISK_PENDING,
    PATCH_RISK_SUCCESS,
    PATCH_RISK_FAILURE,
    GET_QUOTE_PENDING,
    GET_QUOTE_SUCCESS,
    GET_QUOTE_FAILURE,
    UPDATE_RISK_ALBUM,
} from "../actions/types";
import { Risk, RiskSettings } from "./types/commonTypes";

export interface RiskState {
    focusedRisk: Risk | null;
    getRisksPending: boolean;
    modifyRiskPending: boolean; // used on patch and get
    getQuotePending: boolean;
    policyRisks: { [policyId: number]: Risk[] };
    policyRiskSettings: { [policyId: number]: RiskSettings };
    getPolicyRiskSettingsPending: boolean;
    patchPolicyRiskSettingsPending: boolean;
}

const initialState: RiskState = {
    policyRisks: {},
    focusedRisk: null,
    getRisksPending: false,
    modifyRiskPending: false,
    getQuotePending: false,
    policyRiskSettings: {},
    getPolicyRiskSettingsPending: false,
    patchPolicyRiskSettingsPending: false,
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
        case UPDATE_RISK_ALBUM:
            // this isnt great
            let focusedRisk = state.focusedRisk;
            let contentObject = focusedRisk?.content_object;
            if (contentObject) {
                contentObject = {
                    ...contentObject,
                    album: payload,
                };
            }

            return {
                ...state,
                focusedRisk: {
                    ...focusedRisk,
                    content_object: {
                        ...contentObject,
                    },
                },
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

        case GET_RISKS_FOR_USER_PENDING:
            return {
                ...state,
                getRisksPending: true,
            };
        case GET_RISKS_FOR_USER_SUCCESS:
            // mergegetRisksForUsergetRisksForUser the two similarly shaped objs based on risk id
            let mergedPolicyRisks: any = { ...state.policyRisks };

            Object.keys(payload).forEach((policyId: string) => {
                let userPolicyRisks = payload[policyId];
                if (
                    mergedPolicyRisks?.[policyId] &&
                    Array.isArray(mergedPolicyRisks?.[policyId])
                ) {
                    mergedPolicyRisks[policyId] = merge(
                        mergedPolicyRisks[policyId],
                        userPolicyRisks,
                        "id"
                    );
                } else {
                    mergedPolicyRisks[policyId] = userPolicyRisks;
                }
            });
            return {
                ...state,
                getRisksPending: false,
                policyRisks: mergedPolicyRisks,
            };
        case GET_RISKS_FOR_USER_FAILURE:
            return {
                ...state,
                getRisksPending: false,
            };

        case GET_QUOTE_PENDING:
            return {
                ...state,
                getQuotePending: true,
            };
        case GET_QUOTE_SUCCESS:
            return {
                ...state,
                getQuotePending: false,
                focusedRisk: payload,
            };
        case GET_QUOTE_FAILURE:
            return {
                ...state,
                getQuotePending: false,
            };
        case CLEAR_FOCUSED_RISK:
            return {
                ...state,
                focusedRisk: null,
            };
        case GET_POLICY_RISK_SETTINGS_PENDING:
            return {
                ...state,
                getPolicyRiskSettingsPending: true,
            };
        case GET_POLICY_RISK_SETTINGS_SUCCESS:
        case GET_POLICY_RISK_SETTINGS_FAILURE:
            return {
                ...state,
                policyRiskSettings: {
                    ...state.policyRiskSettings,
                    [payload.policy]: payload,
                },
                getPolicyRiskSettingsPending: false,
            };
        case PATCH_POLICY_RISK_SETTINGS_PENDING:
            return {
                ...state,
                patchPolicyRiskSettingsPending: true,
            };

        case PATCH_POLICY_RISK_SETTINGS_SUCCESS:
            return {
                ...state,
                policyRiskSettings: {
                    ...state.policyRiskSettings,
                    [payload.policy]: payload,
                },
                patchPolicyRiskSettingsPending: false,
            };
        case PATCH_POLICY_RISK_SETTINGS_FAILURE:
            return {
                ...state,
                patchPolicyRiskSettingsPending: false,
            };

        default:
            return state;
    }
};
