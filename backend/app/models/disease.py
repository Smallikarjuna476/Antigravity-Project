import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class DiseaseRecord(Base):
    __tablename__ = "disease_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    crop_name = Column(String, index=True, nullable=False)
    disease_name = Column(String, index=True, nullable=False)
    scientific_name = Column(String, nullable=True)
    category = Column(String, default="Fungal")  # Fungal, Bacterial, Viral, Nutrient Deficiency, Pest Damage
    severity_default = Column(String, default="Moderate")  # Mild, Moderate, Severe
    symptoms = Column(Text, nullable=False)
    cause = Column(Text, nullable=False)
    organic_treatment = Column(Text, nullable=False)
    chemical_treatment = Column(Text, nullable=False)
    prevention_tips = Column(Text, nullable=False)
    favorable_conditions = Column(String, nullable=True)
    sample_image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DiseaseDetectionLog(Base):
    __tablename__ = "disease_detection_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    crop_name = Column(String, nullable=False)
    disease_name = Column(String, nullable=False)
    scientific_name = Column(String, nullable=True)
    confidence = Column(Float, nullable=False)
    severity_level = Column(String, nullable=False)  # Mild, Moderate, Severe
    affected_area_pct = Column(Float, default=0.0)
    original_image_path = Column(String, nullable=False)
    heatmap_image_path = Column(String, nullable=False)
    report_path = Column(String, nullable=True)
    symptoms = Column(Text, nullable=True)
    organic_treatment = Column(Text, nullable=True)
    chemical_treatment = Column(Text, nullable=True)
    prevention_tips = Column(Text, nullable=True)
    expert_recommendation = Column(Text, nullable=True)
    stage = Column(String, default="Initial Detection")  # Initial Detection, In Treatment, Recovering, Resolved
    field_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    user = relationship("User", back_populates="disease_logs")

class ExpertContact(Base):
    __tablename__ = "expert_contacts"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    district = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    availability = Column(String, default="Mon - Sat (9:00 AM - 5:00 PM)")
