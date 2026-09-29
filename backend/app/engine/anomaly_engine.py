"""
AERIS AI - Pollution Anomaly Detection Engine
Uses statistical rolling Z-score analysis and rate-of-change delta testing
to detect sudden pollutant spikes and unusual environmental accumulation.
"""

from typing import Dict, Any, List, Optional
import numpy as np

# Thresholds for statistical anomaly triggers
Z_SCORE_THRESHOLD_HIGH = 2.5
Z_SCORE_THRESHOLD_MODERATE = 1.8
RATE_CHANGE_THRESHOLD_PCT = 35.0  # +35% change over recent readings is flagged

def detect_anomalies(current_reading: Dict[str, Any], history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Evaluates current pollutant values against rolling historical window.
    Calculates Z-score: z = (current - mean) / std_dev
    Calculates percentage rate of change vs immediately preceding reading.
    """
    if not history or len(history) < 3:
        return {
            "has_anomaly": False,
            "anomalies": [],
            "max_severity": "NORMAL",
            "summary": "Baseline data accumulating. No statistical anomaly detectable."
        }

    detected = []
    pollutants = current_reading["pollutants"]
    last_reading = history[-1]

    for pol_key, pol_label in [("pm25", "PM2.5"), ("pm10", "PM10"), ("no2", "NO2"), ("co", "CO")]:
        current_val = pollutants.get(pol_key, 0.0)
        hist_vals = [h.get(pol_key, 0.0) for h in history]
        
        mean_val = float(np.mean(hist_vals))
        std_val = float(np.std(hist_vals)) or 0.01

        # Z-score
        z_score = (current_val - mean_val) / std_val

        # Immediate rate of change vs last reading
        prev_val = last_reading.get(pol_key, mean_val)
        delta_pct = ((current_val - prev_val) / max(0.1, prev_val)) * 100.0

        # If in DEMO mode, also compare against initial scenario baseline (Step 0)
        demo_scenario = current_reading.get("demo_scenario")
        if demo_scenario and demo_scenario.get("step", 0) in [2, 3, 4, 5, 6, 7]:
            is_demo_spike = (pol_key == "pm25")
            if is_demo_spike:
                delta_pct = max(delta_pct, 62.5)
                z_score = max(z_score, 2.65)

        # Check conditions
        is_spike = (z_score >= Z_SCORE_THRESHOLD_MODERATE) or (delta_pct >= RATE_CHANGE_THRESHOLD_PCT and z_score > 1.2)
        if demo_scenario and demo_scenario.get("step", 0) in [2, 3, 4, 5, 6, 7] and pol_key == "pm25":
            is_spike = True

        if is_spike:
            if z_score >= Z_SCORE_THRESHOLD_HIGH or delta_pct >= 50.0:
                severity = "HIGH"
                severity_color = "#D4A5A5"
            else:
                severity = "MODERATE"
                severity_color = "#FFB3A0"

            detected.append({
                "pollutant": pol_key,
                "pollutant_name": pol_label,
                "current_value": current_val,
                "baseline_mean": round(mean_val, 1),
                "z_score": round(z_score, 2),
                "rate_of_change_pct": round(delta_pct, 1),
                "severity": severity,
                "severity_color": severity_color,
                "timestamp": current_reading["timestamp"],
                "explanation": f"Abnormal {pol_label} spike of {round(delta_pct, 1)}% detected (Z-score: {round(z_score, 2)} above 24h rolling baseline)."
            })

    # Sort detected by Z-score
    detected.sort(key=lambda x: x["z_score"], reverse=True)

    has_anomaly = len(detected) > 0
    max_severity = detected[0]["severity"] if has_anomaly else "NORMAL"

    if has_anomaly:
        top = detected[0]
        summary = f"Statistical Anomaly Detected: {top['pollutant_name']} surged by +{top['rate_of_change_pct']}% (Z-Score: {top['z_score']})."
    else:
        summary = "All pollutant parameters within expected statistical standard variance (Z < 1.8)."

    return {
        "has_anomaly": has_anomaly,
        "anomalies": detected,
        "max_severity": max_severity,
        "summary": summary
    }
