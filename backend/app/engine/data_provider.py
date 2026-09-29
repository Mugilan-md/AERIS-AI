"""
AERIS AI - Environmental Data Provider
Supports:
1. MODE 1: REAL / NEAR-REALTIME SENSOR SIMULATION
2. MODE 2: HISTORICAL BASELINE & TIME-SERIES DATASET
3. MODE 3: CONTROLLED HACKATHON DEMO MODE SCENARIO
Provides multi-station urban environmental feeds across cities (Delhi, Mumbai, Bengaluru).
"""

import time
import math
import random
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

# Location catalog with real geographical coordinates and baseline profiles
LOCATIONS = {
    "delhi-anand-vihar": {
        "id": "delhi-anand-vihar",
        "city": "Delhi NCR",
        "name": "Anand Vihar Eco-Station",
        "zone_type": "Industrial & Transit Hub",
        "lat": 28.6469,
        "lon": 77.3160,
        "baseline_aqi": 185,
        "base_pm25": 85.0,
        "base_pm10": 160.0,
        "base_no2": 52.0,
        "base_co": 1.8,
        "base_temp": 28.5,
        "base_humidity": 58.0,
        "base_wind_speed": 4.2,
        "base_wind_dir": 290
    },
    "delhi-rk-puram": {
        "id": "delhi-rk-puram",
        "city": "Delhi NCR",
        "name": "R.K. Puram Sensor Hub",
        "zone_type": "Dense Residential",
        "lat": 28.5660,
        "lon": 77.1767,
        "baseline_aqi": 125,
        "base_pm25": 48.0,
        "base_pm10": 98.0,
        "base_no2": 38.0,
        "base_co": 1.1,
        "base_temp": 29.0,
        "base_humidity": 54.0,
        "base_wind_speed": 5.1,
        "base_wind_dir": 310
    },
    "delhi-okhla": {
        "id": "delhi-okhla",
        "city": "Delhi NCR",
        "name": "Okhla Industrial Area Phase-II",
        "zone_type": "Heavy Industrial",
        "lat": 28.5284,
        "lon": 77.2764,
        "baseline_aqi": 210,
        "base_pm25": 110.0,
        "base_pm10": 215.0,
        "base_no2": 68.0,
        "base_co": 2.4,
        "base_temp": 29.8,
        "base_humidity": 51.0,
        "base_wind_speed": 3.4,
        "base_wind_dir": 275
    },
    "mumbai-bkc": {
        "id": "mumbai-bkc",
        "city": "Mumbai",
        "name": "Bandra Kurla Complex (BKC)",
        "zone_type": "Commercial Financial District",
        "lat": 19.0657,
        "lon": 72.8687,
        "baseline_aqi": 112,
        "base_pm25": 42.0,
        "base_pm10": 85.0,
        "base_no2": 32.0,
        "base_co": 0.9,
        "base_temp": 31.2,
        "base_humidity": 72.0,
        "base_wind_speed": 8.5,
        "base_wind_dir": 240
    },
    "mumbai-andheri": {
        "id": "mumbai-andheri",
        "city": "Mumbai",
        "name": "Andheri East Metro Corridor",
        "zone_type": "Commercial & Traffic",
        "lat": 19.1197,
        "lon": 72.8464,
        "baseline_aqi": 138,
        "base_pm25": 54.0,
        "base_pm10": 118.0,
        "base_no2": 45.0,
        "base_co": 1.4,
        "base_temp": 30.5,
        "base_humidity": 74.0,
        "base_wind_speed": 6.8,
        "base_wind_dir": 230
    },
    "bengaluru-silk-board": {
        "id": "bengaluru-silk-board",
        "city": "Bengaluru",
        "name": "Central Silk Board Junction",
        "zone_type": "High Density Vehicular Transit",
        "lat": 12.9177,
        "lon": 77.6238,
        "baseline_aqi": 145,
        "base_pm25": 58.0,
        "base_pm10": 124.0,
        "base_no2": 49.0,
        "base_co": 1.6,
        "base_temp": 26.2,
        "base_humidity": 65.0,
        "base_wind_speed": 6.2,
        "base_wind_dir": 180
    },
    "bengaluru-whitefield": {
        "id": "bengaluru-whitefield",
        "city": "Bengaluru",
        "name": "Whitefield IT & Tech Park",
        "zone_type": "Mixed Suburban & Tech Corridor",
        "lat": 12.9698,
        "lon": 77.7499,
        "baseline_aqi": 82,
        "base_pm25": 28.0,
        "base_pm10": 62.0,
        "base_no2": 22.0,
        "base_co": 0.7,
        "base_temp": 25.8,
        "base_humidity": 62.0,
        "base_wind_speed": 7.5,
        "base_wind_dir": 195
    }
}

