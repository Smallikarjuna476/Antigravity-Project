from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/forum", tags=["Module 13: Community Forum"])

class AuthorSchema(BaseModel):
    name: str
    avatar: str
    role: str
    verified: bool

class PostSchema(BaseModel):
    id: str
    title: str
    content: str
    author: AuthorSchema
    tags: List[str]
    upvotes: int
    replyCount: int
    timestamp: str
    hasImage: bool = False
    imageSrc: Optional[str] = None
    isResolved: bool = False

MOCK_DB_POSTS = [
    {
        "id": "p1",
        "title": "White patches appearing on my Kharif Tomato crop leaves, is this powdery mildew?",
        "content": "Started noticing these patches spreading rapidly across the lower canopy. Humidity has been hovering around 85% this week in Maharashtra. What is the immediate chemical control recommended?",
        "author": { "name": "Vishal Reddy", "avatar": "VR", "role": "Farmer", "verified": False },
        "tags": ["Pest Control", "Tomato"],
        "upvotes": 24,
        "replyCount": 5,
        "timestamp": "2 hours ago",
        "hasImage": True,
        "imageSrc": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800",
        "isResolved": True
    },
    {
        "id": "p2",
        "title": "PM-KISAN 15th installment delayed for my Aadhaar linkage, steps to resolve?",
        "content": "My status shows e-KYC pending but I have already completed it at the local CSC center last week. Does anyone know how long the portal takes to reflect the updated status?",
        "author": { "name": "Sanjeev Kumar", "avatar": "SK", "role": "Farmer", "verified": False },
        "tags": ["Govt Schemes", "PM-KISAN"],
        "upvotes": 12,
        "replyCount": 3,
        "timestamp": "5 hours ago",
        "hasImage": False,
        "imageSrc": None,
        "isResolved": False
    },
    {
        "id": "p3",
        "title": "[Expert Advisory] Switch to Nano Urea to reduce input costs by 15%",
        "content": "IFFCO Nano Urea liquid has proven to provide 80% utilization efficiency compared to 30% for conventional granular Urea. Foliar application bypasses soil fixation. Feel free to ask deployment questions below.",
        "author": { "name": "Dr. Anita Desai", "avatar": "AD", "role": "Agronomist", "verified": True },
        "tags": ["Fertilizers", "Yield Optimization"],
        "upvotes": 156,
        "replyCount": 42,
        "timestamp": "1 day ago",
        "hasImage": False,
        "imageSrc": None,
        "isResolved": False
    }
]

@router.get("/posts", response_model=List[PostSchema])
async def get_forum_posts(
    category: str = Query("All", description="Category Filter"),
    search: str = Query("", description="Search term")
):
    """
    Fetch all community forum posts. Filters can be explicitly queried.
    """
    filtered = []
    for post in MOCK_DB_POSTS:
        match_cat = category == "All" or category in post["tags"]
        title = post["title"].lower()
        content = post["content"].lower()
        search_lower = search.lower()
        match_search = not search_lower or search_lower in title or search_lower in content
        
        if match_cat and match_search:
            filtered.append(post)
    return filtered
