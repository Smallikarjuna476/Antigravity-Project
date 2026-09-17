from fastapi import APIRouter, Query
from typing import List, Dict, Any

router = APIRouter(prefix="/hub", tags=["Module 14: Knowledge Hub"])

LIBRARY_DATA = [
    {
        "id": "1",
        "title": "Integrated Pest Management (IPM) for Tomato Cultivation",
        "category": "Manual",
        "source": "ICAR Extension Division",
        "readTime": "12 min",
        "description": "Comprehensive guide covering biological, cultural, and chemical controls for Early Blight, Leaf Miner, and Fruit Borer.",
        "bookmarked": True,
        "featured": True,
        "link": "https://agritech.tnau.ac.in/expert_system/tomato/IPM.pdf"
    },
    {
        "id": "2",
        "title": "Semantic Vector Search using EfficientNet in Agriculture",
        "category": "Paper",
        "source": "Indian Journal of Agronomy",
        "readTime": "25 min",
        "description": "Deep learning methodology for spatial classification of necrotic lesions via Grad-CAM attribution.",
        "bookmarked": False,
        "featured": False,
        "link": "https://arxiv.org/pdf/1905.11946.pdf"
    },
    {
        "id": "3",
        "title": "Preparation of Jeevamrutha & Beejamrutha",
        "category": "Video",
        "source": "National Centre for Organic Farming",
        "readTime": "15 min watch",
        "description": "Step-by-step masterclass on fermenting microbial organic boosters using indigenous cow dung and urine.",
        "bookmarked": True,
        "featured": True,
        "link": "https://www.youtube.com/watch?v=FjI_i8hZ31c"
    },
    {
        "id": "4",
        "title": "PM-KISAN DBT Beneficiary Guidelines 2026",
        "category": "Policy",
        "source": "Ministry of Agriculture",
        "readTime": "8 min",
        "description": "Official gazette detailing e-KYC linkages required for direct benefit transfers in Kharif 2026.",
        "bookmarked": False,
        "featured": False,
        "link": "https://pmkisan.gov.in/Documents/Revised_Guidelines_PMKISAN_04112020.pdf"
    },
    {
        "id": "5",
        "title": "Drip Irrigation Maintenance & Acid Washing",
        "category": "Manual",
        "source": "State Horticulture Board",
        "readTime": "10 min",
        "description": "Standard operating procedures for declogging emitters and maintaining uniform water distribution.",
        "bookmarked": False,
        "featured": False,
        "link": "https://www.fao.org/3/t7202e/t7202e07.htm"
    }
]

@router.get("/articles")
async def get_articles(
    category: str = Query("All", description="Category Filter"),
    search: str = Query("", description="Search term")
) -> List[Dict[str, Any]]:
    """
    Fetch agricultural knowledge base articles, videos, and manuals.
    """
    filtered = []
    for item in LIBRARY_DATA:
        match_cat = category == "All" or category == item["category"]
        title_lower = item["title"].lower()
        desc_lower = item["description"].lower()
        search_lower = search.lower()
        match_search = not search_lower or search_lower in title_lower or search_lower in desc_lower
        
        if match_cat and match_search:
            filtered.append(item)
    return filtered
