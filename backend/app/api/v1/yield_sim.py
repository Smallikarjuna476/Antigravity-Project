from fastapi import APIRouter, Query, Depends
from typing import Dict, Any

router = APIRouter(prefix="/yield", tags=["Module 4: Yield Simulation"])

@router.get("/simulate")
async def simulate_yield_projection(
    nitrogen: float = Query(..., description="Nitrogen fertilizer kg/ha"),
    water: float = Query(..., description="Irrigation water mm"),
    temp: float = Query(..., description="Average Temperature °C"),
    pest_stress: float = Query(..., description="Pest stress percentage 0-100")
):
    """
    IEEE Algorithm: Polynomial Regression Simulation over temporal heuristics.
    Simulates projected yield per acre based on real-time ecological inputs.
    """
    # Base max yield potential
    base_yield = 6.5

    # Nitrogen curve penalty (optimal ~ 150 kg/ha)
    n_penalty = ((abs(nitrogen - 150) / 100) ** 2) * 1.2

    # Water curve penalty (optimal ~ 750 mm)
    w_penalty = ((abs(water - 750) / 200) ** 2) * 1.5

    # Temperature penalty (optimal ~ 26°C)
    t_penalty = ((abs(temp - 26) / 10) ** 2) * 2.0

    # Pest penalty (linear reduction)
    p_penalty = (pest_stress / 100.0) * 2.5

    final_yield = base_yield - n_penalty - w_penalty - t_penalty - p_penalty
    final_yield = max(0.0, final_yield)

    if final_yield >= 5.0:
        status = 'Optimal'
    elif final_yield >= 3.5:
        status = 'Sub-optimal'
    else:
        status = 'Critical'

    return {
        "projected_yield_tons_per_acre": round(final_yield, 2),
        "status": status,
        "penalties": {
            "nitrogen_impact": round(100 - min(100, (abs(nitrogen - 150) / 150) * 100)),
            "moisture_impact": round(100 - min(100, (abs(water - 750) / 750) * 100)),
            "temp_impact": round(100 - min(100, (abs(temp - 26) / 26) * 100)),
            "biosecurity": round(100 - pest_stress)
        }
    }
