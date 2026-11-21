import pytest
from app.services.carbon_calculator import calculate_operational_emissions, DEFAULT_FACTORS
from app.services.proofchain import calculate_block_hash, GENESIS_HASH
from app.database import Base, engine, SessionLocal
from app.seed_data import seed_database_demo_data
from app.services.simulator import run_what_if_simulation
from app.services.copilot import answer_copilot_query
from app.services.report_generator import generate_enterprise_audit_pdf, generate_supplier_audit_pdf
from app.models import Supplier, FairnessAssessment

def test_carbon_calculator_accuracy():
    # Test Scope 1: 10,000 liters diesel * 2.68 kg/L / 1000 = 26.8 tCO2e
    # Test Scope 2: 100,000 kWh * 0.385 kg/kWh / 1000 = 38.5 tCO2e
    # Test Scope 3: 1,000 km Road freight for 100 tons material = (100 * 1000 * 0.162)/1000 = 16.2 tCO2e
    res = calculate_operational_emissions(
        production_volume=50000,
        electricity_kwh=100000,
        fuel_liters=10000,
        transport_distance_km=1000,
        transport_mode="Road",
        material_tons=100,
        waste_tons=10,
        reported_emissions=200.0
    )
    assert res["calculated_scope1"] == 26.8
    assert res["calculated_scope2"] == 38.5
    assert res["calculated_total_emissions"] > 0
    assert res["emission_intensity"] > 0
    assert res["data_quality_score"] > 0

def test_proofchain_hash_integrity():
    payload_a = '{"finding": "test1"}'
    hash_a = calculate_block_hash(1, GENESIS_HASH, "2026-01-01T00:00:00", payload_a)
    assert len(hash_a) == 64
    
    # Tampering with payload alters the resulting hash
    tampered_payload = '{"finding": "tampered"}'
    tampered_hash = calculate_block_hash(1, GENESIS_HASH, "2026-01-01T00:00:00", tampered_payload)
    assert hash_a != tampered_hash

def test_transport_mode_factor_variations():
    road_calc = calculate_operational_emissions(
        production_volume=10000,
        electricity_kwh=1000,
        fuel_liters=100,
        transport_distance_km=2000,
        transport_mode="Road",
        material_tons=50
    )
    rail_calc = calculate_operational_emissions(
        production_volume=10000,
        electricity_kwh=1000,
        fuel_liters=100,
        transport_distance_km=2000,
        transport_mode="Rail",
        material_tons=50
    )
    assert rail_calc["calculated_scope3"] < road_calc["calculated_scope3"]

def test_database_seeding_and_fairness():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_res = seed_database_demo_data(db, reset_existing=True)
        assert seed_res["status"] == "success"
        assert seed_res["suppliers_seeded"] >= 30
        assert seed_res["findings_generated"] > 0
        
        # Verify S-103 (Global Silicon Wafer Foundry) has positive rank_delta
        s103 = db.query(Supplier).filter(Supplier.supplier_code == "S-103").first()
        assert s103 is not None
        fa = db.query(FairnessAssessment).filter(FairnessAssessment.supplier_id == s103.id).first()
        assert fa is not None
        assert fa.rank_delta > 0  # Jumped up in rank due to clean unit intensity
    finally:
        db.close()

def test_simulation_what_if_decarbonization():
    db = SessionLocal()
    try:
        sim = run_what_if_simulation(
            db=db,
            target_transport_mode="Rail",
            renewable_energy_ratio=50.0,
            energy_efficiency_pct=15.0
        )
        assert sim["percentage_reduction"] > 20.0
        assert sim["absolute_reduction"] > 0
        assert len(sim["recommendations"]) > 0
    finally:
        db.close()

def test_copilot_semantic_query_answering():
    db = SessionLocal()
    try:
        ans1 = answer_copilot_query(db, "Which supplier has the highest emission intensity?")
        assert "Highest Emission Intensity" in ans1["answer"]
        assert len(ans1["evidence_citations"]) > 0
        
        ans2 = answer_copilot_query(db, "Why was Supplier S-102 flagged?")
        assert "S-102" in ans2["answer"]
        
        ans3 = answer_copilot_query(db, "What is our total carbon footprint?")
        assert "Consolidated Enterprise Carbon Footprint" in ans3["answer"]
    finally:
        db.close()

def test_pdf_report_generation():
    db = SessionLocal()
    try:
        enterprise_pdf = generate_enterprise_audit_pdf(db, 1)
        assert len(enterprise_pdf) > 2000
        assert enterprise_pdf.startswith(b"%PDF")
        
        first_sup = db.query(Supplier).first()
        supplier_pdf = generate_supplier_audit_pdf(db, first_sup.id)
        assert len(supplier_pdf) > 1000
        assert supplier_pdf.startswith(b"%PDF")
    finally:
        db.close()
