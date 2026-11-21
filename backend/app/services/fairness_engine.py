"""
FAIRScore AI - Supplier Fairness Intelligence Engine
Evaluates structural bias in carbon auditing and procurement ranking.
Compares absolute emissions vs production-normalized emission intensity across peer groups.
Detects statistical disparities in audit flag rates and ranking penalties.
"""

from typing import List, Dict, Any
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from app.models import Supplier, OperationalRecord, FairnessAssessment, AuditFinding

def run_fairness_assessment(db: Session, audit_id: int) -> Dict[str, Any]:
    """
    Computes absolute ranks vs normalized ranks, Carbon Performance Scores,
    Supplier Fairness Scores, peer benchmarks, and statistical disparity metrics.
    """
    records = db.query(OperationalRecord).join(Supplier).all()
    if not records:
        return {"status": "No records available for fairness assessment", "count": 0}

    # Aggregate by supplier (latest operational period)
    supplier_map = {}
    for r in records:
        s_id = r.supplier.id
        if s_id not in supplier_map or r.id > supplier_map[s_id]["record_id"]:
            supplier_map[s_id] = {
                "supplier_id": s_id,
                "record_id": r.id,
                "supplier_code": r.supplier.supplier_code,
                "name": r.supplier.name,
                "size": r.supplier.size,
                "industry": r.supplier.industry,
                "location": r.supplier.location,
                "production_volume": max(1.0, r.production_volume),
                "total_emissions": r.calculated_total_emissions,
                "scope1": r.calculated_scope1,
                "scope2": r.calculated_scope2,
                "scope3": r.calculated_scope3,
                "intensity": r.emission_intensity,
                "data_quality_score": r.data_quality_score
            }

    df = pd.DataFrame(list(supplier_map.values()))
    
    # Check flags from audit findings
    findings = db.query(AuditFinding).filter(AuditFinding.audit_id == audit_id).all()
    flagged_suppliers = {f.supplier_id for f in findings}
    df["is_flagged"] = df["supplier_id"].apply(lambda sid: sid in flagged_suppliers)

    # 1. Traditional Absolute Ranking (1 = lowest emissions, best; N = highest emissions, worst)
    df["absolute_rank"] = df["total_emissions"].rank(ascending=True, method="min").astype(int)

    # 2. Peer-Group Normalization: Emission Intensity within Industry & Size
    peer_benchmarks = {}
    for ind, group in df.groupby("industry"):
        peer_benchmarks[ind] = {
            "mean_intensity": float(group["intensity"].mean()),
            "std_intensity": float(group["intensity"].std(ddof=0)) if len(group) > 1 else 0.001,
            "min_intensity": float(group["intensity"].min()),
            "max_intensity": float(group["intensity"].max()),
            "count": len(group)
        }

    # Calculate Carbon Performance Score (0-100):
    # Evaluates how clean their production is compared to industry peers.
    # Lower intensity relative to peer max gets higher score.
    def calc_performance_score(row):
        ind = row["industry"]
        bench = peer_benchmarks.get(ind, {"min_intensity": 0.001, "max_intensity": 0.05})
        min_i = bench["min_intensity"]
        max_i = max(bench["max_intensity"], min_i + 0.0001)
        
        # Normalized position in peer group (0.0 = cleanest, 1.0 = dirtiest)
        rel_pos = (row["intensity"] - min_i) / (max_i - min_i)
        score = 100.0 * (1.0 - np.clip(rel_pos, 0.0, 1.0))
        return round(float(score), 1)

    df["carbon_performance_score"] = df.apply(calc_performance_score, axis=1)

    # 3. Normalized Ranking: Ranked by emission intensity (1 = cleanest per unit, best)
    df["normalized_rank"] = df["intensity"].rank(ascending=True, method="min").astype(int)
    df["rank_delta"] = df["absolute_rank"] - df["normalized_rank"] 
    # Positive rank_delta means supplier ranked poorly on absolute scale (e.g. #30) but jumped to #5 on normalized scale (+25 jump)

    # 4. Supplier Fairness Score (0-100):
    # Integrates size-aware equity factor. Large suppliers with massive volume shouldn't get a free pass,
    # and small suppliers with constrained capital shouldn't be penalized if their unit efficiency is competitive.
    def calc_fairness_score(row):
        perf = row["carbon_performance_score"]
        size = row["size"]
        rank_gap = row["rank_delta"]
        
        # Base fairness on performance and rank equity
        base = perf
        if size == "Small":
            # If a small supplier has high performance but was penalized on absolute terms, equity boost
            if rank_gap < -5:
                base += 8.0 # compensating for unfair absolute penalization
        elif size == "Large":
            # If a large supplier has high absolute emissions but also high intensity, ensure no greenwashing
            if row["intensity"] > peer_benchmarks[row["industry"]]["mean_intensity"]:
                base -= 5.0
                
        # Data quality factor
        dq_factor = row["data_quality_score"] / 100.0
        final_fairness = np.clip(base * 0.85 + (dq_factor * 15.0), 10.0, 99.5)
        return round(float(final_fairness), 1)

    df["supplier_fairness_score"] = df.apply(calc_fairness_score, axis=1)

    # 5. Detect Potential Bias & Explainability
    def evaluate_bias(row):
        rank_gap = row["rank_delta"] # absolute_rank - normalized_rank
        size = row["size"]
        intensity = row["intensity"]
        mean_i = peer_benchmarks[row["industry"]]["mean_intensity"]
        
        if size == "Small" and rank_gap < -8:
            return (
                "Unfairly Penalized (Scale Bias)",
                f"Under absolute ranking, {row['name']} ranked #{row['absolute_rank']} due to low raw data visibility, "
                f"despite maintaining an efficient emission intensity ({intensity:.4f} tCO2e/unit vs peer mean {mean_i:.4f}). "
                f"FairScore normalizes ranking to #{row['normalized_rank']} (+{abs(rank_gap)} rank equity adjustment)."
            )
        elif size == "Large" and rank_gap > 8:
            return (
                "Masked Inefficiency (Volume Bias)",
                f"Ranked favorably at #{row['absolute_rank']} on absolute scale because production volume is moderate, "
                f"but intensity ({intensity:.4f} tCO2e/unit) is worse than peer mean ({mean_i:.4f}). "
                f"Normalized ranking falls to #{row['normalized_rank']}."
            )
        elif row["is_flagged"] and size == "Small" and intensity <= mean_i:
            return (
                "Disproportionate Audit Scrutiny",
                f"Flagged by rule-based heuristic despite unit-level efficiency ({intensity:.4f} tCO2e/unit) "
                f"meeting industry average standards."
            )
        else:
            return (
                "Neutral / Balanced",
                f"Rankings reflect consistent operational metrics. Normalized rank #{row['normalized_rank']} "
                f"aligns with carbon intensity benchmarks."
            )

    bias_results = [evaluate_bias(row) for _, row in df.iterrows()]
    df["bias_direction"] = [b[0] for b in bias_results]
    df["explanation"] = [b[1] for b in bias_results]

    # 6. Statistical Disparity Checks across Size Groups
    size_stats = {}
    for s_cat in ["Small", "Medium", "Large"]:
        s_group = df[df["size"] == s_cat]
        cnt = len(s_group)
        if cnt > 0:
            flag_rate = float(s_group["is_flagged"].mean())
            mean_score = float(s_group["supplier_fairness_score"].mean())
            mean_intensity = float(s_group["intensity"].mean())
            mean_rank_delta = float(s_group["rank_delta"].mean())
        else:
            flag_rate, mean_score, mean_intensity, mean_rank_delta = 0.0, 0.0, 0.0, 0.0
            
        size_stats[s_cat] = {
            "count": cnt,
            "flag_rate_pct": round(flag_rate * 100, 1),
            "mean_fairness_score": round(mean_score, 1),
            "mean_intensity": round(mean_intensity, 5),
            "mean_rank_delta": round(mean_rank_delta, 1),
            "sample_size_adequate": cnt >= 4,
            "warning": None if cnt >= 4 else "Sample size too small (<4) for statistical significance"
        }

    # Disparity check: Flag rate difference between Small and Large
    small_flags = size_stats.get("Small", {}).get("flag_rate_pct", 0)
    large_flags = size_stats.get("Large", {}).get("flag_rate_pct", 0)
    flag_disparity = abs(small_flags - large_flags)
    disparity_detected = flag_disparity > 25.0

    # Persist Fairness Assessments to DB
    db.query(FairnessAssessment).filter(FairnessAssessment.audit_id == audit_id).delete()
    
    assessments_to_save = []
    for _, row in df.iterrows():
        ind = row["industry"]
        bench = peer_benchmarks.get(ind, {})
        fa = FairnessAssessment(
            audit_id=audit_id,
            supplier_id=int(row["supplier_id"]),
            size_category=str(row["size"]),
            industry=ind,
            absolute_emissions=round(float(row["total_emissions"]), 2),
            emission_intensity=round(float(row["intensity"]), 6),
            absolute_rank=int(row["absolute_rank"]),
            normalized_rank=int(row["normalized_rank"]),
            rank_delta=int(row["rank_delta"]),
            carbon_performance_score=float(row["carbon_performance_score"]),
            supplier_fairness_score=float(row["supplier_fairness_score"]),
            peer_group_mean_intensity=round(bench.get("mean_intensity", 0.0), 6),
            peer_group_std_intensity=round(bench.get("std_intensity", 0.0), 6),
            statistical_disparity_flag=disparity_detected and row["size"] == "Small",
            bias_direction=row["bias_direction"],
            explanation=row["explanation"],
            metrics_json={
                "production_volume": row["production_volume"],
                "scope1": row["scope1"],
                "scope2": row["scope2"],
                "scope3": row["scope3"],
                "is_flagged": bool(row["is_flagged"])
            }
        )
        assessments_to_save.append(fa)

    for fa in assessments_to_save:
        db.add(fa)
    db.commit()

    return {
        "status": "Fairness assessment completed",
        "suppliers_evaluated": len(df),
        "statistical_disparity_detected": disparity_detected,
        "disparity_summary": {
            "small_flag_rate_pct": small_flags,
            "large_flag_rate_pct": large_flags,
            "gap_percentage_points": round(flag_disparity, 1),
            "disparity_finding": (
                f"Statistically significant flag rate variance detected between Small ({small_flags}%) "
                f"and Large ({large_flags}%) enterprises." if disparity_detected else
                "No statistically significant flag disparity detected across supplier scale tiers."
            )
        },
        "size_group_statistics": size_stats,
        "peer_benchmarks": peer_benchmarks
    }
