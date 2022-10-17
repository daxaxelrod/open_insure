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

export interface Peril {
    id: number;
    name: string;
    description: string;
    icon_name: string;
}

export type CoverageTypes = "m_property" | "renters" | "travel" | "pet_care";
export type UnderlyingInsuredType = "cell_phone" | "audio_equipment"; // | "apartment" | "house" | "life" | "pet";
export type UnderlyingInsuredTypes = UnderlyingInsuredType[];

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
    premium_payment_frequency: number; // in # of months
    claim_approval_threshold_percentage: number;
    claim_payout_limit: number;
    lifetime_payout_limit: number;
    estimated_risk: number;
    created_at: string;
    updated_at: string;
    premiums: Premium[];
    claims: Claim[];
    perils: Peril[];
    pod: Pod; // always look up the pod in the pod reducer
    available_underlying_insured_types: UnderlyingInsuredTypes;
}

export interface Image {
    id: number;
    image: string;
    created_at: string;
    updated_at: string;
}
export interface GenericProperty {
    id: number;
    make: string;
    model: string;
    picture?: string;
    condition: string;
    market_value: number;
    album: Image[];
    has_screen_protector?: boolean;
    has_case?: boolean;
}

export interface Risk {
    id: number;
    policy: number;
    user: number;
    risk_score: number;
    value_at_risk: number;
    premium_amount: number;
    underlying_insured_type: UnderlyingInsuredType;
    content_type: "cell_phone" | "audio_equipment";
    content_object: GenericProperty;
    object_id: number;
    created_at: string;
    updated_at: string;
}

export interface RiskSettings extends Record<string, any> {
    policy: number;
    conservative_factor: number;
    cell_phone_peril_rate: number;
    cell_phone_case_discount: number;
    cell_phone_screen_protector_discount: number;
    audio_equipment_peril_rate: number;
    annual_discount_rate: number;
    last_updated_by: number; // user id
    last_updated_at: string;
}
