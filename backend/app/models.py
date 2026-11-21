import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON, Index
)
from sqlalchemy.orm import relationship
from app.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    industry = Column(String(100), default="Manufacturing")
    reporting_year = Column(Integer, default=2026)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship("User", back_populates="organization")
    audits = relationship("CarbonAudit", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="sustainability_manager") # admin, sustainability_manager, auditor
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    reviews = relationship("AuditReview", back_populates="user")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    supplier_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    size = Column(String(50), nullable=False)  # Small, Medium, Large
    industry = Column(String(100), nullable=False, index=True)
    location = Column(String(150), default="Global")
    country = Column(String(100), default="USA")
    tier = Column(Integer, default=1)  # Tier 1, 2, 3
    contact_email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    records = relationship("OperationalRecord", back_populates="supplier", cascade="all, delete-orphan")
    findings = relationship("AuditFinding", back_populates="supplier")
    fairness_scores = relationship("FairnessAssessment", back_populates="supplier")


class OperationalRecord(Base):
    __tablename__ = "operational_records"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False, index=True)
    reporting_period = Column(String(50), nullable=False)  # e.g., 2025-Q4, 2025-Annual
    
    # Activity data
    production_volume = Column(Float, nullable=False)        # Units produced
    electricity_consumption = Column(Float, default=0.0)    # kWh
    fuel_consumption = Column(Float, default=0.0)           # Liters or Gallons
    transportation_distance = Column(Float, default=0.0)    # km
    transportation_mode = Column(String(50), default="Road")# Road, Rail, Sea, Air
    material_consumption = Column(Float, default=0.0)       # Metric Tons
    waste_generated = Column(Float, default=0.0)            # Metric Tons
    
    # Emissions (tCO2e)
    reported_carbon_emissions = Column(Float, nullable=True) # Reported by supplier
    calculated_scope1 = Column(Float, default=0.0)          # Fuel, direct combustion
    calculated_scope2 = Column(Float, default=0.0)          # Electricity
    calculated_scope3 = Column(Float, default=0.0)          # Transportation, materials, waste
    calculated_total_emissions = Column(Float, default=0.0) # Sum of S1 + S2 + S3
    emission_intensity = Column(Float, default=0.0)         # Total / Production Volume
    
    # Data Quality & Anomaly
    data_quality_score = Column(Float, default=100.0)       # 0 - 100
    has_anomaly = Column(Boolean, default=False)
    status = Column(String(50), default="Verified")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    supplier = relationship("Supplier", back_populates="records")
    findings = relationship("AuditFinding", back_populates="record")


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)     # Electricity, Fuel, Transport, Material, Waste
    subcategory = Column(String(100), nullable=True)  # Grid, Diesel, Heavy Truck, etc.
    name = Column(String(150), nullable=False)
    value = Column(Float, nullable=False)              # kgCO2e per unit
    unit = Column(String(50), nullable=False)          # kWh, liter, ton-km, metric_ton
    source = Column(String(150), default="EPA / GHG Protocol 2025")
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class CarbonAudit(Base):
    __tablename__ = "carbon_audits"

    id = Column(Integer, primary_key=True, index=True)
    audit_code = Column(String(100), unique=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    run_date = Column(DateTime, default=datetime.datetime.utcnow)
    total_records_audited = Column(Integer, default=0)
    flagged_records_count = Column(Integer, default=0)
    overall_data_quality = Column(Float, default=95.0)
    methodology_version = Column(String(50), default="GHG-Protocol-Scope1-3-v2.1")
    status = Column(String(50), default="Completed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="audits")
    findings = relationship("AuditFinding", back_populates="audit", cascade="all, delete-orphan")
    fairness_assessments = relationship("FairnessAssessment", back_populates="audit", cascade="all, delete-orphan")


class AuditFinding(Base):
    __tablename__ = "audit_findings"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("carbon_audits.id"), nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False, index=True)
    record_id = Column(Integer, ForeignKey("operational_records.id"), nullable=True, index=True)
    
    issue_type = Column(String(100), nullable=False) # Excessive Energy, Inconsistent Report, Intensity Outlier, etc.
    issue_title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    supporting_data = Column(JSON, nullable=True)
    estimated_impact_tco2e = Column(Float, default=0.0)
    severity = Column(String(50), default="Medium") # Critical, High, Medium, Low
    recommended_action = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.85) # 0.0 to 1.0
    
    # Audit Review status
    status = Column(String(50), default="Pending") # Pending, Approved, Rejected, Investigating
    reviewer_comment = Column(Text, nullable=True)
    reviewed_by = Column(String(100), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    audit = relationship("CarbonAudit", back_populates="findings")
    supplier = relationship("Supplier", back_populates="findings")
    record = relationship("OperationalRecord", back_populates="findings")
    evidence = relationship("AuditEvidence", back_populates="finding", cascade="all, delete-orphan")
    reviews = relationship("AuditReview", back_populates="finding", cascade="all, delete-orphan")


class FairnessAssessment(Base):
    __tablename__ = "fairness_assessments"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("carbon_audits.id"), nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False, index=True)
    
    size_category = Column(String(50), nullable=False) # Small, Medium, Large
    industry = Column(String(100), nullable=False)
    absolute_emissions = Column(Float, default=0.0)
    emission_intensity = Column(Float, default=0.0)
    
    absolute_rank = Column(Integer, default=0)
    normalized_rank = Column(Integer, default=0)
    rank_delta = Column(Integer, default=0) # absolute_rank - normalized_rank (positive = improved when normalized)
    
    carbon_performance_score = Column(Float, default=0.0) # 0 - 100
    supplier_fairness_score = Column(Float, default=0.0)  # 0 - 100
    
    peer_group_mean_intensity = Column(Float, default=0.0)
    peer_group_std_intensity = Column(Float, default=0.0)
    statistical_disparity_flag = Column(Boolean, default=False)
    bias_direction = Column(String(50), default="Neutral") # Unfairly Penalized, Overlooked Inefficiency, Neutral
    explanation = Column(Text, nullable=True)
    metrics_json = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    audit = relationship("CarbonAudit", back_populates="fairness_assessments")
    supplier = relationship("Supplier", back_populates="fairness_scores")


