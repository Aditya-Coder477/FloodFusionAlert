# 🌊 FUSION FLOOD ALERT v2.0
## Part 4: TECH STACK & ARCHITECTURE

---

## **System Architecture Overview**

```
                    ┌─────────────────────────────┐
                    │    PREDICTION ENGINE        │
                    │   (4 AI Models Working      │
                    │    Together - see Part 2)   │
                    └──────────────┬──────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
            ▼                      ▼                      ▼
    ┌─────────────┐        ┌──────────────┐      ┌──────────────┐
    │  INPUT DATA │        │  PROCESSING  │      │   STORAGE    │
    ├─────────────┤        ├──────────────┤      ├──────────────┤
    │ • Weather   │        │ • Data clean │      │ • PostgreSQL │
    │ • Rivers    │        │ • Feature eng│      │ • Redis      │
    │ • Satellites│        │ • Model run  │      │ • Elasticsearch
    │ • Soil      │        │ • Alerting   │      │              │
    └─────────────┘        └──────────────┘      └──────────────┘
            │                      │                      │
            └──────────────────────┼──────────────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │   ALERT ENGINE               │
                    │ (Decision making + Delivery) │
                    └──────────────┬───────────────┘
                                   │
        ┌──────────────┬───────────┼───────────┬──────────────┐
        │              │           │           │              │
        ▼              ▼           ▼           ▼              ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐
    │  SMS    │  │WhatsApp │  │ Mobile  │  │ Govt API │  │ Logs   │
    │ (Twilio)│  │ (Twilio)│  │  Notify │  │ (JSON)   │  │ (ES)   │
    │         │  │         │  │(Firebase)  │         │  │        │
    └─────────┘  └─────────┘  └─────────┘  └──────────┘  └────────┘
        │              │           │           │              │
        └──────────────┴───────────┴───────────┴──────────────┘
                                   │
        ┌──────────────┬───────────┴─────────┬──────────────┐
        │              │                     │              │
        ▼              ▼                     ▼              ▼
    ┌─────────────────────────────────────────────────────────┐
    │          DASHBOARDS (3 Types)                           │
    ├─────────────────────────────────────────────────────────┤
    │ 1. Gov Command Center (React) - For officials          │
    │ 2. Technical Monitor (React) - For engineers           │
    │ 3. Satellite Map (Mapbox) - For rescue teams           │
    └─────────────────────────────────────────────────────────┘
```

---

## **Backend Architecture (Python)**

### **Main Components**

```python
PROJECT STRUCTURE:

fusion-flood-alert/
│
├── data_collection/
│   ├── weather_api.py          # IMD weather API client
│   ├── river_sensors.py        # River station data reader
│   ├── satellite_download.py   # Sentinel-1 imagery download
│   └── soil_moisture.py        # NASA SMAP data reader
│
├── preprocessing/
│   ├── data_cleaner.py         # Handle missing/bad data
│   ├── feature_engineering.py  # Create features for ML
│   └── normalization.py        # Scale data
│
├── models/
│   ├── lstm_model.py           # LSTM weather pattern recognition
│   ├── hsi_calculator.py       # Hydrological Stress Index (HSI)
│   ├── catboost_classifier.py  # CatBoost risk classification
│   └── satellite_processor.py  # Sentinel-1 water detection
│
├── ensemble/
│   ├── voting_system.py        # 4-signal voting logic
│   ├── confidence_calculator.py# Calculate confidence levels
│   └── alert_escalation.py     # WATCH → WARNING → SEVERE
│
├── alerts/
│   ├── alert_engine.py         # Decision making logic
│   ├── sms_sender.py           # Twilio SMS integration
│   ├── whatsapp_sender.py      # WhatsApp Business API
│   ├── firebase_push.py        # Mobile push notifications
│   └── api_forwarder.py        # Send to government C-FLOOD system
│
├── database/
│   ├── models.py               # SQLAlchemy ORM models
│   ├── connection.py           # PostgreSQL connection
│   └── migrations/             # Database schema versions
│
├── api/
│   ├── main.py                 # FastAPI app setup
│   ├── routes/
│   │   ├── alerts.py           # /api/alerts (current status)
│   │   ├── signals.py          # /api/signals (4 signals breakdown)
│   │   ├── map.py              # /api/map (satellite + flood extent)
│   │   └── history.py          # /api/history (past alerts)
│   └── middleware/             # Authentication, logging
│
├── scheduler/
│   ├── tasks.py                # Celery scheduled tasks
│   └── worker.py               # Background job processor
│
├── logs/
│   └── logger.py               # Centralized logging
│
└── config/
    ├── settings.py             # Configuration management
    └── secrets.py              # API keys (never in git!)
```

