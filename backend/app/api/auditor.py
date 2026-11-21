from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import AuditFinding, CarbonAudit, Supplier
from app.schemas import AuditFindingResponse, AuditReviewRequest
from app.services.auditor import run_carbon_audit
from app.services.proofchain import record_finding_review

router = APIRouter(prefix="/auditor", tags=["AI Carbon Auditor"])

@router.post("/run")
def trigger_audit(db: Session = Depends(get_db)):
    """Runs AI Carbon Audit across all supplier operational records."""
    audit = db.query(CarbonAudit).order_by(CarbonAudit.id.desc()).first()
    if not audit:
        audit = CarbonAudit(audit_code="AUDIT-MANUAL", status="Running")
        db.add(audit)
        db.commit()
        db.refresh(audit)

    result = run_carbon_audit(db, audit.id)
    return result

@router.get("/findings", response_model=List[AuditFindingResponse])
def get_audit_findings(
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    supplier_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(AuditFinding).join(Supplier)
    if severity and severity != "All":
        query = query.filter(AuditFinding.severity == severity)
    if status and status != "All":
        query = query.filter(AuditFinding.status == status)
    if supplier_id:
        query = query.filter(AuditFinding.supplier_id == supplier_id)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (AuditFinding.issue_title.ilike(search_filter)) |
            (Supplier.name.ilike(search_filter)) |
            (Supplier.supplier_code.ilike(search_filter))
        )

    findings = query.order_by(AuditFinding.estimated_impact_tco2e.desc()).all()
    
    # Enrich with supplier metadata for frontend display
    results = []
    for f in findings:
        resp = AuditFindingResponse.model_validate(f)
        resp.supplier_name = f.supplier.name if f.supplier else "Unknown"
        resp.supplier_size = f.supplier.size if f.supplier else "Unknown"
        resp.supplier_industry = f.supplier.industry if f.supplier else "Unknown"
        results.append(resp)
        
    return results

@router.get("/findings/{finding_id}", response_model=AuditFindingResponse)
def get_finding_detail(finding_id: int, db: Session = Depends(get_db)):
    finding = db.query(AuditFinding).filter(AuditFinding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Audit finding not found")
    resp = AuditFindingResponse.model_validate(finding)
    resp.supplier_name = finding.supplier.name if finding.supplier else "Unknown"
    resp.supplier_size = finding.supplier.size if finding.supplier else "Unknown"
    resp.supplier_industry = finding.supplier.industry if finding.supplier else "Unknown"
    return resp

@router.post("/findings/{finding_id}/review")
def review_finding(
    finding_id: int,
    req: AuditReviewRequest,
    user_name: str = "Lead Auditor",
    db: Session = Depends(get_db)
):
    """Auditor approval, rejection, or comments recorded with ProofChain hash link."""
    try:
        updated = record_finding_review(
            db=db,
            finding_id=finding_id,
            user_id=1,
            user_name=user_name,
            action=req.action,
            comment=req.comment
        )
        return {
            "status": "success",
            "finding_id": finding_id,
            "new_status": updated.status,
            "reviewed_by": user_name,
            "reviewer_comment": req.comment
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
