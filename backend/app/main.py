"""
AERIS AI - FastAPI Application Server
Provides RESTful APIs for real-time air quality monitoring, Indian National AQI calculation,
spatial hotspot intelligence, statistical anomaly detection, ML short-term forecasting,
smart alerts, and explainable AI insights.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from app.engine.data_provider import data_provider, LOCATIONS
from app.engine.aqi_engine import calculate_aqi, POLLUTANT_METADATA
from app.engine.hotspot_engine import analyze_hotspots
from app.engine.anomaly_engine import detect_anomalies
from app.engine.forecast_engine import forecast_engine
from app.engine.alert_engine import generate_alerts, RESOLVED_ALERTS_CATALOG
from app.engine.explain_engine import explain_alert_and_dynamics

app = FastAPI(
    title="AERIS AI - Environmental Intelligence API",
    description="AI-Powered Urban Air Intelligence & Pollution Alert System",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DemoStepRequest(BaseModel):
    step: int

class ModeRequest(BaseModel):
    mode: str

class CustomLocationRequest(BaseModel):
    lat: float
    lon: float
    name: Optional[str] = None
    city: Optional[str] = None

class ManualTelemetryRequest(BaseModel):
    location_id: str
    pm25: float
    pm10: float
    no2: float
    co: float
    wind_speed: Optional[float] = None
    wind_direction: Optional[int] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None

class ResetManualRequest(BaseModel):
    location_id: Optional[str] = None

@app.get("/api/status")
def get_system_status():
    return {
        "status": "online",
        "service": "AERIS AI Intelligence Pipeline",
        "version": "1.0.0",
        "active_mode": data_provider.mode,
        "demo_active": data_provider.demo_active,
        "current_demo_step": data_provider.demo_step,
        "available_stations": len(LOCATIONS)
    }

@app.get("/api/locations")
def list_locations():
    return data_provider.get_locations()

@app.get("/api/dashboard")
def get_dashboard_data(location_id: str = Query("delhi-anand-vihar")):
    reading = data_provider.get_current_reading(location_id)
    history = data_provider.get_history(location_id, hours=24)
    
    # 1. AQI deterministic calculation
    aqi_data = calculate_aqi(reading["pollutants"])

    # 2. Gather network readings for spatial hotspot comparison
    all_readings = []
    for loc_id in LOCATIONS.keys():
        r = data_provider.get_current_reading(loc_id)
        r["aqi_data"] = calculate_aqi(r["pollutants"])
        all_readings.append(r)

    all_hotspots = analyze_hotspots(all_readings, data_provider.location_history)
    current_hotspot = next((h for h in all_hotspots if h["location_id"] == location_id), None)

    # 3. Anomaly detection
    anomaly_data = detect_anomalies(reading, history)

    # 4. Short-term ML forecasting
    forecast_data = forecast_engine.generate_forecast(reading, history)

    # 5. Smart alerts
    active_alerts = generate_alerts(reading, aqi_data, current_hotspot, anomaly_data, forecast_data)

    # 6. Detailed pollutant trend calculations vs historical baseline
    enriched_pollutants = {}
    for pol_key, pol_meta in POLLUTANT_METADATA.items():
        curr_val = reading["pollutants"].get(pol_key, 0.0)
        hist_vals = [h.get(pol_key, curr_val) for h in history]
        baseline_avg = sum(hist_vals) / max(1, len(hist_vals)) if hist_vals else curr_val
        change_pct = round(((curr_val - baseline_avg) / max(0.1, baseline_avg)) * 100.0, 1)

        enriched_pollutants[pol_key] = {
            "name": pol_meta["name"],
            "unit": pol_meta["unit"],
            "value": curr_val,
            "baseline_avg": round(baseline_avg, 1),
            "recent_change_pct": change_pct,
            "trend": "Rising" if change_pct > 5 else ("Dropping" if change_pct < -5 else "Stable"),
            "sub_index": aqi_data["sub_indices"].get(pol_key, 0),
            "contribution_pct": aqi_data["contributions"].get(pol_key, 0.0),
            "is_dominant": (pol_key == aqi_data["dominant_pollutant"])
        }

    return {
        "location": {
            "id": reading["location_id"],
            "name": reading["location_name"],
            "city": reading["city"],
            "zone_type": reading["zone_type"],
            "lat": reading["lat"],
            "lon": reading["lon"],
            "timestamp": reading["timestamp"],
            "mode": reading["mode"],
            "demo_scenario": reading.get("demo_scenario")
        },
        "aqi": aqi_data,
        "pollutants": enriched_pollutants,
        "weather": reading["weather"],
        "hotspot": current_hotspot,
        "anomaly": anomaly_data,
        "forecast": forecast_data,
        "alerts": active_alerts,
        "all_hotspots": all_hotspots,
        "history": history
    }

@app.get("/api/hotspots")
def get_hotspots():
    all_readings = []
    for loc_id in LOCATIONS.keys():
        r = data_provider.get_current_reading(loc_id)
        r["aqi_data"] = calculate_aqi(r["pollutants"])
        all_readings.append(r)
    return analyze_hotspots(all_readings, data_provider.location_history)

@app.get("/api/forecast")
def get_forecast(location_id: str = Query("delhi-anand-vihar")):
    reading = data_provider.get_current_reading(location_id)
    history = data_provider.get_history(location_id, hours=24)
    return forecast_engine.generate_forecast(reading, history)

@app.get("/api/explain")
def get_explanation(location_id: str = Query("delhi-anand-vihar")):
    reading = data_provider.get_current_reading(location_id)
    history = data_provider.get_history(location_id, hours=24)
    aqi_data = calculate_aqi(reading["pollutants"])

    all_readings = []
    for loc_id in LOCATIONS.keys():
        r = data_provider.get_current_reading(loc_id)
        r["aqi_data"] = calculate_aqi(r["pollutants"])
        all_readings.append(r)
    
    all_hotspots = analyze_hotspots(all_readings, data_provider.location_history)
    current_hotspot = next((h for h in all_hotspots if h["location_id"] == location_id), None)
    anomaly_data = detect_anomalies(reading, history)
    forecast_data = forecast_engine.generate_forecast(reading, history)

    return explain_alert_and_dynamics(reading, aqi_data, current_hotspot, anomaly_data, forecast_data)

@app.get("/api/alerts")
def get_alerts(location_id: Optional[str] = None):
    all_active = []
    for loc_id in LOCATIONS.keys():
        reading = data_provider.get_current_reading(loc_id)
        aqi_data = calculate_aqi(reading["pollutants"])
        all_readings = []
        for lid in LOCATIONS.keys():
            r = data_provider.get_current_reading(lid)
            r["aqi_data"] = calculate_aqi(r["pollutants"])
            all_readings.append(r)
        hotspot_list = analyze_hotspots(all_readings, data_provider.location_history)
        cur_hotspot = next((h for h in hotspot_list if h["location_id"] == loc_id), None)
        history = data_provider.get_history(loc_id, hours=24)
        anom = detect_anomalies(reading, history)
        fc = forecast_engine.generate_forecast(reading, history)
        alts = generate_alerts(reading, aqi_data, cur_hotspot, anom, fc)
        all_active.extend(alts)

    if location_id:
        all_active = [a for a in all_active if a["location_id"] == location_id]

    return {
        "active_alerts": [a for a in all_active if a["status"] == "ACTIVE"],
        "forecast_alerts": [a for a in all_active if a["status"] == "FORECAST"],
        "resolved_alerts": RESOLVED_ALERTS_CATALOG
    }

@app.post("/api/demo/step")
def set_demo_step(req: DemoStepRequest):
    data_provider.set_demo_step(req.step)
    return {
        "status": "updated",
        "demo_step": data_provider.demo_step,
        "mode": data_provider.mode
    }

@app.post("/api/demo/mode")
def set_mode(req: ModeRequest):
    data_provider.set_mode(req.mode)
    return {
        "status": "updated",
        "mode": data_provider.mode,
        "demo_active": data_provider.demo_active
    }

@app.post("/api/locations/custom")
def create_custom_location(req: CustomLocationRequest):
    new_loc = data_provider.register_custom_location(req.lat, req.lon, req.name, req.city)
    return {
        "status": "created",
        "location": new_loc,
        "all_locations": data_provider.get_locations()
    }

@app.post("/api/manual/telemetry")
def set_manual_telemetry(req: ManualTelemetryRequest):
    data_dict = {
        "pm25": req.pm25,
        "pm10": req.pm10,
        "no2": req.no2,
        "co": req.co,
        "wind_speed": req.wind_speed,
        "wind_direction": req.wind_direction,
        "temperature": req.temperature,
        "humidity": req.humidity
    }
    data_provider.set_manual_telemetry(req.location_id, data_dict)
    data_provider.set_mode("MANUAL")
    return {
        "status": "updated",
        "location_id": req.location_id,
        "mode": "MANUAL"
    }

@app.post("/api/manual/reset")
def reset_manual_telemetry(req: ResetManualRequest):
    data_provider.clear_manual_telemetry(req.location_id)
    if not data_provider.manual_overrides:
        data_provider.set_mode("SIMULATED")
    return {
        "status": "reset",
        "mode": data_provider.mode
    }

