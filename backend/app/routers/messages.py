from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class MessageRequest(BaseModel):
    text: str


class MessageResponse(BaseModel):
    risk_score: float
    is_likely_scam: bool
    reasoning: str


@router.post("/analyze", response_model=MessageResponse)
def analyze_message(req: MessageRequest):
    # TODO(Day 3): call app/llm/gemini_client.py for zero-shot scam classification
    raise NotImplementedError("gemini client not wired yet")
