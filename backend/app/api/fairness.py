from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import FairnessAssessment, CarbonAudit, Supplier
from app.schemas import FairnessAssessmentResponse
from app.services.fairness_engine import run_fairness_assessment

router = APIRouter(prefix="/fairness", tags=["FAIRScore AI"])

@router.get("/assessments", response_model=List[FairnessAssessmentResponse])
def get_fairness_assessments(
    size: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("normalized_rank"), # normalized_rank, absolute_rank, rank_delta, supplier_fairness_score
    db: Session = Depends(get_db)
):
    query = db.query(FairnessAssessment).join(Supplier)
    if size and size != "All":
        query = query.filter(FairnessAssessment.size_category == size)
    if industry and industry != "All":
        query = query.filter(FairnessAssessment.industry == industry)

    if sort_by == "absolute_rank":
        query = query.order_by(FairnessAssessment.absolute_rank.asc())
    elif sort_by == "rank_delta":
        query = query.order_by(FairnessAssessment.rank_delta.desc())
    elif sort_by == "supplier_fairness_score":
        query = query.order_by(FairnessAssessment.supplier_fairness_score.desc())
    else:
        query = query.order_by(FairnessAssessment.normalized_rank.asc())

    assessments = query.all()
    results = []
    for fa in assessments:
        resp = FairnessAssessmentResponse.model_validate(fa)
        resp.supplier_code = fa.supplier.supplier_code if fa.supplier else "Unknown"
        resp.supplier_name = fa.supplier.name if fa.supplier else "Unknown"
        results.append(resp)
    return results

@router.get("/stats")
def get_fairness_statistics(db: Session = Depends(get_db)):
    """Provides statistical equity metrics across Small, Medium, and Large suppliers."""
    audit = db.query(CarbonAudit).order_by(CarbonAudit.id.desc()).first()
    if not audit:
        return {"status": "No audit records found"}
    res = run_fairness_assessment(db, audit.id)
    return res

@router.post("/recalculate")
def recalculate_fairness(db: Session = Depends(get_db)):
    audit = db.query(CarbonAudit).order_by(CarbonAudit.id.desc()).first()
    if not audit:
        audit = CarbonAudit(audit_code="AUDIT-FAIRNESS", status="Completed")
        db.add(audit)
        db.commit()
        db.refresh(audit)
    return run_fairness_assessment(db, audit.id)