---

## **Technology Stack Detailed**

### **1. DATA COLLECTION LAYER**

```
WHAT IT DOES: Fetches data from external sources

COMPONENTS:

Weather API Client:
├─ Library: requests
├─ API: IMD (India Meteorological Department)
├─ Data: Rainfall, temperature, humidity, wind
├─ Frequency: Every 30 minutes
├─ Fallback: OpenWeather API (if IMD fails)
└─ Code example:
    def get_weather_data():
        response = requests.get('https://imdapi.in/data/rainfall')
        return response.json()

River Sensor Reader:
├─ Library: pandas + SQLAlchemy
├─ Source: USGS/NIH sensor stations (networked devices)
├─ Data: Water level, discharge (m³/s), flow velocity
├─ Frequency: Every hour
├─ Method: Direct TCP connection to sensor network
└─ Code example:
    def get_river_data():
        df = pd.read_sql('SELECT * FROM river_sensors', db_connection)
        return df

Satellite Data Download:
├─ Library: rasterio + geopandas
├─ Source: ESA Sentinel-1 SAR imagery (free)
├─ Data: Water extent maps (5m resolution)
├─ Frequency: Every 6-12 hours
├─ Method: Download via STAC (SpatioTemporal Asset Catalog)
└─ Code example:
    import rasterio
    import boto3
    
    def download_sentinel1():
        # Search Copernicus Open Data Hub
        # Download GeoTIFF file
        # Process water extent

Soil Moisture:
├─ Library: requests + xarray
├─ Source: NASA SMAP satellite
├─ Data: Soil saturation (%)
├─ Frequency: Every 3 days
└─ Method: Download HDF5 file from NSIDC
```

---

### **2. ML MODELS LAYER**

```
WHAT IT DOES: Run predictions using trained AI models

LSTM MODEL (TensorFlow/Keras):

Code Structure:
├─ Load pre-trained model: model.load_weights('lstm_v3.2.h5')
├─ Prepare input: Past 7-10 days of weather data
├─ Normalize: Scale features to 0-1 range
├─ Run prediction: output = model.predict(X)
├─ Get confidence: Extract from softmax layer
└─ Result: "Flood probability: 78% ± 5%"

HSI CALCULATOR (Pure Python):

Code:
def calculate_hsi(rainfall_3day, soil_saturation, 
                  discharge_rate, lag_hours):
    """
    Simple formula-based calculation (NO ML needed)
    """
    rainfall_stress = (rainfall_3day / normal_rainfall) * 100 * 0.40
    soil_stress = (soil_saturation / critical_saturation) * 100 * 0.25
    discharge_stress = (discharge_rate / normal_discharge) * 100 * 0.20
    lag_stress = (overlap_hours / total_lag) * 100 * 0.15
    
    hsi = rainfall_stress + soil_stress + discharge_stress + lag_stress
    return min(hsi, 100)  # Cap at 100

Result: HSI score 0-100 (no ML, pure physics!)

CatBoost MODEL:

Code:
from catboost import CatBoostClassifier
import pickle

# Load trained model
with open('catboost_v2.1.pkl', 'rb') as f:
    model = pickle.load(f)

# Prepare features
features = [lstm_confidence, hsi_score, 
            rainfall_anomaly, soil_saturation, ...]

# Predict
prediction = model.predict([features])
risk_class = ['NORMAL', 'WATCH', 'WARNING', 'SEVERE'][prediction[0]]
confidence = model.predict_proba([features])[0].max()

Result: "WARNING with 82% confidence"
Plus: Show feature importance (why WARNING?)

SATELLITE PROCESSOR:

Code:
import rasterio
from scipy import ndimage

def process_satellite_image(filepath):
    """
    Compare current water extent to baseline
    """
    with rasterio.open(filepath) as src:
        data = src.read(1)  # Read first band (intensity)
    
    # Threshold to identify water (SAR signal < -8 dB = water)
    water_mask = data < -8
    
    # Count water pixels
    current_water_area = np.sum(water_mask) * pixel_area_km2
    change_percent = (current_water_area - baseline_area) / baseline_area
    
    if change_percent > 5:  # 5% increase threshold
        alert = "Water area increasing - confirms flood signals"
    
    return current_water_area, change_percent, alert
```

---

### **3. ENSEMBLE & DECISION ENGINE**

