export const LOGIN = "auth/LOGIN";

export const LOGOUT = "auth/LOGOUT";

export const REGISTER_PENDING = "auth/REGISTER_PENDING";
export const REGISTER_SUCCESS = "auth/REGISTER_SUCCESS";
export const REGISTER_FAILURE = "auth/REGISTER_FAILURE";

export const LOGIN_PENDING = "auth/LOGIN_PENDING";
export const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "auth/LOGIN_FAILURE";

export const PATCH_USER = "auth/PATCH_USER";

// policies
export const GET_AVAILABLE_POLICIES_PENDING =
    "policies/GET_AVAILABLE_POLICIES_PENDING";
export const GET_AVAILABLE_POLICIES_SUCCESS =
    "policies/GET_AVAILABLE_POLICIES_SUCCESS";
export const GET_AVAILABLE_POLICIES_FAILURE =
    "policies/GET_AVAILABLE_POLICIES_FAILURE";
export const JOIN_POLICY_PENDING = "policies/JOIN_POLICY_PENDING";
export const JOIN_POLICY_SUCCESS = "policies/JOIN_POLICY_SUCCESS";
export const JOIN_POLICY_FAILURE = "policies/JOIN_POLICY_FAILURE";

export const CREATE_POLICY_PENDING = "policies/CREATE_POLICY_PENDING";
export const CREATE_POLICY_SUCCESS = "policies/CREATE_POLICY_SUCCESS";
export const CREATE_POLICY_FAILURE = "policies/CREATE_POLICY_FAILURE";

export const PATCH_POLICY_PENDING = "policies/PATCH_POLICY_PENDING";
export const PATCH_POLICY_SUCCESS = "policies/PATCH_POLICY_SUCCESS";
export const PATCH_POLICY_FAILURE = "policies/PATCH_POLICY_FAILURE";

// Policies the user is a member of
export const GET_USER_POLICIES_PENDING = "policies/GET_USER_POLICIES_PENDING";
export const GET_USER_POLICIES_SUCCESS = "policies/GET_USER_POLICIES_SUCCESS";
export const GET_USER_POLICIES_FAILURE = "policies/GET_USER_POLICIES_FAILURE";

// Risk settings
export const GET_POLICY_RISK_SETTINGS_PENDING =
    "policies/GET_POLICY_RISK_SETTINGS_PENDING";
export const GET_POLICY_RISK_SETTINGS_SUCCESS =
    "policies/GET_POLICY_RISK_SETTINGS_SUCCESS";
export const GET_POLICY_RISK_SETTINGS_FAILURE =
    "policies/GET_POLICY_RISK_SETTINGS_FAILURE";

export const PATCH_POLICY_RISK_SETTINGS_PENDING =
    "policies/PATCH_POLICY_RISK_SETTINGS_PENDING";
export const PATCH_POLICY_RISK_SETTINGS_SUCCESS =
    "policies/PATCH_POLICY_RISK_SETTINGS_SUCCESS";
export const PATCH_POLICY_RISK_SETTINGS_FAILURE =
    "policies/PATCH_POLICY_RISK_SETTINGS_FAILURE";

// pods
export const GET_SINGLE_POD_PENDING = "pods/GET_SINGLE_POD_PENDING";
export const GET_SINGLE_POD_SUCCESS = "pods/GET_SINGLE_POD_SUCCESS";
export const GET_SINGLE_POD_FAILURE = "pods/GET_SINGLE_POD_FAILURE";

export const CREATE_POD_PENDING = "pods/CREATE_POD_PENDING";
export const CREATE_POD_SUCCESS = "pods/CREATE_POD_SUCCESS";
export const CREATE_POD_FAILURE = "pods/CREATE_POD_FAILURE";

// risk
export const GET_RISK_FOR_POLICY_PENDING = "risk/GET_RISK_FOR_POLICY_PENDING";
export const GET_RISK_FOR_POLICY_SUCCESS = "risk/GET_RISK_FOR_POLICY_SUCCESS";
export const GET_RISK_FOR_POLICY_FAILURE = "risk/GET_RISK_FOR_POLICY_FAILURE";

export const CREATE_RISK_PENDING = "risk/CREATE_RISK_PENDING";
export const CREATE_RISK_SUCCESS = "risk/CREATE_RISK_SUCCESS";
export const CREATE_RISK_FAILURE = "risk/CREATE_RISK_FAILURE";

