from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CarbonAudit, Supplier
from app.services.report_generator import generate_enterprise_audit_pdf, generate_supplier_audit_pdf

router = APIRouter(prefix="/reports", tags=["Report Generator"])

@router.get("/enterprise-pdf")
def download_enterprise_report(db: Session = Depends(get_db)):
    """Downloads executive enterprise carbon audit and fairness PDF report."""
    audit = db.query(CarbonAudit).order_by(CarbonAudit.id.desc()).first()
    audit_id = audit.id if audit else 1
    
    pdf_bytes = generate_enterprise_audit_pdf(db, audit_id)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=CarbonTrack_Enterprise_Audit_Report_2026.pdf"
        }
    )

@router.get("/supplier-pdf/{supplier_id}")
def download_supplier_report(supplier_id: int, db: Session = Depends(get_db)):
    """Downloads supplier-specific audit and fairness certificate PDF."""
    sup = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Supplier not found")
        
    pdf_bytes = generate_supplier_audit_pdf(db, supplier_id)
    safe_name = sup.supplier_code.replace(" ", "_")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=CarbonTrack_Supplier_Audit_{safe_name}.pdf"
        }
    )

@router.get("/available")
def list_available_reports(db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).all()
    audit = db.query(CarbonAudit).order_by(CarbonAudit.id.desc()).first()
    return {
        "enterprise_report": {
            "title": "Comprehensive Enterprise Carbon Footprint & Supplier Fairness Audit Report",
            "format": "PDF",
            "audit_code": audit.audit_code if audit else "AUDIT-2026",
            "status": "Ready for download"
        },
        "suppliers": [
            {
                "id": s.id,
                "code": s.supplier_code,
                "name": s.name,
                "size": s.size,
                "industry": s.industry
            }
            for s in suppliers
        ]
    }
