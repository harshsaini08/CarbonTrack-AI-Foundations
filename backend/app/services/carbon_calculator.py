"""
Carbon Intelligence Calculator
Standardized GHG Protocol Corporate Standard (Scopes 1, 2, and 3)
Calculates emissions using activity data and transparent emission factors.
"""

from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models import EmissionFactor

DEFAULT_FACTORS = {
    # Scope 1 - Direct Combustion
    "fuel_diesel": {"category": "Fuel", "subcategory": "Diesel", "value": 2.68, "unit": "kgCO2e/liter", "source": "EPA 2024 / DEFRA"},
    "fuel_natural_gas": {"category": "Fuel", "subcategory": "Natural Gas", "value": 2.03, "unit": "kgCO2e/m3", "source": "EPA 2024"},
    
    # Scope 2 - Electricity Grid
    "electricity_grid": {"category": "Electricity", "subcategory": "US Average Grid", "value": 0.385, "unit": "kgCO2e/kWh", "source": "EPA eGRID 2024"},
    
    # Scope 3 - Freight Transport (kgCO2e per ton-km)
    "transport_road": {"category": "Transport", "subcategory": "Heavy Freight Truck", "value": 0.162, "unit": "kgCO2e/ton-km", "source": "GLEC Framework / DEFRA"},
    "transport_rail": {"category": "Transport", "subcategory": "Electric / Diesel Rail", "value": 0.028, "unit": "kgCO2e/ton-km", "source": "GLEC Framework"},
    "transport_sea": {"category": "Transport", "subcategory": "Container Vessel", "value": 0.018, "unit": "kgCO2e/ton-km", "source": "IMO / GLEC"},
    "transport_air": {"category": "Transport", "subcategory": "Air Cargo Freight", "value": 0.602, "unit": "kgCO2e/ton-km", "source": "ICAO / DEFRA"},
    
    # Scope 3 - Materials & Waste
    "material_raw": {"category": "Material", "subcategory": "Industrial Raw Material", "value": 1.45, "unit": "kgCO2e/metric_ton", "source": "Ecoinvent 3.9"},
    "waste_disposal": {"category": "Waste", "subcategory": "Industrial Landfill & Treatment", "value": 0.58, "unit": "kgCO2e/metric_ton", "source": "EPA WARM"}
}

def get_emission_factors(db: Session = None) -> Dict[str, float]:
    """Retrieve active emission factors from database or fallback to standard constants."""
    factors = {
        "electricity": DEFAULT_FACTORS["electricity_grid"]["value"],
        "fuel": DEFAULT_FACTORS["fuel_diesel"]["value"],
        "transport_Road": DEFAULT_FACTORS["transport_road"]["value"],
        "transport_Rail": DEFAULT_FACTORS["transport_rail"]["value"],
        "transport_Sea": DEFAULT_FACTORS["transport_sea"]["value"],
        "transport_Air": DEFAULT_FACTORS["transport_air"]["value"],
        "material": DEFAULT_FACTORS["material_raw"]["value"],
        "waste": DEFAULT_FACTORS["waste_disposal"]["value"]
    }

    if db:
        try:
            db_factors = db.query(EmissionFactor).all()
            for ef in db_factors:
                if ef.category == "Electricity":
                    factors["electricity"] = ef.value
                elif ef.category == "Fuel":
                    factors["fuel"] = ef.value
                elif ef.category == "Transport":
                    if "rail" in ef.name.lower():
                        factors["transport_Rail"] = ef.value
                    elif "sea" in ef.name.lower():
                        factors["transport_Sea"] = ef.value
                    elif "air" in ef.name.lower():
                        factors["transport_Air"] = ef.value
                    else:
                        factors["transport_Road"] = ef.value
                elif ef.category == "Material":
                    factors["material"] = ef.value
                elif ef.category == "Waste":
                    factors["waste"] = ef.value
        except Exception:
            pass

    return factors

