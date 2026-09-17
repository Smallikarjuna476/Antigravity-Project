from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/twin", tags=["Module 12: Digital Twin"])

@router.get("/status")
async def get_twin_status() -> Dict[str, Any]:
    """
    Returns the real-time simulation metrics for a digital twin of plot A01.
    Includes moisture matrices, biomass growth curves, and polygon map bounds.
    """
    return {
        "farmPolygon": [
            [15.317, 75.713],
            [15.317, 75.716],
            [15.314, 75.715],
            [15.315, 75.712]
        ],
        "centerPoint": [15.3155, 75.714],
        "moistureData": [
            {"time": "00:00", "surface": 45, "rootZone": 62},
            {"time": "04:00", "surface": 42, "rootZone": 60},
            {"time": "08:00", "surface": 40, "rootZone": 58},
            {"time": "12:00", "surface": 32, "rootZone": 55},
            {"time": "16:00", "surface": 28, "rootZone": 52},
            {"time": "20:00", "surface": 30, "rootZone": 51},
        ],
        "biomassData": [
            {"day": 10, "biomass": 5, "expected": 6},
            {"day": 20, "biomass": 15, "expected": 16},
            {"day": 30, "biomass": 32, "expected": 35},
            {"day": 40, "biomass": 60, "expected": 58},
            {"day": 50, "biomass": 85, "expected": 82},
        ],
        "metrics": {
            "canopyCover": 68,
            "simulationDay": 42,
            "crop": "Tomato cv. Arka Rakshak"
        }
    }
