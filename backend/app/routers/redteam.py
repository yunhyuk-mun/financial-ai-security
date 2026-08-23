import random

from fastapi import APIRouter
from pydantic import BaseModel

from app.llm.gemini_client import generate_json

router = APIRouter()

_SCHEMA = {
    "type": "object",
    "properties": {
        "sample_text": {"type": "string"},
        "attack_type": {"type": "string"},
    },
    "required": ["sample_text", "attack_type"],
}

_ATTACK_TYPES = [
    "투자 리딩방 홍보 (고수익 보장형)",
    "유명인 사칭 딥페이크 투자 권유",
    "금융기관 사칭 피싱 문자",
    "대출빙자형 사기 문자",
]

_PROMPT = """당신은 금융 보안 서비스의 탐지 모델을 검증하기 위한 레드팀입니다.
아래 공격 유형과 유사한 "가상의" 금융 사기 메시지 샘플을 하나 만드세요.
목적은 이 샘플을 방금 만든 블루팀 탐지 모델에 입력해서 실제로 잡아내는지 시연하는 것뿐이며,
실제 인물/기관/계좌 정보를 포함하지 말고, 명백히 허구임을 알 수 있는 가상의 이름을 사용하세요.

공격 유형: {attack_type}
"""


class RedteamGenerateResponse(BaseModel):
    sample_text: str
    attack_type: str


@router.post("/generate", response_model=RedteamGenerateResponse)
def generate_sample():
    attack_type = random.choice(_ATTACK_TYPES)
    result = generate_json(_PROMPT.format(attack_type=attack_type), _SCHEMA)
    return RedteamGenerateResponse(
        sample_text=result["sample_text"], attack_type=result.get("attack_type", attack_type)
    )
