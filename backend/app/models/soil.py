from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class SoilScanRecord(Base):
    __tablename__ = "soil_scans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    filename = Column(String, nullable=True)
    health_status = Column(String, nullable=False)
    
    ph = Column(Float)
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    ec = Column(Float)
    oc = Column(Float)
