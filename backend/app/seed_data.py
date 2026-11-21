"""
Synthetic Supply-Chain Demonstration Data Seeder
Creates 32+ realistic enterprise suppliers across Small, Medium, Large tiers,
with pre-configured test scenarios (high emissions, inconsistent reporting, scale bias, etc.),
seeds default emission factors, and initializes ProofChain audit ledger.
"""

from sqlalchemy.orm import Session
from app.models import (
    Organization, User, Supplier, OperationalRecord, EmissionFactor,
    CarbonAudit, AuditFinding, FairnessAssessment, AuditEvidence
)
from app.services.carbon_calculator import DEFAULT_FACTORS, calculate_operational_emissions
from app.services.auditor import run_carbon_audit
from app.services.fairness_engine import run_fairness_assessment
from app.services.proofchain import record_finding_evidence

# Default seed users
DEMO_USERS = [
    {
        "email": "admin@carbontrack.io",
        "full_name": "Eleanor Vance (System Administrator)",
        "role": "admin",
        "password": "adminpassword"
    },
    {
        "email": "sustainability@carbontrack.io",
        "full_name": "Marcus Chen (Chief Sustainability Officer)",
        "role": "sustainability_manager",
        "password": "sustainabilitypassword"
    },
    {
        "email": "auditor@carbontrack.io",
        "full_name": "Dr. Aris Thorne (Lead ESG Auditor)",
        "role": "auditor",
        "password": "auditorpassword"
    }
]

