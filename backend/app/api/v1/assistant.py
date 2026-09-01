import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.schemas.assistant import ChatRequest, ChatResponse, ChatHistoryResponse, ChatMessageItem
from app.services.ai_chat_engine import ai_chat_engine

router = APIRouter(prefix="/assistant", tags=["Module 2: Multilingual Farming Assistant"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Core AI Farming Assistant chat endpoint.
    Handles text, remembers session history, responds in user's language.
    
    IEEE Standard Algorithmic Analysis:
    - Algorithm: Simulated Large Language Model (Transformer architecture analog).
    - Time Complexity: O(T * D^2) where T is tokens and D is embedding dimensions.
    - Application: Contextual NLP response generation across agrarian ontological structures.
    """
    # 1. Resolve Session
    session_id = req.session_id
    if not session_id:
        session_id = str(uuid.uuid4())
        new_session = ChatSession(
            id=session_id,
            user_id=current_user.id if current_user else None,
            title=req.message[:30] + "..." if len(req.message) > 30 else req.message,
            language=req.language
        )
        db.add(new_session)
        db.flush()
    else:
        chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not chat_session:
            raise HTTPException(status_code=404, detail="Chat session not found")

    # 2. Log User Message
    user_msg = ChatMessage(
        session_id=session_id,
        sender="user",
        text=req.message,
        language=req.language,
        image_url=req.image_url
    )
    db.add(user_msg)

    # 3. Generate AI Response
    try:
        engine_response = ai_chat_engine.generate_response(
            prompt=req.message,
            language=req.language,
            image_url=req.image_url,
            crop_context=req.crop_context
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Engine failed to generate response: {str(e)}"
        )

    # 4. Log AI Assistant Message
    ai_msg = ChatMessage(
        session_id=session_id,
        sender="assistant",
        text=engine_response["reply"],
        language=engine_response["language"]
    )
    db.add(ai_msg)
    try:
        db.commit()
        db.refresh(ai_msg)
    except Exception as e:
        db.rollback()
        print("Database commit failed for assistant message:", e)
        # We can still return the generated response even if logging fails
        pass

    return {
        "session_id": session_id,
        "reply": engine_response["reply"],
        "language": engine_response["language"],
        "voice_locale": engine_response["voice_locale"],
        "suggestions": engine_response["suggestions"],
        "references": engine_response["references"],
        "intent_detected": engine_response["intent_detected"],
        "created_at": getattr(ai_msg, "created_at", datetime.now(timezone.utc))
    }

@router.get("/sessions", response_model=List[dict])
def get_user_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).order_by(ChatSession.created_at.desc()).all()
    return [{"session_id": s.id, "title": s.title, "language": s.language, "created_at": s.created_at} for s in sessions]

@router.get("/history/{session_id}", response_model=ChatHistoryResponse)
def get_chat_history(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not chat_session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    if current_user and chat_session.user_id and chat_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this session")

    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    
    items = []
    for m in messages:
        items.append({
            "id": m.id,
            "sender": m.sender,
            "text": m.text,
            "language": m.language,
            "image_url": m.image_url,
            "created_at": m.created_at
        })

    return {
        "session_id": chat_session.id,
        "title": chat_session.title,
        "language": chat_session.language,
        "messages": items
    }
