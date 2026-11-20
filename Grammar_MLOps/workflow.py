"""Train a demo baseline once, then monitor, retrain and compare models."""
import argparse
import csv
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.base import clone
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.pipeline import make_pipeline

ROOT = Path(__file__).resolve().parent
MODEL = ROOT / "champion.joblib"


def read_batch(name):
    data = pd.read_csv(ROOT / f"{name}.csv")
    required = {"sentence", "label"}
    if not required <= set(data):
        raise ValueError(f"{name}: expected sentence and label")
    keys = data.sentence.astype("string").str.strip().str.casefold()
    invalid = data[list(required)].isna().any(axis=1) | keys.eq("") | ~data.label.isin([0, 1])
    print(name, "rows", len(data), "invalid", invalid.sum(), "duplicates", keys.duplicated().sum(),
          "label counts", data.label.value_counts().to_dict())
    if invalid.any() or keys.duplicated().any():
        raise ValueError(f"Fix invalid or duplicate records in {name}")
    return data.assign(key=keys)


def scores(model, data):
    pred = model.predict(data.sentence)
    p, r, f, _ = precision_recall_fscore_support(data.label, pred, average="binary", zero_division=0)
    return dict(accuracy=accuracy_score(data.label, pred), precision=p, recall=r, f1=f)


def run(init):
    old, new, test = [read_batch(n) for n in ("original", "incoming", "holdout")]
    new = pd.concat([new, read_batch("project_rules")], ignore_index=True)
    if pd.concat([old, new, test]).key.duplicated().any():
        raise ValueError("Sentence overlap between datasets")
    if init and not MODEL.exists():
        base = make_pipeline(CountVectorizer(ngram_range=(1, 3)), LogisticRegression(random_state=42))
        joblib.dump(base.fit(old.sentence, old.label), MODEL)
    champion = joblib.load(MODEL)
    incoming = scores(champion, new)
    train = pd.concat([old, new])
    candidate = clone(champion).fit(train.sentence, train.label)
    out = ROOT / "runs" / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    out.mkdir(parents=True)
    joblib.dump(candidate, out / "candidate.joblib")
    before, after = scores(champion, test), scores(candidate, test)
    decision = "eligible for promotion" if after["f1"] > before["f1"] else "retain champion"
    report = dict(champion_sha256=hashlib.sha256(MODEL.read_bytes()).hexdigest(),
                  incoming_champion=incoming, holdout_champion=before, holdout_candidate=after,
                  rule="Strict improvement in error-class F1 on the same untouched holdout",
                  decision=decision)
    (out / "evaluation.json").write_text(json.dumps(report, indent=2))
    test.assign(champion_prediction=champion.predict(test.sentence),
                candidate_prediction=candidate.predict(test.sentence)).drop(columns="key").to_csv(
                    out / "predictions.csv", index=False)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--init-demo", action="store_true")
    run(parser.parse_args().init_demo)
