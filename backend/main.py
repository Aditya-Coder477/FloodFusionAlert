from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import redis
import json
import os
from datetime import datetime
from typing import List

from schemas import Alert, SignalInput, SignalOutput, HistoryRequest, PredictionRequest, PredictionResponse
from services.hydrology import calculate_hsi, determine_risk_category
from services.ml_service import ml_service

app = FastAPI(title="FloodFusionAlert Backend")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis Connection
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

r = None
try:
    # Try connecting to real Redis
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    r.ping()
    print("Connected to Redis successfully.")
except redis.ConnectionError:
    print("Warning: Real Redis connection failed. Falling back to FakeRedis (In-Memory).")
    try:
        from fakeredis import FakeRedis
        r = FakeRedis(decode_responses=True)
        print("Connected to FakeRedis successfully.")
    except ImportError:
        print("Error: FakeRedis not installed. History features via Redis will be disabled.")
        r = None

@app.get("/")
def health_check():
    return {"status": "ok", "service": "FloodFusionAlert Backend"}

@app.get("/api/alerts", response_model=List[Alert])
def get_alerts():
    """
    Get current active alerts.
    """
    # In a real scenario, fetch from DB/Redis. 
    # Mocking for initial setup.
    return [
        Alert(
            id="1",
            level="LOW",
            message="Water levels normal at Sangam.",
            timestamp=datetime.now(),
            location="Sangam, Prayagraj"
        )
    ]

@app.post("/api/signals", response_model=SignalOutput)
def process_signal(data: SignalInput):
    """
    Calculate HSI and risk based on raw sensor inputs.
    """
    hsi = calculate_hsi(data.rainfall_mm, data.soil_moisture_index, data.river_level_m)
    risk = determine_risk_category(hsi)
    
    output = SignalOutput(
        **data.model_dump(),
        hsi=hsi,
        risk_category=risk,
        timestamp=datetime.now()
    )
    
    # Store in Redis for history
    if r:
        try:
            r.lpush("signal_history", output.model_dump_json())
            r.ltrim("signal_history", 0, 999) # Keep last 1000 records
        except Exception as e:
            print(f"Failed to save to Redis: {e}")
            
    return output

@app.get("/api/history")
def get_history(limit: int = 50):
    """
    Fetch historical signal data from Redis.
    """
    if not r:
        raise HTTPException(status_code=503, detail="Redis unavailable")
        
    try:
        raw_history = r.lrange("signal_history", 0, limit - 1)
        history = [json.loads(item) for item in raw_history]
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict", response_model=PredictionResponse)
def predict_flood(data: PredictionRequest):
    """
    Run the ML model prediction.
    """
    if not ml_service.model:
        raise HTTPException(status_code=503, detail="ML Model not loaded")
        
    prediction = ml_service.predict(data.features)
    
    if prediction is None:
        raise HTTPException(status_code=500, detail="Prediction failed")
        
    return PredictionResponse(
        prediction=prediction,
        probability=prediction # Assuming binary classification prob for now
    )
