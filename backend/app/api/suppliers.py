from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Supplier, OperationalRecord, AuditFinding, FairnessAssessment
from app.schemas import SupplierResponse, SupplierCreate, OperationalRecordResponse

router = APIRouter(prefix="/suppliers", tags=["Supplier Intelligence"])

@router.get("", response_model=List[SupplierResponse])
def get_suppliers(
    size: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Supplier)
    if size and size != "All":
        query = query.filter(Supplier.size == size)
    if industry and industry != "All":
        query = query.filter(Supplier.industry == industry)
    if search:
        search_filter = f"%{search}%"
        query = query.filter((Supplier.name.ilike(search_filter)) | (Supplier.supplier_code.ilike(search_filter)))

    suppliers = query.order_by(Supplier.name.asc()).all()
    results = []
    for s in suppliers:
        resp = SupplierResponse.model_validate(s)
        resp.records_count = len(s.records)
        latest_rec = s.records[-1] if s.records else None
        resp.latest_emissions = latest_rec.calculated_total_emissions if latest_rec else 0.0
        resp.latest_intensity = latest_rec.emission_intensity if latest_rec else 0.0
        results.append(resp)
    return results

@router.get("/{supplier_id}")
def get_supplier_detail(supplier_id: int, db: Session = Depends(get_db)):
    sup = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Supplier not found")
        
    records = db.query(OperationalRecord).filter(OperationalRecord.supplier_id == supplier_id).order_by(OperationalRecord.id.desc()).all()
    findings = db.query(AuditFinding).filter(AuditFinding.supplier_id == supplier_id).all()
    fairness = db.query(FairnessAssessment).filter(FairnessAssessment.supplier_id == supplier_id).first()

    return {
        "supplier": SupplierResponse.model_validate(sup),
        "records": [OperationalRecordResponse.model_validate(r) for r in records],
        "findings_count": len(findings),
        "findings": [
            {
                "id": f.id,
                "title": f.issue_title,
                "type": f.issue_type,
                "severity": f.severity,
                "impact": f.estimated_impact_tco2e,
                "status": f.status
            }
            for f in findings
        ],
        "fairness": {
            "absolute_rank": fairness.absolute_rank if fairness else None,
            "normalized_rank": fairness.normalized_rank if fairness else None,
            "rank_delta": fairness.rank_delta if fairness else None,
            "fairness_score": fairness.supplier_fairness_score if fairness else None,
            "carbon_performance_score": fairness.carbon_performance_score if fairness else None,
            "bias_direction": fairness.bias_direction if fairness else "Neutral",
            "explanation": fairness.explanation if fairness else None
        } if fairness else None
    }

@router.post("", response_model=SupplierResponse)
def create_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db)):
    existing = db.query(Supplier).filter(Supplier.supplier_code == supplier_in.supplier_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Supplier code {supplier_in.supplier_code} already exists")
    sup = Supplier(**supplier_in.model_dump())
    db.add(sup)
    db.commit()
    db.refresh(sup)
    resp = SupplierResponse.model_validate(sup)
    resp.records_count = 0
    resp.latest_emissions = 0.0
    resp.latest_intensity = 0.0
    return resp
