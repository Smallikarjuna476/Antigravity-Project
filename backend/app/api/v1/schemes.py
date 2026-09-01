from fastapi import APIRouter, Query, Depends
from typing import List, Dict, Any
import random
from sqlalchemy.orm import Session
from app.core.database import get_db
import random

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

# Database of Schemes
ALL_SCHEMES = [
    {
        "id": "pm-kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "scope": "National",
        "category": "Direct Income Support",
        "subsidy_amount": "₹6,000 / year",
        "eligibility": "Small and marginal farmers with cultivable landholding.",
        "documents_required": ["Aadhaar Card", "Bank Passbook", "Land Records (RTC/Pahani)"],
        "deadline": "Rolling",
        "portal_link": "https://pmkisan.gov.in/"
    },
    {
        "id": "pmfby",
        "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "scope": "National",
        "category": "Crop Insurance",
        "subsidy_amount": "Premium capped at 2% for Kharif, 1.5% for Rabi",
        "eligibility": "All farmers growing notified crops in notified areas.",
        "documents_required": ["Aadhaar Card", "Sowing Certificate", "Bank Account Details"],
        "deadline": "July 31 (Kharif) / Dec 31 (Rabi)",
        "portal_link": "https://pmfby.gov.in/"
    },
    {
        "id": "kcc",
        "name": "Kisan Credit Card (KCC)",
        "scope": "National",
        "category": "Credit / Loan",
        "subsidy_amount": "Up to ₹3,00,000 at 4% interest (with prompt repayment)",
        "eligibility": "All farmers (individuals/joint borrowers), tenant farmers, sharecroppers.",
        "documents_required": ["Aadhaar/PAN", "Land Documents", "Passport Size Photos"],
        "deadline": "Open Year Round",
        "portal_link": "https://www.myscheme.gov.in/schemes/kcc"
    },
    {
        "id": "krishi-bhagya",
        "name": "Krishi Bhagya Yojana",
        "scope": "Karnataka",
        "category": "Irrigation Support",
        "subsidy_amount": "80-90% subsidy for Krishi Hondas (Farm Ponds)",
        "eligibility": "Farmers in dry-land agricultural zones of Karnataka.",
        "documents_required": ["Aadhaar", "Caste Certificate (if applicable)", "RTC"],
        "deadline": "Subject to state budget allocation",
        "portal_link": "https://raitamitra.karnataka.gov.in/"
    },
    {
        "id": "rythu-bandhu",
        "name": "Rythu Bandhu",
        "scope": "Telangana",
        "category": "Direct Investment Support",
        "subsidy_amount": "₹10,000 / acre / year (₹5,000 per season)",
        "eligibility": "Land-owning farmers in Telangana.",
        "documents_required": ["Pattadar Passbook", "Aadhaar Card", "Bank Account Details"],
        "deadline": "Before start of Kharif/Rabi seasons",
        "portal_link": "http://rythubandhu.telangana.gov.in/"
    },
    {
        "id": "maha-sanman",
        "name": "Namo Shetkari Maha Sanman Nidhi",
        "scope": "Maharashtra",
        "category": "Direct Income Support",
        "subsidy_amount": "₹6,000 / year (in addition to PM-KISAN)",
        "eligibility": "Must be a beneficiary of PM-KISAN in Maharashtra.",
        "documents_required": ["PM-KISAN ID", "Aadhaar", "Mahabhulekh Land Records"],
        "deadline": "Rolling",
        "portal_link": "https://mahasanman.maharashtra.gov.in/"
    },
    {
        "id": "pmksy",
        "name": "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
        "scope": "National",
        "category": "Irrigation Support",
        "subsidy_amount": "55% for small/marginal farmers, 45% for others",
        "eligibility": "Farmers with agriculture land.",
        "documents_required": ["Aadhaar", "Land Ownership Proof", "Bank Details"],
        "deadline": "Open Year Round",
        "portal_link": "https://pmksy.gov.in/"
    },
    {
        "id": "kalia",
        "name": "KALIA Scheme",
        "scope": "Odisha",
        "category": "Direct Investment Support",
        "subsidy_amount": "₹10,000 / year for Cultivators, ₹12,500 for Landless",
        "eligibility": "Small, marginal, and landless agricultural households in Odisha.",
        "documents_required": ["Aadhaar", "Bhulekh Records", "Bank Passbook Front Page"],
        "deadline": "Rolling",
        "portal_link": "https://kalia.odisha.gov.in/"
    },
    {
        "id": "jagananna-vidya",
        "name": "YSR Rythu Bharosa",
        "scope": "Andhra Pradesh",
        "category": "Direct Income Support",
        "subsidy_amount": "₹13,500 / year (incl. PM-KISAN)",
        "eligibility": "Farmer families with cultivable land in AP.",
        "documents_required": ["Aadhaar", "Webland Records", "Bank Passbook"],
        "deadline": "Rolling",
        "portal_link": "https://ysrrythubharosa.ap.gov.in/"
    },
    {
        "id": "paramparagat-krishi",
        "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "scope": "National",
        "category": "Organic Farming",
        "subsidy_amount": "₹50,000 / hectare / 3 years",
        "eligibility": "Farmers adopting organic farming in clusters.",
        "documents_required": ["Aadhaar", "Cluster Membership", "Land Records"],
        "deadline": "Subject to central budget allocation",
        "portal_link": "https://pgsindia-ncof.gov.in/pkvy/"
    },
    {
        "id": "solar-pump",
        "name": "PM-KUSUM Scheme",
        "scope": "National",
        "category": "Solar Pumps / Energy",
        "subsidy_amount": "Up to 60% subsidy on Solar Pumps",
        "eligibility": "Individual farmers, groups, or cooperatives.",
        "documents_required": ["Aadhaar", "Land Ownership Document", "Water Source Proof"],
        "deadline": "Allocation based",
        "portal_link": "https://pmkusum.mnre.gov.in/"
    }
]

@router.get("/list")
async def get_schemes(state: str = Query("Karnataka"), db: Session = Depends(get_db)):
    """
    Returns a curated list of agricultural schemes applicable to the farmer's state + National schemes.
    """
    from app.models.scheme import SchemeDB
    import json
    
    db_schemes = db.query(SchemeDB).filter(
        (SchemeDB.scope == "National") | (SchemeDB.scope.ilike(state))
    ).all()
    
    applicable_schemes = []
    for s in db_schemes:
        applicable_schemes.append({
            "id": s.id,
            "name": s.name,
            "scope": s.scope,
            "category": s.category,
            "subsidy_amount": s.subsidy_amount,
            "eligibility": s.eligibility,
            "documents_required": json.loads(s.documents_required),
            "deadline": s.deadline,
            "portal_link": s.portal_link
        })
    
    return {
        "state": state,
        "total_schemes_found": len(applicable_schemes),
        "schemes": applicable_schemes
    }