class DataProvider:
    def __init__(self):
        self.mode = "SIMULATED"  # "REAL", "HISTORICAL", "SIMULATED", "DEMO", "MANUAL"
        self.demo_step = 0
        self.demo_max_steps = 8
        self.demo_active = False
        self.demo_start_time = time.time()
        self.location_history: Dict[str, List[Dict[str, Any]]] = {}
        self.manual_overrides: Dict[str, Dict[str, Any]] = {}
        self._seed_historical_records()

    def _seed_historical_records(self):
        """Generates realistic 24-hour historical records for each station based on diurnal cycles."""
        now = datetime.now()
        for loc_id, loc in LOCATIONS.items():
            records = []
            for h in range(24, 0, -1):
                timestamp = now - timedelta(hours=h)
                hour = timestamp.hour
                traffic_mult = 1.35 if (8 <= hour <= 10 or 18 <= hour <= 21) else (0.8 if 1 <= hour <= 5 else 1.0)
                temp_factor = math.sin((hour - 9) * math.pi / 12)
                
                pm25 = max(12.0, loc["base_pm25"] * traffic_mult + (random.uniform(-4, 4)))
                pm10 = max(25.0, loc["base_pm10"] * traffic_mult + (random.uniform(-8, 8)))
                no2 = max(10.0, loc["base_no2"] * traffic_mult + (random.uniform(-3, 3)))
                co = max(0.4, loc["base_co"] * traffic_mult + (random.uniform(-0.15, 0.15)))
                temp = loc["base_temp"] + (temp_factor * 4.5) + random.uniform(-0.5, 0.5)
                humidity = max(30.0, min(95.0, loc["base_humidity"] - (temp_factor * 12.0) + random.uniform(-2, 2)))
                wind_speed = max(1.2, loc["base_wind_speed"] + (temp_factor * 2.0) + random.uniform(-0.8, 0.8))
                wind_dir = (loc["base_wind_dir"] + random.randint(-15, 15)) % 360

                records.append({
                    "timestamp": timestamp.isoformat(),
                    "hour": hour,
                    "pm25": round(pm25, 1),
                    "pm10": round(pm10, 1),
                    "no2": round(no2, 1),
                    "co": round(co, 2),
                    "temp": round(temp, 1),
                    "humidity": round(humidity, 1),
                    "wind_speed": round(wind_speed, 1),
                    "wind_dir": int(wind_dir)
                })
            self.location_history[loc_id] = records

    def set_manual_telemetry(self, location_id: str, data: Dict[str, Any]):
        """Sets custom manual values for real-time testing sandbox."""
        self.manual_overrides[location_id] = data

    def clear_manual_telemetry(self, location_id: Optional[str] = None):
        """Clears manual telemetry overrides, restoring natural simulation."""
        if location_id:
            self.manual_overrides.pop(location_id, None)
        else:
            self.manual_overrides.clear()

    def register_custom_location(self, lat: float, lon: float, name: Optional[str] = None, city: Optional[str] = None) -> Dict[str, Any]:
        """Dynamically interpolates and registers a new observation node from any clicked coordinate on the map."""
        # Check if already registered nearby (< 1km)
        for loc_id, existing in list(LOCATIONS.items()):
            if loc_id.startswith("custom-") and abs(existing["lat"] - lat) < 0.01 and abs(existing["lon"] - lon) < 0.01:
                return existing

        # Inverse Distance Weighting interpolation from existing real stations
        distances = []
        for loc_id, loc in LOCATIONS.items():
            if loc_id.startswith("custom-"):
                continue
            d_lat = (loc["lat"] - lat) * 111.0
            d_lon = (loc["lon"] - lon) * 111.0 * math.cos(math.radians(lat))
            dist = math.sqrt(d_lat**2 + d_lon**2)
            distances.append((dist, loc))

        distances.sort(key=lambda x: x[0])
        nearest_dist, nearest_station = distances[0]

        detected_city = city or (nearest_station["city"] if nearest_dist < 120 else "Regional Sensor Site")
        station_name = name or f"Point ({lat:.3f}°N, {lon:.3f}°E)"

        weights = [1.0 / (max(2.0, d)**1.5) for d, _ in distances]
        total_weight = sum(weights)

        def interpolate(key):
            return sum(w * s[key] for w, (_, s) in zip(weights, distances)) / total_weight

        interp_pm25 = interpolate("base_pm25")
        interp_pm10 = interpolate("base_pm10")
        interp_no2 = interpolate("base_no2")
        interp_co = interpolate("base_co")
        interp_temp = interpolate("base_temp")
        interp_hum = interpolate("base_humidity")
        interp_wind_s = interpolate("base_wind_speed")
        interp_wind_d = nearest_station["base_wind_dir"]

        custom_id = f"custom-{abs(int(lat*10000))}-{abs(int(lon*10000))}"
        new_loc = {
            "id": custom_id,
            "city": detected_city,
            "name": station_name,
            "zone_type": f"Map Point (~{int(nearest_dist)}km from {nearest_station['name']})",
            "lat": round(lat, 5),
            "lon": round(lon, 5),
            "baseline_aqi": int(interp_pm25 * 2.2),
            "base_pm25": round(interp_pm25, 1),
            "base_pm10": round(interp_pm10, 1),
            "base_no2": round(interp_no2, 1),
            "base_co": round(interp_co, 2),
            "base_temp": round(interp_temp, 1),
            "base_humidity": round(interp_hum, 1),
            "base_wind_speed": round(interp_wind_s, 1),
            "base_wind_dir": int(interp_wind_d),
            "is_custom": True
        }

        LOCATIONS[custom_id] = new_loc

        # Seed 24h history for this custom location
        now = datetime.now()
        records = []
        for h in range(24, 0, -1):
            timestamp = now - timedelta(hours=h)
            hour = timestamp.hour
            traffic_mult = 1.35 if (8 <= hour <= 10 or 18 <= hour <= 21) else (0.8 if 1 <= hour <= 5 else 1.0)
            temp_factor = math.sin((hour - 9) * math.pi / 12)
            records.append({
                "timestamp": timestamp.isoformat(),
                "hour": hour,
                "pm25": round(max(10.0, interp_pm25 * traffic_mult + random.uniform(-3, 3)), 1),
                "pm10": round(max(20.0, interp_pm10 * traffic_mult + random.uniform(-6, 6)), 1),
                "no2": round(max(8.0, interp_no2 * traffic_mult + random.uniform(-2, 2)), 1),
                "co": round(max(0.3, interp_co * traffic_mult + random.uniform(-0.1, 0.1)), 2),
                "temp": round(interp_temp + (temp_factor * 4.0) + random.uniform(-0.5, 0.5), 1),
                "humidity": round(max(20.0, min(95.0, interp_hum - (temp_factor * 10.0))), 1),
                "wind_speed": round(max(1.0, interp_wind_s + random.uniform(-0.5, 0.5)), 1),
                "wind_dir": int((interp_wind_d + random.randint(-15, 15)) % 360)
            })
        self.location_history[custom_id] = records

        return new_loc

    def set_mode(self, mode: str):
        if mode in ["REAL", "HISTORICAL", "SIMULATED", "DEMO", "MANUAL"]:
            self.mode = mode
            if mode == "DEMO":
                self.demo_active = True
                self.demo_step = 0
            else:
                self.demo_active = False

    def set_demo_step(self, step: int):
        self.demo_step = max(0, min(step, self.demo_max_steps))
        self.demo_active = True
        self.mode = "DEMO"

    def get_locations(self) -> List[Dict[str, Any]]:
        return list(LOCATIONS.values())

    def get_location_by_id(self, loc_id: str) -> Dict[str, Any]:
        return LOCATIONS.get(loc_id, LOCATIONS["delhi-anand-vihar"])

    def get_current_reading(self, loc_id: str) -> Dict[str, Any]:
        loc = self.get_location_by_id(loc_id)

        # Check for active manual testing override
        if loc_id in self.manual_overrides:
            override = self.manual_overrides[loc_id]
            wind_dir = override.get("wind_direction") if override.get("wind_direction") is not None else loc["base_wind_dir"]
            temp = override.get("temperature") if override.get("temperature") is not None else loc["base_temp"]
            hum = override.get("humidity") if override.get("humidity") is not None else loc["base_humidity"]
            wind_s = override.get("wind_speed") if override.get("wind_speed") is not None else loc["base_wind_speed"]
            return {
                "location_id": loc["id"],
                "location_name": loc["name"],
                "city": loc["city"],
                "zone_type": loc["zone_type"],
                "lat": loc["lat"],
                "lon": loc["lon"],
                "timestamp": datetime.now().isoformat(),
                "mode": "MANUAL",
                "manual_testing": True,
                "pollutants": {
                    "pm25": round(float(override["pm25"]), 1),
                    "pm10": round(float(override["pm10"]), 1),
                    "no2": round(float(override["no2"]), 1),
                    "co": round(float(override["co"]), 2)
                },
                "weather": {
                    "temperature": round(float(temp), 1),
                    "humidity": round(float(hum), 1),
                    "wind_speed": round(float(wind_s), 1),
                    "wind_direction": int(wind_dir),
                    "wind_direction_cardinal": self._degrees_to_cardinal(int(wind_dir))
                }
            }

        # If in DEMO mode and this is the active demo station (Anand Vihar default)
        if self.mode == "DEMO" and (loc_id == "delhi-anand-vihar" or loc_id == "delhi-okhla"):
            return self._get_demo_reading(loc)

        # Normal Simulated mode with realistic gentle live drift
        t = time.time()
        drift = math.sin(t / 120.0) * 0.15
        noise_pm25 = random.uniform(-2.0, 2.0)
        noise_pm10 = random.uniform(-4.0, 4.0)
        
        pm25 = max(10.0, loc["base_pm25"] * (1.0 + drift) + noise_pm25)
        pm10 = max(20.0, loc["base_pm10"] * (1.0 + drift) + noise_pm10)
        no2 = max(8.0, loc["base_no2"] * (1.0 + drift * 0.8) + random.uniform(-1.5, 1.5))
        co = max(0.3, loc["base_co"] * (1.0 + drift * 0.6) + random.uniform(-0.08, 0.08))
        temp = loc["base_temp"] + random.uniform(-0.3, 0.3)
        humidity = max(20.0, min(98.0, loc["base_humidity"] + random.uniform(-1.0, 1.0)))
        wind_speed = max(1.0, loc["base_wind_speed"] + random.uniform(-0.5, 0.5))
        wind_dir = (loc["base_wind_dir"] + random.randint(-5, 5)) % 360

        return {
            "location_id": loc["id"],
            "location_name": loc["name"],
            "city": loc["city"],
            "zone_type": loc["zone_type"],
            "lat": loc["lat"],
            "lon": loc["lon"],
            "timestamp": datetime.now().isoformat(),
            "mode": self.mode,
            "pollutants": {
                "pm25": round(pm25, 1),
                "pm10": round(pm10, 1),
                "no2": round(no2, 1),
                "co": round(co, 2)
            },
            "weather": {
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_direction": int(wind_dir),
                "wind_direction_cardinal": self._degrees_to_cardinal(wind_dir)
            }
        }

    def _get_demo_reading(self, loc: Dict[str, Any]) -> Dict[str, Any]:
        """
        Controlled 8-Step Hackathon Demo Scenario:
        Step 0: Baseline state: AQI ~ 118 (Satisfactory / Moderate)
        Step 1: PM2.5 begins increasing (+25%), Wind speed softens
        Step 2: Rapid PM2.5 surge (+55%), Anomaly detector triggers!
        Step 3: Secondary pollutants (PM10, NO2) rise, Hotspot score hits critical
        Step 4: AQI peaks into Poor/Very Poor (AQI 280-320)
        Step 5: ML forecast model projects continued severe stagnation
        Step 6: Smart Alert engine fires critical multi-factor alert
        Step 7: Explainable AI insight tree explains accumulation mechanics
        Step 8: Recovery event - fresh westerly wind (8.5 m/s) disperses pollutants, AQI drops to clean baseline!
        """
        step = self.demo_step

        profiles = [
            # Step 0: Baseline (AQI ~ 118)
            {"pm25": 42.0, "pm10": 98.0, "no2": 36.0, "co": 1.1, "temp": 28.0, "hum": 55.0, "wind_s": 5.5, "wind_d": 300, "phase": "Baseline Monitoring"},
            # Step 1: Early Rise
            {"pm25": 65.0, "pm10": 130.0, "no2": 44.0, "co": 1.4, "temp": 28.2, "hum": 59.0, "wind_s": 3.8, "wind_d": 290, "phase": "Early Concentration Increase"},
            # Step 2: Anomaly Triggered Spike
            {"pm25": 115.0, "pm10": 195.0, "no2": 58.0, "co": 1.9, "temp": 28.5, "hum": 64.0, "wind_s": 2.2, "wind_d": 270, "phase": "Statistical Anomaly Detected (+62% surge)"},
            # Step 3: Hotspot Formation
            {"pm25": 145.0, "pm10": 260.0, "no2": 72.0, "co": 2.5, "temp": 28.8, "hum": 68.0, "wind_s": 1.8, "wind_d": 260, "phase": "Hotspot Score Elevates (Spatial Deviation)"},
            # Step 4: AQI Peaks into Severe/Very Poor
            {"pm25": 185.0, "pm10": 320.0, "no2": 88.0, "co": 3.1, "temp": 29.0, "hum": 70.0, "wind_s": 1.3, "wind_d": 250, "phase": "AQI Exceeds Unhealthy Thresholds (AQI > 310)"},
            # Step 5: Predictive Deterioration
            {"pm25": 192.0, "pm10": 335.0, "no2": 92.0, "co": 3.3, "temp": 29.1, "hum": 72.0, "wind_s": 1.1, "wind_d": 240, "phase": "ML Model Forecasts Prolonged Inversion"},
            # Step 6: Critical Alert Active
            {"pm25": 190.0, "pm10": 330.0, "no2": 90.0, "co": 3.2, "temp": 29.0, "hum": 71.0, "wind_s": 1.2, "wind_d": 240, "phase": "Multi-Trigger Smart Alert Dispatched"},
            # Step 7: Explainable AI Diagnosis Active
            {"pm25": 178.0, "pm10": 305.0, "no2": 82.0, "co": 2.9, "temp": 28.7, "hum": 68.0, "wind_s": 2.4, "wind_d": 260, "phase": "Explainable Diagnosis & Action Recommendations"},
            # Step 8: Atmospheric Dispersion Recovery
            {"pm25": 32.0, "pm10": 68.0, "no2": 26.0, "co": 0.8, "temp": 27.2, "hum": 48.0, "wind_s": 8.8, "wind_d": 315, "phase": "Wind Influx Dispersion - Recovery Complete (AQI Good)"}
        ]

        p = profiles[min(step, len(profiles) - 1)]
        return {
            "location_id": loc["id"],
            "location_name": loc["name"],
            "city": loc["city"],
            "zone_type": loc["zone_type"],
            "lat": loc["lat"],
            "lon": loc["lon"],
            "timestamp": datetime.now().isoformat(),
            "mode": "DEMO",
            "demo_scenario": {
                "step": step,
                "max_steps": len(profiles) - 1,
                "phase_name": p["phase"],
                "is_recovery": step == 8
            },
            "pollutants": {
                "pm25": p["pm25"],
                "pm10": p["pm10"],
                "no2": p["no2"],
                "co": p["co"]
            },
            "weather": {
                "temperature": p["temp"],
                "humidity": p["hum"],
                "wind_speed": p["wind_s"],
                "wind_direction": p["wind_d"],
                "wind_direction_cardinal": self._degrees_to_cardinal(p["wind_d"])
            }
        }

    def get_history(self, loc_id: str, hours: int = 24) -> List[Dict[str, Any]]:
        history = self.location_history.get(loc_id, [])
        return history[-hours:]

    @staticmethod
    def _degrees_to_cardinal(deg: int) -> str:
        dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
        ix = int((deg + 11.25) / 22.5) % 16
        return dirs[ix]

# Global singleton
data_provider = DataProvider()