```
WHAT IT DOES: Combines 4 signals, makes final decision

Code:

def ensemble_vote(lstm_confidence, lstm_class,
                  hsi_score,
                  catboost_confidence, catboost_class,
                  satellite_status):
    """
    Vote on final alert level
    """
    votes = []
    
    # LSTM vote
    if lstm_confidence > 70:
        votes.append('WARNING')
    elif lstm_confidence > 50:
        votes.append('WATCH')
    
    # HSI vote
    if hsi_score > 75:
        votes.append('SEVERE')
    elif hsi_score > 60:
        votes.append('WARNING')
    elif hsi_score > 45:
        votes.append('WATCH')
    
    # CatBoost vote
    votes.append(catboost_class)
    
    # Satellite vote (confirming consistency)
    if satellite_status == 'water_rising':
        votes.append('CONSISTENT')  # Not a class, just validation
    
    # Count votes
    vote_counts = Counter(votes)
    winner = vote_counts.most_common(1)[0][0]
    
    # Calculate final confidence
    agreement_count = vote_counts[winner]
    final_confidence = (agreement_count / 3) * 100
    
    # Escalation logic
    if agreement_count == 3:  # All agree
        confidence_multiplier = 1.0
    elif agreement_count == 2:  # 2 agree
        confidence_multiplier = 0.75
    else:  # 1 agrees
        confidence_multiplier = 0.50
    
    final_confidence *= confidence_multiplier
    
    return {
        'alert_level': winner,
        'confidence': final_confidence,
        'votes': vote_counts,
        'timestamp': datetime.now()
    }

Result:
{
    'alert_level': 'WARNING',
    'confidence': 82.5,
    'votes': {'WARNING': 3, 'SEVERE': 1},  # Satellite says consistent
    'timestamp': '2025-12-25T11:10:45Z'
}
```

---

### **4. ALERT ENGINE & NOTIFICATION**

```
WHAT IT DOES: Sends alerts via SMS, WhatsApp, Mobile app

Code:

def send_alert(alert_level, confidence, top_factors, timeline):
    """
    Execute multi-channel alert sending
    """
    # 1. Build message
    if alert_level == 'WARNING':
        message = f"""
FLOOD WARNING - Narmada Basin
Status: WARNING (Confidence: {confidence}%)
Expected: 48 ± 6 hours from now

Top Factors:
• Rainfall {top_factors[0]} above normal
• Soil saturation at {top_factors[1]}%
• {top_factors[2]} tributaries active

Action Timeline:
Hour 0-4: Alert officials
Hour 4-12: Pre-position supplies
Hour 12-24: Activate shelters
Hour 24-48: Begin evacuation

System: Fusion Flood Alert
Confidence: {confidence}% | ±6 hours uncertainty
        """
    
    # 2. Send SMS (to District Magistrate, SDRF, officials)
    sms_recipients = [
        '+91-XXXX-DM',           # District Magistrate
        '+91-XXXX-SDRF',         # SDRF Commander
        '+91-XXXX-Collector',    # Collector
    ]
    
    for number in sms_recipients:
        twilio_client.messages.create(
            to=number,
            from_=TWILIO_NUMBER,
            body=message
        )
    
    # 3. Send WhatsApp (group message)
    wa_client.send_group_message(
        group_id='government_officials_flood_alert',
        message=message,
        media=None  # Could attach map image
    )
    
    # 4. Mobile push notification
    firebase.send_notification(
        title='⚠️ FLOOD WARNING',
        message=f'Narmada: {alert_level} | 48±6 hours',
        data={
            'alert_level': alert_level,
            'confidence': confidence,
            'dashboard_url': 'https://app.fusionfloodalert.in/'
        },
        users=['all_officials']
    )
    
    # 5. Activate siren system (for high-risk areas)
    if alert_level == 'SEVERE':
        siren_controller.activate_sirens(
            zone=['low_lying_areas', 'rural_villages'],
            duration_minutes=5
        )
    
    # 6. Forward to government C-FLOOD system
    requests.post(
        'https://cflood.dwr.gov.in/api/external-alert',
        json={
            'source': 'Fusion Flood Alert',
            'alert_level': alert_level,
            'basin': 'Narmada',
            'confidence': confidence,
            'factors': top_factors,
            'timestamp': datetime.now().isoformat()
        },
        headers={'Authorization': f'Bearer {API_TOKEN}'}
    )
    
    # 7. Log decision
    log_entry = {
        'timestamp': datetime.now(),
        'alert_level': alert_level,
        'confidence': confidence,
        'channels_used': ['SMS', 'WhatsApp', 'Mobile', 'Siren', 'API'],
        'recipients_count': len(sms_recipients) + len(whatsapp_group),
        'status': 'sent'
    }
    
    elasticsearch.index(
        index='flood_alerts',
        document=log_entry
    )
    
    return log_entry
```

