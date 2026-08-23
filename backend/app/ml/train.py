"""Trains the anomalous-transaction (fraud) detector.

Split BEFORE resampling, and only resample the training fold — SMOTE-ing
before the split would leak synthetic neighbors of test-set points into
training and inflate every metric below.
"""
import json
from pathlib import Path

import joblib
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.metrics import (
    average_precision_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "creditcard.csv"
MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "fraud_model.pkl"
METRICS_PATH = Path(__file__).resolve().parents[1] / "models" / "fraud_model_metrics.json"


def main():
    df = pd.read_csv(DATA_PATH)
    X = df.drop(columns=["Class"])
    y = df["Class"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    X_train_res, y_train_res = SMOTE(random_state=42).fit_resample(X_train, y_train)

    model = XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.1,
        eval_metric="aucpr",
        random_state=42,
    )
    model.fit(X_train_res, y_train_res)

    # Evaluate on the untouched, non-resampled test split.
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    report = classification_report(y_test, y_pred, output_dict=True)
    metrics = {
        "n_train": len(X_train),
        "n_train_after_smote": len(X_train_res),
        "n_test": len(X_test),
        "test_fraud_count": int(y_test.sum()),
        "precision_fraud": report["1"]["precision"],
        "recall_fraud": report["1"]["recall"],
        "f1_fraud": report["1"]["f1-score"],
        "roc_auc": roc_auc_score(y_test, y_proba),
        "avg_precision": average_precision_score(y_test, y_proba),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
    }

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "feature_names": list(X.columns)}, MODEL_PATH)
    METRICS_PATH.write_text(json.dumps(metrics, indent=2))

    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