# 32+ Suppliers with realistic operational profiles and deliberate edge-case scenarios
RAW_SUPPLIERS = [
    # --- TEST SCENARIO 1: High-Emission Heavy Industrial Supplier ---
    {
        "code": "S-101", "name": "Vulcan Heavy Forgings & Castings", "size": "Large", "industry": "Industrial Machinery",
        "location": "Cleveland, OH, USA", "country": "USA", "tier": 1,
        "volume": 85000, "elec": 820000, "fuel": 145000, "distance": 1200, "mode": "Road", "material": 4200, "waste": 310, "reported": 1420.0
    },
    # --- TEST SCENARIO 2: Inconsistent Reporting Record (Under-reporting) ---
    {
        "code": "S-102", "name": "Apex Intermodal Freight Services", "size": "Medium", "industry": "Logistics & Transport",
        "location": "Chicago, IL, USA", "country": "USA", "tier": 1,
        "volume": 42000, "elec": 95000, "fuel": 110000, "distance": 2800, "mode": "Road", "material": 120, "waste": 15, "reported": 180.0  # Real calc is ~800+ tCO2e!
    },
    # --- TEST SCENARIO 3: Large Supplier, High Absolute Emissions but Highly Efficient (Clean Unit Intensity) ---
    {
        "code": "S-103", "name": "Global Silicon Wafer Foundry", "size": "Large", "industry": "Electronics",
        "location": "Austin, TX, USA", "country": "USA", "tier": 1,
        "volume": 450000, "elec": 1100000, "fuel": 18000, "distance": 1800, "mode": "Rail", "material": 1800, "waste": 80, "reported": 720.0
    },
    # --- TEST SCENARIO 4: Small Supplier, Low Absolute Emissions but High Emission Intensity (Outdated Boiler) ---
    {
        "code": "S-104", "name": "MicroMelt Precision Stampings", "size": "Small", "industry": "Automotive Parts",
        "location": "Detroit, MI, USA", "country": "USA", "tier": 2,
        "volume": 4200, "elec": 115000, "fuel": 32000, "distance": 450, "mode": "Road", "material": 320, "waste": 45, "reported": 175.0
    },
    # --- TEST SCENARIO 5: Small Supplier Unfairly Penalized under Gross Ranking, jumps under FairScore ---
    {
        "code": "S-105", "name": "BioPak Compostable Solutions", "size": "Small", "industry": "Packaging",
        "location": "Portland, OR, USA", "country": "USA", "tier": 2,
        "volume": 120000, "elec": 42000, "fuel": 2800, "distance": 320, "mode": "Rail", "material": 850, "waste": 25, "reported": 35.0
    },
    # --- TEST SCENARIO 6: Missing Environmental Data / Zero Values ---
    {
        "code": "S-106", "name": "Horizon Weaving & Technical Textiles", "size": "Small", "industry": "Textiles",
        "location": "Greensboro, NC, USA", "country": "USA", "tier": 3,
        "volume": 18000, "elec": 0, "fuel": 8500, "distance": 620, "mode": "Road", "material": 410, "waste": 12, "reported": 45.0
    },
    # --- Additional Diverse Suppliers ---
    {
        "code": "S-107", "name": "AeroAlloy Precision Systems", "size": "Medium", "industry": "Automotive Parts",
        "location": "Munich, Germany", "country": "Germany", "tier": 1,
        "volume": 38000, "elec": 310000, "fuel": 24000, "distance": 1400, "mode": "Rail", "material": 1200, "waste": 65, "reported": 240.0
    },
    {
        "code": "S-108", "name": "Quantum Chem Polymers Corp", "size": "Large", "industry": "Chemicals",
        "location": "Antwerp, Belgium", "country": "Belgium", "tier": 1,
        "volume": 210000, "elec": 1450000, "fuel": 190000, "distance": 950, "mode": "Sea", "material": 5800, "waste": 450, "reported": 1650.0
    },
    {
        "code": "S-109", "name": "GreenCircuit PCB Assembly", "size": "Medium", "industry": "Electronics",
        "location": "Hsinchu, Taiwan", "country": "Taiwan", "tier": 2,
        "volume": 180000, "elec": 420000, "fuel": 8200, "distance": 3200, "mode": "Air", "material": 640, "waste": 35, "reported": 380.0
    },
    {
        "code": "S-110", "name": "Solas EcoGlass Containers", "size": "Small", "industry": "Packaging",
        "location": "Toledo, OH, USA", "country": "USA", "tier": 2,
        "volume": 65000, "elec": 180000, "fuel": 22000, "distance": 410, "mode": "Road", "material": 1100, "waste": 50, "reported": 165.0
    },
    {
        "code": "S-111", "name": "Nordic Timber Pulp & Paper", "size": "Large", "industry": "Packaging",
        "location": "Gothenburg, Sweden", "country": "Sweden", "tier": 1,
        "volume": 320000, "elec": 890000, "fuel": 68000, "distance": 1600, "mode": "Sea", "material": 8200, "waste": 220, "reported": 780.0
    },
    {
        "code": "S-112", "name": "Atlas Heavy Axle & Gear", "size": "Medium", "industry": "Industrial Machinery",
        "location": "Stuttgart, Germany", "country": "Germany", "tier": 1,
        "volume": 44000, "elec": 410000, "fuel": 48000, "distance": 780, "mode": "Rail", "material": 2400, "waste": 140, "reported": 340.0
    },
    {
        "code": "S-113", "name": "Delta Trans-Air Express", "size": "Medium", "industry": "Logistics & Transport",
        "location": "Atlanta, GA, USA", "country": "USA", "tier": 1,
        "volume": 28000, "elec": 110000, "fuel": 185000, "distance": 3400, "mode": "Air", "material": 80, "waste": 18, "reported": 820.0
    },
    {
        "code": "S-114", "name": "Vanguard Micro-Sensors Ltd", "size": "Small", "industry": "Electronics",
        "location": "Cambridge, UK", "country": "UK", "tier": 2,
        "volume": 52000, "elec": 88000, "fuel": 4100, "distance": 1800, "mode": "Air", "material": 190, "waste": 12, "reported": 68.0
    },
    {
        "code": "S-115", "name": "Titanium Dynamics Extrusions", "size": "Large", "industry": "Industrial Machinery",
        "location": "Pittsburgh, PA, USA", "country": "USA", "tier": 1,
        "volume": 120000, "elec": 980000, "fuel": 112000, "distance": 850, "mode": "Road", "material": 3600, "waste": 280, "reported": 990.0
    },
    {
        "code": "S-116", "name": "Lumina Optoelectronics", "size": "Small", "industry": "Electronics",
        "location": "San Jose, CA, USA", "country": "USA", "tier": 2,
        "volume": 75000, "elec": 140000, "fuel": 3200, "distance": 650, "mode": "Road", "material": 280, "waste": 15, "reported": 72.0
    },
    {
        "code": "S-117", "name": "Cascade Biorefineries Inc", "size": "Medium", "industry": "Chemicals",
        "location": "Seattle, WA, USA", "country": "USA", "tier": 2,
        "volume": 95000, "elec": 510000, "fuel": 56000, "distance": 1100, "mode": "Rail", "material": 2800, "waste": 190, "reported": 410.0
    },
    {
        "code": "S-118", "name": "Pinnacle Stamped Metal Components", "size": "Medium", "industry": "Automotive Parts",
        "location": "Monterrey, Mexico", "country": "Mexico", "tier": 1,
        "volume": 160000, "elec": 590000, "fuel": 44000, "distance": 1850, "mode": "Road", "material": 3100, "waste": 180, "reported": 490.0
    },
    {
        "code": "S-119", "name": "PureFibre Synthetic Yarns", "size": "Small", "industry": "Textiles",
        "location": "Greenville, SC, USA", "country": "USA", "tier": 3,
        "volume": 32000, "elec": 195000, "fuel": 18000, "distance": 740, "mode": "Road", "material": 820, "waste": 45, "reported": 145.0
    },
    {
        "code": "S-120", "name": "Oceanic Bulk Marine Haulage", "size": "Large", "industry": "Logistics & Transport",
        "location": "Rotterdam, Netherlands", "country": "Netherlands", "tier": 1,
        "volume": 520000, "elec": 220000, "fuel": 280000, "distance": 6500, "mode": "Sea", "material": 250, "waste": 40, "reported": 1150.0
    },
    {
        "code": "S-121", "name": "Krona Fasteners & Bolts", "size": "Small", "industry": "Automotive Parts",
        "location": "Turin, Italy", "country": "Italy", "tier": 2,
        "volume": 88000, "elec": 145000, "fuel": 9500, "distance": 920, "mode": "Road", "material": 750, "waste": 35, "reported": 98.0
    },
    {
        "code": "S-122", "name": "Ecolene Recycled Resins", "size": "Small", "industry": "Chemicals",
        "location": "Lyons, France", "country": "France", "tier": 3,
        "volume": 48000, "elec": 160000, "fuel": 14000, "distance": 580, "mode": "Rail", "material": 1400, "waste": 60, "reported": 125.0
    },
    {
        "code": "S-123", "name": "Zenith Battery Cell Technology", "size": "Large", "industry": "Electronics",
        "location": "Daejeon, South Korea", "country": "South Korea", "tier": 1,
        "volume": 290000, "elec": 1350000, "fuel": 26000, "distance": 7200, "mode": "Sea", "material": 4500, "waste": 150, "reported": 840.0
    },
    {
        "code": "S-124", "name": "Piedmont Corrugated Boxworks", "size": "Medium", "industry": "Packaging",
        "location": "Richmond, VA, USA", "country": "USA", "tier": 2,
        "volume": 140000, "elec": 280000, "fuel": 19000, "distance": 380, "mode": "Road", "material": 2200, "waste": 95, "reported": 210.0
    },
    {
        "code": "S-125", "name": "Alps Hydraulics & Valves", "size": "Medium", "industry": "Industrial Machinery",
        "location": "Zurich, Switzerland", "country": "Switzerland", "tier": 2,
        "volume": 31000, "elec": 220000, "fuel": 18500, "distance": 890, "mode": "Rail", "material": 950, "waste": 40, "reported": 165.0
    },
    {
        "code": "S-126", "name": "SilicaTech Micro-Coatings", "size": "Small", "industry": "Chemicals",
        "location": "Osaka, Japan", "country": "Japan", "tier": 3,
        "volume": 22000, "elec": 135000, "fuel": 8200, "distance": 4800, "mode": "Sea", "material": 380, "waste": 25, "reported": 88.0
    },
    {
        "code": "S-127", "name": "Centurion Rail Logistics Group", "size": "Large", "industry": "Logistics & Transport",
        "location": "Omaha, NE, USA", "country": "USA", "tier": 1,
        "volume": 380000, "elec": 340000, "fuel": 145000, "distance": 2200, "mode": "Rail", "material": 180, "waste": 25, "reported": 580.0
    },
    {
        "code": "S-128", "name": "KevlarWeave Industrial Fabrics", "size": "Medium", "industry": "Textiles",
        "location": "Charlotte, NC, USA", "country": "USA", "tier": 2,
        "volume": 58000, "elec": 360000, "fuel": 31000, "distance": 820, "mode": "Road", "material": 1450, "waste": 70, "reported": 275.0
    },
    {
        "code": "S-129", "name": "Apex Injection Moulded Plastics", "size": "Medium", "industry": "Packaging",
        "location": "Guadalajara, Mexico", "country": "Mexico", "tier": 2,
        "volume": 175000, "elec": 490000, "fuel": 28000, "distance": 1650, "mode": "Road", "material": 2900, "waste": 110, "reported": 360.0
    },
    {
        "code": "S-130", "name": "Vortex Pneumatics & Turbines", "size": "Large", "industry": "Industrial Machinery",
        "location": "Manchester, UK", "country": "UK", "tier": 1,
        "volume": 68000, "elec": 640000, "fuel": 72000, "distance": 1400, "mode": "Rail", "material": 2800, "waste": 160, "reported": 510.0
    },
    {
        "code": "S-131", "name": "EcoThread Organic Fibers", "size": "Small", "industry": "Textiles",
        "location": "Coimbatore, India", "country": "India", "tier": 3,
        "volume": 45000, "elec": 120000, "fuel": 11000, "distance": 5400, "mode": "Sea", "material": 920, "waste": 30, "reported": 92.0
    },
    {
        "code": "S-132", "name": "NovaSeal Gaskets & Elastomers", "size": "Small", "industry": "Automotive Parts",
        "location": "Akron, OH, USA", "country": "USA", "tier": 3,
        "volume": 62000, "elec": 110000, "fuel": 7800, "distance": 520, "mode": "Road", "material": 480, "waste": 28, "reported": 74.0
    }
]

