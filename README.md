# AI 금융보안 비서 — AI Red Team vs AI Blue Team

2026 금융 AI Challenge 제출작. 생성형 AI가 만든 금융사기(딥페이크 투자 리딩방, AI 생성 피싱 문자)를 AI로 탐지하는 웹서비스.

**Live demo**: https://financial-ai-security.vercel.app (백엔드가 무료 서버(Render)라 응답하지 않을 수 있다. 아래 '로컬 실행'으로 돌릴 수 있다.)
**기획서 / 기능명세서**: [`docs/기획서.md`](docs/기획서.md), [`docs/기능명세서.md`](docs/기능명세서.md)

## 핵심 아이디어

레드팀 AI가 최신 사기 트렌드를 반영한 가상 공격 샘플(딥페이크 투자 리딩방 스크립트, 피싱 문자)을 생성하고,
블루팀 AI가 이를 실시간으로 탐지한 뒤 위험도별 맞춤 대응 요령을 제공한다. `/demo` 페이지에서 이 대립 구조를
라이브로 확인할 수 있다.

## 검증된 성능

이상거래 탐지 모델(XGBoost + SMOTE, 학습 데이터에만 적용)을 held-out 테스트셋에서 평가:

| 지표 | 값 |
|---|---|
| Recall | 87.8% |
| Precision | 74.8% |
| F1 | 0.81 |
| ROC-AUC | 0.981 |

원본 값: [`backend/app/models/fraud_model_metrics.json`](backend/app/models/fraud_model_metrics.json)

## 구성

```
backend/   FastAPI — 이상거래 탐지(XGBoost) + Gemini 기반 텍스트 판별/레드팀 생성/대응 가이드
frontend/  Next.js — 메시지 분석 화면, 이상거래 탐지 체험, 레드팀 vs 블루팀 라이브 데모
docs/      기획서, 기능명세서
```

## 로컬 실행

### 백엔드
```bash
cd backend
python -m venv .venv
.venv/Scripts/activate       # Windows. macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # GEMINI_API_KEY 채우기 (aistudio.google.com/apikey, 무료)
python -m app.ml.train       # 모델이 없다면 학습 (data/creditcard.csv 필요, OpenML에서 자동 fetch 가능)
uvicorn app.main:app --reload
```

### 프론트엔드
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
```

## 배포

- 프론트엔드: Vercel (무료 티어)
- 백엔드: Render (무료 티어, [`backend/render.yaml`](backend/render.yaml) 블루프린트)
- LLM: Google Gemini API (`gemini-3.5-flash-lite`, 무료 티어)

전 구간 무료 티어로만 구성되어 있어 별도 비용이 들지 않는다.
