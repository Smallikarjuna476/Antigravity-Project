import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="farmer", nullable=False)  # farmer, officer, researcher, admin
    phone = Column(String, nullable=True)
    state = Column(String, default="Karnataka")
    district = Column(String, default="Mysuru")
    farm_size_acres = Column(Float, default=2.5)
    primary_crops = Column(String, default="Tomato, Potato, Rice")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    disease_logs = relationship("DiseaseDetectionLog", back_populates="user", cascade="all, delete-orphan")
