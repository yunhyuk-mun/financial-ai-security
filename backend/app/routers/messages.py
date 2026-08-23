from fastapi import APIRouter
from pydantic import BaseModel

from app.llm.gemini_client import generate_json

router = APIRouter()

_SCHEMA = {
    "type": "object",
    "properties": {
        "risk_score": {"type": "number"},
        "is_likely_scam": {"type": "boolean"},
        "reasoning": {"type": "string"},
        "red_flags": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["risk_score", "is_likely_scam", "reasoning", "red_flags"],
}

_PROMPT = """당신은 한국 금융 소비자를 보호하는 AI 보안 비서입니다.
아래 메시지가 AI로 생성됐거나 사람이 작성한 금융 사기(피싱 문자, 투자 리딩방 홍보, 대출 사기 등)일 가능성을 분석하세요.

판단 기준 예시: 비정상적으로 높은 수익률 약속, 긴급성/공포 유발 문구, 출처 불분명한 링크·계좌 요구, 개인정보·인증번호 요구, 유명인/기관 사칭, 부자연스러운 어투나 반복 패턴(AI 생성 정황).

risk_score는 0.0(안전)~1.0(매우 위험) 사이 실수로, red_flags는 감지된 위험 신호를 한국어 짧은 문구 리스트로 반환하세요.

분석할 메시지:
---
{text}
---
"""


class MessageRequest(BaseModel):
    text: str


class MessageResponse(BaseModel):
    risk_score: float
    is_likely_scam: bool
    reasoning: str
    red_flags: list[str]


@router.post("/analyze", response_model=MessageResponse)
def analyze_message(req: MessageRequest):
    result = generate_json(_PROMPT.format(text=req.text), _SCHEMA)
    return MessageResponse(**result)
