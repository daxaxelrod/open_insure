export interface PolicyLine {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    search_tags?: string; // space separated
    created_at: string;
    updated_at: string;
    orignal_creator?: number;
}

export interface LossDataPoint {
    loss_date: string;
    loss_months_into_ownership?: number;
    loss_percent?: number;
    loss_amount: number;
    loss_reason: "damaged" | "lost" | "stolen";
}

export interface PropertyLifeDatePoint {
    guesser?: number;
    is_guessor_audited_authority: boolean; // see backend, mostly false
    property_name: string;
    property_make?: string;
    property_type: PolicyLine;
    purchase_price: number;
    purchase_date: string;
    age_of_ownership?: number;
    yearly_loss_rate_bsp?: number;
    createdAt: string;
    updatedAt: string;
    losses: LossDataPoint[];
}

export interface SummaryStats {
    count: number;
    sum: number;
    mean: number;
    median: number;
    standard_deviation: number;
    variance: number;
    minimum_value: number;
    maximum_value: number;
    "25th_percentile": number;
    "75th_percentile": number;
    z_scores: number[];
    confidence_interval: [number, number];
    required_count_for_desired_confidence: number;
    desired_confidence: number;
}

export interface Manufacturers {
    bins: string[];
    counts: number[];
    raw: string[];
}

export interface LossCostByAge {
    loss_count: number;
    average_age_of_loss: number;
    total_value_lost: number;
}

export interface ActuaryDetails {
    count: number;

    total_asset_value: number;
    asset_value_summary: SummaryStats;
    loss_rate_summary: SummaryStats;
    age_summary: SummaryStats;
    manufacturers: Manufacturers;
    loss_cost_by_loss_count_by_avg_age: LossCostByAge[];
}

export interface PolicyLineStats extends PolicyLine {
    actuary_details: ActuaryDetails;
}