---

### **5. API LAYER (FastAPI)**

```
WHAT IT DOES: Provides REST endpoints for dashboards

Code:

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title="Fusion Flood Alert API")

# Enable CORS for dashboard frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://dashboard.fusionfloodalert.in"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ENDPOINT 1: Get current alert status
@app.get("/api/alerts/current")
async def get_current_alert():
    """
    Returns: Current alert level, confidence, top factors
    Used by: Gov Command Center dashboard
    """
    latest_alert = db.session.query(Alert)\
        .order_by(Alert.timestamp.desc())\
        .first()
    
    return {
        'alert_level': latest_alert.level,  # GREEN/YELLOW/ORANGE/RED
        'confidence': latest_alert.confidence,
        'hsi_score': latest_alert.hsi_score,
        'top_factors': latest_alert.top_factors,
        'timeline': latest_alert.expected_timing,
        'uncertainty': latest_alert.confidence_interval,
        'updated_at': latest_alert.timestamp,
        'next_update_in': '5 minutes'
    }

# ENDPOINT 2: Get all 4 signals breakdown
@app.get("/api/signals/breakdown")
async def get_signals_breakdown():
    """
    Returns: Each signal's confidence, status, calculation details
    Used by: Technical monitoring dashboard
    """
    lstm_signal = get_lstm_confidence()
    hsi_signal = get_hsi_calculation()
    catboost_signal = get_catboost_confidence()
    satellite_signal = get_satellite_status()
    
    return {
        'lstm': {
            'confidence': lstm_signal.confidence,
            'prediction': lstm_signal.class_name,
            'model_version': 'LSTM-v3.2',
            'last_update': lstm_signal.timestamp,
            'data_source': 'IMD API'
        },
        'hsi': {
            'score': hsi_signal.score,  # 0-100
            'rainfall_component': hsi_signal.rainfall,
            'soil_component': hsi_signal.soil,
            'discharge_component': hsi_signal.discharge,
            'lag_component': hsi_signal.lag,
            'last_update': hsi_signal.timestamp,
            'data_sources': ['IMD', 'River Sensors', 'NASA SMAP']
        },
        'catboost': {
            'confidence': catboost_signal.confidence,
            'prediction': catboost_signal.class_name,
            'top_factors': catboost_signal.feature_importance,
            'model_version': 'CatBoost-v2.1',
            'last_update': catboost_signal.timestamp
        },
        'satellite': {
            'water_area_km2': satellite_signal.water_area,
            'change_percent': satellite_signal.change_from_baseline,
            'status': satellite_signal.validation_status,
            'last_image': satellite_signal.image_timestamp,
            'next_image': satellite_signal.next_image_time
        },
        'ensemble': {
            'final_alert': get_ensemble_decision().level,
            'confidence': get_ensemble_decision().confidence,
            'votes': get_ensemble_decision().votes
        }
    }

# ENDPOINT 3: Get satellite map data
@app.get("/api/map/flood-extent")
async def get_flood_extent():
    """
    Returns: GeoJSON of current water extent + stranded populations
    Used by: Satellite map dashboard
    """
    # Get latest satellite-processed data
    flood_data = db.session.query(FloodExtent)\
        .order_by(FloodExtent.timestamp.desc())\
        .first()
    
    # Get stranded populations
    stranded = db.session.query(StrandedPopulation)\
        .filter(StrandedPopulation.evacuated == False)\
        .all()
    
    # Get rescue resources
    boats = db.session.query(RescueBoat).all()
    shelters = db.session.query(Shelter).all()
    
    return {
        'flood_extent_geojson': flood_data.to_geojson(),
        'stranded_populations': [
            {
                'id': p.id,
                'location': p.coordinates,  # [lat, lon]
                'population': p.population,
                'water_level_cm': p.current_water_level,
                'evacuation_urgency': p.urgency_level,  # LOW/MEDIUM/URGENT/CRITICAL
                'nearest_shelter': p.nearest_shelter_distance_km,
                'assigned_boat': p.assigned_rescue_boat_id or None
            }
            for p in stranded
        ],
        'rescue_boats': [
            {
                'id': b.id,
                'current_location': b.gps_location,
                'capacity': b.capacity,
                'status': b.status,  # READY/IN_TRANSIT/RETURNING
                'assigned_target': b.current_mission_target,
                'eta_minutes': b.eta_to_target
            }
            for b in boats
        ],
        'shelters': [
            {
                'id': s.id,
                'location': s.coordinates,
                'capacity': s.total_capacity,
                'occupied': s.current_occupancy,
                'available': s.total_capacity - s.current_occupancy
            }
            for s in shelters
        ]
    }

# ENDPOINT 4: Get alert history
@app.get("/api/history/alerts")
async def get_alert_history(days: int = 30):
    """
    Returns: Past alerts, how accurate were they, trends
    Used by: System monitoring, performance analysis
    """
    alerts = db.session.query(Alert)\
        .filter(Alert.timestamp >= datetime.now() - timedelta(days=days))\
        .order_by(Alert.timestamp.desc())\
        .all()
    
    return {
        'alerts': [
            {
                'timestamp': a.timestamp,
                'level': a.level,
                'confidence': a.confidence,
                'actual_flood_occurred': a.verified_against_reality,
                'accuracy': 'TRUE_POSITIVE' if a.verified_against_reality else 'FALSE_POSITIVE'
            }
            for a in alerts
        ],
        'statistics': {
            'total_alerts': len(alerts),
            'true_positives': sum(1 for a in alerts if a.verified_against_reality),
            'false_positives': sum(1 for a in alerts if not a.verified_against_reality),
            'false_alarm_rate': calculate_false_alarm_rate(alerts),
            'detection_rate': calculate_detection_rate(alerts)
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

### **6. DATABASE SCHEMA**

```sql
-- PostgreSQL + PostGIS

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    alert_level VARCHAR(20),        -- GREEN, YELLOW, ORANGE, RED
    confidence FLOAT,                -- 0-100%
    hsi_score FLOAT,                 -- 0-100
    top_factors JSONB,               -- {factor1, factor2, factor3}
    expected_timing VARCHAR(50),     -- "48±6 hours"
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE signals (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    signal_type VARCHAR(20),         -- LSTM, HSI, CATBOOST, SATELLITE
    confidence FLOAT,
    value JSONB,                     -- Signal-specific data
    data_quality VARCHAR(20)         -- GOOD, WARNING, ERROR
);

