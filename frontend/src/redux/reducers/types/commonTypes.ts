export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    picture: string;
    created_at: string;
    updated_at: string;
    verified_email: boolean;

    linkedin_url?: string;
    twitter_url?: string;
}

export interface Premium {
    id: number;
    amount: number;
    payer: number;
    due_date: string;
    paid: boolean;
    paid_date: string;
    marked_paid_by: number; // user id
    created_at: string;
    updated_at: string;
}

export interface PolicyMemberApprovals {
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

export interface Evidence {
    id: number;
    claim: number;
    policy: number;
    owner: number;
    evidence_type: "photo" | "video" | "document";
    image: string; // aka url
    photo_order: number;
    created_at: string;
    updated_at: string;
}

export interface ClaimComment {
    id: number;
    claim: number;
    commenter: number;
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
    location_description: string;
    occurance_date: string;
    amount: number;
    paid_on: string;
    is_claim_invalid: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    approvals: PolicyMemberApprovals[];
    evidence: Evidence[];
    comments: ClaimComment[];
}

export interface PodMembership {
    id: number;
    pod: number;
    user: number;
    risk_penalty: number;
    is_user_friend_of_the_pod: boolean;
    joined_at: string; // aka created_at
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
    memberships: PodMembership[];
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
    escrow_manager: number;
    is_public: boolean;
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
    mutual?: boolean;
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

export interface Claim {
    policy: number;
    claimant: number;
    title: string;
    description: string;
    amount: number;
    paid_on: string;
    is_claim_invalid: boolean;
    created_at: string;
    updated_at: string;
}

export interface ClaimEvidence {
    claim: number;
    evidence_type: "photo" | "video" | "document";
    url: string;
    created_at: string;
    updated_at: string;
}

export interface ClaimApproval {
    id: number;
    claim: number;
    approved: boolean;
    approved_on: string;
    viewed_on: string;
    comment: string;
    approver: number;
    created_at: string;
    updated_at: string;
}

export interface ClaimComment {
    claim: number;
    comment: string;
    commenter: number;
    created_at: string;
    updated_at: string;
}

export interface Renewal {
    id: number;
    policy: number;
    election: number;
    months_extension: number;
    initiator: number;
    created_at: string;
    updated_at: string;
}

export interface InviteData {
    email: string; // email of the person who was invited
    pod: Partial<Pod>; // pod that the person was invited to
    invitor: {
        first_name: string;
        last_name: string;
        email: string;
        picture: string;
    };
    created_at: string;

    is_accepted: boolean;
    is_revoked_by_user: boolean;
    is_revoked_by_pod: boolean;
    is_revoked_by_admin: boolean;
}
