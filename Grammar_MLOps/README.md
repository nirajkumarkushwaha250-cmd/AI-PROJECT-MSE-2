# KIET MLOps practical and viva

From the extracted Integrated folder, create and activate a Python 3.11 or 3.12 environment. Run the following commands.

    python -m pip install -r Grammar_MLOps/requirements.txt
    python Grammar_MLOps/workflow.py
    python server.py

Press Enter at the optional key prompt. Open http://127.0.0.1:8000 and try “She are ready.” with Check agreement. The local champion serves this button. Gemini handles corrections separately.

## Practical evidence

**A. Data validation.** The baseline trains on 32 authored sentences. The incoming batch combines 24 authored sentences and 12 examples made by applying the project's checker.js to six authored drafts. Inspect project_rules.csv for the six error/correction pairs. Run node Grammar_MLOps/project_examples.js to regenerate them. Label 1 means an agreement error. The pipeline checks columns, empty values, labels, duplicates, and overlap, and prints sizes and class counts.

**B. Monitor.** Load champion.joblib and predict on all 36 incoming records before training. Accuracy 0.528, precision 0.526, recall 0.556 and F1 0.541. See execution.txt.

**C. Retrain.** Clone the champion's count-vectorizer and logistic regression pipeline. Fit on 68 sentences and save the candidate in the dated runs folder. The workflow uses local tracking through dated artifacts and JSON.

**D. Quality gate.** Compare both models on 16 reserved sentences. Candidate F1 must strictly exceed champion F1. Champion F1 was 0.875 and candidate F1 was 0.933. The recorded decision was eligible for promotion. Candidate accuracy was 15/16. Both classifiers missed one error, but the candidate avoided the champion's false alarm. Open evaluation.json and predictions.csv to inspect the decision and per-sentence evidence.

**E. Viva.** Demonstrate the button, rerun the workflow, then show the evaluation and candidate file. F1 balances catching errors with avoiding incorrect flags. A separate holdout matters because the candidate has seen the incoming batch during training. A failed gate retains the champion. This small, template-based dataset measures English agreement detection only. Its scores cannot establish general correction or Hinglish quality. The trainable baseline was introduced for this assessment.
