from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import CopilotQuery, CopilotResponse
from app.services.copilot import answer_copilot_query

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])

@router.post("/chat", response_model=CopilotResponse)
def chat_with_copilot(req: CopilotQuery, db: Session = Depends(get_db)):
    """Conversational intelligence answering sustainability questions using real application data."""
    res = answer_copilot_query(db, req.query)
    return res
