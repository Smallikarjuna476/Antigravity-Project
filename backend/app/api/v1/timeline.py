from fastapi import APIRouter, Query
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter(prefix="/timeline", tags=["Crop Health Timeline"])

# Mock Database of Agronomic Timelines for common crops
TIMELINES = {
    "Paddy (Rice)": [
        {"day": 0, "title": "Seed Soaking & Nursery Bed", "status": "completed", "type": "planting", "description": "Pre-germinate seeds in water for 24h. Sow on prepared seedling beds."},
        {"day": 21, "title": "Transplanting", "status": "active", "type": "operation", "description": "Transplant 21-day old seedlings at 2-3 cm depth with 20x15cm spacing. Apply basal NPK."},
        {"day": 35, "title": "Active Tillering (Vegetative Stage)", "status": "upcoming", "type": "fertilizer", "description": "Critical period. Apply first top dressing of Nitrogen. Maintain 3-5 cm water level."},
        {"day": 50, "title": "Maximum Tillering", "status": "upcoming", "type": "maintenance", "description": "Panicle initiation prepares to begin. Spray Zinc if deficiency is observed."},
        {"day": 65, "title": "Panicle Initiation (PI)", "status": "upcoming", "type": "milestone", "description": "Microscopic panicle forms. Highest water sensitivity stage. Apply final Nitrogen split."},
        {"day": 80, "title": "Booting Stage", "status": "upcoming", "type": "health", "description": "Sheath swelling. Protect from Leaf Folder and Stem Borer using recommended pesticides."},
        {"day": 90, "title": "Heading & Flowering", "status": "upcoming", "type": "milestone", "description": "Avoid spraying. Protect from extreme heat. Pollination occurs."},
        {"day": 105, "title": "Dough Stage", "status": "upcoming", "type": "milestone", "description": "Grain transitions from milky to doughy texture. Begin draining water slowly."},
        {"day": 120, "title": "Physiological Maturity / Harvest", "status": "upcoming", "type": "harvest", "description": "Harvest when 80-85% grains turn golden-yellow and moisture is ~20%."}
    ],
    "Cotton": [
        {"day": 0, "title": "Sowing (Deep Ploughing)", "status": "completed", "type": "planting", "description": "Ensure soil is deeply ploughed and basal NPK applied."},
        {"day": 30, "title": "First Hoeing / Weeding", "status": "completed", "type": "maintenance", "description": "Weed removal and soil aeration."},
        {"day": 45, "title": "Square Formation", "status": "active", "type": "milestone", "description": "Critical stage for sucking pests. Monitor for Whitefly."},
        {"day": 60, "title": "First Top Dressing", "status": "upcoming", "type": "fertilizer", "description": "Apply first dose of Urea."},
        {"day": 90, "title": "Boll Formation", "status": "upcoming", "type": "milestone", "description": "Irrigation essential. Monitor for Pink Bollworm."},
        {"day": 140, "title": "First Picking", "status": "upcoming", "type": "harvest", "description": "Start manual picking of fully opened bolls."}
    ],
    "Wheat": [
        {"day": 0, "title": "Land Preparation & Sowing", "status": "completed", "type": "planting", "description": "Sowing with seed drill ensuring adequate moisture."},
        {"day": 21, "title": "CRI Stage (Crown Root Initiation)", "status": "active", "type": "milestone", "description": "Most critical stage for first irrigation. Apply first split of Urea."},
        {"day": 40, "title": "Tillering Stage", "status": "upcoming", "type": "milestone", "description": "Apply weedicides if broad-leaved weeds are severe."},
        {"day": 65, "title": "Late Jointing / Booting", "status": "upcoming", "type": "operation", "description": "Second critical irrigation stage. Check for yellow rust."},
        {"day": 90, "title": "Flowering & Milk Stage", "status": "upcoming", "type": "milestone", "description": "Ensure moisture; avoid moisture stress to prevent grain shriveling."},
        {"day": 130, "title": "Harvesting", "status": "upcoming", "type": "harvest", "description": "Harvest when grains become hard and moisture is around 12%."}
    ],
    "Sugarcane": [
        {"day": 0, "title": "Planting (Setts)", "status": "completed", "type": "planting", "description": "Treat setts with fungicide. Plant in trenches."},
        {"day": 45, "title": "Germination Phase Complete", "status": "active", "type": "milestone", "description": "Apply early shoot borer treatments if symptoms visible."},
        {"day": 90, "title": "Tillering Phase", "status": "upcoming", "type": "operation", "description": "First earthing up and top dressing of Nitrogen."},
        {"day": 150, "title": "Grand Growth Phase Start", "status": "upcoming", "type": "milestone", "description": "Second earthing up. Peak water requirement phase."},
        {"day": 300, "title": "Ripening Phase", "status": "upcoming", "type": "milestone", "description": "Stop irrigation 15-20 days prior to harvest to aid sugar accumulation."},
        {"day": 360, "title": "Harvesting", "status": "upcoming", "type": "harvest", "description": "Cut stalks close to the ground level."}
    ]
}

@router.get("/events")
async def get_timeline_events(
    crop: str = Query("Paddy (Rice)"),
    start_date: str = Query(None, description="Start date of the crop cycle in YYYY-MM-DD format")
):
    """
    Returns a chronologically ordered list of agronomic milestones and health check alerts for a crop. 
    """
    if crop not in TIMELINES:
        crop = "Paddy (Rice)"
        
    events = TIMELINES.get(crop, [])
    
    if start_date:
        try:
            base_date = datetime.strptime(start_date, "%Y-%m-%d")
        except ValueError:
            base_date = datetime.now() - timedelta(days=20)
    else:
        base_date = datetime.now() - timedelta(days=20) 
        
    formatted_events = []
    
    current_time = datetime.now()
    
    for evt in events:
        target_date = base_date + timedelta(days=evt["day"])
        
        # Calculate status based on actual current date
        if target_date.date() < current_time.date():
            status = "completed"
        elif target_date.date() == current_time.date() or (target_date < current_time + timedelta(days=5) and target_date.date() >= current_time.date()):
            status = "active"
        else:
            status = "upcoming"
            
        formatted_events.append({
            "id": f"evt_{evt['day']}",
            "day_offset": evt["day"],
            "date": target_date.strftime("%b %d, %Y"),
            "title": evt["title"],
            "status": status,
            "type": evt["type"],
            "description": evt["description"]
        })
        
    return {
        "crop": crop,
        "sowing_date": base_date.strftime("%b %d, %Y"),
        "events": formatted_events
    }
