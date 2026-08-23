from functools import lru_cache
from pathlib import Path

import joblib

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "fraud_model.pkl"


@lru_cache
def _load():
    if not MODEL_PATH.exists():
        raise RuntimeError("fraud model not trained yet — run `python -m app.ml.train`")
    bundle = joblib.load(MODEL_PATH)
    return bundle["model"], bundle["feature_names"]


def score(features: list[float]) -> tuple[float, bool]:
    model, feature_names = _load()
    if len(features) != len(feature_names):
        raise ValueError(f"expected {len(feature_names)} features, got {len(features)}")
    proba = model.predict_proba([features])[0][1]
    return float(proba), bool(proba >= 0.5)


def feature_names() -> list[str]:
    return _load()[1]
