from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import joblib

app = FastAPI(title="AI Powered Learner Placement Prediction Service")

# -------------------------------------------------------------------
# NOTE: Analytics endpoints have been REMOVED from this service.
# Analytics (top learners, batch performance, weak learners) are now
# served directly from the Spring Boot backend using live DB data.
#
# This service is responsible ONLY for ML-based placement prediction.
# -------------------------------------------------------------------

class PredictionInput(BaseModel):
    attendance: Optional[int] = 0
    codingScore: Optional[int] = 0
    communicationScore: Optional[int] = 0
    aptitudeScore: Optional[int] = 0


# --- PREDICTION API ---
@app.post("/predict/{learnerId}")
def predict_placement(learnerId: int, data: PredictionInput):
    """
    Predict placement readiness for a learner using the trained ML model.
    Called by Spring Boot PredictionController.
    """
    try:
        model = joblib.load('models/placement_rf.pkl')

        features = [[data.codingScore, data.aptitudeScore, data.communicationScore]]
        probabilities = model.predict_proba(features)[0]
        ready_probability = int(probabilities[1] * 100)

        if ready_probability >= 70:
            status = "Placement Ready"
        elif ready_probability >= 50:
            status = "Moderate"
        else:
            status = "High Risk"

        return {
            "readinessScore": ready_probability,
            "recommendation": status
        }

    except FileNotFoundError:
        # Fallback rule-based logic if model not trained yet
        if data.attendance > 80 and data.codingScore > 70 and data.communicationScore > 70:
            return {"readinessScore": 90, "recommendation": "Placement Ready"}
        elif 60 <= data.attendance <= 80 and 50 <= data.codingScore <= 70:
            return {"readinessScore": 65, "recommendation": "Moderate"}
        else:
            return {"readinessScore": 30, "recommendation": "High Risk"}