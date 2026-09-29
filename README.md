# AERIS AI — AI-Powered Urban Air Intelligence & Pollution Alert System

> *"See the Air. Predict the Risk. Act Before It Peaks."*

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black.svg?style=for-the-badge&logo=vercel)](https://aeris-ai-jade.vercel.app/)
[![API Status](https://img.shields.io/badge/Backend_API-Render-46E3B7.svg?style=for-the-badge&logo=render)](https://aeris-ai-1iu7.onrender.com/api/status)
[![API Docs](https://img.shields.io/badge/Interactive_Docs-Swagger_UI-85EA2D.svg?style=for-the-badge&logo=swagger)](https://aeris-ai-1iu7.onrender.com/docs)

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Design System](https://img.shields.io/badge/UI-Tactile_Claymorphism-FFE5A0.svg?style=flat)](#-visual-design-system-tactile-claymorphism)

---

## 🌐 Live Deployments

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://aeris-ai-jade.vercel.app/](https://aeris-ai-jade.vercel.app/) |
| **Backend API Service** | Render | [https://aeris-ai-1iu7.onrender.com/](https://aeris-ai-1iu7.onrender.com/) |
| **API Health Status** | Render | [https://aeris-ai-1iu7.onrender.com/api/status](https://aeris-ai-1iu7.onrender.com/api/status) |
| **Interactive Swagger Docs**| Render | [https://aeris-ai-1iu7.onrender.com/docs](https://aeris-ai-1iu7.onrender.com/docs) |

---

## 🌟 Overview

**AERIS AI** is an AI-powered environmental decision-support platform that transforms raw urban air quality and weather telemetry into real-time pollution intelligence, short-term predictions, spatial hotspot detection, and actionable location-based alerts.

Rather than acting as a static AQI dashboard, AERIS AI implements an end-to-end intelligence pipeline:

```
MONITOR ➔ UNDERSTAND ➔ DETECT ➔ PREDICT ➔ ALERT ➔ EXPLAIN ➔ RECOVER
```

```
┌─────────────────────────────────┐        HTTPS Requests        ┌──────────────────────────────────┐
│      Vercel Production Edge     │ ───────────────────────────> │        Render Web Service        │
│   https://aeris-ai-jade.vercel  │ <─────────────────────────── │   https://aeris-ai-1iu7.onrender │
│   (React 19 + TypeScript + Vite)│    Reverse Proxy / REST API  │   (FastAPI + Scikit-Learn + ML)  │
└─────────────────────────────────┘                              └──────────────────────────────────┘
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
- Clear mathematical separation between deterministic real-time measurements and predictive ML forecasts.

### 2. Spatial Pollution Hotspot Detection Engine
- Calculates transparent composite hotspot scores ($0\text{–}100$) combining:
  - **$\text{PM}_{2.5}$ Intensity Factor** vs. national ambient threshold.
  - **Spatial Excess** relative to regional network average.
  - **Baseline Deviation** against 24-hour rolling station averages.
  - **Microclimate Wind Stagnation** penalty ($< 2.0\text{ m/s}$ inversion risk).
- Provides transparent factor decomposition: *"Why is this a hotspot?"*.

### 3. Statistical Anomaly Detection Engine
- Utilizes rolling statistical variance ($Z\text{-score} > 1.8\sigma$) and rate of change ($\Delta\% > 35\%$) to flag sudden localized surges (e.g. $+62.5\%$ $\text{PM}_{2.5}$ surge).
- Triggers instant diagnostic banners and alert feeds when anomalous accumulation occurs.

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
- Dedicated *"Why is AQI Changing?"* and *"Why this Alert?"* modal experiences.
- Deconstructs physical factors into multi-stage causal chains with scientifically responsible terminology (*"associated with"*, *"correlated with"*, *"observed alongside"*).

### 7. Interactive Geospatial Map (Leaflet)
- Custom tactile pastel markers with color-coded AQI badges and pulsing hotspot rings.
- Dynamic wind heading compass vector overlay.
- Real-time station telemetry inspector.
- **Interactive Pin Dropper**: Click anywhere on the map to pin a custom coordinate and calculate real-time environmental intelligence.

### 8. Manual Telemetry Injector (Test Lab)
- Dedicated testing panel to manually inject custom pollutant levels ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{CO}$, Wind Speed, Humidity) and immediately observe how the deterministic AQI engine, ML forecaster, and smart alerts respond in real time.

### 9. Controlled Hackathon Demo Scenario
An interactive 8-step presentation stepper showcasing the complete environmental intelligence lifecycle:
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

AERIS AI features a signature **Tactile Claymorphism** aesthetic:
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
│   │   │   ├── forecast_engine.py  # Scikit-Learn Random Forest forecaster
│   │   │   ├── alert_engine.py     # Multi-rule smart alert generator
│   │   │   ├── explain_engine.py   # Causal reasoning & XAI attribution trees
│   │   │   └── data_provider.py    # Multi-station data stream & demo scenario
│   │   └── main.py                 # FastAPI application router
│   ├── start.py                    # Production entrypoint with dynamic PORT binding
│   └── requirements.txt            # Backend dependencies
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
│   │   │   ├── MapSection.tsx       # Leaflet interactive map with custom pins & click-to-pin
│   │   │   ├── HistoricalSection.tsx# 24-hour time-series area charts
│   │   │   ├── AnomalyBanner.tsx    # Prominent statistical anomaly notification
│   │   │   ├── ExplainableAIModal.tsx# Sequential causal diagnostic tree modal
│   │   │   └── ManualTestPanel.tsx  # Live parameter injector & simulation sandbox
│   │   ├── services/
│   │   │   └── api.ts               # Resilient REST API client with trailing-slash sanitization
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript definitions
│   │   ├── App.tsx                  # Root application component
│   │   └── index.css                # Tactile Claymorphism CSS tokens
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── package.json                    # Root package.json for monorepo build automation
├── vercel.json                     # Vercel deployment & API reverse-proxy configuration
├── render.yaml                     # Render.com web service configuration
├── requirements.txt                # Root requirements file
└── README.md
```

---

## ⚡ Local Development & Setup

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
pip install -r requirements.txt

# Start FastAPI server
python start.py
```
Backend API will be accessible at: `http://127.0.0.1:8000`  
Interactive Swagger documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 📡 Key API Endpoints

| Method | Endpoint | Description | Live Endpoint |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | System health check and pipeline status | [View Live](https://aeris-ai-1iu7.onrender.com/api/status) |
| `GET` | `/api/locations` | List of all monitored urban stations | [View Live](https://aeris-ai-1iu7.onrender.com/api/locations) |
| `GET` | `/api/dashboard?location_id={id}` | Full integrated payload (AQI, Pollutants, Weather, Hotspot, Forecast, Alerts) | [View Live](https://aeris-ai-1iu7.onrender.com/api/dashboard?location_id=delhi-anand-vihar) |
| `GET` | `/api/hotspots` | Ranked hotspots across all monitored stations | [View Live](https://aeris-ai-1iu7.onrender.com/api/hotspots) |
| `GET` | `/api/forecast?location_id={id}` | $+1\text{h}$, $+3\text{h}$, $+6\text{h}$ predictions and model evaluation metrics | [View Live](https://aeris-ai-1iu7.onrender.com/api/forecast?location_id=delhi-anand-vihar) |
| `GET` | `/api/alerts` | Active, forecast, and resolved alerts with filtering | [View Live](https://aeris-ai-1iu7.onrender.com/api/alerts) |
| `GET` | `/api/explain?location_id={id}` | Causal reasoning tree and meteorological attribution | [View Live](https://aeris-ai-1iu7.onrender.com/api/explain?location_id=delhi-anand-vihar) |
| `POST` | `/api/demo/step` | Advance or set controlled hackathon scenario step ($0\text{–}8$) | Live via UI Stepper |
| `POST` | `/api/demo/mode` | Set system mode (`SIMULATED`, `DEMO`, `REAL`, `HISTORICAL`) | Live via UI Toggle |
| `POST` | `/api/custom-location` | Calculate intelligence for any user-pinned coordinate | Live via Map Click |

---

## 🏆 Hackathon Wow Moments

1. **Inflated Tactile AQI Gauge:** Real-time CPCB sub-index calculations presented in a distinctive tactile claymorphism style.
2. **Short-Term ML Prediction:** Visualizing solid recorded trends alongside dashed predicted trajectories with Scikit-Learn evaluation scores ($R^2 = 0.892$).
3. **Transparent Hotspot Factor Decomposition:** Clear quantitative breakdown explaining why specific zones are flagged.
4. **Explainable AI (XAI) Modal:** Multi-stage causal attribution explaining emission surges and atmospheric stagnation traps.
5. **8-Step Demo Playback:** Effortlessly demonstrates the complete environmental decision-support cycle to judges.
6. **Live Production Deployments:** Fully functional and decoupled deployment on Vercel and Render with instant reverse-proxy failover.

---

## 📄 License
This project is licensed under the MIT License.
