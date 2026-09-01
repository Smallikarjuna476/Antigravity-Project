from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class TreatmentInfo(BaseModel):
    organic: str
    chemical: str
    preventive: str
    dosage_guide: Optional[str] = None
    application_interval: Optional[str] = None

class DiseaseDiagnosisResult(BaseModel):
    id: Optional[str] = None
    crop: str
    disease: str
    scientific_name: Optional[str] = None
    category: str
    confidence: float
    confidence_percentage: str
    severity: str
    affected_area_pct: float
    is_healthy: bool
    symptoms: str
    cause: str
    treatments: TreatmentInfo
    prevention_tips: str
    favorable_conditions: Optional[str] = None
    original_image_url: str
    heatmap_image_url: str
    report_download_url: Optional[str] = None
    nearby_experts_count: int = 0
    explainability: dict
    created_at: Optional[datetime] = None

class DiseaseHistoryItem(BaseModel):
    id: str
    crop_name: str
    disease_name: str
    confidence: float
    severity_level: str
    affected_area_pct: float
    original_image_url: str
    heatmap_image_url: str
    report_url: Optional[str] = None
    stage: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DiseaseRecordSchema(BaseModel):
    id: str
    crop_name: str
    disease_name: str
    scientific_name: Optional[str] = None
    category: str
    severity_default: str
    symptoms: str
    cause: str
    organic_treatment: str
    chemical_treatment: str
    prevention_tips: str
    favorable_conditions: Optional[str] = None
    sample_image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ExpertContactSchema(BaseModel):
    id: str
    name: str
    designation: str
    organization: str
    district: str
    state: str
    phone: str
    email: str
    specialization: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    availability: str

    model_config = ConfigDict(from_attributes=True)

class CompareRequest(BaseModel):
    log_id_before: str
    log_id_after: str

class CompareResponse(BaseModel):
    before_log: DiseaseHistoryItem
    after_log: DiseaseHistoryItem
    days_between: int
    lesion_reduction_pct: float
    healing_progress_score: float
    recovery_status: str  # Excellent Improvement, Moderate Recovery, Stagnant, Progression
    clinical_notes: str
