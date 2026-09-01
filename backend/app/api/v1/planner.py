from fastapi import APIRouter, Query
from typing import List, Dict, Any
from datetime import datetime
import random

router = APIRouter(prefix="/planner", tags=["Smart Crop Planner"])

# Mock database of crops
CROP_DB = {
    "Kharif (Monsoon)": ["Paddy", "Maize", "Cotton", "Groundnut", "Tur (Arhar)"],
    "Rabi (Winter)": ["Wheat", "Gram (Chana)", "Mustard", "Barley", "Peas"],
    "Zaid (Summer)": ["Watermelon", "Cucumber", "Moong", "Sunflower", "Bitter Gourd"]
}

def generate_crop_timeline(crop: str):
    crop_lower = crop.lower()
    
    timelines = {
        "paddy": [
            {"month": 1, "phase": "Nursery & Puddling", "activity": "Prepare wet nursery. Puddle main field to reduce water percolation.", "status": "pending"},
            {"month": 2, "phase": "Transplanting", "activity": "Transplant 21-25 day old seedlings. Apply basal NPK (+Zinc).", "status": "pending"},
            {"month": 3, "phase": "Tillering", "activity": "Maintain 2-3 cm standing water. Top dress Urea.", "status": "pending"},
            {"month": 4, "phase": "Panicle Initiation", "activity": "Critical water stage. Spray for stem borer/leaf folder if needed.", "status": "pending"},
            {"month": 5, "phase": "Harvesting", "activity": "Drain water 15 days before harvest. Harvest at 20% moisture.", "status": "pending"}
        ],
        "wheat": [
            {"month": 1, "phase": "Seedbed Prep", "activity": "Pre-irrigation (Palewa). Sowing with seed drill at 5cm depth.", "status": "pending"},
            {"month": 2, "phase": "Crown Root Initiation", "activity": "First and most critical irrigation at 21 DAS. First Nitrogen split.", "status": "pending"},
            {"month": 3, "phase": "Tillering & Jointing", "activity": "Second irrigation. Spray broad-leaf herbicides.", "status": "pending"},
            {"month": 4, "phase": "Booting / Heading", "activity": "Prevent heat stress. Monitor for yellow rust.", "status": "pending"},
            {"month": 5, "phase": "Maturity", "activity": "Harvest when grains become hard and moisture is <12%.", "status": "pending"}
        ],
        "maize": [
            {"month": 1, "phase": "Sowing", "activity": "Sow on ridges. Apply 50% N, full P & K.", "status": "pending"},
            {"month": 2, "phase": "Knee-High Stage", "activity": "First top dressing of urea. Weed control operations.", "status": "pending"},
            {"month": 3, "phase": "Tasseling/Silking", "activity": "Crucial irrigation window. Monitor for Fall Armyworm.", "status": "pending"},
            {"month": 4, "phase": "Cob Development", "activity": "Final Nitrogen spray. Ensure moisture for grain filling.", "status": "pending"},
        ],
        "cotton": [
            {"month": 1, "phase": "Sowing", "activity": "Pre-emergence herbicide. Sowing at 90x60cm spacing.", "status": "pending"},
            {"month": 2, "phase": "Vegetative", "activity": "Thinning, gap filling. First fertilizer dose.", "status": "pending"},
            {"month": 3, "phase": "Squaring", "activity": "Monitor for sap-sucking pests (Aphids, Jassids).", "status": "pending"},
            {"month": 4, "phase": "Flowering", "activity": "Spray Potassium Nitrate (2%) to prevent square drop.", "status": "pending"},
            {"month": 5, "phase": "Boll Formation", "activity": "Heavy irrigation. Trap installation for Pink Bollworm.", "status": "pending"},
            {"month": 6, "phase": "Picking", "activity": "First picking of fully opened bolls.", "status": "pending"},
            {"month": 7, "phase": "Final Harvest", "activity": "Subsequent clean picking. Uproot stalks.", "status": "pending"}
        ],
        "groundnut": [
            {"month": 1, "phase": "Sowing", "activity": "Seed treatment with Rhizobium. Apply Gypsum to soil.", "status": "pending"},
            {"month": 2, "phase": "Flowering", "activity": "No intercultivation after this to prevent peg damage.", "status": "pending"},
            {"month": 3, "phase": "Pegging & Pod", "activity": "Ensure soil moisture to allow pegs to penetrate soil.", "status": "pending"},
            {"month": 4, "phase": "Harvesting", "activity": "Uproot when vines turn yellow and inner shell browns.", "status": "pending"}
        ],
        "tur": [
            {"month": 1, "phase": "Sowing", "activity": "Treat seeds with Trichoderma. Pre-emergent weedicide.", "status": "pending"},
            {"month": 2, "phase": "Early Growth", "activity": "Nipping/Topping of terminal buds to induce branching.", "status": "pending"},
            {"month": 4, "phase": "Flowering", "activity": "Critical irrigation. Monitor closely for Pod Borer.", "status": "pending"},
            {"month": 5, "phase": "Pod Development", "activity": "Spray 2% Urea or DAP for better seed formation.", "status": "pending"},
            {"month": 6, "phase": "Maturation", "activity": "Harvest when 80% pods turn brown.", "status": "pending"}
        ],
        "gram": [
            {"month": 1, "phase": "Sowing", "activity": "Deep sowing (8-10cm) preserves moisture.", "status": "pending"},
            {"month": 2, "phase": "Branching", "activity": "Nipping at 35 DAS to encourage lateral branches.", "status": "pending"},
            {"month": 3, "phase": "Flowering", "activity": "Irrigation strictly before flowering, not during.", "status": "pending"},
            {"month": 4, "phase": "Harvest", "activity": "Harvest when leaves fall off and pods sound dry.", "status": "pending"}
        ],
        "mustard": [
            {"month": 1, "phase": "Sowing", "activity": "Shallow sowing with adequate moisture. Apply Sulphur.", "status": "pending"},
            {"month": 2, "phase": "Thinning", "activity": "Maintain 15cm plant-to-plant spacing. First irrigation.", "status": "pending"},
            {"month": 3, "phase": "Flowering/Siliqua", "activity": "Second irrigation. Spray for Aphids if threshold crosses.", "status": "pending"},
            {"month": 4, "phase": "Harvesting", "activity": "Harvest early morning to prevent pod shattering.", "status": "pending"}
        ],
        "watermelon": [
            {"month": 1, "phase": "Planting", "activity": "Sow in pits or raised beds with plastic mulch.", "status": "pending"},
            {"month": 2, "phase": "Vining & Flowering", "activity": "Trim lateral vines. Introduce bees for pollination.", "status": "pending"},
            {"month": 3, "phase": "Fruit Maturation", "activity": "Reduce watering 1 week before harvest to boost sweetness.", "status": "pending"}
        ]
    }
    
    # Try dynamic matching first
    for key, timeline in timelines.items():
        if key in crop_lower:
            return timeline
            
    # Highly specific fallback based on season types if crop not matched
    if any(c in crop_lower for c in ["cucumber", "moong", "bitter gourd", "peas"]):
        return [
            {"month": 1, "phase": "Land Preparation & Sowing", "activity": f"Prepare ridges/furrows. Seed treatment and precise sowing of {crop}.", "status": "pending"},
            {"month": 2, "phase": "Vegetative & Flowering", "activity": "Frequent light irrigation. NPK application and staking/trailing if required.", "status": "pending"},
            {"month": 3, "phase": "Fruiting & Harvest", "activity": "Multiple pickings as fruits/pods reach marketable size.", "status": "pending"}
        ]

    # Universal Medium Duration Fallback
    return [
        {"month": 1, "phase": "Land Preparation", "activity": "Deep ploughing and application of FYM.", "status": "pending"},
        {"month": 2, "phase": "Sowing & Germination", "activity": f"Seed treatment and sowing of {crop} seeds at optimal depth.", "status": "pending"},
        {"month": 3, "phase": "Vegetative Growth", "activity": "Fertilizer top dressing and critical weed control.", "status": "pending"},
        {"month": 4, "phase": "Flowering / Grain Filling", "activity": "Pest monitoring and foliar spray of micronutrients.", "status": "pending"},
        {"month": 5, "phase": "Harvesting", "activity": "Harvesting when moisture content reaches optimal levels.", "status": "pending"}
    ]

