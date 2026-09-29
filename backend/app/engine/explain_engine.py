"""
AERIS AI - Explainable AI (XAI) Engine
Constructs transparent, causal diagnostic trees explaining:
1. "WHY THIS ALERT?" (Why specific alerts were triggered)
2. "WHY IS AIR QUALITY CHANGING?" (Physical & meteorological attribution)
Uses scientifically responsible phrasing ('associated with', 'correlated with', 'observed alongside').
"""

from typing import Dict, Any, List

def explain_alert_and_dynamics(
    reading: Dict[str, Any],
    aqi_data: Dict[str, Any],
    hotspot_data: Dict[str, Any],
    anomaly_data: Dict[str, Any],
    forecast_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Synthesizes multi-source evidence into clear, explainable diagnostic steps.
    """
    pollutants = reading["pollutants"]
    weather = reading["weather"]
    aqi = aqi_data["aqi"]
    dominant = aqi_data.get("dominant_pollutant_name", "PM2.5")
    pm25 = pollutants.get("pm25", 0.0)
    wind_s = weather.get("wind_speed", 5.0)
    humidity = weather.get("humidity", 50.0)
    temp = weather.get("temperature", 28.0)

    # 1. Physical Factor Decomposition
    evidence_factors = []
    
    # Pollutant intensity
    if pm25 > 90:
        evidence_factors.append({
            "parameter": "PM2.5 Concentration",
            "observation": f"{pm25} µg/m³",
            "relationship": "Elevated particulate density is observed in ambient air.",
            "impact": "Primary direct contributor to AQI inflation."
        })
    elif pm25 > 40:
        evidence_factors.append({
            "parameter": "PM2.5 Concentration",
            "observation": f"{pm25} µg/m³",
            "relationship": "Particulates are in moderate concentration bands.",
            "impact": "Contributing steadily to overall sub-index."
        })

    # Wind ventilation relationship
    if wind_s < 2.0:
        evidence_factors.append({
            "parameter": "Surface Wind Velocity",
            "observation": f"{wind_s} m/s (Calm)",
            "relationship": "Low wind speed is strongly associated with reduced horizontal dispersion.",
            "impact": "Limits ventilation and promotes local particulate stagnation."
        })
    elif wind_s > 6.0:
        evidence_factors.append({
            "parameter": "Surface Wind Velocity",
            "observation": f"{wind_s} m/s (Active)",
            "relationship": "Active wind velocity is correlated with effective atmospheric advection.",
            "impact": "Aids in particulate dilution and clearance."
        })

    # Humidity & Secondary aerosol formation
    if humidity > 70:
        evidence_factors.append({
            "parameter": "Relative Humidity",
            "observation": f"{humidity}%",
            "relationship": "High relative humidity is observed alongside hygroscopic particulate growth.",
            "impact": "Can retard particulate deposition and enhance optical haze."
        })

    # 2. Causal Chain Flow (Step-by-step diagnostic breakdown)
    causal_chain = []
    
    # Step 1: Emission & Source
    causal_chain.append({
        "step_num": 1,
        "step_title": "Primary Pollutant Accumulation",
        "description": f"{dominant} concentration ({pollutants.get(dominant.lower().replace('.', ''), pm25)} { 'µg/m³' if dominant != 'CO' else 'mg/m³'}) represents the dominant sub-index driving overall air quality.",
        "status": "Warning" if aqi > 100 else "Nominal"
    })

    # Step 2: Meteorological Coupling
    if wind_s < 2.5:
        causal_chain.append({
            "step_num": 2,
            "step_title": "Reduced Atmospheric Ventilation",
            "description": f"Observed wind speeds of {wind_s} m/s coupled with boundary-layer stabilization restrict outward particulate transport.",
            "status": "High Risk"
        })
    else:
        causal_chain.append({
            "step_num": 2,
            "step_title": "Adequate Atmospheric Ventilation",
            "description": f"Wind speed of {wind_s} m/s facilitates ongoing dispersion of urban plumes.",
            "status": "Nominal"
        })

    # Step 3: Spatial Convergence
    if hotspot_data and hotspot_data.get("hotspot_score", 0) >= 50:
        causal_chain.append({
            "step_num": 3,
            "step_title": "Spatial Hotspot Convergence",
            "description": f"This station displays a hotspot index of {hotspot_data['hotspot_score']}/100, exceeding regional mean concentrations.",
            "status": "Elevated"
        })
    else:
        causal_chain.append({
            "step_num": 3,
            "step_title": "Uniform Regional Distribution",
            "description": "Station concentrations are closely aligned with regional ambient baselines.",
            "status": "Nominal"
        })

    # Step 4: Short-Term Forecast Projection
    trajectory = forecast_data.get("trajectory", "Stable")
    causal_chain.append({
        "step_num": 4,
        "step_title": "Near-Term Predictive Projection",
        "description": f"ML model trajectory evaluates current trends as '{trajectory}'. {forecast_data.get('trajectory_summary', '')}",
        "status": "Critical" if trajectory == "Deteriorating" else "Nominal"
    })

    # 3. Plain English Explanation Summary
    if aqi > 200:
        plain_summary = (
            f"Air quality has deteriorated into the {aqi_data['category']} category. "
            f"The primary driver is elevated {dominant}, compounded by calm winds ({wind_s} m/s) "
            f"which correlate with localized atmospheric stagnation. "
            f"The predictive model indicates that conditions will remain challenging until wind speeds strengthen."
        )
    elif aqi > 100:
        plain_summary = (
            f"Current air quality is classified as {aqi_data['category']}. "
            f"{dominant} is the leading pollutant. "
            f"Meteorological ventilation is moderate ({wind_s} m/s), maintaining ambient concentrations within expected bounds."
        )
    else:
        plain_summary = (
            f"Air quality is currently in the {aqi_data['category']} category with clean ambient levels. "
            f"Active wind velocity ({wind_s} m/s) provides effective natural dispersion."
        )

    return {
        "location_name": reading["location_name"],
        "aqi": aqi,
        "category": aqi_data["category"],
        "dominant_pollutant": dominant,
        "plain_english_summary": plain_summary,
        "evidence_factors": evidence_factors,
        "causal_chain": causal_chain,
        "weather_attribution": {
            "wind_speed": wind_s,
            "wind_direction": weather.get("wind_direction_cardinal", "W"),
            "temperature": temp,
            "humidity": humidity,
            "scientific_note": "Weather parameters are correlated with particulate dispersion rates based on boundary layer aerodynamics."
        }
    }
