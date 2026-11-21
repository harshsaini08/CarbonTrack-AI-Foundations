from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
import io
import pandas as pd
from typing import List, Dict, Any, Optional
from app.database import get_db
from app.models import Supplier, OperationalRecord, CarbonAudit
from app.services.carbon_calculator import calculate_operational_emissions
from app.services.auditor import run_carbon_audit
from app.services.fairness_engine import run_fairness_assessment
from app.services.proofchain import record_finding_evidence
from app.seed_data import seed_database_demo_data

router = APIRouter(prefix="/ingestion", tags=["Smart Data Ingestion"])

EXPECTED_COLUMNS = [
    "Supplier ID", "Supplier Name", "Supplier Size", "Industry", "Location",
    "Production Volume", "Electricity Consumption", "Fuel Consumption",
    "Transportation Distance", "Transportation Mode", "Material Consumption",
    "Waste Generated", "Reported Carbon Emissions", "Reporting Period"
]

@router.post("/seed-demo")
def seed_demo(db: Session = Depends(get_db)):
    """One-click Load Demo Dataset feature."""
    result = seed_database_demo_data(db, reset_existing=True)
    return result

@router.get("/sample-template")
def download_sample_template():
    """Generates downloadable sample CSV template for supplier carbon data."""
    sample_rows = [
        {
            "Supplier ID": "S-201",
            "Supplier Name": "Apex CleanTech Castings",
            "Supplier Size": "Medium",
            "Industry": "Industrial Machinery",
            "Location": "Pittsburgh, PA, USA",
            "Production Volume": 45000,
            "Electricity Consumption": 380000,
            "Fuel Consumption": 25000,
            "Transportation Distance": 850,
            "Transportation Mode": "Rail",
            "Material Consumption": 1800,
            "Waste Generated": 95,
            "Reported Carbon Emissions": 220.0,
            "Reporting Period": "2025-Q4"
        },
        {
            "Supplier ID": "S-202",
            "Supplier Name": "Verdant Packaging Innovations",
            "Supplier Size": "Small",
            "Industry": "Packaging",
            "Location": "Denver, CO, USA",
            "Production Volume": 85000,
            "Electricity Consumption": 92000,
            "Fuel Consumption": 6500,
            "Transportation Distance": 420,
            "Transportation Mode": "Road",
            "Material Consumption": 650,
            "Waste Generated": 30,
            "Reported Carbon Emissions": 62.0,
            "Reporting Period": "2025-Q4"
        }
    ]
    df = pd.DataFrame(sample_rows)
    csv_str = df.to_csv(index=False)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=carbontrack_sample_template.csv"}
    )

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Parses, validates, maps columns, and imports CSV or Excel files.
    Calculates carbon emissions automatically and records quality scores.
    """
    filename = file.filename.lower()
    contents = await file.read()
    
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a .csv or .xlsx file.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    # Column Mapping Heuristics
    col_map = {}
    for col in df.columns:
        norm = str(col).strip().lower().replace("_", " ").replace("-", " ")
        if "id" in norm or "code" in norm:
            col_map["supplier_code"] = col
        elif "name" in norm:
            col_map["name"] = col
        elif "size" in norm or "scale" in norm or "tier" in norm:
            col_map["size"] = col
        elif "industry" in norm or "sector" in norm:
            col_map["industry"] = col
        elif "location" in norm or "city" in norm or "country" in norm:
            col_map["location"] = col
        elif "volume" in norm or "production" in norm or "units" in norm:
            col_map["production_volume"] = col
        elif "elec" in norm or "kwh" in norm:
            col_map["electricity"] = col
        elif "fuel" in norm or "diesel" in norm or "liters" in norm:
            col_map["fuel"] = col
        elif "dist" in norm or "km" in norm or "miles" in norm:
            col_map["distance"] = col
        elif "mode" in norm or "transport" in norm or "freight" in norm:
            col_map["mode"] = col
        elif "material" in norm or "raw" in norm:
            col_map["material"] = col
        elif "waste" in norm:
            col_map["waste"] = col
        elif "reported" in norm or "claimed" in norm:
            col_map["reported_emissions"] = col
        elif "period" in norm or "quarter" in norm or "year" in norm:
            col_map["period"] = col

    # Validation & Ingestion
    validation_warnings = []
    processed_count = 0
    duplicate_count = 0
    
    for idx, row in df.iterrows():
        # Validate Supplier Identity
        raw_code = str(row.get(col_map.get("supplier_code", "Supplier ID"), f"S-IMP-{idx+1}")).strip()
        raw_name = str(row.get(col_map.get("name", "Supplier Name"), f"Supplier {raw_code}")).strip()
        raw_size = str(row.get(col_map.get("size", "Supplier Size"), "Medium")).capitalize()
        if raw_size not in ["Small", "Medium", "Large"]:
            raw_size = "Medium"
        raw_ind = str(row.get(col_map.get("industry", "Industry"), "General Manufacturing")).strip()
        raw_loc = str(row.get(col_map.get("location", "Location"), "Global")).strip()

        # Operational Values
        try:
            prod_vol = float(row.get(col_map.get("production_volume", "Production Volume"), 1000))
            if prod_vol <= 0:
                validation_warnings.append(f"Row {idx+1} ({raw_code}): Zero/negative volume provided. Adjusted to 1.0.")
                prod_vol = 1.0
        except Exception:
            prod_vol = 1000.0

        try:
            elec = float(row.get(col_map.get("electricity", "Electricity Consumption"), 0))
        except Exception:
            elec = 0.0

        try:
            fuel = float(row.get(col_map.get("fuel", "Fuel Consumption"), 0))
        except Exception:
            fuel = 0.0

        try:
            distance = float(row.get(col_map.get("distance", "Transportation Distance"), 0))
        except Exception:
            distance = 0.0

        mode = str(row.get(col_map.get("mode", "Transportation Mode"), "Road")).capitalize()
        material = float(row.get(col_map.get("material", "Material Consumption"), 0) or 0)
        waste = float(row.get(col_map.get("waste", "Waste Generated"), 0) or 0)
        
        rep_val = row.get(col_map.get("reported_emissions", "Reported Carbon Emissions"), None)
        try:
            reported_emissions = float(rep_val) if pd.notna(rep_val) else None
        except Exception:
            reported_emissions = None

        period = str(row.get(col_map.get("period", "Reporting Period"), "2025-Annual"))

        # Check or Create Supplier
        sup = db.query(Supplier).filter(Supplier.supplier_code == raw_code).first()
        if not sup:
            sup = Supplier(
                supplier_code=raw_code,
                name=raw_name,
                size=raw_size,
                industry=raw_ind,
                location=raw_loc
            )
            db.add(sup)
            db.flush()
        else:
            duplicate_count += 1

        # Calculate standard emissions
        calc = calculate_operational_emissions(
            production_volume=prod_vol,
            electricity_kwh=elec,
            fuel_liters=fuel,
            transport_distance_km=distance,
            transport_mode=mode,
            material_tons=material,
            waste_tons=waste,
            reported_emissions=reported_emissions
        )

        rec = OperationalRecord(
            supplier_id=sup.id,
            reporting_period=period,
            production_volume=prod_vol,
            electricity_consumption=elec,
            fuel_consumption=fuel,
            transportation_distance=distance,
            transportation_mode=mode,
            material_consumption=material,
            waste_generated=waste,
            reported_carbon_emissions=reported_emissions,
            calculated_scope1=calc["calculated_scope1"],
            calculated_scope2=calc["calculated_scope2"],
            calculated_scope3=calc["calculated_scope3"],
            calculated_total_emissions=calc["calculated_total_emissions"],
            emission_intensity=calc["emission_intensity"],
            data_quality_score=calc["data_quality_score"],
            has_anomaly=len(calc["anomalies"]) > 0,
            status="Imported"
        )
        db.add(rec)
        processed_count += 1

    db.commit()

    # Re-run audit and fairness assessment for the new data
    audit = db.query(CarbonAudit).order_by(CarbonAudit.id.desc()).first()
    if not audit:
        audit = CarbonAudit(audit_code="AUDIT-UPLOAD", status="Completed")
        db.add(audit)
        db.commit()
        db.refresh(audit)
        
    run_carbon_audit(db, audit.id)
    run_fairness_assessment(db, audit.id)

    return {
        "status": "success",
        "filename": file.filename,
        "rows_processed": processed_count,
        "existing_suppliers_updated": duplicate_count,
        "warnings": validation_warnings[:10],
        "columns_mapped": list(col_map.keys()),
        "data_quality_preview": "Verified and audited"
    }
