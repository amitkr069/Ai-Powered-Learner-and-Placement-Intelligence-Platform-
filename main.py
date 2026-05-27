# from fastapi import FastAPI
# from pydantic import BaseModel

# app = FastAPI(title="AI Placement Intelligence Service")

# class PredictionInput(BaseModel):
#     attendance: int
#     coding: int
#     communication: int

# @app.post("/predict")
# def predict_placement(data: PredictionInput):
#     # Dummy response matching the required output format
#     return {
#         "placement_probability": 87,
#         "status": "Placement Ready"
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)



from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib
import os

app = FastAPI(title="AI Powered Learner Analytics Service")

# Dynamic Configuration
CONFIG = {"mode": "ML"}

# class PredictionInput(BaseModel):
#     attendance: int
#     coding: int
#     communication: int

class PredictionInput(BaseModel):
    attendance: Optional[int] = 0
    codingScore: Optional[int] = 0
    communicationScore: Optional[int] = 0
    aptitudeScore: Optional[int] = 0

# --- ETL PROCESS ---
@app.post("/etl/process")
def process_etl():
    scores = pd.read_csv('data/learner_scores.csv')
    att = pd.read_csv('data/attendance_data.csv')
    processed = pd.merge(scores, att, on='learner_id')
    processed.to_csv('data/processed_analytics.csv', index=False)
    return {"status": "Success", "message": "ETL Batch complete."}

# --- ANALYTICS APIS ---
@app.get("/analytics/top-learners")
def get_top():
    df = pd.read_csv('data/processed_analytics.csv')
    return {"data": df.nlargest(5, 'coding_score').to_dict(orient="records")}

@app.get("/analytics/batch-performance")
def get_batch():
    df = pd.read_csv('data/processed_analytics.csv')
    return {"data": df.groupby('batch')['coding_score'].mean().to_dict()}

# --- PREDICTION API ---
@app.post("/predict/{learnerId}")
def predict_placement(learnerId: int, data: PredictionInput):
    if CONFIG["mode"] == "RULE_BASED":
        # Rule-based logic (Updated to use new variable names)
        if data.attendance > 80 and data.codingScore > 70 and data.communicationScore > 70:
            return {"readinessScore": 90, "recommendation": "Placement Ready"}
        elif 60 <= data.attendance <= 80 and 50 <= data.codingScore <= 70 and 50 <= data.communicationScore <= 70:
            return {"readinessScore": 65, "recommendation": "Moderate"}
        else:
            return {"readinessScore": 30, "recommendation": "High Risk"}
 
    else:
        # ML-based logic
        model = joblib.load('models/placement_rf.pkl')
 
        # Updated to use new variable names
        features = [[data.codingScore, data.aptitudeScore, data.communicationScore]]
 
        probabilities = model.predict_proba(features)[0]
 
        ready_probability = int(probabilities[1] * 100)
        if ready_probability >= 70:
            status = "Placement Ready"
        elif ready_probability >= 50:
            status = "Moderate"
        else:
            status = "High Risk"
 
        # Updated return format to match Spring Boot DTO
        return {
            "readinessScore": ready_probability,
            "recommendation": status
        }

@app.get("/analytics/weak-learners")
def get_weak_learners():

    try:
        df = pd.read_csv('data/processed_analytics.csv')
        
        # Filter for learners with a coding score less than 50
        weak_df = df[df['coding_score'] < 50]
        
        # Sort them so the absolute lowest scores appear first
        weak_sorted = weak_df.sort_values(by='coding_score', ascending=True).head(10)
        
        return {"data": weak_sorted.to_dict(orient="records")}
    except FileNotFoundError:
        return {"error": "Processed data not found. Run /etl/process first."}

@app.get("/analytics/placement-trends")
def get_placement_trends():
    try:
        df = pd.read_csv('data/processed_analytics.csv')
        
        # Group by batch and calculate the mean for the core metrics
        trends = df.groupby('batch')[['coding_score', 'aptitude_score', 'communication_score']].mean()
        
        # Round the results to 2 decimal places for cleaner frontend rendering
        trends = trends.round(2)
        
        return {"data": trends.to_dict(orient="index")}
    except FileNotFoundError:
        return {"error": "Processed data not found. Run /etl/process first."}