CREATE TABLE river_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    river_name VARCHAR(100),
    water_level_cm FLOAT,
    discharge_m3_per_s FLOAT,
    flow_velocity FLOAT,
    sensor_id VARCHAR(50)
);

CREATE TABLE flood_extent (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    geom GEOMETRY(POLYGON, 4326),    -- PostGIS geometry
    water_area_km2 FLOAT,
    change_percent FLOAT,
    satellite_image_id VARCHAR(100)
);

CREATE TABLE stranded_populations (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    location GEOMETRY(POINT, 4326),
    population INTEGER,
    water_level_cm FLOAT,
    urgency_level VARCHAR(20),       -- LOW, MEDIUM, URGENT, CRITICAL
    evacuated BOOLEAN,
    assigned_boat_id INTEGER REFERENCES rescue_boats(id)
);

CREATE TABLE rescue_boats (
    id SERIAL PRIMARY KEY,
    boat_name VARCHAR(100),
    gps_location GEOMETRY(POINT, 4326),
    capacity INTEGER,
    status VARCHAR(20),              -- READY, IN_TRANSIT, RETURNING
    current_mission_target VARCHAR(200),
    eta_minutes INTEGER
);

CREATE TABLE shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    location GEOMETRY(POINT, 4326),
    total_capacity INTEGER,
    current_occupancy INTEGER,
    medical_staff INTEGER,
    food_supplies_kg FLOAT
);

-- Create indexes for performance
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp);
CREATE INDEX idx_signals_timestamp ON signals(timestamp);
CREATE INDEX idx_flood_extent_geom ON flood_extent USING GIST(geom);
```

---

## **Frontend Stack**

### **Dashboard 1 & 2: React.js**

```javascript
// Project structure for both dashboards
src/
├── components/
│   ├── AlertStatus/       // Big alert display
│   ├── SignalBreakdown/   // 4 signals visualization
│   ├── ActionTimeline/    // What to do when
│   ├── RiverStressGauge/  // HSI visualization
│   └── SystemHealth/      // Data pipeline status
│
├── pages/
│   ├── CommandCenter.jsx  // Dashboard 1
│   └── TechnicalMonitor.jsx // Dashboard 2
│
├── api/
│   └── client.js          // API calls to backend
│
├── charts/
│   └── using Chart.js or D3.js for visualizations
│
└── styles/
    └── Using Tailwind CSS or Material-UI
