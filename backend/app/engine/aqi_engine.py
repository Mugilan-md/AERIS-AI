"""
AERIS AI - AQI Calculation Engine
Implements deterministic Indian National Air Quality Index (CPCB) methodology.
Calculates sub-indices for PM2.5, PM10, NO2, and CO using standard piecewise linear interpolation.
Determines overall AQI, dominant pollutant, category classification, and health advisory.
"""

from typing import Dict, Any, Optional, Tuple

# CPCB Standard Breakpoints for criteria pollutants
# Format: (C_low, C_high, I_low, I_high)
BREAKPOINTS = {
    "pm25": [
        (0.0, 30.0, 0, 50),
        (30.1, 60.0, 51, 100),
        (60.1, 90.0, 101, 200),
        (90.1, 120.0, 201, 300),
        (120.1, 250.0, 301, 400),
        (250.1, 500.0, 401, 500),
    ],
    "pm10": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 250.0, 101, 200),
        (250.1, 350.0, 201, 300),
        (350.1, 430.0, 301, 400),
        (430.1, 600.0, 401, 500),
    ],
    "no2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 180.0, 101, 200),
        (180.1, 280.0, 201, 300),
        (280.1, 400.0, 301, 400),
        (400.1, 500.0, 401, 500),
    ],
    "co": [
        (0.0, 1.0, 0, 50),
        (1.01, 2.0, 51, 100),
        (2.01, 10.0, 101, 200),
        (10.01, 17.0, 201, 300),
        (17.01, 34.0, 301, 400),
        (34.01, 50.0, 401, 500),
    ]
}

CATEGORIES = [
    (0, 50, "Good", "good", "#B8E6D5", "Minimal impact. Clean fresh air."),
    (51, 100, "Satisfactory", "satisfactory", "#B8E6D5", "Minor breathing discomfort to sensitive people."),
    (101, 200, "Moderately Polluted", "moderate", "#FFE5A0", "Breathing discomfort to people with asthma and heart diseases."),
    (201, 300, "Poor", "unhealthy", "#FFB3A0", "Breathing discomfort to most people on prolonged exposure."),
    (301, 400, "Very Poor", "hazardous", "#D4A5A5", "Respiratory illness on prolonged exposure."),
    (401, 500, "Severe", "severe", "#D4A5A5", "Affects healthy people and seriously impacts those with existing diseases.")
]

POLLUTANT_METADATA = {
    "pm25": {"name": "PM2.5", "unit": "µg/m³", "description": "Fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller"},
    "pm10": {"name": "PM10", "unit": "µg/m³", "description": "Inhalable particles, with diameters that are generally 10 micrometers and smaller"},
    "no2": {"name": "NO2", "unit": "µg/m³", "description": "Nitrogen Dioxide primarily emitted from burning fuel in vehicles and industries"},
    "co": {"name": "CO", "unit": "mg/m³", "description": "Carbon Monoxide from incomplete combustion of carbon-based fuels"}
}

def calculate_sub_index(pollutant: str, concentration: float) -> Optional[int]:
    """
    Calculate deterministic sub-index for a specific pollutant using CPCB piecewise linear formula:
    Ip = [(I_high - I_low) / (C_high - C_low)] * (Cp - C_low) + I_low
    """
    if pollutant not in BREAKPOINTS or concentration is None or concentration < 0:
        return None
    
    ranges = BREAKPOINTS[pollutant]
    for c_low, c_high, i_low, i_high in ranges:
        if c_low <= concentration <= c_high:
            sub = ((i_high - i_low) / (c_high - c_low)) * (concentration - c_low) + i_low
            return int(round(sub))
            
    # If beyond max breakpoint, cap at 500
    if concentration > ranges[-1][1]:
        return 500
    return 0

def classify_aqi(aqi: int) -> Tuple[str, str, str, str]:
    """
    Returns (category_name, category_code, hex_color, health_note)
    """
    for low, high, label, code, color, note in CATEGORIES:
        if low <= aqi <= high:
            return label, code, color, note
    if aqi > 500:
        return "Severe", "severe", "#D4A5A5", "Severe emergency hazard levels. Minimize all outdoor activities."
    return "Good", "good", "#B8E6D5", "Minimal impact."

def calculate_aqi(pollutants: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes overall AQI from a dict of pollutant concentrations:
    {"pm25": 87.5, "pm10": 142.0, "no2": 45.0, "co": 1.2}
    """
    sub_indices: Dict[str, int] = {}
    contributions: Dict[str, float] = {}
    
    for pol_key in ["pm25", "pm10", "no2", "co"]:
        val = pollutants.get(pol_key)
        if val is not None:
            sub = calculate_sub_index(pol_key, float(val))
            if sub is not None:
                sub_indices[pol_key] = sub
                
    if not sub_indices:
        # Fallback if no valid sub-indices
        return {
            "aqi": 0,
            "category": "Insufficient Data",
            "category_code": "unknown",
            "dominant_pollutant": None,
            "sub_indices": {},
            "color": "#6B6B6B",
            "health_advisory": "Awaiting sensor measurements."
        }
        
    overall_aqi = max(sub_indices.values())
    dominant_key = max(sub_indices, key=sub_indices.get)
    
    # Calculate relative contribution percentage to overall max
    total_sub = sum(sub_indices.values()) or 1
    for k, v in sub_indices.items():
        contributions[k] = round((v / total_sub) * 100, 1)
        
    cat_name, cat_code, hex_color, advisory = classify_aqi(overall_aqi)
    
    return {
        "aqi": overall_aqi,
        "category": cat_name,
        "category_code": cat_code,
        "color": hex_color,
        "dominant_pollutant": dominant_key,
        "dominant_pollutant_name": POLLUTANT_METADATA.get(dominant_key, {}).get("name", dominant_key.upper()),
        "sub_indices": sub_indices,
        "contributions": contributions,
        "health_advisory": advisory
    }
