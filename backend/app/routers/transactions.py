from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class TransactionRequest(BaseModel):
    features: list[float]


class TransactionResponse(BaseModel):
    risk_score: float
    is_anomalous: bool


@router.post("/score", response_model=TransactionResponse)
def score_transaction(req: TransactionRequest):
    # TODO(Day 2-3): load trained model via app/ml/predict.py and score real features
    raise NotImplementedError("fraud model not trained yet")
