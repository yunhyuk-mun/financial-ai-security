from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ml import predict

router = APIRouter()


class TransactionRequest(BaseModel):
    features: list[float]


class TransactionResponse(BaseModel):
    risk_score: float
    is_anomalous: bool


class FeatureSchemaResponse(BaseModel):
    feature_names: list[str]


@router.get("/schema", response_model=FeatureSchemaResponse)
def schema():
    return FeatureSchemaResponse(feature_names=predict.feature_names())


@router.post("/score", response_model=TransactionResponse)
def score_transaction(req: TransactionRequest):
    try:
        risk_score, is_anomalous = predict.score(req.features)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return TransactionResponse(risk_score=risk_score, is_anomalous=is_anomalous)
