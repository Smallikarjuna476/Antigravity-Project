from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.journal import JournalEntryDB
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/journal", tags=["Smart Farm Journal"])

class JournalEntry(BaseModel):
    title: str
    category: str
    cost: float
    description: str
    date: str

class JournalEntryResponse(JournalEntry):
    id: str
    model_config = ConfigDict(from_attributes=True)

@router.get("/entries", response_model=List[JournalEntryResponse])
async def get_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns all journal entries in descending order by date.
    """
    entries = db.query(JournalEntryDB).filter(JournalEntryDB.user_id == current_user.id).order_by(JournalEntryDB.date.desc()).all()
    return entries

@router.post("/entries", response_model=JournalEntryResponse)
async def create_entry(entry: JournalEntry, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Creates a new journal entry.
    """
    db_entry = JournalEntryDB(**entry.dict(), user_id=current_user.id)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/entries/{entry_id}")
async def delete_entry(entry_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Delete a specific journal entry.
    """
    db_entry = db.query(JournalEntryDB).filter(JournalEntryDB.id == entry_id, JournalEntryDB.user_id == current_user.id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
        
    db.delete(db_entry)
    db.commit()
    return {"message": "Journal entry deleted successfully"}
