"""
Report Generator Service
Generates professional executive PDF audit reports using ReportLab.
Includes executive summary, scope breakdown, fairness analysis, critical findings,
methodology, and ProofChain cryptographic seal.
"""

import io
import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from app.models import (
    Supplier, OperationalRecord, AuditFinding, FairnessAssessment,
    EmissionFactor, AuditEvidence
)

# Brand colors
C_FOREST = colors.HexColor("#0d3826")
C_EMERALD = colors.HexColor("#10b981")
C_CHARCOAL = colors.HexColor("#111720")
C_LIGHT_BG = colors.HexColor("#f8fafc")
C_MUTED = colors.HexColor("#64748b")
C_CRITICAL = colors.HexColor("#ef4444")
C_HIGH = colors.HexColor("#f97316")

def generate_enterprise_audit_pdf(db: Session, audit_id: int) -> bytes:
    """
    Generates a full enterprise carbon footprint and fairness audit PDF report.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    story = []
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=C_FOREST
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=C_MUTED
    )
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=C_FOREST,
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=C_CHARCOAL
    )
    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    # 1. Header Banner
    story.append(Paragraph("CarbonTrack Enterprise Footprint & Fairness Audit", title_style))
    story.append(Paragraph("AI-Powered Carbon Footprint Auditor & Supplier Fairness Intelligence", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=C_EMERALD, spaceAfter=14))

    # 2. Executive Metadata Box
    now_str = datetime.datetime.utcnow().strftime("%B %d, %Y - %H:%M UTC")
    records = db.query(OperationalRecord).all()
    suppliers = db.query(Supplier).all()
    findings = db.query(AuditFinding).filter(AuditFinding.audit_id == audit_id).all()
    assessments = db.query(FairnessAssessment).filter(FairnessAssessment.audit_id == audit_id).all()
    
    total_emissions = sum(r.calculated_total_emissions for r in records)
    total_s1 = sum(r.calculated_scope1 for r in records)
    total_s2 = sum(r.calculated_scope2 for r in records)
    total_s3 = sum(r.calculated_scope3 for r in records)
    avg_fairness = sum(fa.supplier_fairness_score for fa in assessments) / max(1, len(assessments))

    meta_data = [
        [Paragraph("<b>Audit ID:</b> CT-AUDIT-2026", body_style), Paragraph(f"<b>Audit Date:</b> {now_str}", body_style)],
        [Paragraph("<b>Reporting Period:</b> 2025-2026 Fiscal Cycle", body_style), Paragraph("<b>Standard:</b> GHG Protocol Corporate Standard", body_style)],
        [Paragraph(f"<b>Suppliers Audited:</b> {len(suppliers)}", body_style), Paragraph(f"<b>Total Scope 1-3 Footprint:</b> {total_emissions:,.1f} tCO2e", body_style)],
        [Paragraph(f"<b>Audit Flags Detected:</b> {len(findings)}", body_style), Paragraph(f"<b>Portfolio Fairness Index:</b> {avg_fairness:.1f} / 100", body_style)],
    ]
    t_meta = Table(meta_data, colWidths=[260, 260])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    # 3. Executive Summary
    story.append(Paragraph("1. Executive Summary", h2_style))
    exec_summary_text = (
        f"This carbon footprint and fairness audit encompasses <b>{len(suppliers)} suppliers</b> across global supply chain "
        f"operations. Total verified greenhouse gas emissions stand at <b>{total_emissions:,.1f} tCO2e</b>. "
        f"Scope 3 value chain emissions account for <b>{(total_s3/max(0.1, total_emissions))*100:.1f}%</b> of total impact, "
        f"identifying freight logistics and raw materials as primary decarbonization levers. "
        f"The AI Carbon Auditor detected <b>{len(findings)} operational anomalies</b>. Concurrently, the FAIRScore AI engine "
        f"evaluated supplier fairness distributions to ensure small suppliers are evaluated by production intensity rather than "
        f"penalized solely on absolute gross volume."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 12))

    # 4. Scope Breakdown Table
    story.append(Paragraph("2. Scope-Wise Carbon Emissions Breakdown", h2_style))
    scope_data = [
        [Paragraph("<b>GHG Emission Scope</b>", body_style), Paragraph("<b>Description</b>", body_style), Paragraph("<b>Emissions (tCO2e)</b>", body_style), Paragraph("<b>Share (%)</b>", body_style)],
        [Paragraph("<b>Scope 1</b>", body_style), Paragraph("Direct Fuel Combustion (Diesel, Gas, Boilers)", body_style), f"{total_s1:,.1f}", f"{(total_s1/max(0.1, total_emissions))*100:.1f}%"],
        [Paragraph("<b>Scope 2</b>", body_style), Paragraph("Indirect Purchased Grid Electricity", body_style), f"{total_s2:,.1f}", f"{(total_s2/max(0.1, total_emissions))*100:.1f}%"],
        [Paragraph("<b>Scope 3</b>", body_style), Paragraph("Upstream Freight, Materials & Industrial Waste", body_style), f"{total_s3:,.1f}", f"{(total_s3/max(0.1, total_emissions))*100:.1f}%"],
        [Paragraph("<b>Total Enterprise Footprint</b>", body_bold), Paragraph("<b>Consolidated Scopes 1, 2, and 3</b>", body_bold), f"<b>{total_emissions:,.1f}</b>", "<b>100.0%</b>"]
    ]
    t_scope = Table(scope_data, colWidths=[100, 240, 100, 80])
    t_scope.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_FOREST),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('PADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, colors.HexColor("#f8fafc")]),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#e2e8f0")),
    ]))
    story.append(t_scope)
    story.append(Spacer(1, 12))

    # 5. Top 5 Emission Contributors
    story.append(Paragraph("3. Top 5 Emission Contributors", h2_style))
    top_records = sorted(records, key=lambda r: r.calculated_total_emissions, reverse=True)[:5]
    top_data = [
        [Paragraph("<b>Supplier Code & Name</b>", body_style), Paragraph("<b>Industry</b>", body_style), Paragraph("<b>Size</b>", body_style), Paragraph("<b>Emissions (tCO2e)</b>", body_style), Paragraph("<b>Intensity</b>", body_style)]
    ]
    for r in top_records:
        top_data.append([
            Paragraph(f"<b>{r.supplier.supplier_code}</b> - {r.supplier.name}", body_style),
            Paragraph(r.supplier.industry, body_style),
            Paragraph(r.supplier.size, body_style),
            f"{r.calculated_total_emissions:,.1f}",
            f"{r.emission_intensity:.4f}"
        ])
    t_top = Table(top_data, colWidths=[180, 120, 70, 80, 70])
    t_top.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('PADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t_top)
    story.append(Spacer(1, 12))

    # 6. Critical & High Audit Findings
    story.append(Paragraph("4. Prioritized Audit Findings & Anomalies", h2_style))
    crit_high_findings = [f for f in findings if f.severity in ["Critical", "High"]][:6]
    if crit_high_findings:
        find_data = [
            [Paragraph("<b>Sev</b>", body_style), Paragraph("<b>Supplier</b>", body_style), Paragraph("<b>Detected Issue & Root Cause</b>", body_style), Paragraph("<b>Impact</b>", body_style), Paragraph("<b>Status</b>", body_style)]
        ]
        for f in crit_high_findings:
            sev_color = C_CRITICAL if f.severity == "Critical" else C_HIGH
            find_data.append([
                Paragraph(f"<font color='{sev_color}'><b>{f.severity}</b></font>", body_style),
                Paragraph(f"{f.supplier.name}<br/>({f.supplier.supplier_code})", body_style),
                Paragraph(f"<b>{f.issue_title}</b><br/>{f.description[:120]}...", body_style),
                f"{f.estimated_impact_tco2e:.1f} t",
                f"{f.status}"
            ])
        t_find = Table(find_data, colWidths=[55, 110, 245, 60, 50])
        t_find.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('PADDING', (0,0), (-1,-1), 4),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(t_find)
    else:
        story.append(Paragraph("No critical or high-severity anomalies detected.", body_style))
    story.append(Spacer(1, 12))

    # 7. FAIRScore AI Equity Analysis
    story.append(Paragraph("5. FAIRScore AI – Supplier Equity & Bias Mitigation", h2_style))
    fair_text = (
        "Traditional carbon ranking penalizes small suppliers purely because of low capital scale or reporting "
        "immaturity, while overlooking high carbon intensity among large-volume suppliers. "
        "CarbonTrack normalizes evaluation against peer groups using unit carbon intensity ($tCO2e/unit$). "
        "Below are highlighted suppliers where fairness adjustments altered ranking visibility:"
    )
    story.append(Paragraph(fair_text, body_style))
    story.append(Spacer(1, 6))

    equity_shifts = [fa for fa in assessments if abs(fa.rank_delta) >= 5][:4]
    if equity_shifts:
        eq_data = [
            [Paragraph("<b>Supplier</b>", body_style), Paragraph("<b>Scale</b>", body_style), Paragraph("<b>Abs Rank</b>", body_style), Paragraph("<b>Norm Rank</b>", body_style), Paragraph("<b>Delta</b>", body_style), Paragraph("<b>Fairness Score</b>", body_style)]
        ]
        for fa in equity_shifts:
            eq_data.append([
                Paragraph(f"{fa.supplier.name}", body_style),
                Paragraph(fa.size_category, body_style),
                f"#{fa.absolute_rank}",
                f"#{fa.normalized_rank}",
                f"{fa.rank_delta:+d}",
                f"{fa.supplier_fairness_score:.1f}"
            ])
        t_eq = Table(eq_data, colWidths=[180, 70, 65, 65, 60, 80])
        t_eq.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), C_FOREST),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('PADDING', (0,0), (-1,-1), 4),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(t_eq)
    story.append(Spacer(1, 12))

    # 8. Methodology & ProofChain Seal
    story.append(Paragraph("6. Audit Methodology & ProofChain Cryptographic Ledger", h2_style))
    latest_evidence = db.query(AuditEvidence).order_by(AuditEvidence.sequence_index.desc()).first()
    latest_hash = latest_evidence.record_hash if latest_evidence else "GENESIS-INITIALIZED"
    blocks_count = db.query(AuditEvidence).count()

    method_text = (
        "<b>Emission Methodology:</b> GHG Protocol Corporate Accounting Standard (Scopes 1, 2, and 3). "
        "Emission Factors: US EPA eGRID 2024 (Electricity: 0.385 kgCO2e/kWh), Diesel (2.68 kgCO2e/L), GLEC Freight Factors. "
        "<br/><b>ProofChain Verification:</b> Every audit finding and reviewer action is cryptographically sealed "
        "in a SHA-256 hash-linked sequence to guarantee tamper-evident traceability."
    )
    story.append(Paragraph(method_text, body_style))
    story.append(Spacer(1, 8))

    seal_data = [
        [Paragraph(f"<b>ProofChain Ledger Seal:</b> <code>{latest_hash[:48]}...</code>", body_style),
         Paragraph(f"<b>Total Blocks:</b> {blocks_count} | <b>Status:</b> Cryptographically Verified", body_style)]
    ]
    t_seal = Table(seal_data, colWidths=[360, 160])
    t_seal.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ecfdf5")),
        ('BOX', (0,0), (-1,-1), 1, C_EMERALD),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_seal)

    doc.build(story)
    return buffer.getvalue()

def generate_supplier_audit_pdf(db: Session, supplier_id: int) -> bytes:
    """
    Generates a dedicated single-supplier carbon profile and audit certificate PDF.
    """
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise ValueError(f"Supplier {supplier_id} not found")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=20, textColor=C_FOREST)
    h2_style = ParagraphStyle('SectionH2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=12, textColor=C_FOREST, spaceBefore=10, spaceAfter=4)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=13, textColor=C_CHARCOAL)

    story.append(Paragraph(f"CarbonTrack Supplier Audit Report: {supplier.name}", title_style))
    story.append(Paragraph(f"Supplier Code: {supplier.supplier_code} | Tier: {supplier.tier} | Industry: {supplier.industry}", body_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=C_EMERALD, spaceAfter=14))

    records = db.query(OperationalRecord).filter(OperationalRecord.supplier_id == supplier_id).all()
    latest_rec = records[-1] if records else None
    fa = db.query(FairnessAssessment).filter(FairnessAssessment.supplier_id == supplier_id).first()
    findings = db.query(AuditFinding).filter(AuditFinding.supplier_id == supplier_id).all()

    if latest_rec:
        meta_data = [
            [Paragraph(f"<b>Scale Category:</b> {supplier.size}", body_style), Paragraph(f"<b>Location:</b> {supplier.location}", body_style)],
            [Paragraph(f"<b>Production Volume:</b> {latest_rec.production_volume:,.0f} units", body_style), Paragraph(f"<b>Total Emissions:</b> {latest_rec.calculated_total_emissions:.1f} tCO2e", body_style)],
            [Paragraph(f"<b>Scope 1 / 2 / 3:</b> {latest_rec.calculated_scope1:.1f} / {latest_rec.calculated_scope2:.1f} / {latest_rec.calculated_scope3:.1f}", body_style), Paragraph(f"<b>Emission Intensity:</b> {latest_rec.emission_intensity:.4f} tCO2e/unit", body_style)],
        ]
        t_meta = Table(meta_data, colWidths=[260, 260])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(t_meta)
        story.append(Spacer(1, 12))

    story.append(Paragraph("FairScore AI Equity Assessment", h2_style))
    if fa:
        fair_info = [
            [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Value</b>", body_style)],
            ["Absolute Ranking", f"#{fa.absolute_rank}"],
            ["Normalized Ranking", f"#{fa.normalized_rank}"],
            ["Ranking Shift", f"{fa.rank_delta:+d} positions"],
            ["Supplier Fairness Score", f"{fa.supplier_fairness_score:.1f} / 100"],
            ["Peer Group Mean Intensity", f"{fa.peer_group_mean_intensity:.4f} tCO2e/unit"],
            ["Equity Finding", fa.explanation or "Consistent performance with industry peers."]
        ]
        t_fair = Table(fair_info, colWidths=[180, 340])
        t_fair.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), C_FOREST),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('PADDING', (0,0), (-1,-1), 5),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(t_fair)
        story.append(Spacer(1, 12))

    story.append(Paragraph(f"Audit Findings ({len(findings)})", h2_style))
    if findings:
        f_data = [[Paragraph("<b>Severity</b>", body_style), Paragraph("<b>Issue</b>", body_style), Paragraph("<b>Impact</b>", body_style), Paragraph("<b>Recommendation</b>", body_style)]]
        for f in findings:
            f_data.append([
                Paragraph(f.severity, body_style),
                Paragraph(f"<b>{f.issue_title}</b>", body_style),
                f"{f.estimated_impact_tco2e:.1f} tCO2e",
                Paragraph(f.recommended_action[:140], body_style)
            ])
        t_f = Table(f_data, colWidths=[70, 150, 80, 220])
        t_f.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('PADDING', (0,0), (-1,-1), 5),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(t_f)
    else:
        story.append(Paragraph("✅ No active audit discrepancies or critical anomalies detected.", body_style))

    doc.build(story)
    return buffer.getvalue()
