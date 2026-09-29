"""
AERIS AI - Pollution Hotspot Detection Engine
Calculates transparent composite hotspot score (0-100) based on:
1. Pollutant concentration severity (PM2.5, PM10, NO2)
2. Spatial deviation vs regional network baseline
3. Temporal baseline deviation vs station's historical mean
4. Meteorological dispersion risk (stagnant low wind speed)
Provides explainable factor decomposition for every detected hotspot.
"""

from typing import Dict, Any, List
import numpy as np

HOTSPOT_WEIGHTS = {
    "pm25_intensity": 0.35,
    "spatial_excess": 0.25,
    "baseline_excess": 0.20,
    "wind_stagnation": 0.20
}

def analyze_hotspots(current_readings: List[Dict[str, Any]], baseline_history: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """
    Computes hotspot scores across all active monitoring stations.
    """
    if not current_readings:
        return []

    # Calculate regional average AQI & PM2.5 across all stations
    all_aqis = [r["aqi_data"]["aqi"] for r in current_readings if "aqi_data" in r]
    all_pm25 = [r["pollutants"]["pm25"] for r in current_readings]
    regional_avg_aqi = float(np.mean(all_aqis)) if all_aqis else 100.0
    regional_avg_pm25 = float(np.mean(all_pm25)) if all_pm25 else 45.0

    hotspots = []

    for r in current_readings:
        loc_id = r["location_id"]
        pollutants = r["pollutants"]
        weather = r["weather"]
        aqi = r["aqi_data"]["aqi"]
        dominant_pol = r["aqi_data"]["dominant_pollutant_name"]
        
        # 1. Intensity factor: scaled relative to CPCB Severe threshold (250 ug/m3 for PM2.5)
        pm25_val = pollutants.get("pm25", 0.0)
        intensity_score = min(100.0, (pm25_val / 200.0) * 100.0)

        # 2. Spatial excess: how much this location exceeds regional network mean
        spatial_delta = aqi - regional_avg_aqi
        spatial_score = min(100.0, max(0.0, (spatial_delta / 80.0) * 100.0))

        # 3. Temporal baseline excess: compare against station's historical 24h average
        history = baseline_history.get(loc_id, [])
        if history:
            hist_pm25 = np.mean([h["pm25"] for h in history])
            pct_change = ((pm25_val - hist_pm25) / max(1.0, hist_pm25)) * 100.0
            baseline_score = min(100.0, max(0.0, (pct_change / 60.0) * 100.0))
        else:
            pct_change = 0.0
            baseline_score = 30.0

        # 4. Wind stagnation factor: wind speeds < 3.0 m/s trap pollutants; < 1.5 m/s is severe stagnation
        wind_speed = weather.get("wind_speed", 5.0)
        if wind_speed < 1.5:
            stagnation_score = 95.0
            dispersion_status = "Severe Stagnation (Inversion Trap)"
        elif wind_speed < 3.0:
            stagnation_score = 70.0
            dispersion_status = "Reduced Atmospheric Dispersion"
        elif wind_speed < 6.0:
            stagnation_score = 35.0
            dispersion_status = "Moderate Ventilation"
        else:
            stagnation_score = 10.0
            dispersion_status = "Active Atmospheric Dispersion"

        # Composite Hotspot Score
        hotspot_score = int(round(
            (intensity_score * HOTSPOT_WEIGHTS["pm25_intensity"]) +
            (spatial_score * HOTSPOT_WEIGHTS["spatial_excess"]) +
            (baseline_score * HOTSPOT_WEIGHTS["baseline_excess"]) +
            (stagnation_score * HOTSPOT_WEIGHTS["wind_stagnation"])
        ))

        # Severity Classification
        if hotspot_score >= 75:
            severity = "CRITICAL"
            severity_color = "#D4A5A5"
        elif hotspot_score >= 55:
            severity = "HIGH"
            severity_color = "#FFB3A0"
        elif hotspot_score >= 35:
            severity = "MODERATE"
            severity_color = "#FFE5A0"
        else:
            severity = "LOW"
            severity_color = "#B8E6D5"

        # Transparent Explanation Factors
        factors = [
            {
                "name": "PM2.5 Concentration",
                "value": f"{pm25_val} µg/m³",
                "impact": "High" if intensity_score > 60 else "Moderate" if intensity_score > 35 else "Low",
                "detail": f"{round(intensity_score)}% of severe threshold benchmark"
            },
            {
                "name": "Spatial Excess",
                "value": f"{'+' if spatial_delta >= 0 else ''}{round(spatial_delta, 1)} AQI pts",
                "impact": "High" if spatial_score > 50 else "Normal",
                "detail": f"Relative to regional network average ({round(regional_avg_aqi)} AQI)"
            },
            {
                "name": "Baseline Deviation",
                "value": f"{'+' if pct_change >= 0 else ''}{round(pct_change, 1)}%",
                "impact": "Elevated" if pct_change > 20 else "Normal",
                "detail": "Compared to 24-hr historical rolling baseline"
            },
            {
                "name": "Wind Dispersion",
                "value": f"{wind_speed} m/s",
                "impact": "Unfavorable" if wind_speed < 3.0 else "Favorable",
                "detail": dispersion_status
            }
        ]

        hotspots.append({
            "location_id": loc_id,
            "location_name": r["location_name"],
            "city": r["city"],
            "zone_type": r["zone_type"],
            "lat": r["lat"],
            "lon": r["lon"],
            "aqi": aqi,
            "aqi_category": r["aqi_data"]["category"],
            "dominant_pollutant": dominant_pol,
            "hotspot_score": hotspot_score,
            "severity": severity,
            "severity_color": severity_color,
            "trend": "Rising" if pct_change > 10 else ("Dropping" if pct_change < -10 else "Stable"),
            "factors": factors,
            "dispersion_status": dispersion_status
        })

    # Sort descending by hotspot score
    hotspots.sort(key=lambda x: x["hotspot_score"], reverse=True)
    return hotspots