class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    
    # Original baseline vs target modifications
    baseline_record_id = Column(Integer, nullable=True)
    target_transport_mode = Column(String(50), nullable=True)
    target_transport_distance = Column(Float, nullable=True)
    target_electricity_consumption = Column(Float, nullable=True)
    target_fuel_consumption = Column(Float, nullable=True)
    target_production_volume = Column(Float, nullable=True)
    renewable_energy_ratio = Column(Float, default=0.0) # 0 - 100%
    
    baseline_emissions = Column(Float, default=0.0)
    simulated_emissions = Column(Float, default=0.0)
    absolute_reduction = Column(Float, default=0.0)
    percentage_reduction = Column(Float, default=0.0)
    estimated_cost_impact_usd = Column(Float, default=0.0)
    recommendation_summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditEvidence(Base):
    __tablename__ = "audit_evidence"

    id = Column(Integer, primary_key=True, index=True)
    finding_id = Column(Integer, ForeignKey("audit_findings.id"), nullable=False, index=True)
    evidence_type = Column(String(100), default="ActivityDataSnapshot")
    description = Column(Text, nullable=False)
    payload = Column(JSON, nullable=False)
    
    # ProofChain tamper-evident link
    sequence_index = Column(Integer, nullable=False)
    record_hash = Column(String(64), nullable=False, index=True)
    prev_hash = Column(String(64), nullable=False)
    merkle_root = Column(String(64), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    finding = relationship("AuditFinding", back_populates="evidence")


class AuditReview(Base):
    __tablename__ = "audit_reviews"

    id = Column(Integer, primary_key=True, index=True)
    finding_id = Column(Integer, ForeignKey("audit_findings.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(50), nullable=False) # approve, reject, flag, comment
    comment = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    finding = relationship("AuditFinding", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
