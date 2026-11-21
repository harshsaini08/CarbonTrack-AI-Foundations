from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import SimulationScenario, Supplier
from app.schemas import SimulationRequest, SimulationResponse, SaveSimulationRequest
from app.services.simulator import run_what_if_simulation

router = APIRouter(prefix="/simulator", tags=["Carbon Twin Simulator"])

@router.post("/run", response_model=SimulationResponse)
def execute_simulation(
    req: SimulationRequest,
    db: Session = Depends(get_db)
):
    """Executes what-if decarbonization simulation."""
    try:
        res = run_what_if_simulation(
            db=db,
            supplier_id=req.supplier_id,
            target_transport_mode=req.target_transport_mode,
            transport_distance_change_pct=req.transport_distance_change_pct or 0.0,
            renewable_energy_ratio=req.renewable_energy_ratio or 0.0,
            energy_efficiency_pct=req.energy_efficiency_pct or 0.0,
            fuel_reduction_pct=req.fuel_reduction_pct or 0.0,
            production_volume_change_pct=req.production_volume_change_pct or 0.0
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/save")
def save_scenario(
    req: SaveSimulationRequest,
    db: Session = Depends(get_db)
):
    """Saves a configured simulation scenario for comparison."""
    scenario = SimulationScenario(
        name=req.name,
        description=req.description,
        supplier_id=req.supplier_id,
        target_transport_mode=req.simulation_params.get("target_transport_mode"),
        renewable_energy_ratio=req.simulation_params.get("renewable_energy_ratio", 0.0),
        baseline_emissions=req.simulation_results.get("baseline_emissions", 0.0),
        simulated_emissions=req.simulation_results.get("simulated_emissions", 0.0),
        absolute_reduction=req.simulation_results.get("absolute_reduction", 0.0),
        percentage_reduction=req.simulation_results.get("percentage_reduction", 0.0),
        estimated_cost_impact_usd=req.simulation_results.get("estimated_cost_impact_usd", 0.0),
        recommendation_summary="; ".join(req.simulation_results.get("recommendations", []))
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return {"status": "saved", "scenario_id": scenario.id}

@router.get("/saved")
def get_saved_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(SimulationScenario).order_by(SimulationScenario.id.desc()).all()
    results = []
    for s in scenarios:
        sup_name = "Enterprise Portfolio"
        if s.supplier_id:
            sup = db.query(Supplier).filter(Supplier.id == s.supplier_id).first()
            if sup:
                sup_name = sup.name
        results.append({
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "supplier_name": sup_name,
            "baseline_emissions": s.baseline_emissions,
            "simulated_emissions": s.simulated_emissions,
            "absolute_reduction": s.absolute_reduction,
            "percentage_reduction": s.percentage_reduction,
            "estimated_cost_impact_usd": s.estimated_cost_impact_usd,
            "created_at": s.created_at
        })
    return results

@router.delete("/saved/{scenario_id}")
def delete_saved_scenario(scenario_id: int, db: Session = Depends(get_db)):
    sc = db.query(SimulationScenario).filter(SimulationScenario.id == scenario_id).first()
    if not sc:
        raise HTTPException(status_code=404, detail="Scenario not found")
    db.delete(sc)
    db.commit()
    return {"status": "deleted"}
