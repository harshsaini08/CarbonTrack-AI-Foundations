"""
AI Carbon Auditor Service
Implements rule-based, explainable, and statistical anomaly detection on supplier operational data.
Identifies energy inefficiencies, reporting inconsistencies, and carbon intensity outliers.
"""

from typing import List, Dict, Any
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from app.models import Supplier, OperationalRecord, AuditFinding, CarbonAudit

def run_carbon_audit(db: Session, audit_id: int) -> Dict[str, Any]:
    """
    Executes a comprehensive carbon audit across all active supplier operational records.
    Stores structured audit findings with exact mathematical evidence and recommendations.
    """
    records = db.query(OperationalRecord).join(Supplier).all()
    if not records:
        return {"status": "No records found to audit", "findings_count": 0}

    # Build DataFrame for statistical peer-group benchmarking
    data = []
    for r in records:
        data.append({
            "record_id": r.id,
            "supplier_id": r.supplier.id,
            "supplier_code": r.supplier.supplier_code,
            "supplier_name": r.supplier.name,
            "size": r.supplier.size,
            "industry": r.supplier.industry,
            "production_volume": r.production_volume,
            "electricity": r.electricity_consumption,
            "fuel": r.fuel_consumption,
            "distance": r.transportation_distance,
            "mode": r.transportation_mode,
            "material": r.material_consumption,
            "waste": r.waste_generated,
            "reported_emissions": r.reported_carbon_emissions,
            "calc_total": r.calculated_total_emissions,
            "calc_scope1": r.calculated_scope1,
            "calc_scope2": r.calculated_scope2,
            "calc_scope3": r.calculated_scope3,
            "intensity": r.emission_intensity,
            "quality_score": r.data_quality_score
        })
    df = pd.DataFrame(data)

    # Compute statistical benchmarks by industry and size
    industry_benchmarks = {}
    for ind, group in df.groupby("industry"):
        industry_benchmarks[ind] = {
            "mean_intensity": float(group["intensity"].mean()),
            "std_intensity": float(group["intensity"].std(ddof=0)) if len(group) > 1 else 0.001,
            "median_intensity": float(group["intensity"].median()),
            "mean_elec_per_unit": float((group["electricity"] / group["production_volume"].clip(lower=1)).mean()),
            "mean_fuel_per_unit": float((group["fuel"] / group["production_volume"].clip(lower=1)).mean()),
            "count": len(group)
        }

    # Remove existing pending findings for this audit to allow re-runs
    db.query(AuditFinding).filter(AuditFinding.audit_id == audit_id).delete()
    db.commit()

    findings_to_create = []

    for _, row in df.iterrows():
        rec_id = int(row["record_id"])
        sup_id = int(row["supplier_id"])
        sup_name = str(row["supplier_name"])
        industry = str(row["industry"])
        size = str(row["size"])
        prod_vol = float(row["production_volume"])
        bench = industry_benchmarks.get(industry, {})
        
        # 1. Inconsistent Reported Emissions vs Activity Data
        if row["reported_emissions"] is not None and row["reported_emissions"] > 0:
            reported = float(row["reported_emissions"])
            calculated = float(row["calc_total"])
            delta = calculated - reported
            rel_diff = abs(delta) / reported
            
            if rel_diff >= 0.40 and abs(delta) >= 15.0: # Significant under/over-reporting
                severity = "Critical" if (rel_diff > 1.0 or delta > 150) else "High"
                findings_to_create.append(AuditFinding(
                    audit_id=audit_id,
                    supplier_id=sup_id,
                    record_id=rec_id,
                    issue_type="Inconsistent Reported Emissions",
                    issue_title=f"Reported emissions deviate {rel_diff*100:.1f}% from calculated activity",
                    description=(
                        f"Supplier reported {reported:.1f} tCO2e, whereas physical activity data "
                        f"(Electricity: {row['electricity']:.0f} kWh, Fuel: {row['fuel']:.0f} L, "
                        f"Transport: {row['distance']:.0f} km {row['mode']}) yields {calculated:.1f} tCO2e. "
                        f"Unaccounted carbon variance: {delta:+.1f} tCO2e."
                    ),
                    supporting_data={
                        "reported_tco2e": reported,
                        "calculated_tco2e": calculated,
                        "variance_tco2e": round(delta, 2),
                        "variance_pct": round(rel_diff * 100, 1),
                        "detection_method": "GHG Activity Reconstruction Match"
                    },
                    estimated_impact_tco2e=round(abs(delta), 2),
                    severity=severity,
                    recommended_action="Require immediate reconciliation of fuel receipts and utility meter logs. Conduct formal third-party Scope 1/2 verification.",
                    confidence_score=0.96,
                    status="Pending"
                ))

        # 2. High Carbon Intensity Outlier (Z-score analysis)
        mean_int = bench.get("mean_intensity", 0.01)
        std_int = bench.get("std_intensity", 0.005)
        if std_int > 0:
            z_score = (row["intensity"] - mean_int) / std_int
            if z_score >= 1.95: # Above 97.5th percentile
                excess_emissions = max(0.0, (row["intensity"] - mean_int) * prod_vol)
                findings_to_create.append(AuditFinding(
                    audit_id=audit_id,
                    supplier_id=sup_id,
                    record_id=rec_id,
                    issue_type="Carbon Intensity Outlier",
                    issue_title=f"Production carbon intensity {z_score:.1f}σ above industry peer group",
                    description=(
                        f"Emission intensity is {row['intensity']:.4f} tCO2e/unit compared to "
                        f"industry benchmark median of {bench.get('median_intensity', 0):.4f} tCO2e/unit "
                        f"(Z-score: {z_score:.2f}). Indicates significant manufacturing or thermal inefficiencies."
                    ),
                    supporting_data={
                        "supplier_intensity": round(row["intensity"], 5),
                        "peer_mean_intensity": round(mean_int, 5),
                        "peer_std_intensity": round(std_int, 5),
                        "z_score": round(z_score, 2),
                        "peer_count": bench.get("count", 0)
                    },
                    estimated_impact_tco2e=round(excess_emissions, 2),
                    severity="High" if z_score > 2.5 else "Medium",
                    recommended_action="Initiate energy audit targeting baseline process heat loss, motor drive efficiency, and outdated boiler units.",
                    confidence_score=0.91,
                    status="Pending"
                ))

        # 3. Excessive Fuel Consumption (Scope 1 hotspot)
        elec_per_unit = row["electricity"] / max(1.0, prod_vol)
        fuel_per_unit = row["fuel"] / max(1.0, prod_vol)
        bench_fuel = bench.get("mean_fuel_per_unit", 0.1)
        if fuel_per_unit > (bench_fuel * 2.2) and row["fuel"] > 2000:
            excess_fuel_emissions = ((fuel_per_unit - bench_fuel) * prod_vol * 2.68) / 1000.0
            findings_to_create.append(AuditFinding(
                audit_id=audit_id,
                supplier_id=sup_id,
                record_id=rec_id,
                issue_type="Excessive Fuel Consumption",
                issue_title="Abnormally high direct fuel consumption per unit of production",
                description=(
                    f"Direct fuel intensity ({fuel_per_unit:.3f} L/unit) exceeds peer average ({bench_fuel:.3f} L/unit) "
                    f"by {((fuel_per_unit/bench_fuel)-1)*100:.1f}%. Direct combustion represents { (row['calc_scope1']/max(0.1, row['calc_total']))*100:.1f}% "
                    f"of total site emissions."
                ),
                supporting_data={
                    "fuel_liters": row["fuel"],
                    "fuel_per_unit": round(fuel_per_unit, 4),
                    "peer_avg_fuel_per_unit": round(bench_fuel, 4),
                    "scope1_emissions_tco2e": round(row["calc_scope1"], 2)
                },
                estimated_impact_tco2e=round(excess_fuel_emissions, 2),
                severity="High",
                recommended_action="Evaluate transition from heavy fuel oil/diesel to electric induction or certified green hydrogen/biomethane.",
                confidence_score=0.88,
                status="Pending"
            ))

        # 4. Inefficient Freight Mode (Air transport or long distance road for heavy bulk)
        if str(row["mode"]).lower() == "air" and row["distance"] > 800:
            rail_or_sea_emissions = (max(1.0, row["material"]) * row["distance"] * 0.028) / 1000.0
            air_emissions = row["calc_scope3"]
            avoidable = max(0.0, air_emissions - rail_or_sea_emissions)
            findings_to_create.append(AuditFinding(
                audit_id=audit_id,
                supplier_id=sup_id,
                record_id=rec_id,
                issue_type="High Transportation Emissions",
                issue_title="Carbon-intensive air freight utilized for regular supply routes",
                description=(
                    f"Shipments over {row['distance']:.0f} km utilize air cargo (0.602 kgCO2e/ton-km), "
                    f"generating {row['calc_scope3']:.1f} tCO2e. Modal shift to rail or multimodal freight "
                    f"can lower transport carbon footprint by over 85%."
                ),
                supporting_data={
                    "distance_km": row["distance"],
                    "freight_mode": "Air",
                    "transport_tco2e": round(air_emissions, 2),
                    "potential_rail_tco2e": round(rail_or_sea_emissions, 2)
                },
                estimated_impact_tco2e=round(avoidable, 2),
                severity="Medium",
                recommended_action="Restructure logistics lead-times to transition standard shipments to rail or maritime freight lanes.",
                confidence_score=0.94,
                status="Pending"
            ))

        # 5. Data Completeness & Missing Activity Indicators
        if row["electricity"] == 0 or row["production_volume"] == 0:
            findings_to_create.append(AuditFinding(
                audit_id=audit_id,
                supplier_id=sup_id,
                record_id=rec_id,
                issue_type="Missing Environmental Information",
                issue_title="Key operational activity indicators missing from reporting period",
                description=(
                    f"Crucial operational records (Electricity: {row['electricity']}, Production Volume: {row['production_volume']}) "
                    f"contain zeroes or unpopulated fields, preventing accurate ESG Scope 2 auditing."
                ),
                supporting_data={
                    "missing_fields": [k for k in ["electricity", "production_volume"] if row[k] == 0],
                    "data_quality_score": row["quality_score"]
                },
                estimated_impact_tco2e=15.0,
                severity="Low",
                recommended_action="Deploy automated IoT energy sub-metering or request re-submission of primary utility bills.",
                confidence_score=0.99,
                status="Pending"
            ))

    # Commit all findings to database
    for f in findings_to_create:
        db.add(f)
    
    # Update Audit summary record
    audit = db.query(CarbonAudit).filter(CarbonAudit.id == audit_id).first()
    if audit:
        audit.total_records_audited = len(records)
        audit.flagged_records_count = len(findings_to_create)
        audit.overall_data_quality = float(df["quality_score"].mean()) if not df.empty else 95.0
        audit.status = "Completed"
    
    db.commit()

    return {
        "status": "Audit completed successfully",
        "records_audited": len(records),
        "findings_count": len(findings_to_create),
        "critical_count": sum(1 for f in findings_to_create if f.severity == "Critical"),
        "high_count": sum(1 for f in findings_to_create if f.severity == "High"),
        "medium_count": sum(1 for f in findings_to_create if f.severity == "Medium"),
        "low_count": sum(1 for f in findings_to_create if f.severity == "Low"),
    }