export const PATCH_RISK_PENDING = "risk/PATCH_RISK_PENDING";
export const PATCH_RISK_SUCCESS = "risk/PATCH_RISK_SUCCESS";
export const PATCH_RISK_FAILURE = "risk/PATCH_RISK_FAILURE";

export const GET_QUOTE_PENDING = "risk/GET_QUOTE_PENDING";
export const GET_QUOTE_SUCCESS = "risk/GET_QUOTE_SUCCESS";
export const GET_QUOTE_FAILURE = "risk/GET_QUOTE_FAILURE";

export const UPDATE_RISK_ALBUM = "risk/UPDATE_RISK_ALBUM";

export const GET_RISKS_FOR_USER_PENDING = "risk/GET_RISKS_FOR_USER_PENDING";
export const GET_RISKS_FOR_USER_SUCCESS = "risk/GET_RISKS_FOR_USER_SUCCESS";
export const GET_RISKS_FOR_USER_FAILURE = "risk/GET_RISKS_FOR_USER_FAILURE";

export const CLEAR_FOCUSED_RISK = "risk/CLEAR_FOCUSED_RISK";

// premiums
export const GET_POLICY_PREMIUMS_PENDING =
    "premiums/GET_POLICY_PREMIUMS_PENDING";
export const GET_POLICY_PREMIUMS_SUCCESS =
    "premiums/GET_POLICY_PREMIUMS_SUCCESS";
export const GET_POLICY_PREMIUMS_FAILURE =
    "premiums/GET_POLICY_PREMIUMS_FAILURE";

export const PATCH_PREMIUM_PENDING = "premiums/PATCH_PREMIUM_PENDING";
export const PATCH_PREMIUM_SUCCESS = "premiums/PATCH_PREMIUM_SUCCESS";
export const PATCH_PREMIUM_FAILURE = "premiums/PATCH_PREMIUM_FAILURE";

// claims
export const CREATE_CLAIM_PENDING = "claims/CREATE_CLAIM_PENDING";
export const CREATE_CLAIM_SUCCESS = "claims/CREATE_CLAIM_SUCCESS";
export const CREATE_CLAIM_FAILURE = "claims/CREATE_CLAIM_FAILURE";

export const GET_CLAIMS_FOR_POLICY_PENDING =
    "claims/GET_CLAIMS_FOR_POLICY_PENDING";
export const GET_CLAIMS_FOR_POLICY_SUCCESS =
    "claims/GET_CLAIMS_FOR_POLICY_SUCCESS";
export const GET_CLAIMS_FOR_POLICY_FAILURE =
    "claims/GET_CLAIMS_FOR_POLICY_FAILURE";
export const SET_CLAIMS_FOR_POLICY = "claims/SET_CLAIMS_FOR_POLICY"; // for use by a get policy list call

export const GET_CLAIM_COMMENTS_PENDING = "claims/GET_CLAIM_COMMENTS_PENDING";
export const GET_CLAIM_COMMENTS_SUCCESS = "claims/GET_CLAIM_COMMENTS_SUCCESS";
export const GET_CLAIM_COMMENTS_FAILURE = "claims/GET_CLAIM_COMMENTS_FAILURE";

export const CREATE_CLAIM_COMMENT_PENDING =
    "claims/CREATE_CLAIM_COMMENT_PENDING";
export const CREATE_CLAIM_COMMENT_SUCCESS =
    "claims/CREATE_CLAIM_COMMENT_SUCCESS";
export const CREATE_CLAIM_COMMENT_FAILURE =
    "claims/CREATE_CLAIM_COMMENT_FAILURE";

export const DELETE_CLAIM_COMMENT_PENDING =
    "claims/DELETE_CLAIM_COMMENT_PENDING";
export const DELETE_CLAIM_COMMENT_SUCCESS =
    "claims/DELETE_CLAIM_COMMENT_SUCCESS";
export const DELETE_CLAIM_COMMENT_FAILURE =
    "claims/DELETE_CLAIM_COMMENT_FAILURE";

export const PATCH_CLAIM_APPROVAL_PENDING =
    "claims/PATCH_CLAIM_APPROVAL_PENDING";
export const PATCH_CLAIM_APPROVAL_SUCCESS =
    "claims/PATCH_CLAIM_APPROVAL_SUCCESS";
export const PATCH_CLAIM_APPROVAL_FAILURE =
    "claims/PATCH_CLAIM_APPROVAL_FAILURE";

// UI
export const SET_POLICY_DETAIL_TAB_KEY = "ui/SET_POLICY_DETAIL_TAB_KEY";
