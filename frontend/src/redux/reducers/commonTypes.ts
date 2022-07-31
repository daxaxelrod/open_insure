export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    picture: string;
    created_at: string;
    updated_at: string;
    verified_email: boolean;
}

export interface Premium {
    id: number;
    amount: number;
    payer: number;
    due_date: string;
    paid: boolean;
    created_at: string;
    updated_at: string;
}

export interface PolicyMemeberApprovals {
    id: number;
    approver: number;
    claim: number;
    approved: boolean;
    approved_on: string;
    viewed_on: string;
    comment: string;
    created_at: string;
    updated_at: string;
}
export interface Claim {
    id: number;
    policy: number;
    claimant: number;
    title: string;
    description: string;
    amount: number;
    paid_on: string;
    is_claim_invalid: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    approvals: PolicyMemeberApprovals[];
}

export interface Pod {
    id: number;
    name: string;
    description: string;
    picture: string;
    created_at: string;
    updated_at: string;
    creator: number;
    members: User[];
    max_pod_size: number;
    allow_joiners_after_policy_start: boolean;
}

export type CoverageTypes = "m_property" | "renters" | "travel" | "pet_care";
export interface Policy {
    id: number;
    name: string;
    description?: string;
    coverage_type: CoverageTypes;
    premium_pool_type: "perpetual_pool";
    governance_type: "direct_democracy";
    coverage_start_date: string;
    coverage_duration: number;
    max_pool_size: number;
    pool_address: string;
    pool_balance: number;
    premium_amount: number;
    premium_payment_frequency: number; // in # of months
    claim_payout_limit: number;
    lifetime_payout_limit: number;
    estimated_risk: number;
    created_at: string;
    updated_at: string;
    premiums: Premium[];
    claims: Claim[];
    pod: Pod; // always look up the pod in the pod reducer
}