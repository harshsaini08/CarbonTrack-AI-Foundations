"""
Carbon Twin - What-If Scenario Simulation Engine
Simulates low-carbon transitions: freight modal shift, renewable energy adoption,
fuel efficiency optimization, and production routing.
Calculates emission reductions and estimated financial/operational ROI.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import OperationalRecord, Supplier, SimulationScenario
from app.services.carbon_calculator import get_emission_factors, calculate_operational_emissions

def run_what_if_simulation(
    db: Session,
    supplier_id: Optional[int] = None,
    target_transport_mode: Optional[str] = None,
    transport_distance_change_pct: float = 0.0,
    renewable_energy_ratio: float = 0.0,
    energy_efficiency_pct: float = 0.0,
    fuel_reduction_pct: float = 0.0,
    production_volume_change_pct: float = 0.0
) -> Dict[str, Any]:
    """
    Executes a what-if simulation against a specific supplier or enterprise portfolio average.
    """
    factors = get_emission_factors(db)

    # 1. Fetch baseline record(s)
    if supplier_id:
        record = (
            db.query(OperationalRecord)
            .filter(OperationalRecord.supplier_id == supplier_id)
            .order_by(OperationalRecord.id.desc())
            .first()
        )
        if not record:
            raise ValueError(f"No operational record found for supplier id {supplier_id}")
        
        prod_vol = record.production_volume
        elec_kwh = record.electricity_consumption
        fuel_liters = record.fuel_consumption
        distance_km = record.transportation_distance
        current_mode = record.transportation_mode
        material_tons = record.material_consumption
        waste_tons = record.waste_generated
        
        baseline_scope1 = record.calculated_scope1
        baseline_scope2 = record.calculated_scope2
        baseline_scope3 = record.calculated_scope3
        baseline_total = record.calculated_total_emissions
    else:
        # Portfolio aggregate
        all_records = db.query(OperationalRecord).all()
        if not all_records:
            return {"error": "No records in database to simulate"}
        
        prod_vol = sum(r.production_volume for r in all_records)
        elec_kwh = sum(r.electricity_consumption for r in all_records)
        fuel_liters = sum(r.fuel_consumption for r in all_records)
        distance_km = sum(r.transportation_distance for r in all_records) / max(1, len(all_records))
        current_mode = "Road"
        material_tons = sum(r.material_consumption for r in all_records)
        waste_tons = sum(r.waste_generated for r in all_records)
        
        baseline_scope1 = sum(r.calculated_scope1 for r in all_records)
        baseline_scope2 = sum(r.calculated_scope2 for r in all_records)
        baseline_scope3 = sum(r.calculated_scope3 for r in all_records)
        baseline_total = sum(r.calculated_total_emissions for r in all_records)

    # 2. Apply Simulation Adjustments
    sim_prod_vol = prod_vol * (1.0 + (production_volume_change_pct / 100.0))
    sim_fuel = fuel_liters * (1.0 - (fuel_reduction_pct / 100.0))
    
    # Energy efficiency + Renewable PPA / solar substitution
    sim_elec_base = elec_kwh * (1.0 - (energy_efficiency_pct / 100.0))
    # Renewable factor: residual grid emissions
    # Standard grid factor vs certified green power (0.015 kgCO2e/kWh lifecycle)
    grid_factor = factors.get("electricity", 0.385)
    renewable_fraction = max(0.0, min(1.0, renewable_energy_ratio / 100.0))
    effective_elec_factor = (grid_factor * (1.0 - renewable_fraction)) + (0.015 * renewable_fraction)
    
    sim_distance = distance_km * (1.0 + (transport_distance_change_pct / 100.0))
    sim_mode = target_transport_mode if target_transport_mode else current_mode

    # Calculate simulated Scope 1
    sim_scope1 = (sim_fuel * factors.get("fuel", 2.68)) / 1000.0
    
    # Calculate simulated Scope 2
    sim_scope2 = (sim_elec_base * effective_elec_factor) / 1000.0
    
    # Calculate simulated Scope 3 (transport modal shift + materials)
    sim_mode_key = f"transport_{sim_mode.capitalize()}"
    sim_trans_factor = factors.get(sim_mode_key, factors.get("transport_Road", 0.162))
    sim_effective_tonnage = max(1.0, material_tons if material_tons > 0 else (sim_prod_vol * 0.002))
    sim_trans_emissions = (sim_effective_tonnage * sim_distance * sim_trans_factor) / 1000.0
    
    sim_mat_emissions = (material_tons * factors.get("material", 1.45)) / 1000.0
    sim_waste_emissions = (waste_tons * factors.get("waste", 0.58)) / 1000.0
    sim_scope3 = sim_trans_emissions + sim_mat_emissions + sim_waste_emissions

    sim_total = sim_scope1 + sim_scope2 + sim_scope3
    abs_reduction = max(0.0, baseline_total - sim_total)
    pct_reduction = (abs_reduction / max(0.01, baseline_total)) * 100.0

    scope1_reduction = max(0.0, baseline_scope1 - sim_scope1)
    scope2_reduction = max(0.0, baseline_scope2 - sim_scope2)
    scope3_reduction = max(0.0, baseline_scope3 - sim_scope3)

    # Financial Cost / Savings estimation:
    # Fuel savings: $1.20 per liter saved
    # Electricity savings: $0.14 per kWh saved
    # Renewable tariff premium: +$0.012 per kWh on green fraction
    # Modal shift cost differential: Rail is typically 18% cheaper than road; Sea 45% cheaper than road; Air is 4x road.
    fuel_savings_usd = max(0.0, fuel_liters - sim_fuel) * 1.20
    elec_savings_usd = max(0.0, elec_kwh - sim_elec_base) * 0.14
    green_tariff_cost_usd = (sim_elec_base * renewable_fraction) * 0.012
    
    transport_cost_delta = 0.0
    if sim_mode != current_mode:
        if sim_mode == "Rail":
            transport_cost_delta = - (sim_distance * sim_effective_tonnage * 0.04) # net savings
        elif sim_mode == "Sea":
            transport_cost_delta = - (sim_distance * sim_effective_tonnage * 0.06) # larger savings
        elif sim_mode == "Air":
            transport_cost_delta = + (sim_distance * sim_effective_tonnage * 0.35) # expensive

    net_financial_impact_usd = -(fuel_savings_usd + elec_savings_usd - green_tariff_cost_usd - transport_cost_delta)
    # Negative impact = cost savings!

    # Recommendations synthesis
    recommendations = []
    if renewable_energy_ratio > 0:
        recommendations.append(f"Deploying {renewable_energy_ratio:.0f}% on-site solar/renewable PPA abates {scope2_reduction:.1f} tCO2e of Scope 2 emissions.")
    if sim_mode != current_mode:
        recommendations.append(f"Modal shift from {current_mode} to {sim_mode} eliminates {scope3_reduction:.1f} tCO2e from logistics footprint.")
    if fuel_reduction_pct > 0:
        recommendations.append(f"Process thermal optimization lowers diesel consumption by {fuel_reduction_pct:.0f}%, saving ${fuel_savings_usd:,.0f} annually.")
    if not recommendations:
        recommendations.append("Increase renewable energy ratio and select Rail/Multimodal freight to unlock high-impact decarbonization.")

    return {
        "baseline_emissions": round(baseline_total, 2),
        "simulated_emissions": round(sim_total, 2),
        "absolute_reduction": round(abs_reduction, 2),
        "percentage_reduction": round(pct_reduction, 1),
        "scope1_reduction": round(scope1_reduction, 2),
        "scope2_reduction": round(scope2_reduction, 2),
        "scope3_reduction": round(scope3_reduction, 2),
        "estimated_cost_impact_usd": round(net_financial_impact_usd, 2),
        "recommendations": recommendations,
        "breakdown_by_scope": {
            "baseline": {
                "scope1": round(baseline_scope1, 2),
                "scope2": round(baseline_scope2, 2),
                "scope3": round(baseline_scope3, 2),
                "total": round(baseline_total, 2)
            },
            "simulated": {
                "scope1": round(sim_scope1, 2),
                "scope2": round(sim_scope2, 2),
                "scope3": round(sim_scope3, 2),
                "total": round(sim_total, 2)
            }
        }
    }
