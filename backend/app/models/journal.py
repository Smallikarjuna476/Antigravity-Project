from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class JournalEntryDB(Base):
    __tablename__ = "journal_entries"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    cost = Column(Float, nullable=False, default=0.0)
    description = Column(String, nullable=False)
    date = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