def seed_database_demo_data(db: Session, reset_existing: bool = True) -> dict:
    """
    Seeds organization, users, emission factors, suppliers, operational records,
    executes the initial carbon audit, runs fairness assessment, and builds ProofChain blocks.
    """
    if reset_existing:
        # Clear child tables first
        db.query(AuditEvidence).delete()
        db.query(AuditFinding).delete()
        db.query(FairnessAssessment).delete()
        db.query(CarbonAudit).delete()
        db.query(OperationalRecord).delete()
        db.query(Supplier).delete()
        db.commit()

    # 1. Ensure Organization exists
    org = db.query(Organization).first()
    if not org:
        org = Organization(name="AeroDynamics Global Enterprise", industry="Aerospace & Advanced Manufacturing", reporting_year=2026)
        db.add(org)
        db.commit()
        db.refresh(org)

    # 2. Ensure Users exist
    for u in DEMO_USERS:
        existing_user = db.query(User).filter(User.email == u["email"]).first()
        if not existing_user:
            # Simple hash for demonstration prototype
            db_user = User(
                email=u["email"],
                full_name=u["full_name"],
                role=u["role"],
                hashed_password=f"pbkdf2:{u['password']}",
                organization_id=org.id
            )
            db.add(db_user)
    db.commit()

    # 3. Ensure Emission Factors exist
    existing_efs = db.query(EmissionFactor).count()
    if existing_efs == 0:
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

    # 4. Insert Suppliers and Operational Records
    created_suppliers = []
    created_records = []

    for s_raw in RAW_SUPPLIERS:
        sup = Supplier(
            supplier_code=s_raw["code"],
            name=s_raw["name"],
            size=s_raw["size"],
            industry=s_raw["industry"],
            location=s_raw["location"],
            country=s_raw["country"],
            tier=s_raw["tier"],
            contact_email=f"esg-desk@{s_raw['name'].lower().replace(' ', '').replace('&', '').replace(',', '')[:14]}.com"
        )
        db.add(sup)
        db.flush() # get sup.id
        created_suppliers.append(sup)

        # Calculate exact GHG Protocol emissions using calculator
        calc = calculate_operational_emissions(
            production_volume=s_raw["volume"],
            electricity_kwh=s_raw["elec"],
            fuel_liters=s_raw["fuel"],
            transport_distance_km=s_raw["distance"],
            transport_mode=s_raw["mode"],
            material_tons=s_raw["material"],
            waste_tons=s_raw["waste"],
            reported_emissions=s_raw.get("reported")
        )

        rec = OperationalRecord(
            supplier_id=sup.id,
            reporting_period="2025-Annual",
            production_volume=s_raw["volume"],
            electricity_consumption=s_raw["elec"],
            fuel_consumption=s_raw["fuel"],
            transportation_distance=s_raw["distance"],
            transportation_mode=s_raw["mode"],
            material_consumption=s_raw["material"],
            waste_generated=s_raw["waste"],
            reported_carbon_emissions=s_raw.get("reported"),
            calculated_scope1=calc["calculated_scope1"],
            calculated_scope2=calc["calculated_scope2"],
            calculated_scope3=calc["calculated_scope3"],
            calculated_total_emissions=calc["calculated_total_emissions"],
            emission_intensity=calc["emission_intensity"],
            data_quality_score=calc["data_quality_score"],
            has_anomaly=len(calc["anomalies"]) > 0,
            status="Verified"
        )
        db.add(rec)
        created_records.append(rec)

    db.commit()

    # 5. Create default CarbonAudit record
    audit = CarbonAudit(
        audit_code="AUDIT-2026-Q1-GLOBAL",
        organization_id=org.id,
        methodology_version="GHG-Protocol-Scope1-3-v2.1",
        status="Completed"
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)

    # 6. Run AI Carbon Audit
    audit_res = run_carbon_audit(db, audit.id)

    # 7. Run FAIRScore AI Assessment
    fair_res = run_fairness_assessment(db, audit.id)

    # 8. Cryptographically seal findings into ProofChain blocks
    findings = db.query(AuditFinding).filter(AuditFinding.audit_id == audit.id).all()
    for f in findings:
        record_finding_evidence(db, f.id)

    return {
        "status": "success",
        "suppliers_seeded": len(created_suppliers),
        "records_seeded": len(created_records),
        "audit_id": audit.id,
        "findings_generated": len(findings),
        "audit_summary": audit_res,
        "fairness_summary": fair_res
    }
