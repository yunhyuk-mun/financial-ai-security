import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ml import predict

router = APIRouter()

_EXAMPLES_PATH = Path(__file__).resolve().parents[1] / "ml" / "examples.json"
_EXAMPLES = json.loads(_EXAMPLES_PATH.read_text())


class TransactionRequest(BaseModel):
    features: list[float]


class TransactionResponse(BaseModel):
    risk_score: float
    is_anomalous: bool


class FeatureSchemaResponse(BaseModel):
    feature_names: list[str]


class ExampleTransaction(BaseModel):
    key: str
    label: str
    features: list[float]


@router.get("/schema", response_model=FeatureSchemaResponse)
def schema():
    return FeatureSchemaResponse(feature_names=predict.feature_names())


@router.get("/examples", response_model=list[ExampleTransaction])
def examples():
    return [
        ExampleTransaction(key=key, label=val["label"], features=val["features"])
        for key, val in _EXAMPLES.items()
    ]


@router.post("/score", response_model=TransactionResponse)
def score_transaction(req: TransactionRequest):
    try:
        risk_score, is_anomalous = predict.score(req.features)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return TransactionResponse(risk_score=risk_score, is_anomalous=is_anomalous)
