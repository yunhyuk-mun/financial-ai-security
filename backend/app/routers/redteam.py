from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class RedteamGenerateResponse(BaseModel):
    sample_text: str
    attack_type: str


@router.post("/generate", response_model=RedteamGenerateResponse)
def generate_sample():
    # TODO(Day 4): call app/llm/gemini_client.py to synthesize a demo attack sample
    # Internal/demo use only — feeds the live redteam-vs-blueteam panel, not a public generator.
    raise NotImplementedError("gemini client not wired yet")
