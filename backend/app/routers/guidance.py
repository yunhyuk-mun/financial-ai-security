from fastapi import APIRouter
from pydantic import BaseModel

from app.llm.gemini_client import generate_json

router = APIRouter()

_SCHEMA = {
    "type": "object",
    "properties": {
        "risk_level": {"type": "string", "enum": ["낮음", "중간", "높음"]},
        "steps": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["risk_level", "steps"],
}

_PROMPT = """당신은 한국 금융 소비자를 위한 AI 보안 비서입니다.
아래 위험도 점수와 상황 설명을 바탕으로, 사용자가 지금 바로 취해야 할 구체적인 행동 요령을 3~5단계로 안내하세요.
위험도가 높으면 신고 절차(경찰청 112, 금융감독원 1332, 계좌 지급정지 요청 등 실제 한국 제도)를 포함하고,
위험도가 낮으면 예방 차원의 주의사항 위주로 안내하세요. 각 단계는 한 문장, 실행 가능한 형태로 작성하세요.

위험도 점수 (0.0~1.0): {risk_score}
상황 설명: {context}
"""


class GuidanceRequest(BaseModel):
    risk_score: float
    context: str


class GuidanceResponse(BaseModel):
    risk_level: str
    steps: list[str]


@router.post("/", response_model=GuidanceResponse)
def get_guidance(req: GuidanceRequest):
    result = generate_json(
        _PROMPT.format(risk_score=req.risk_score, context=req.context), _SCHEMA
    )
    return GuidanceResponse(**result)