@router.get("/recommendations")
async def get_crop_recommendations(
    state: str = Query("Karnataka"),
    season: str = Query("Kharif (Monsoon)")
):
    """
    Provides risk-adjusted crop recommendations based on season and region.
    """
    season_crops = CROP_DB.get(season, CROP_DB["Kharif (Monsoon)"])
    
    recommendations = []
    for crop in season_crops:
        risk_score = random.randint(10, 80)
        potential_profit = random.randint(30000, 90000)
        water_req = random.choice(["Low", "Moderate", "High"])
        
        recommendations.append({
            "id": f"crop-{crop.lower().replace(' ', '-')}",
            "name": crop,
            "suitability_score": random.randint(60, 98),
            "risk_level": "High" if risk_score > 60 else "Medium" if risk_score > 30 else "Low",
            "estimated_profit_per_acre": potential_profit,
            "water_requirement": water_req,
            "seed_varieties": [f"{crop} Hybrid-1", f"{crop} Pro-Max", f"Local Desi {crop}"],
            "timeline": generate_crop_timeline(crop)
        })
        
    # Sort by highest suitability
    recommendations.sort(key=lambda x: x["suitability_score"], reverse=True)
    
    return {
        "region": state,
        "season": season,
        "recommendations": recommendations
    }

@router.get("/benchmarks")
async def get_yield_benchmarks(crop: str = Query("Paddy")):
    """
    Returns historical yield benchmarks to compare against regional averages.
    """
    years = [2021, 2022, 2023, 2024, 2025]
    history = []
    
    base_yield = random.uniform(1.5, 4.0)
    for year in years:
        history.append({
            "year": year,
            "regional_avg_tons": round(base_yield + random.uniform(-0.3, 0.3), 2),
            "top_performer_tons": round(base_yield + random.uniform(0.5, 1.2), 2)
        })
        
    return {
        "crop": crop,
        "benchmarks": history,
        "fertilizer_demand_kg_per_acre": {
            "Nitrogen (N)": random.randint(40, 90),
            "Phosphorus (P)": random.randint(20, 60),
            "Potassium (K)": random.randint(20, 50)
        }
    }
