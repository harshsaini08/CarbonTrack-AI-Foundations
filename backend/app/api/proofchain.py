from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models import AuditEvidence, AuditFinding, Supplier
from app.schemas import ProofChainBlockResponse, ProofChainVerificationResponse
from app.services.proofchain import verify_proofchain_integrity

router = APIRouter(prefix="/proofchain", tags=["ProofChain Audit Trail"])

@router.get("/blocks", response_model=List[ProofChainBlockResponse])
def get_proofchain_blocks(db: Session = Depends(get_db)):
    """Retrieves all hash-linked evidence blocks on the ProofChain."""
    blocks = db.query(AuditEvidence).order_by(AuditEvidence.sequence_index.desc()).all()
    results = []
    for b in blocks:
        resp = ProofChainBlockResponse.model_validate(b)
        finding = db.query(AuditFinding).filter(AuditFinding.id == b.finding_id).first()
        if finding:
            resp.issue_title = finding.issue_title
            resp.supplier_name = finding.supplier.name if finding.supplier else "Unknown"
        results.append(resp)
    return results

@router.get("/verify", response_model=ProofChainVerificationResponse)
def verify_ledger(db: Session = Depends(get_db)):
    """Verifies that the SHA-256 hash sequence has not been altered or tampered with."""
    res = verify_proofchain_integrity(db)
    return res

@router.get("/export")
def export_audit_ledger(db: Session = Depends(get_db)):
    """Exports full verifiable proof bundle."""
    blocks = db.query(AuditEvidence).order_by(AuditEvidence.sequence_index.asc()).all()
    verification = verify_proofchain_integrity(db)
    return {
        "ledger_name": "CarbonTrack ProofChain Audit Trail",
        "standard": "SHA-256 Hash-Linked Tamper-Evident Ledger",
        "verification": verification,
        "blocks": [
            {
                "sequence": b.sequence_index,
                "timestamp": b.timestamp.isoformat(),
                "record_hash": b.record_hash,
                "prev_hash": b.prev_hash,
                "payload": b.payload
            }
            for b in blocks
        ]
    }
