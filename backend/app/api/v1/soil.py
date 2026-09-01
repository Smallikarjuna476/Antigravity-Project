from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.soil import SoilScanRecord
from app.models.user import User
from app.api.deps import get_current_user
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
import uuid

router = APIRouter(prefix="/soil", tags=["Soil & NPK Intelligence"])

@router.post("/scan")
async def scan_soil_report(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Simulated OCR endpoint to extract soil metrics from an uploaded report.
    """
    # Mock Indian Soil Profiles Dataset
    SOIL_PROFILES = [
        {"type": "Black Cotton Soil (Regur)", "ph": (7.2, 8.5), "N": (120, 180), "P": (20, 45), "K": (250, 400), "ec": (0.8, 2.5), "oc": (0.4, 0.8)},
        {"type": "Red Soil", "ph": (5.5, 6.8), "N": (100, 160), "P": (10, 30), "K": (100, 180), "ec": (0.1, 0.9), "oc": (0.2, 0.6)},
        {"type": "Alluvial Soil", "ph": (6.5, 7.5), "N": (150, 220), "P": (30, 60), "K": (150, 250), "ec": (0.4, 1.5), "oc": (0.5, 1.2)},
        {"type": "Laterite Soil", "ph": (4.5, 5.8), "N": (80, 120), "P": (5, 20), "K": (50, 120), "ec": (0.1, 0.5), "oc": (0.1, 0.4)}
    ]
    
    # Select a deterministic profile based on filename hash to feel like "real" OCR mapping
    # Fallback to random if no filename
    hash_val = sum(ord(c) for c in (file.filename or "unknown"))
    selected_profile = SOIL_PROFILES[hash_val % len(SOIL_PROFILES)]
    
    ph_value = round(random.uniform(*selected_profile["ph"]), 1)
    nitrogen = random.randint(*selected_profile["N"])
    phosphorus = random.randint(*selected_profile["P"])
    potassium = random.randint(*selected_profile["K"])
    ec_value = round(random.uniform(*selected_profile["ec"]), 2)
    oc_value = round(random.uniform(*selected_profile["oc"]), 2)

    # Determine soil health status
    status = "Optimal"
    if ph_value < 6.0 or ph_value > 7.5:
        status = "Requires Amendment"
    if nitrogen < 200 or phosphorus < 25 or potassium < 150:
        status = "Nutrient Deficient"

    record_id = str(uuid.uuid4())
    db_scan = SoilScanRecord(
        id=record_id,
        user_id=current_user.id,
        filename=file.filename,
        health_status=status,
        ph=ph_value,
        nitrogen=nitrogen,
        phosphorus=phosphorus,
        potassium=potassium,
        ec=ec_value,
        oc=oc_value
    )
    db.add(db_scan)
    db.commit()

    return {
        "scan_id": record_id,
        "filename": file.filename,
        "date_scanned": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "metrics": {
            "pH": ph_value,
            "EC_ds_m": ec_value,
            "OC_percentage": oc_value,
            "Nitrogen_kg_ha": nitrogen,
            "Phosphorus_kg_ha": phosphorus,
            "Potassium_kg_ha": potassium
        },
        "health_status": status,
        "recommendations": [
            "Apply 50kg/ha of Urea to boost Nitrogen." if nitrogen < 200 else "Nitrogen levels are optimal.",
            "Apply Gypsum to balance soil pH." if ph_value > 7.5 else "Add agricultural lime to raise pH." if ph_value < 6.0 else "pH is excellent.",
            "Incorporate green manure or compost." if oc_value < 0.5 else "Organic Carbon is well maintained."
        ]
    }

@router.get("/history")
async def get_soil_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Simulates historical tracking of soil degradation or improvement over the last 5 years.
    Retrieves from DB or seeds initial mock data.
    """
    scans = db.query(SoilScanRecord).filter(SoilScanRecord.user_id == current_user.id).order_by(SoilScanRecord.timestamp.asc()).all()
    
    if not scans:
        # Seed 5 years of fake history
        years = [datetime.now().year - i for i in reversed(range(5))]
        history_records = []
        n_base = 250; p_base = 35; k_base = 200; ph_base = 6.8; oc_base = 0.8
        for yr in years:
            n_base = n_base + random.randint(-20, 15)
            p_base = p_base + random.randint(-5, 5)
            k_base = k_base + random.randint(-15, 10)
            ph_base = round(ph_base + random.uniform(-0.2, 0.2), 1)
            oc_base = round(oc_base + random.uniform(-0.1, 0.05), 2)
            
            hr = SoilScanRecord(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                filename="historical_mock.pdf",
                health_status="Historical",
                ph=ph_base,
                nitrogen=max(100, n_base),
                phosphorus=max(10, p_base),
                potassium=max(80, k_base),
                ec=1.2,
                oc=max(0.1, oc_base)
            )
            # Override timestamp for historical realism
            hr.timestamp = datetime(yr, 1, 15)
            db.add(hr)
            history_records.append(hr)
        db.commit()
        scans = history_records
        
    history = []
    for scan in scans:
        history.append({
            "year": scan.timestamp.year,
            "Nitrogen": scan.nitrogen,
            "Phosphorus": scan.phosphorus,
            "Potassium": scan.potassium,
            "pH": scan.ph,
            "OrganicCarbon": scan.oc
        })

    return {"history": history}
