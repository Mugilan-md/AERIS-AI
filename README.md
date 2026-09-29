<div align="center">

# 🍃 AERIS AI
### AI-Powered Urban Air Intelligence & Pollution Alert System

> *"See the Air. Predict the Risk. Act Before It Peaks."*

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aeris-ai-jade.vercel.app/)
[![API Backend](https://img.shields.io/badge/API%20Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://aeris-ai-1iu7.onrender.com/api/status)
[![API Documentation](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://aeris-ai-1iu7.onrender.com/docs)

<br/>

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML%20Engine-Scikit--Learn-F7931E.svg?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

</div>

---

## 🌐 Live Deployments

| Component | Platform | Direct URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web Application** | **Vercel** | [https://aeris-ai-jade.vercel.app/](https://aeris-ai-jade.vercel.app/) | ![Vercel Status](https://img.shields.io/badge/Status-Online-brightgreen?style=flat-square) |
| **Backend REST API** | **Render** | [https://aeris-ai-1iu7.onrender.com/](https://aeris-ai-1iu7.onrender.com/) | ![Render Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square) |
| **Interactive Swagger Docs** | **Render** | [https://aeris-ai-1iu7.onrender.com/docs](https://aeris-ai-1iu7.onrender.com/docs) | ![Swagger Status](https://img.shields.io/badge/Docs-Active-blue?style=flat-square) |
| **API Health Check** | **Render** | [https://aeris-ai-1iu7.onrender.com/api/status](https://aeris-ai-1iu7.onrender.com/api/status) | ![Health Check](https://img.shields.io/badge/Health-200%20OK-brightgreen?style=flat-square) |

---

## 📸 Application Showcase

<div align="center">
  <img src="doc_images/01_command_center.png" alt="AERIS AI Command Center" width="95%" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.12);" />
  <p><em>Real-Time Command Center: CPCB Deterministic Sub-Index AQI Dial, Meteorological Coupling & Ambient Pollutant Matrix</em></p>
</div>

<br/>

| **Spatial Intelligence & Map** | **Short-Term Predictive ML Forecaster** |
| :---: | :---: |
| <img src="doc_images/04_pollution_map.png" alt="Interactive Pollution Map" width="100%" /> | <img src="doc_images/03_ml_forecast.png" alt="Scikit-Learn ML Forecaster" width="100%" /> |
| *Leaflet Geospatial Map with Wind Vectors & Click-to-Pin* | *+1h, +3h, +6h Forecast Horizons with Scikit-Learn (R² = 0.892)* |

| **Explainable AI (XAI) Attribution** | **Multi-Trigger Smart Alert Dispatcher** |
| :---: | :---: |
| <img src="doc_images/06_explainable_ai_modal.png" alt="Explainable AI Modal" width="100%" /> | <img src="doc_images/05_alert_center.png" alt="Alert Center" width="100%" /> |
| *Sequential Causal Trees & Meteorological Trap Diagnostics* | *Severity Filtering, Threshold Exceedances & Recovery Feeds* |

<div align="center">
  <img src="doc_images/07_demo_stepper.png" alt="8-Step Hackathon Scenario Stepper" width="95%" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.12);" />
  <p><em>Controlled 8-Step Hackathon Demonstration Stepper: Visualizing Full Smog Formation to Wind Influx Atmospheric Recovery</em></p>
</div>

---

## 🌟 Architecture & Intelligence Pipeline

### Real-Time Intelligence Lifecycle

```mermaid
flowchart LR
    A["📡 Ingest & Monitor<br/>(Multi-Station Telemetry)"] --> B["⚖️ CPCB Sub-Index Engine<br/>(Deterministic Piecewise Linear)"]
    B --> C["🔍 Anomaly & Hotspot Detector<br/>(Z-Score > 1.8σ & Spatial Density)"]
    C --> D["🔮 ML Forecaster<br/>(Random Forest Regressor)"]
    D --> E["🚨 Smart Alert Engine<br/>(Multi-Trigger Hazard Feeds)"]
    E --> F["🧠 Explainable AI (XAI)<br/>(Causal Chain Attribution)"]
    F --> G["🍃 Atmospheric Recovery<br/>(Wind Front Dispersion)"]

    style A fill:#A8D5E2,stroke:#2D2D2D,stroke-width:1.5px,color:#2D2D2D
    style B fill:#FFE5A0,stroke:#2D2D2D,stroke-width:1.5px,color:#2D2D2D
    style C fill:#FFB3A0,stroke:#2D2D2D,stroke-width:1.5px,color:#2D2D2D
    style D fill:#C9B8E8,stroke:#2D2D2D,stroke-width:1.5px,color:#2D2D2D
    style E fill:#D4A5A5,stroke:#2D2D2D,stroke-width:1.5px,color:#2D2D2D
    style F fill:#FFE5A0,stroke:#2D2D2D,stroke-width:1.5px,color:#2D2D2D
    style G fill:#B8E6D5,stroke:#2D2D2D,stroke-width:1.5px,color:#2D2D2D
```

### System & Cloud Deployment Topology

```mermaid
graph TB
    subgraph Client_Edge["Frontend Edge Layer (Vercel)"]
        UI["Tactile Claymorphism UI<br/>(React 19 + TypeScript + Lucide)"]
        SPA["Client-Side State & Routing<br/>(Interactive Map, Gauges, Steppers)"]
        VProxy["Vercel Edge Proxy<br/>(/api/:path* Reverse Proxy)"]
        UI --> SPA --> VProxy
    end

    subgraph Cloud_Compute["Backend Compute Engine (Render)"]
        API["FastAPI REST Application<br/>(ASGI / Uvicorn Server)"]
        
        subgraph Pipeline["Intelligence Core Modules"]
            AQI["CPCB AQI Engine<br/>(Deterministic Linear Splines)"]
            HOT["Hotspot Engine<br/>(Spatial Excess & Stagnation Penalty)"]
            ANO["Anomaly Engine<br/>(Rolling Z-Score & Δ% Surges)"]
            ML["Predictive Forecaster<br/>(Scikit-Learn Random Forest)"]
            XAI["Explainable AI (XAI)<br/>(Physical Causal Reasoning Tree)"]
            ALT["Smart Alert Engine<br/>(Threshold, Forecast & Anomaly Triggers)"]
        end
        
        DB[("Multi-Station Telemetry Stream<br/>(Simulated & Live Station Feeds)")]
    end

    VProxy -- "HTTPS / TLS Encrypted" --> API
    API --> Pipeline
    Pipeline <--> DB

    style Client_Edge fill:#F8F6F0,stroke:#2D2D2D,stroke-width:2px,color:#2D2D2D
    style Cloud_Compute fill:#F5F3EF,stroke:#2D2D2D,stroke-width:2px,color:#2D2D2D
    style Pipeline fill:#FFFFFF,stroke:#38B2AC,stroke-width:1.5px,color:#2D2D2D
```

---

## 🚀 Key Modules & Capabilities

### 1. Deterministic Indian National AQI Engine (CPCB)
- Implements the official **Central Pollution Control Board (CPCB)** piecewise linear sub-index formula for criteria pollutants:
  - $\text{PM}_{2.5}$ (24-hour average)
  - $\text{PM}_{10}$ (24-hour average)
  - $\text{NO}_2$ (24-hour average)
  - $\text{CO}$ (8-hour average)
- Overall AQI calculated deterministically as $\max(I_{\text{PM2.5}}, I_{\text{PM10}}, I_{\text{NO2}}, I_{\text{CO}})$.
- Clear distinction between deterministic mathematical AQI calculation and predictive machine learning forecasts.

### 2. Spatial Pollution Hotspot Detection Engine
- Calculates transparent composite hotspot scores ($0\text{–}100$) combining:
  - **$\text{PM}_{2.5}$ Intensity Factor**: Scaled against the national ambient standard ($60\ \mu\text{g/m}^3$).
  - **Spatial Excess**: Deviation relative to regional network average.
  - **Baseline Deviation**: Difference against station's 24-hour rolling average.
  - **Microclimate Stagnation Penalty**: Triggered when wind speed falls below $2.0\text{ m/s}$ (inversion risk).
- Provides transparent factor decomposition: *"Why is this a hotspot?"*.

### 3. Statistical Anomaly Detection Engine
- Uses rolling statistical variance ($Z\text{-score} > 1.8\sigma$) and rate of change ($\Delta\% > 35\%$) to flag sudden localized surges (e.g., $+62.5\%$ particulate spike).
- Immediately displays diagnostic banners and warning feeds when anomalous accumulation is detected.

### 4. Short-Term ML AQI & Pollutant Forecaster
- Powered by a trained **Scikit-Learn Random Forest Regressor** using lagged multi-pollutant inputs, cyclic temporal features ($\sin/\cos$ hour & day), and atmospheric dispersion dynamics.
- Projects $+1\text{ hour}$, $+3\text{ hours}$, and $+6\text{ hours}$ horizons with confidence uncertainty bounds.
- **Genuine Test Evaluation Metrics:**
  - **MAE:** $\pm 4.38\ \mu\text{g/m}^3$
  - **RMSE:** $5.38\ \mu\text{g/m}^3$
  - **$R^2$ Score:** $0.892$

### 5. Explainable AI (XAI)
- Dedicated *"Why is AQI Changing?"* and *"Why this Alert?"* modal diagnostics.
- Deconstructs physical factors into multi-stage causal chains with scientifically responsible terminology (*"associated with"*, *"correlated with"*, *"observed alongside"*).

### 6. Interactive Geospatial Map (Leaflet)
- Custom tactile pastel markers with color-coded AQI badges and pulsing hotspot rings.
- Dynamic wind heading compass vector overlay.
- Real-time station telemetry inspector.
- **Interactive Pin Dropper**: Click anywhere on the map to pin a custom coordinate and calculate real-time environmental intelligence.

### 7. Manual Telemetry Injector (Test Lab)
- Dedicated testing panel to manually inject custom pollutant levels ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{CO}$, Wind Speed, Humidity) and immediately observe how the deterministic AQI engine, ML forecaster, and smart alerts respond in real time.

---

## 🎬 8-Step Incident Lifecycle Demo

AERIS AI features a built-in presentation stepper simulating an entire urban pollution cycle from baseline to severe crisis and atmospheric recovery:

```mermaid
sequenceDiagram
    autonumber
    actor Presenter as Presenter / Judge
    participant UI as Command Center UI
    participant Core as CPCB & Anomaly Engine
    participant ML as Scikit-Learn Forecaster
    participant Alert as Smart Alert Engine

    Presenter->>UI: Step 0: Baseline Monitoring
    UI->>Core: Normal conditions (AQI 118 - Moderate)
    Presenter->>UI: Step 1: Concentration Rise
    UI->>Core: Industrial shift startup (+25% PM2.5)
    Presenter->>UI: Step 2: Statistical Anomaly
    Core->>UI: Z-Score exceeds 1.8σ (+62.5% spike flagged)
    Presenter->>UI: Step 3: Hotspot Formation
    Core->>UI: Composite hotspot score surpasses 65/100
    Presenter->>UI: Step 4: Severe AQI Peak
    Core->>UI: AQI reaches 350 (Severe Category)
    Presenter->>UI: Step 5: ML Inversion Forecast
    ML->>UI: Projects prolonged particulate trapping over 6 hours
    Presenter->>UI: Step 6: Multi-Trigger Alert
    Alert->>UI: Emits multi-hazard priority alert with health advisories
    Presenter->>UI: Step 7: Explainable AI Diagnosis
    UI->>Presenter: XAI modal unpacks stagnant wind (<1.5 m/s) + emission spike
    Presenter->>UI: Step 8: Atmospheric Recovery
    Core->>UI: Wind speed surges (7.8 m/s), dispersing smog (AQI drops to 69 - Satisfactory!)
```

---

## 🎨 Visual Design System: Tactile Claymorphism

AERIS AI is built on a handcrafted **Tactile Claymorphism** design language:
- **Atmospheric Grain:** `#F0EBE5` warm off-white canvas with an ultra-subtle $2.5\%$ SVG fractal noise overlay.
- **Puffy Surfaces:** Zero harsh borders; cards defined by layered double-inset highlights and soft ambient drop shadows:
  ```css
  box-shadow:
    inset 0 -4px 8px rgba(0, 0, 0, 0.05),
    inset 0 4px 8px rgba(255, 255, 255, 0.9),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.04);
  border-radius: 24px;
  ```
- **Harmonious Status Palette:**
  - Good / Satisfactory: `#B8E6D5` (Soft Mint)
  - Moderate: `#FFE5A0` (Butter Yellow)
  - Unhealthy / Poor: `#FFB3A0` (Warm Coral)
  - Hazardous / Severe: `#D4A5A5` (Clay Crimson)
  - Data Blue & Purple: `#A8D5E2` & `#C9B8E8`
- **Typography:** Google Fonts *Nunito* and *Quicksand*.
- **Tactile Micro-Interactions:** Spring hover lift (`translateY(-4px)` with `cubic-bezier(0.34, 1.56, 0.64, 1)`).

---

## 🛠️ Repository Structure

```
AERIS-AI/
├── backend/
│   ├── app/
│   │   ├── engine/
│   │   │   ├── aqi_engine.py       # CPCB Deterministic AQI piecewise calculation
│   │   │   ├── hotspot_engine.py   # Spatial hotspot composite scoring
│   │   │   ├── anomaly_engine.py   # Statistical rolling Z-score & rate-of-change
│   │   │   ├── forecast_engine.py  # Scikit-Learn Random Forest forecaster
│   │   │   ├── alert_engine.py     # Multi-rule smart alert generator
│   │   │   ├── explain_engine.py   # Causal reasoning & XAI attribution trees
│   │   │   └── data_provider.py    # Multi-station data stream & demo scenario
│   │   └── main.py                 # FastAPI application & REST endpoints
│   ├── start.py                    # Production entrypoint with dynamic PORT binding
│   └── requirements.txt            # Backend dependencies (FastAPI, scikit-learn, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Navigation tabs, station picker & demo trigger
│   │   │   ├── DemoController.tsx   # 8-Step Hackathon Demo Scenario controller
│   │   │   ├── AQIHeroCard.tsx      # Inflated AQI gauge & health advisory
│   │   │   ├── PollutantGrid.tsx    # PM2.5, PM10, NO2, CO matrix & contributions
│   │   │   ├── WeatherCard.tsx      # Microclimate & aerodynamic dispersion analysis
│   │   │   ├── ForecastSection.tsx  # ML predictions, confidence bands & evaluation metrics
│   │   │   ├── HotspotsSection.tsx  # Ranked hotspots & factor decomposition
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
│   ├── package.json
│   └── vite.config.ts
├── doc_images/                     # High-resolution application screenshots
├── package.json                    # Root package.json for monorepo automation
├── vercel.json                     # Vercel deployment & API reverse-proxy configuration
├── render.yaml                     # Render.com web service configuration
├── requirements.txt                # Root requirements file
└── README.md
```

---

## ⚡ Local Development

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
> API will be running at: `http://127.0.0.1:8000`  
> Interactive Swagger docs: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
> Open your browser at: `http://localhost:5173`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Live Endpoint |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | System health check and mode status | [Inspect Live](https://aeris-ai-1iu7.onrender.com/api/status) |
| `GET` | `/api/locations` | Monitored urban monitoring stations | [Inspect Live](https://aeris-ai-1iu7.onrender.com/api/locations) |
| `GET` | `/api/dashboard?location_id={id}` | Full integrated payload (AQI, Pollutants, Forecast, Alerts) | [Inspect Live](https://aeris-ai-1iu7.onrender.com/api/dashboard?location_id=delhi-anand-vihar) |
| `GET` | `/api/hotspots` | Ranked hotspots with factor decomposition | [Inspect Live](https://aeris-ai-1iu7.onrender.com/api/hotspots) |
| `GET` | `/api/forecast?location_id={id}` | $+1\text{h}$, $+3\text{h}$, $+6\text{h}$ predictions & model evaluation | [Inspect Live](https://aeris-ai-1iu7.onrender.com/api/forecast?location_id=delhi-anand-vihar) |
| `GET` | `/api/alerts` | Active, forecast, and resolved alert feeds | [Inspect Live](https://aeris-ai-1iu7.onrender.com/api/alerts) |
| `GET` | `/api/explain?location_id={id}` | Causal reasoning tree and meteorological attribution | [Inspect Live](https://aeris-ai-1iu7.onrender.com/api/explain?location_id=delhi-anand-vihar) |
| `POST` | `/api/demo/step` | Advance or jump to demo scenario step ($0\text{–}8$) | Live via App UI |
| `POST` | `/api/demo/mode` | Set system mode (`SIMULATED`, `DEMO`, `REAL`) | Live via App UI |
| `POST` | `/api/custom-location` | Calculate intelligence for custom-pinned coordinate | Live via Map Click |

---

## 📄 License
This project is licensed under the MIT License.
