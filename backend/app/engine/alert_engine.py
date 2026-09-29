"""
AERIS AI - Smart Alert Engine
Generates context-aware, multi-trigger environmental alerts:
1. AQI Threshold exceedances (Poor, Very Poor, Severe)
2. Statistical particulate anomalies & sudden spikes
3. Spatial hotspot development
4. Forecasted short-term deterioration
5. Meteorological stagnation risk (thermal inversion / low wind)
Adheres strictly to scientifically responsible, cautious, non-medical recommendations.
"""

from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime

def generate_alerts(
    reading: Dict[str, Any],
    aqi_data: Dict[str, Any],
    hotspot_data: Optional[Dict[str, Any]],
    anomaly_data: Dict[str, Any],
    forecast_data: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Evaluates all environmental criteria and returns active and forecast alerts.
    """
    alerts = []
    loc_id = reading["location_id"]
    loc_name = reading["location_name"]
    aqi = aqi_data["aqi"]
    dominant = aqi_data.get("dominant_pollutant_name", "PM2.5")
    weather = reading["weather"]
    now_iso = reading["timestamp"]

    # Trigger 1: Critical / High AQI Threshold
    if aqi >= 301:
        alerts.append({
            "id": f"alt-{loc_id}-aqi-severe",
            "type": "THRESHOLD",
            "severity": "CRITICAL",
            "severity_color": "#D4A5A5",
            "title": f"CRITICAL AIR QUALITY ALERT",
            "location_id": loc_id,
            "location_name": loc_name,
            "current_aqi": aqi,
            "dominant_pollutant": dominant,
            "trend": "Severe Peak",
            "reason": f"AQI has reached {aqi} ({aqi_data['category']}), significantly exceeding national ambient safety thresholds.",
            "forecast_note": "Pollution levels projected to remain elevated until atmospheric dispersion strengthens.",
            "recommendation": "Sensitive groups and general public should avoid prolonged outdoor physical exertion. Keep windows closed during morning/evening inversion.",
            "timestamp": now_iso,
            "status": "ACTIVE"
        })
    elif aqi >= 201:
        alerts.append({
            "id": f"alt-{loc_id}-aqi-poor",
            "type": "THRESHOLD",
            "severity": "WARNING",
            "severity_color": "#FFB3A0",
            "title": f"UNHEALTHY AIR QUALITY ADVISORY",
            "location_id": loc_id,
            "location_name": loc_name,
            "current_aqi": aqi,
            "dominant_pollutant": dominant,
            "trend": "Elevated",
            "reason": f"AQI is currently {aqi} ({aqi_data['category']}). Primary contributor is {dominant}.",
            "forecast_note": "Elevated particulate concentrations present in the local breathing zone.",
            "recommendation": "Individuals with respiratory sensitivities should consider wearing N95/FFP2 masks outdoors and limit vigorous workouts.",
            "timestamp": now_iso,
            "status": "ACTIVE"
        })

    # Trigger 2: Statistical Anomaly / Rapid Spike
    if anomaly_data.get("has_anomaly") and anomaly_data.get("anomalies"):
        top_anomaly = anomaly_data["anomalies"][0]
        alerts.append({
            "id": f"alt-{loc_id}-anomaly-{top_anomaly['pollutant']}",
            "type": "ANOMALY",
            "severity": "CRITICAL" if top_anomaly["severity"] == "HIGH" else "WARNING",
            "severity_color": top_anomaly["severity_color"],
            "title": f"RAPID POLLUTION SURGE DETECTED",
            "location_id": loc_id,
            "location_name": loc_name,
            "current_aqi": aqi,
            "dominant_pollutant": top_anomaly["pollutant_name"],
            "trend": f"+{top_anomaly['rate_of_change_pct']}% Spike",
            "reason": top_anomaly["explanation"],
            "forecast_note": "Sudden accumulation indicative of local emission burst or localized stagnation.",
            "recommendation": "Investigate localized emissions sources and restrict non-essential ventilation intake.",
            "timestamp": now_iso,
            "status": "ACTIVE"
        })

    # Trigger 3: Hotspot Formation
    if hotspot_data and hotspot_data.get("hotspot_score", 0) >= 60:
        alerts.append({
            "id": f"alt-{loc_id}-hotspot",
            "type": "HOTSPOT",
            "severity": "CRITICAL" if hotspot_data["hotspot_score"] >= 75 else "WARNING",
            "severity_color": hotspot_data["severity_color"],
            "title": f"URBAN HOTSPOT CONVERGENCE",
            "location_id": loc_id,
            "location_name": loc_name,
            "current_aqi": aqi,
            "dominant_pollutant": dominant,
            "trend": hotspot_data.get("trend", "Rising"),
            "reason": f"Hotspot index computed at {hotspot_data['hotspot_score']}/100. Station exhibits notable spatial excess over regional mean.",
            "forecast_note": f"Dispersion status: {hotspot_data.get('dispersion_status', 'Reduced')}.",
            "recommendation": "Urban transit rerouting or localized industrial damping recommended to prevent particulate accumulation.",
            "timestamp": now_iso,
            "status": "ACTIVE"
        })

    # Trigger 4: Short-Term Forecast Deterioration
    if forecast_data.get("trajectory") == "Deteriorating":
        predictions = forecast_data.get("predictions", [])
        if predictions:
            furthest = predictions[-1]
            alerts.append({
                "id": f"alt-{loc_id}-forecast-deterioration",
                "type": "FORECAST",
                "severity": "ADVISORY",
                "severity_color": "#FFE5A0",
                "title": f"PROJECTED AIR QUALITY DETERIORATION",
                "location_id": loc_id,
                "location_name": loc_name,
                "current_aqi": aqi,
                "dominant_pollutant": dominant,
                "trend": "Forecast Rising",
                "reason": f"ML predictive engine anticipates AQI worsening toward ~{furthest['predicted_aqi']} by {furthest['target_time']}.",
                "forecast_note": forecast_data.get("trajectory_summary", "Stagnation anticipated."),
                "recommendation": "Plan outdoor municipal or construction operations ahead of peak evening stagnation.",
                "timestamp": now_iso,
                "status": "FORECAST"
            })

    # Trigger 5: Stagnation / Low Wind Risk
    if weather.get("wind_speed", 5.0) < 1.8 and aqi >= 140:
        alerts.append({
            "id": f"alt-{loc_id}-weather-stagnation",
            "type": "METEOROLOGICAL",
            "severity": "ADVISORY",
            "severity_color": "#FFE5A0",
            "title": f"ATMOSPHERIC STAGNATION ADVISORY",
            "location_id": loc_id,
            "location_name": loc_name,
            "current_aqi": aqi,
            "dominant_pollutant": dominant,
            "trend": "Trapped Layer",
            "reason": f"Calm surface winds ({weather['wind_speed']} m/s) significantly reduce horizontal particulate ventilation.",
            "forecast_note": "Thermal inversion layer likely inhibiting vertical dispersion.",
            "recommendation": "Minimize dust generation activities during periods of calm microclimatic wind velocity.",
            "timestamp": now_iso,
            "status": "ACTIVE"
        })

    return alerts

# Predefined resolved alerts for the Alert Center archive
RESOLVED_ALERTS_CATALOG = [
    {
        "id": "alt-res-01",
        "type": "THRESHOLD",
        "severity": "RESOLVED",
        "severity_color": "#B8E6D5",
        "title": "MORNING TRAFFIC PM2.5 SURGE (RESOLVED)",
        "location_id": "delhi-anand-vihar",
        "location_name": "Anand Vihar Eco-Station",
        "current_aqi": 88,
        "dominant_pollutant": "PM2.5",
        "trend": "Cleared",
        "reason": "Traffic rush hour particulate surge successfully dispersed following wind velocity increase to 7.2 m/s.",
        "forecast_note": "Ventilation restored.",
        "recommendation": "Normal outdoor activities resumed.",
        "timestamp": "Earlier Today, 09:45 AM",
        "status": "RESOLVED"
    },
    {
        "id": "alt-res-02",
        "type": "HOTSPOT",
        "severity": "RESOLVED",
        "severity_color": "#B8E6D5",
        "title": "INDUSTRIAL CORRIDOR ELEVATION (RESOLVED)",
        "location_id": "delhi-okhla",
        "location_name": "Okhla Industrial Area Phase-II",
        "current_aqi": 94,
        "dominant_pollutant": "PM10",
        "trend": "Normalized",
        "reason": "Temporary construction particulate drift settled under humid sea breeze inflow.",
        "forecast_note": "Normal baseline established.",
        "recommendation": "No ongoing restrictions required.",
        "timestamp": "Yesterday, 06:15 PM",
        "status": "RESOLVED"
    }
]
