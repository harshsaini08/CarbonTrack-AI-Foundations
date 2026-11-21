import pytest
from app.services.carbon_calculator import calculate_operational_emissions, DEFAULT_FACTORS
from app.services.proofchain import calculate_block_hash, GENESIS_HASH

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
    # Rail should produce significantly lower emissions than Road
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
