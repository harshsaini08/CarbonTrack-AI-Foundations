from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Supplier Schemas
class SupplierBase(BaseModel):
    supplier_code: str
    name: str
    size: str # Small, Medium, Large
    industry: str
    location: str
    country: str = "USA"
    tier: int = 1
    contact_email: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int
    created_at: Optional[datetime] = None
    records_count: Optional[int] = 0
    latest_emissions: Optional[float] = 0.0
    latest_intensity: Optional[float] = 0.0

    class Config:
        from_attributes = True

# Operational Record Schemas
class OperationalRecordBase(BaseModel):
    reporting_period: str
    production_volume: float
    electricity_consumption: float = 0.0
    fuel_consumption: float = 0.0
    transportation_distance: float = 0.0
    transportation_mode: str = "Road"
    material_consumption: float = 0.0
    waste_generated: float = 0.0
    reported_carbon_emissions: Optional[float] = None

class OperationalRecordCreate(OperationalRecordBase):
    supplier_id: int

class OperationalRecordResponse(OperationalRecordBase):
    id: int
    supplier_id: int
    calculated_scope1: float
    calculated_scope2: float
    calculated_scope3: float
    calculated_total_emissions: float
    emission_intensity: float
    data_quality_score: float
    has_anomaly: bool
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Emission Factor Schemas
class EmissionFactorBase(BaseModel):
    category: str
    subcategory: Optional[str] = None
    name: str
    value: float
    unit: str
    source: str = "EPA / GHG Protocol"
    description: Optional[str] = None

class EmissionFactorUpdate(BaseModel):
    value: float
    source: Optional[str] = None
    description: Optional[str] = None

class EmissionFactorResponse(EmissionFactorBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Audit Finding Schemas
class AuditFindingResponse(BaseModel):
    id: int
    audit_id: int
    supplier_id: int
    supplier_name: Optional[str] = None
    supplier_size: Optional[str] = None
    supplier_industry: Optional[str] = None
    record_id: Optional[int] = None
    issue_type: str
    issue_title: str
    description: str
    supporting_data: Optional[Dict[str, Any]] = None
    estimated_impact_tco2e: float
    severity: str
    recommended_action: str
    confidence_score: float
    status: str
    reviewer_comment: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AuditReviewRequest(BaseModel):
    action: str # approve, reject, flag, comment
    comment: str

# Fairness Assessment Schemas
class FairnessAssessmentResponse(BaseModel):
    id: int
    supplier_id: int
    supplier_code: Optional[str] = None
    supplier_name: Optional[str] = None
    size_category: str
    industry: str
    absolute_emissions: float
    emission_intensity: float
    absolute_rank: int
    normalized_rank: int
    rank_delta: int
    carbon_performance_score: float
    supplier_fairness_score: float
    peer_group_mean_intensity: float
    peer_group_std_intensity: float
    statistical_disparity_flag: bool
    bias_direction: str
    explanation: Optional[str] = None
    metrics_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

# Simulation Schemas
class SimulationRequest(BaseModel):
    supplier_id: Optional[int] = None
    target_transport_mode: Optional[str] = None
    transport_distance_change_pct: Optional[float] = 0.0 # e.g. -20%
    renewable_energy_ratio: Optional[float] = 0.0        # 0 to 100%
    energy_efficiency_pct: Optional[float] = 0.0         # 0 to 50%
    fuel_reduction_pct: Optional[float] = 0.0            # 0 to 50%
    production_volume_change_pct: Optional[float] = 0.0  # e.g. +10%

class SimulationResponse(BaseModel):
    baseline_emissions: float
    simulated_emissions: float
    absolute_reduction: float
    percentage_reduction: float
    scope1_reduction: float
    scope2_reduction: float
    scope3_reduction: float
    estimated_cost_impact_usd: float
    estimated_roi_months: Optional[float] = None
    recommendations: List[str]
    breakdown_by_scope: Dict[str, Any]

class SaveSimulationRequest(BaseModel):
    name: str
    description: Optional[str] = None
    supplier_id: Optional[int] = None
    simulation_params: Dict[str, Any]
    simulation_results: Dict[str, Any]

# Audit Evidence Schemas
class ProofChainBlockResponse(BaseModel):
    id: int
    sequence_index: int
    finding_id: int
    supplier_name: Optional[str] = None
    issue_title: Optional[str] = None
    evidence_type: str
    description: str
    payload: Dict[str, Any]
    record_hash: str
    prev_hash: str
    timestamp: datetime
    is_valid: bool = True

    class Config:
        from_attributes = True

class ProofChainVerificationResponse(BaseModel):
    is_valid: bool
    total_blocks: int
    genesis_hash: str
    latest_hash: str
    verification_timestamp: datetime
    integrity_details: str

# Copilot Schemas
class CopilotQuery(BaseModel):
    query: str
    conversation_history: Optional[List[Dict[str, str]]] = None

class CopilotResponse(BaseModel):
    answer: str
    evidence_citations: List[Dict[str, Any]]
    suggested_followups: List[str]
    charts_or_tables: Optional[Dict[str, Any]] = None

# Executive Dashboard Response
class DashboardMetricsResponse(BaseModel):
    total_emissions_tco2e: float
    scope1_emissions: float
    scope2_emissions: float
    scope3_emissions: float
    total_suppliers_audited: int
    high_risk_suppliers_count: int
    overall_fairness_index: float
    potential_carbon_savings_tco2e: float
    monthly_trends: List[Dict[str, Any]]
    emissions_by_scope: Dict[str, float]
    emissions_by_category: List[Dict[str, Any]]
    top_contributors: List[Dict[str, Any]]
    fairness_distribution: List[Dict[str, Any]]
    intensity_distribution: List[Dict[str, Any]]
    data_quality_score: float
