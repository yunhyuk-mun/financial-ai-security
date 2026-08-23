from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import transactions, messages, redteam, guidance

app = FastAPI(title="AI 금융보안 비서 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
app.include_router(redteam.router, prefix="/api/redteam", tags=["redteam"])
app.include_router(guidance.router, prefix="/api/guidance", tags=["guidance"])


@app.get("/health")
def health():
    return {"status": "ok"}
