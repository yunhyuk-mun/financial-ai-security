# AI 금융보안 비서

2026 금융 AI Challenge 제출작. 상세 계획은 [plan](C:\Users\User\.claude\plans\buzzing-wibbling-wozniak.md) 참고.

## 구성
- `backend/` — FastAPI, 이상거래 탐지 모델 + Gemini 기반 텍스트 판별/레드팀 생성/대응 가이드
- `frontend/` — Next.js, 분석 화면 + 레드팀/블루팀 라이브 데모 패널
- `docs/` — 기획서, 기능명세서

## 로컬 실행
```bash
cd backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env  # GEMINI_API_KEY 채우기
uvicorn app.main:app --reload
```