```

### **Dashboard 3: Mapbox GL JS**

```javascript
// Satellite map dashboard
src/
├── components/
│   ├── SatelliteMap/      // Main map component
│   ├── StrandedPopupInfo/ // Click popup for stranded people
│   ├── RescueBoatTracker/ // Real-time boat tracking
│   ├── ShelterStatus/     // Shelter capacity display
│   └── ResourcePanel/     // Request more boats, supplies
│
├── api/
│   └── geoserver.js       // GeoJSON + tile server API
│
└── styles/
    └── Mapbox styling
```

---

## **Deployment Infrastructure**

### **Cloud Setup (AWS Recommended)**

```
┌─────────────────────────────────────────┐
│           AWS CLOUD SETUP               │
├─────────────────────────────────────────┤
│                                         │
│  EC2 Instances (Backend):               │
│  ├─ Primary: t3.xlarge (4 CPU, 16GB)   │
│  ├─ Secondary: t3.xlarge (auto-scaling)│
│  └─ Database: RDS PostgreSQL 14        │
│     └─ db.r6i.xlarge with Multi-AZ     │
│                                         │
│  Storage:                               │
│  ├─ S3 bucket: Satellite imagery store  │
│  ├─ EBS: Database volumes               │
│  └─ CloudFront: CDN for dashboards      │
│                                         │
│  Networking:                            │
│  ├─ VPC with public/private subnets     │
│  ├─ RDS in private subnet (secure)      │
│  ├─ NAT gateway for outbound traffic    │
│  ├─ Load balancer (ALB)                 │
│  └─ Route53 for DNS                     │
│                                         │
│  Monitoring:                            │
│  ├─ CloudWatch for logging              │
│  ├─ Auto-scaling policies               │
│  └─ SNS alerts for system issues        │
│                                         │
└─────────────────────────────────────────┘

Estimated Monthly Cost (AWS):
├─ EC2: ₹4,000-5,000/month
├─ RDS: ₹3,000-4,000/month
├─ Storage/Data transfer: ₹2,000-3,000/month
└─ Total: ₹10,000-15,000/month (₹1.2-1.8L/year)
```

---

## **Development Environment Setup**

```bash
# Clone repo
git clone https://github.com/yourname/fusion-flood-alert.git
cd fusion-flood-alert

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies (for dashboards)
cd frontend
npm install
cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys, database credentials

# Initialize database
python manage.py migrate

# Start backend server
python -m uvicorn api.main:app --reload

# Start frontend (in new terminal)
cd frontend
npm start

# Access dashboards:
# - Dashboard 1: http://localhost:3000/command-center
# - Dashboard 2: http://localhost:3000/technical-monitor
# - Dashboard 3: http://localhost:3000/rescue-map
```

---

## **Key Technologies Summary**

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend** | Python 3.10+ | Best ML libraries available |
| **ML Framework** | TensorFlow + CatBoost | Industry standard |
| **Data Processing** | Pandas + NumPy + Scikit-learn | Standard data science stack |
| **Database** | PostgreSQL + PostGIS | Geospatial data support |
| **Caching** | Redis | Fast real-time predictions |
| **Search/Logs** | Elasticsearch | Searchable alert history |
| **API** | FastAPI | Modern, fast, type-safe |
| **Frontend** | React.js | Reactive, component-based |
| **Maps** | Mapbox GL JS | Professional satellite mapping |
| **Charts** | Chart.js / D3.js | Data visualization |
| **Notifications** | Twilio + Firebase | Multi-channel alerts |
| **Deployment** | Docker + Kubernetes | Scalable containerization |
| **Cloud** | AWS | Enterprise-grade hosting |

---

## **Documents in This Series**

1. **01_problem_analysis.md** - Why problem exists
2. **02_solution_overview.md** - How solution works
3. **03_dashboards_guide.md** - Dashboards to build
4. ✅ **04_tech_stack_setup.md** - This file (technology architecture)
5. **05_implementation_guide.md** - Step-by-step building
6. **06_deployment_model.md** - Government deployment
7. **07_economics_roi.md** - Cost and returns
8. **08_interactive_dashboards.md** - Interactive prototypes

---

**Next:** Ready to start building? → Move to `05_implementation_guide.md`