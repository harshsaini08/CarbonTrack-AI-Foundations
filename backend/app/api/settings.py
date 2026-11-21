from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import EmissionFactor, User, CarbonAudit, AuditEvidence
from app.schemas import EmissionFactorResponse, EmissionFactorUpdate, UserResponse
from app.services.carbon_calculator import DEFAULT_FACTORS

router = APIRouter(prefix="/settings", tags=["Settings & Configuration"])

@router.get("/emission-factors", response_model=List[EmissionFactorResponse])
def get_emission_factors(db: Session = Depends(get_db)):
    factors = db.query(EmissionFactor).all()
    if not factors:
        # Seed standard if empty
        for k, v in DEFAULT_FACTORS.items():
            ef = EmissionFactor(
                category=v["category"],
                subcategory=v.get("subcategory"),
                name=k.replace("_", " ").title(),
                value=v["value"],
                unit=v["unit"],
                source=v["source"]
            )
            db.add(ef)
        db.commit()
        factors = db.query(EmissionFactor).all()
    return factors

@router.put("/emission-factors/{factor_id}", response_model=EmissionFactorResponse)
def update_emission_factor(factor_id: int, req: EmissionFactorUpdate, db: Session = Depends(get_db)):
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=404, detail="Emission factor not found")
    factor.value = req.value
    if req.source:
        factor.source = req.source
    if req.description:
        factor.description = req.description
    db.commit()
    db.refresh(factor)
    return factor

@router.post("/emission-factors/reset")
def reset_emission_factors(db: Session = Depends(get_db)):
    db.query(EmissionFactor).delete()
    for k, v in DEFAULT_FACTORS.items():
        ef = EmissionFactor(
            category=v["category"],
            subcategory=v.get("subcategory"),
            name=k.replace("_", " ").title(),
            value=v["value"],
            unit=v["unit"],
            source=v["source"]
        )
        db.add(ef)
    db.commit()
    return {"status": "success", "message": "Emission factors reset to EPA / DEFRA standard defaults"}

@router.get("/system-info")
def get_system_info(db: Session = Depends(get_db)):
    audit = db.query(CarbonAudit).order_by(CarbonAudit.id.desc()).first()
    block_count = db.query(AuditEvidence).count()
    return {
        "platform_name": "CarbonTrack – Enterprise Footprint Auditor with Bias Mitigation",
        "version": "2.4.0-Enterprise",
        "audit_methodology": audit.methodology_version if audit else "GHG-Protocol-Scope1-3-v2.1",
        "database_engine": "SQLite / SQLAlchemy ORM (PostgreSQL Ready)",
        "proofchain_blocks": block_count,
        "tamper_evident_integrity": "Cryptographically Sealed (SHA-256)",
        "ai_engine": "Statistical Disparity Analytics + Explainable Heuristics Engine"
    }
