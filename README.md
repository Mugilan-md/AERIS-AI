# AERIS AI — AI-Powered Urban Air Intelligence & Pollution Alert System

> *"See the Air. Predict the Risk. Act Before It Peaks."*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Design System](https://img.shields.io/badge/UI-Tactile_Claymorphism-FFE5A0.svg?style=flat)](#visual-design-system)

---

## 🌟 Overview

**AERIS AI** is an AI-powered environmental decision-support platform that transforms raw urban air quality and weather telemetry into real-time pollution intelligence, short-term predictions, spatial hotspot detection, and actionable location-based alerts.

Rather than acting as a static AQI dashboard, AERIS AI implements an end-to-end intelligence pipeline:

```
MONITOR ➔ UNDERSTAND ➔ DETECT ➔ PREDICT ➔ ALERT ➔ EXPLAIN ➔ RECOVER
```

---

## 🚀 Key Features

### 1. Deterministic Indian National AQI Engine (CPCB)
- Implements the official **Central Pollution Control Board (CPCB)** piecewise linear sub-index formula for criteria pollutants:
  - $\text{PM}_{2.5}$ (24-hour average)
  - $\text{PM}_{10}$ (24-hour average)
  - $\text{NO}_2$ (24-hour average)
  - $\text{CO}$ (8-hour average)
- Overall AQI calculated deterministically as $\max(I_{\text{PM2.5}}, I_{\text{PM10}}, I_{\text{NO2}}, I_{\text{CO}})$.
- Distinguishes deterministic AQI calculations from predictive machine learning forecasts.

### 2. Spatial Pollution Hotspot Detection Engine
- Calculates transparent composite hotspot scores ($0\text{–}100$) combining:
  - **$\text{PM}_{2.5}$ Intensity Factor** vs. national ambient threshold.
  - **Spatial Excess** relative to regional network average.
  - **Baseline Deviation** against 24-hour rolling station averages.
  - **Microclimate Wind Stagnation** penalty ($< 2.0\text{ m/s}$ inversion risk).
- Provides transparent factor decomposition: *"Why is this a hotspot?"*.

### 3. Statistical Anomaly Detection Engine
- Utilizes rolling statistical variance ($Z\text{-score} > 1.8\sigma$) and rate of change ($\Delta\% > 35\%$) to flag sudden localized surges (e.g. $+62.5\%$ $\text{PM}_{2.5}$ surge).
- Triggers instant diagnostic alerts when anomalous accumulation occurs.

### 4. Short-Term ML AQI & Pollutant Forecaster
- Powered by a trained **Scikit-Learn Random Forest Regressor** using lagged multi-pollutant inputs, cyclic temporal encoding ($\sin/\cos$), and boundary layer dispersion aerodynamics.
- Projects $+1\text{ hour}$, $+3\text{ hours}$, and $+6\text{ hours}$ horizons with confidence uncertainty bounds.
- **Genuine Test Evaluation Metrics:**
  - **MAE:** $\pm 4.38\ \mu\text{g/m}^3$
  - **RMSE:** $5.38\ \mu\text{g/m}^3$
  - **$R^2$ Score:** $0.892$

### 5. Smart Alert Engine
- Context-aware alert dispatching triggered by:
  1. AQI Threshold Exceedances (Poor, Very Poor, Severe)
  2. Rapid Pollution Spikes / Statistical Anomalies
  3. Spatial Hotspot Formations
  4. Near-Term Forecast Deterioration
  5. Atmospheric Stagnation & Microclimate Trapping
- Delivers practical, cautious, non-medical guidance.

### 6. Explainable AI (XAI)
- Dedicated *"Why is AQI Changing?"* and *"Why this Alert?"* experiences.
- Deconstructs physical factors into multi-stage causal chains with scientifically responsible terminology (*"associated with"*, *"correlated with"*, *"observed alongside"*).

### 7. Interactive Geospatial Map (Leaflet)
- Custom tactile pastel markers with color-coded AQI badges and pulsing hotspot rings.
- Dynamic wind heading compass vector overlay.
- Real-time station telemetry inspector.

### 8. Controlled Hackathon Demo Scenario
An interactive 8-step presentation stepper showcasing the complete lifecycle:
```
Baseline Monitoring (AQI 118)
    ↓
Concentration Rise (+25% PM2.5)
    ↓
Statistical Anomaly Triggered (+62.5% Spike)
    ↓
Hotspot Formation (>65 Score)
    ↓
Severe AQI Peak (AQI 350)
    ↓
ML Forecast Prolonged Inversion
    ↓
Multi-Trigger Smart Alert Dispatched
    ↓
Explainable AI Diagnosis
    ↓
Wind Influx Atmospheric Recovery (AQI drops to 69 - Good!)
```

---

## 🎨 Visual Design System: Tactile Claymorphism

AERIS AI features a **Tactile Claymorphism** aesthetic:
- **Background:** `#F0EBE5` (Warm off-white) with an ultra-subtle $2.5\%$ SVG fractal atmospheric grain.
- **Surfaces:** Pure `#FFFFFF` puffy cards with layered double-inset highlights and soft drop shadows:
  ```css
  box-shadow:
    inset 0 -4px 8px rgba(0, 0, 0, 0.05),
    inset 0 4px 8px rgba(255, 255, 255, 0.9),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.04);
  border-radius: 24px;
  border: none !important;
  ```
- **Zero Harsh Borders:** Spatial hierarchy built through depth, highlights, and contrast.
- **Pastel Status Palette:**
  - Good / Satisfactory: `#B8E6D5`
  - Moderate: `#FFE5A0`
  - Unhealthy / Poor: `#FFB3A0`
  - Hazardous / Severe: `#D4A5A5`
  - Data Blue & Purple: `#A8D5E2` & `#C9B8E8`
- **Typography:** Google Fonts *Nunito* and *Quicksand*.
- **Motion:** Spring hover lift (`translateY(-4px)` with `cubic-bezier(0.34, 1.56, 0.64, 1)`).

---

## 🛠️ Project Structure

```
AERIS-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── engine/
│   │   │   ├── aqi_engine.py       # CPCB Deterministic AQI calculation
│   │   │   ├── hotspot_engine.py   # Spatial hotspot composite scoring
│   │   │   ├── anomaly_engine.py   # Statistical rolling Z-score & rate-of-change
│   │   │   ├── forecast_engine.py  # Scikit-Learn Random Forest short-term forecaster
│   │   │   ├── alert_engine.py     # Multi-rule smart alert generator
│   │   │   ├── explain_engine.py   # Causal reasoning & XAI attribution trees
│   │   │   └── data_provider.py    # Multi-station data stream & demo scenario
│   │   └── main.py                 # FastAPI application router
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Navigation tabs, station picker & demo trigger
│   │   │   ├── DemoController.tsx   # 8-Step Hackathon Demo Scenario controller
│   │   │   ├── AQIHeroCard.tsx      # Inflated AQI gauge & health advisory
│   │   │   ├── PollutantGrid.tsx    # PM2.5, PM10, NO2, CO matrix & contributions
│   │   │   ├── WeatherCard.tsx      # Microclimate & aerodynamic dispersion analysis
│   │   │   ├── ForecastSection.tsx  # ML predictions, confidence bands & evaluation metrics
│   │   │   ├── HotspotsSection.tsx  # Ranked hotspots & "Why is this a hotspot?" factors
│   │   │   ├── AlertsSection.tsx    # Active, forecast & resolved alert feeds
│   │   │   ├── MapSection.tsx       # Leaflet interactive map with custom pins
│   │   │   ├── HistoricalSection.tsx# 24-hour time-series area charts
│   │   │   ├── AnomalyBanner.tsx    # Prominent statistical anomaly notification
│   │   │   └── ExplainableAIModal.tsx# Sequential causal diagnostic tree modal
│   │   ├── services/
│   │   │   └── api.ts               # REST API client
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript definitions
│   │   ├── App.tsx                  # Root application component
│   │   └── index.css                # Tactile Claymorphism CSS tokens
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (3.11 or 3.12)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic numpy pandas scikit-learn python-multipart

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```
Backend API will be accessible at: `http://127.0.0.1:8001`  
Interactive Swagger documentation: `http://127.0.0.1:8001/docs`

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser at: `http://127.0.0.1:5173`

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | System health check and mode status |
| `GET` | `/api/locations` | List of all monitored urban stations |
| `GET` | `/api/dashboard?location_id={id}` | Full integrated payload (AQI, Pollutants, Weather, Hotspot, Forecast, Alerts) |
| `GET` | `/api/hotspots` | Ranked hotspots across all monitored stations |
| `GET` | `/api/forecast?location_id={id}` | $+1\text{h}$, $+3\text{h}$, $+6\text{h}$ predictions and model evaluation metrics |
| `GET` | `/api/alerts` | Active, forecast, and resolved alerts with filtering |
| `GET` | `/api/explain?location_id={id}` | Causal reasoning tree and meteorological attribution |
| `POST` | `/api/demo/step` | Advance or set controlled hackathon scenario step ($0\text{–}8$) |
| `POST` | `/api/demo/mode` | Set system mode (`SIMULATED`, `DEMO`, `REAL`, `HISTORICAL`) |

---

## 🏆 Hackathon Wow Moments
1. **Interactive AQI Dial:** Inflated tactile gauge reflecting real-time CPCB sub-index calculations.
2. **Short-Term ML Prediction:** Visualizing both solid actual trends and dashed predicted trajectories with genuine Scikit-Learn evaluation scores ($R^2 = 0.892$).
3. **Transparent Hotspot Factor Decomposition:** Clear quantitative insight into why specific zones are flagged.
4. **Explainable AI (XAI) Modal:** Multi-stage causal attribution explaining emission surges and atmospheric stagnation traps.
5. **8-Step Demo Playback:** Effortlessly demonstrates the complete environmental decision-support cycle to judges.

---

## 📄 License
This project is licensed under the MIT License.
