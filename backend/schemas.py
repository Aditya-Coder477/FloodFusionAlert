from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Alert(BaseModel):
    id: str
    level: str = Field(..., description="Alert level: LOW, MEDIUM, HIGH, CRITICAL")
    message: str
    timestamp: datetime
    location: Optional[str] = "Sangam, Prayagraj"

class SignalInput(BaseModel):
    rainfall_mm: float
    soil_moisture_index: float
    river_level_m: float

class SignalOutput(SignalInput):
    hsi: float = Field(..., description="Hydrological Stress Index (0-1)")
    risk_category: str
    timestamp: datetime

class HistoryRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 100

class PredictionRequest(BaseModel):
    features: List[float]

class PredictionResponse(BaseModel):
    prediction: float
    probability: Optional[float] = None
