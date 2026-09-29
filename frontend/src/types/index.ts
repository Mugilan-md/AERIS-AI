export interface StationLocation {
  id: string;
  name: string;
  city: string;
  zone_type: string;
  lat: number;
  lon: number;
  timestamp?: string;
  mode?: string;
  demo_scenario?: {
    step: number;
    max_steps: number;
    phase_name: string;
    is_recovery: boolean;
  };
}

export interface AQIData {
  aqi: number;
  category: string;
  category_code: string;
  color: string;
  dominant_pollutant: string;
  dominant_pollutant_name: string;
  sub_indices: Record<string, number>;
  contributions: Record<string, number>;
  health_advisory: string;
}

export interface PollutantDetail {
  name: string;
  unit: string;
  value: number;
  baseline_avg: number;
  recent_change_pct: number;
  trend: 'Rising' | 'Dropping' | 'Stable';
  sub_index: number;
  contribution_pct: number;
  is_dominant: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wind_direction_cardinal: string;
}

export interface HotspotFactor {
  name: string;
  value: string;
  impact: string;
  detail: string;
}

export interface HotspotData {
  location_id: string;
  location_name: string;
  city: string;
  zone_type: string;
  lat: number;
  lon: number;
  aqi: number;
  aqi_category: string;
  dominant_pollutant: string;
  hotspot_score: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  severity_color: string;
  trend: string;
  factors: HotspotFactor[];
  dispersion_status: string;
}

export interface AnomalyItem {
  pollutant: string;
  pollutant_name: string;
  current_value: number;
  baseline_mean: number;
  z_score: number;
  rate_of_change_pct: number;
  severity: 'HIGH' | 'MODERATE';
  severity_color: string;
  timestamp: string;
  explanation: string;
}

export interface AnomalyData {
  has_anomaly: boolean;
  anomalies: AnomalyItem[];
  max_severity: string;
  summary: string;
}

export interface ForecastPrediction {
  horizon_hours: number;
  target_time: string;
  predicted_pm25: number;
  predicted_aqi: number;
  confidence_lower_pm25: number;
  confidence_upper_pm25: number;
  trend: string;
  model_rmse: number;
  model_mae: number;
}

export interface ForecastData {
  model_type: string;
  evaluation_metrics: Record<string, { mae: number; rmse: number; r2: number; sample_count: number }>;
  predictions: ForecastPrediction[];
  trajectory: 'Deteriorating' | 'Improving' | 'Stable';
  trajectory_summary: string;
  is_ml_computed: boolean;
}

export interface AlertItem {
  id: string;
  type: 'THRESHOLD' | 'ANOMALY' | 'HOTSPOT' | 'FORECAST' | 'METEOROLOGICAL';
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'RESOLVED';
  severity_color: string;
  title: string;
  location_id: string;
  location_name: string;
  current_aqi: number;
  dominant_pollutant: string;
  trend: string;
  reason: string;
  forecast_note: string;
  recommendation: string;
  timestamp: string;
  status: 'ACTIVE' | 'FORECAST' | 'RESOLVED';
}

export interface HistoryRecord {
  timestamp: string;
  hour: number;
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  temp: number;
  humidity: number;
  wind_speed: number;
  wind_dir: number;
}

export interface DashboardResponse {
  location: StationLocation;
  aqi: AQIData;
  pollutants: Record<string, PollutantDetail>;
  weather: WeatherData;
  hotspot: HotspotData | null;
  anomaly: AnomalyData;
  forecast: ForecastData;
  alerts: AlertItem[];
  all_hotspots: HotspotData[];
  history: HistoryRecord[];
}

export interface XAIExplanationResponse {
  location_name: string;
  aqi: number;
  category: string;
  dominant_pollutant: string;
  plain_english_summary: string;
  evidence_factors: Array<{
    parameter: string;
    observation: string;
    relationship: string;
    impact: string;
  }>;
  causal_chain: Array<{
    step_num: number;
    step_title: string;
    description: string;
    status: string;
  }>;
  weather_attribution: {
    wind_speed: number;
    wind_direction: string;
    temperature: number;
    humidity: number;
    scientific_note: string;
  };
}
