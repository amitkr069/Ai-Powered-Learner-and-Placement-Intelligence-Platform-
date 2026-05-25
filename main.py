from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Placement Intelligence Service")

class PredictionInput(BaseModel):
    attendance: int
    coding: int
    communication: int

@app.post("/predict")
def predict_placement(data: PredictionInput):
    # Dummy response matching the required output format
    return {
        "placement_probability": 87,
        "status": "Placement Ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)