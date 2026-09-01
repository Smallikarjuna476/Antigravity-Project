from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    language: str = "en"  # en, kn, te, hi, ta, mr
    session_id: Optional[str] = None
    image_url: Optional[str] = None
    crop_context: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    reply: str
    language: str
    voice_locale: str
    suggestions: List[str]
    references: List[str]
    intent_detected: str
    created_at: datetime

class ChatMessageItem(BaseModel):
    id: str
    sender: str
    text: str
    language: str
    image_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ChatHistoryResponse(BaseModel):
    session_id: str
    title: str
    language: str
    messages: List[ChatMessageItem]

class ChatPresetQuery(BaseModel):
    id: str
    category: str
    language: str
    title: str
    prompt: str
