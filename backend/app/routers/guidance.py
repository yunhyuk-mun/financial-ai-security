from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class GuidanceRequest(BaseModel):
    risk_score: float
    context: str


class GuidanceResponse(BaseModel):
    risk_level: str
    steps: list[str]


@router.post("/", response_model=GuidanceResponse)
def get_guidance(req: GuidanceRequest):
    # TODO(Day 4): call app/llm/gemini_client.py for tailored response steps by risk level
    raise NotImplementedError("gemini client not wired yet")
