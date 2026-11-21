export type Role = 'admin' | 'sustainability_manager' | 'auditor';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  organization_id?: number;
}

export interface Supplier {
  id: number;
  supplier_code: string;
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  industry: string;
  location: string;
  country: string;
  tier: number;
  contact_email?: string;
  records_count?: number;
  latest_emissions?: number;
  latest_intensity?: number;
}

export interface OperationalRecord {
  id: number;
  supplier_id: number;
  reporting_period: string;
  production_volume: number;
  electricity_consumption: number;
  fuel_consumption: number;
  transportation_distance: number;
  transportation_mode: string;
  material_consumption: number;
  waste_generated: number;
  reported_carbon_emissions?: number;
  calculated_scope1: number;
  calculated_scope2: number;
  calculated_scope3: number;
  calculated_total_emissions: number;
  emission_intensity: number;
  data_quality_score: number;
  has_anomaly: boolean;
  status: string;
}

export interface AuditFinding {
  id: number;
  audit_id: number;
  supplier_id: number;
  supplier_name?: string;
  supplier_size?: string;
  supplier_industry?: string;
  record_id?: number;
  issue_type: string;
  issue_title: string;
  description: string;
  supporting_data?: Record<string, any>;
  estimated_impact_tco2e: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  recommended_action: string;
  confidence_score: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Investigating';
  reviewer_comment?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at?: string;
}

export interface FairnessAssessment {
  id: number;
  supplier_id: number;
  supplier_code?: string;
  supplier_name?: string;
  size_category: 'Small' | 'Medium' | 'Large';
  industry: string;
  absolute_emissions: number;
  emission_intensity: number;
  absolute_rank: number;
  normalized_rank: number;
  rank_delta: number;
  carbon_performance_score: number;
  supplier_fairness_score: number;
  peer_group_mean_intensity: number;
  peer_group_std_intensity: number;
  statistical_disparity_flag: boolean;
  bias_direction: string;
  explanation?: string;
  metrics_json?: Record<string, any>;
}

export interface DashboardMetrics {
  total_emissions_tco2e: number;
  scope1_emissions: number;
  scope2_emissions: number;
  scope3_emissions: number;
  total_suppliers_audited: number;
  high_risk_suppliers_count: number;
  overall_fairness_index: number;
  potential_carbon_savings_tco2e: number;
  monthly_trends: Array<{
    month: string;
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  }>;
  emissions_by_scope: {
    'Scope 1': number;
    'Scope 2': number;
    'Scope 3': number;
  };
  emissions_by_category: Array<{
    category: string;
    emissions: number;
  }>;
  top_contributors: Array<{
    supplier_id: number;
    supplier_code: string;
    supplier_name: string;
    size: string;
    industry: string;
    emissions_tco2e: number;
    emission_intensity: number;
    share_pct: number;
  }>;
  fairness_distribution: Array<{
    size: string;
    avg_fairness_score: number;
    count: number;
  }>;
  intensity_distribution: Array<{
    supplier_name: string;
    supplier_code: string;
    production_volume: number;
    emission_intensity: number;
    total_emissions: number;
    size: string;
    industry: string;
  }>;
  data_quality_score: number;
}

export interface SimulationParams {
  supplier_id?: number;
  target_transport_mode?: string;
  transport_distance_change_pct?: number;
  renewable_energy_ratio?: number;
  energy_efficiency_pct?: number;
  fuel_reduction_pct?: number;
  production_volume_change_pct?: number;
}

export interface SimulationResult {
  baseline_emissions: number;
  simulated_emissions: number;
  absolute_reduction: number;
  percentage_reduction: number;
  scope1_reduction: number;
  scope2_reduction: number;
  scope3_reduction: number;
  estimated_cost_impact_usd: number;
  recommendations: string[];
  breakdown_by_scope: {
    baseline: { scope1: number; scope2: number; scope3: number; total: number };
    simulated: { scope1: number; scope2: number; scope3: number; total: number };
  };
}

export interface SavedScenario {
  id: number;
  name: string;
  description?: string;
  supplier_name: string;
  baseline_emissions: number;
  simulated_emissions: number;
  absolute_reduction: number;
  percentage_reduction: number;
  estimated_cost_impact_usd: number;
  created_at: string;
}

export interface ProofChainBlock {
  id: number;
  sequence_index: number;
  finding_id: number;
  supplier_name?: string;
  issue_title?: string;
  evidence_type: string;
  description: string;
  payload: Record<string, any>;
  record_hash: string;
  prev_hash: string;
  timestamp: string;
  is_valid: boolean;
}

export interface ProofChainVerification {
  is_valid: boolean;
  total_blocks: number;
  genesis_hash: string;
  latest_hash: string;
  verification_timestamp: string;
  integrity_details: string;
}

export interface EmissionFactorItem {
  id: number;
  category: string;
  subcategory?: string;
  name: string;
  value: number;
  unit: string;
  source: string;
  description?: string;
}
