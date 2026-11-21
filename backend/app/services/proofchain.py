"""
ProofChain - Tamper-Evident Explainable Audit Ledger
Creates cryptographically hash-linked audit records (SHA-256) for complete traceability.
Demonstrates verifiable evidence trails, finding verification, and sign-off workflows.
"""

import hashlib
import json
import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import AuditEvidence, AuditFinding, AuditReview, Supplier

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

def calculate_block_hash(sequence_index: int, prev_hash: str, timestamp_str: str, payload_str: str) -> str:
    """Calculates SHA-256 digest of block header and payload."""
    raw = f"{sequence_index}|{prev_hash}|{timestamp_str}|{payload_str}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def record_finding_evidence(db: Session, finding_id: int) -> AuditEvidence:
    """
    Creates a new hash-linked evidence block on ProofChain for an audit finding.
    """
    finding = db.query(AuditFinding).filter(AuditFinding.id == finding_id).first()
    if not finding:
        raise ValueError(f"AuditFinding {finding_id} not found")

    # Get latest block to establish hash link
    latest_block = db.query(AuditEvidence).order_by(AuditEvidence.sequence_index.desc()).first()
    prev_hash = latest_block.record_hash if latest_block else GENESIS_HASH
    seq_index = (latest_block.sequence_index + 1) if latest_block else 1
    
    timestamp = datetime.datetime.utcnow()
    timestamp_str = timestamp.isoformat()

    payload_data = {
        "finding_id": finding.id,
        "audit_id": finding.audit_id,
        "supplier_id": finding.supplier_id,
        "supplier_name": finding.supplier.name if finding.supplier else "Unknown",
        "supplier_code": finding.supplier.supplier_code if finding.supplier else "Unknown",
        "issue_type": finding.issue_type,
        "issue_title": finding.issue_title,
        "severity": finding.severity,
        "confidence_score": finding.confidence_score,
        "estimated_impact_tco2e": finding.estimated_impact_tco2e,
        "supporting_data": finding.supporting_data,
        "recommended_action": finding.recommended_action,
        "status": finding.status,
        "audit_methodology": "GHG-Protocol-Scope1-3-v2.1",
        "record_id": finding.record_id
    }
    payload_str = json.dumps(payload_data, sort_keys=True)
    block_hash = calculate_block_hash(seq_index, prev_hash, timestamp_str, payload_str)

    evidence = AuditEvidence(
        finding_id=finding.id,
        evidence_type="AuditFindingVerification",
        description=f"Cryptographic evidence seal for finding: {finding.issue_title}",
        payload=payload_data,
        sequence_index=seq_index,
        record_hash=block_hash,
        prev_hash=prev_hash,
        timestamp=timestamp
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence

def verify_proofchain_integrity(db: Session) -> Dict[str, Any]:
    """
    Verifies the cryptographic continuity of all blocks in the ProofChain.
    Returns whether the ledger is untampered and identifies any corrupt nodes.
    """
    blocks = db.query(AuditEvidence).order_by(AuditEvidence.sequence_index.asc()).all()
    if not blocks:
        return {
            "is_valid": True,
            "total_blocks": 0,
            "genesis_hash": GENESIS_HASH,
            "latest_hash": GENESIS_HASH,
            "verification_timestamp": datetime.datetime.utcnow().isoformat(),
            "integrity_details": "ProofChain is initialized (0 blocks recorded)."
        }

    expected_prev = GENESIS_HASH
    for i, b in enumerate(blocks):
        # 1. Verify link continuity
        if b.prev_hash != expected_prev:
            return {
                "is_valid": False,
                "broken_block_index": b.sequence_index,
                "total_blocks": len(blocks),
                "genesis_hash": GENESIS_HASH,
                "latest_hash": blocks[-1].record_hash,
                "verification_timestamp": datetime.datetime.utcnow().isoformat(),
                "integrity_details": f"Tampering detected at block #{b.sequence_index}: prev_hash does not match predecessor."
            }

        # 2. Verify self-hash integrity
        timestamp_str = b.timestamp.isoformat()
        payload_str = json.dumps(b.payload, sort_keys=True)
        recalculated = calculate_block_hash(b.sequence_index, b.prev_hash, timestamp_str, payload_str)
        if recalculated != b.record_hash:
            return {
                "is_valid": False,
                "broken_block_index": b.sequence_index,
                "total_blocks": len(blocks),
                "genesis_hash": GENESIS_HASH,
                "latest_hash": blocks[-1].record_hash,
                "verification_timestamp": datetime.datetime.utcnow().isoformat(),
                "integrity_details": f"Tampering detected at block #{b.sequence_index}: payload hash mismatch."
            }

        expected_prev = b.record_hash

    return {
        "is_valid": True,
        "total_blocks": len(blocks),
        "genesis_hash": GENESIS_HASH,
        "latest_hash": blocks[-1].record_hash,
        "verification_timestamp": datetime.datetime.utcnow().isoformat(),
        "integrity_details": f"All {len(blocks)} ProofChain blocks mathematically verified. Cryptographic continuity intact."
    }

def record_finding_review(
    db: Session,
    finding_id: int,
    user_id: Optional[int],
    user_name: str,
    action: str, # approve, reject, investigating
    comment: str
) -> AuditFinding:
    """
    Records an auditor's verification, update finding status, and seals an update block.
    """
    finding = db.query(AuditFinding).filter(AuditFinding.id == finding_id).first()
    if not finding:
        raise ValueError(f"Finding {finding_id} not found")

    status_map = {
        "approve": "Approved",
        "reject": "Rejected",
        "investigating": "Investigating",
        "comment": finding.status
    }
    new_status = status_map.get(action.lower(), "Pending")
    
    finding.status = new_status
    finding.reviewer_comment = comment
    finding.reviewed_by = user_name
    finding.reviewed_at = datetime.datetime.utcnow()

    # Create review log
    review = AuditReview(
        finding_id=finding_id,
        user_id=user_id,
        action=action,
        comment=comment,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(review)
    db.commit()

    # Re-seal evidence on ProofChain
    record_finding_evidence(db, finding_id)

    return finding