def calculate_operational_emissions(
    production_volume: float,
    electricity_kwh: float,
    fuel_liters: float,
    transport_distance_km: float,
    transport_mode: str,
    material_tons: float = 0.0,
    waste_tons: float = 0.0,
    reported_emissions: float = None,
    factors: Dict[str, float] = None
) -> Dict[str, Any]:
    """
    Transparent GHG Protocol calculation.
    Returns Scope 1, Scope 2, Scope 3, Total (in tCO2e), emission intensity,
    and data quality assessment score.
    """
    if factors is None:
        factors = get_emission_factors()

    # Scope 1: Fuel Combustion (liters * kgCO2e/liter / 1000)
    fuel_factor = factors.get("fuel", 2.68)
    scope1_tco2e = (fuel_liters * fuel_factor) / 1000.0

    # Scope 2: Purchased Electricity (kWh * kgCO2e/kWh / 1000)
    elec_factor = factors.get("electricity", 0.385)
    scope2_tco2e = (electricity_kwh * elec_factor) / 1000.0

    # Scope 3: Upstream Transportation + Materials + Waste
    mode_key = f"transport_{transport_mode.capitalize()}" if transport_mode else "transport_Road"
    transport_factor = factors.get(mode_key, factors.get("transport_Road", 0.162))
    
    # Ton-km estimate: assumed average shipment weight estimated from material or baseline 10% volume
    effective_tonnage = max(1.0, material_tons if material_tons > 0 else (production_volume * 0.002))
    transport_tco2e = (effective_tonnage * transport_distance_km * transport_factor) / 1000.0
    
    material_factor = factors.get("material", 1.45)
    material_tco2e = (material_tons * material_factor) / 1000.0
    
    waste_factor = factors.get("waste", 0.58)
    waste_tco2e = (waste_tons * waste_factor) / 1000.0

    scope3_tco2e = transport_tco2e + material_tco2e + waste_tco2e
    total_tco2e = scope1_tco2e + scope2_tco2e + scope3_tco2e

    # Emission Intensity: tCO2e per unit produced
    intensity = total_tco2e / max(1.0, production_volume)

    # Data Quality & Validation checks
    quality_score = 100.0
    anomalies = []

    if production_volume <= 0:
        quality_score -= 40.0
        anomalies.append("Zero or negative production volume")
    if electricity_kwh < 0 or fuel_liters < 0:
        quality_score -= 30.0
        anomalies.append("Negative energy consumption recorded")
    if transport_distance_km < 0:
        quality_score -= 15.0
        anomalies.append("Negative transport distance")
        
    # Check reported vs calculated discrepancy
    if reported_emissions is not None and reported_emissions > 0:
        diff_pct = abs(total_tco2e - reported_emissions) / max(0.1, reported_emissions)
        if diff_pct > 0.40:
            quality_score -= min(35.0, diff_pct * 40.0)
            anomalies.append(f"Reported emissions ({reported_emissions:.1f} tCO2e) deviate by {diff_pct*100:.1f}% from activity calculation")

    return {
        "calculated_scope1": round(scope1_tco2e, 3),
        "calculated_scope2": round(scope2_tco2e, 3),
        "calculated_scope3": round(scope3_tco2e, 3),
        "calculated_total_emissions": round(total_tco2e, 3),
        "emission_intensity": round(intensity, 6),
        "transport_emissions": round(transport_tco2e, 3),
        "material_emissions": round(material_tco2e, 3),
        "waste_emissions": round(waste_tco2e, 3),
        "data_quality_score": max(10.0, round(quality_score, 1)),
        "anomalies": anomalies,
        "calculation_methodology": {
            "formula": "Emissions = (Activity * Factor) / 1000",
            "factors_applied": {
                "electricity": f"{elec_factor} kgCO2e/kWh",
                "fuel": f"{fuel_factor} kgCO2e/liter",
                "transport_mode": f"{transport_mode} ({transport_factor} kgCO2e/ton-km)",
                "material": f"{material_factor} kgCO2e/ton",
                "waste": f"{waste_factor} kgCO2e/ton"
            }
        }
    }
