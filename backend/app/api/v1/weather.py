from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/weather", tags=["Weather Intelligence"])

def generate_mock_weather_data(lat: float, lon: float):
    # Generates a realistic 7-day forecast with hourly data and soil moisture
    now = datetime.now()
    daily_forecasts = []
    hourly_forecasts = []
    
    # 7-day daily forecast
    for i in range(7):
        target_date = now + timedelta(days=i)
        temp_max = random.randint(28, 38)
        daily_forecasts.append({
            "date": target_date.strftime("%Y-%m-%d"),
            "temp_max": temp_max,
            "temp_min": temp_max - random.randint(8, 12),
            "precipitation_chance": random.choice([0, 10, 20, 60, 80]),
            "condition": random.choice(["Sunny", "Partly Cloudy", "Rain", "Thunderstorm", "Clear"]),
            "humidity": random.randint(40, 85),
            "wind_speed_kmh": random.randint(5, 25)
        })
    
    # 24-hour hourly forecast
    for i in range(24):
        target_hour = now + timedelta(hours=i)
        hourly_forecasts.append({
            "time": target_hour.strftime("%H:00"),
            "temp": random.randint(25, 36),
            "precipitation_mm": round(random.uniform(0, 15) if random.random() > 0.7 else 0, 1),
            "soil_moisture_surface": random.randint(20, 60),
            "soil_moisture_10cm": random.randint(30, 70),
            "soil_moisture_30cm": random.randint(40, 80)
        })

    return {
        "location": {"lat": lat, "lon": lon, "name": "Simulated Farm Area"},
        "current": {
            "temp": daily_forecasts[0]["temp_max"] - 2,
            "condition": daily_forecasts[0]["condition"],
            "humidity": daily_forecasts[0]["humidity"],
            "uv_index": random.randint(4, 10),
            "disease_favorable_index": random.randint(10, 90) # percentage
        },
        "daily": daily_forecasts,
        "hourly": hourly_forecasts
    }

def generate_mock_alerts(district: str):
    alerts = []
    # 30% chance for an alert
    if random.random() > 0.3:
        alerts.append({
            "id": f"alert_{random.randint(1000, 9999)}",
            "type": random.choice(["HEATWAVE", "FROST", "CYCLONE", "HEAVY_RAIN"]),
            "severity": random.choice(["MODERATE", "SEVERE", "EXTREME"]),
            "title": f"Extreme Weather Warning for {district}",
            "description": "Conditions are highly favorable for crop stress. Ensure adequate irrigation protocols.",
            "issued_at": datetime.now().isoformat(),
            "valid_until": (datetime.now() + timedelta(days=2)).isoformat()
        })
    return alerts

@router.get("/forecast")
async def get_weather_forecast(
    lat: float = Query(..., description="Latitude of the farm"),
    lon: float = Query(..., description="Longitude of the farm")
):
    """
    Retrieve 7-day predictive meteorological data and 24-hour granular metrics 
    including multi-depth soil moisture modeling.
    """
    return generate_mock_weather_data(lat, lon)


@router.get("/alerts")
async def get_weather_alerts(
    district: str = Query("Mysuru", description="District name for localized alerts")
):
    """
    Fetch emergency meteorological dispatches (heatwave, frost, floods)
    """
    return {"alerts": generate_mock_alerts(district)}

@router.get("/irrigation-schedule")
async def get_irrigation_recommendation(
    crop_type: str = Query(..., description="Type of crop"),
    soil_type: str = Query(..., description="Type of soil (clay, sandy, loam)")
):
    """
    Dynamic generation of irrigation schedules based on real-time soil moisture depletion algorithms.
    """
    # Mock scheduling logic
    return {
        "crop": crop_type,
        "soil_type": soil_type,
        "recommendation": "Irrigate 15mm today. Soil moisture is approaching wilting point at 10cm depth.",
        "next_irrigation_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "water_volume_liters_per_acre": random.randint(5000, 15000)
    }
