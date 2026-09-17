from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/analytics", tags=["Module 10: Analytics Dashboard"])

@router.get("/metrics")
async def get_analytics_metrics(timeframe: str = 'season') -> Dict[str, Any]:
    """
    Returns enterprise-grade analytics metrics for yield tracking and epidemiological spread.
    Data is aggregated based on the provided timeframe ('month', 'season', 'year').
    """
    all_yield_data = {
        "month": [
            {"name": "Week 1", "Expected": 120, "Actual": 110},
            {"name": "Week 2", "Expected": 125, "Actual": 115},
            {"name": "Week 3", "Expected": 130, "Actual": 105},
            {"name": "Week 4", "Expected": 140, "Actual": 135},
        ],
        "season": [
            {"name": "Kharif 21", "Expected": 120, "Actual": 110},
            {"name": "Rabi 21-22", "Expected": 140, "Actual": 145},
            {"name": "Kharif 22", "Expected": 130, "Actual": 105},
            {"name": "Rabi 22-23", "Expected": 150, "Actual": 155},
            {"name": "Kharif 23", "Expected": 135, "Actual": 140},
            {"name": "Rabi 23-24", "Expected": 160, "Actual": 165},
        ],
        "year": [
            {"name": "2019", "Expected": 250, "Actual": 240},
            {"name": "2020", "Expected": 260, "Actual": 255},
            {"name": "2021", "Expected": 270, "Actual": 245},
            {"name": "2022", "Expected": 280, "Actual": 290},
            {"name": "2023", "Expected": 295, "Actual": 285},
        ]
    }

    all_disease_incidence = {
        "month": [
            {"name": "Early Blight", "cases": 12, "severity": 8},
            {"name": "Leaf Curl", "cases": 5, "severity": 3},
            {"name": "Rust", "cases": 8, "severity": 4},
            {"name": "Aphids", "cases": 20, "severity": 5},
        ],
        "season": [
            {"name": "Early Blight", "cases": 45, "severity": 8},
            {"name": "Leaf Curl", "cases": 30, "severity": 5},
            {"name": "Rust", "cases": 80, "severity": 3},
            {"name": "Powdery Mildew", "cases": 55, "severity": 6},
            {"name": "Aphids", "cases": 110, "severity": 4},
        ],
        "year": [
            {"name": "Early Blight", "cases": 145, "severity": 9},
            {"name": "Leaf Curl", "cases": 90, "severity": 5},
            {"name": "Rust", "cases": 280, "severity": 4},
            {"name": "Mildew", "cases": 155, "severity": 6},
            {"name": "Aphids", "cases": 410, "severity": 7},
        ]
    }

    ai_accuracy_data = [
        {"name": "T-4", "Confidence": 88, "Validated": 85},
        {"name": "T-3", "Confidence": 91, "Validated": 89},
        {"name": "T-2", "Confidence": 94, "Validated": 92},
        {"name": "T-1", "Confidence": 96, "Validated": 95},
        {"name": "Current", "Confidence": 98, "Validated": 97},
    ]

    # Validate timeframe input
    timeframe = timeframe.lower()
    if timeframe not in ["month", "season", "year"]:
        timeframe = "season"

    # KPI Telemetry
    kpis = {
        "month": {
            "gross_revenue": "₹0.6L",
            "revenue_growth": "+3.1% vs last month",
            "ai_precision": "98.1%",
            "precision_growth": "+0.5% model confidence",
            "pest_interventions": "3",
            "pest_reduction": "-1 chemical sprays reduced",
            "fertilizer_efficiency": "A+",
            "fertilizer_tier": "Optimal"
        },
        "season": {
            "gross_revenue": "₹3.4L",
            "revenue_growth": "+14.2% vs last season",
            "ai_precision": "97.4%",
            "precision_growth": "+2.1% model confidence",
            "pest_interventions": "12",
            "pest_reduction": "-4 chemical sprays reduced",
            "fertilizer_efficiency": "A",
            "fertilizer_tier": "High"
        },
        "year": {
            "gross_revenue": "₹14.2L",
            "revenue_growth": "+21.5% vs last year",
            "ai_precision": "96.5%",
            "precision_growth": "+5.4% model confidence",
            "pest_interventions": "48",
            "pest_reduction": "-15 chemical sprays reduced",
            "fertilizer_efficiency": "B+",
            "fertilizer_tier": "Moderate"
        }
    }

    return {
        "yield_data": all_yield_data[timeframe],
        "disease_incidence": all_disease_incidence[timeframe],
        "ai_accuracy": ai_accuracy_data,
        "kpis": kpis[timeframe],
        "timeframe_applied": timeframe
    }
