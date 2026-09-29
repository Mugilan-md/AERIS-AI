import {
  DashboardResponse,
  HotspotData,
  ForecastData,
  AlertItem,
  XAIExplanationResponse,
  StationLocation
} from '../types';

const API_BASE = '/api';

export async function fetchLocations(): Promise<StationLocation[]> {
  const res = await fetch(`${API_BASE}/locations`);
  if (!res.ok) throw new Error('Failed to load locations');
  return res.json();
}

export async function fetchDashboard(locationId: string): Promise<DashboardResponse> {
  const res = await fetch(`${API_BASE}/dashboard?location_id=${encodeURIComponent(locationId)}`);
  if (!res.ok) throw new Error('Failed to load dashboard data');
  return res.json();
}

export async function fetchHotspots(): Promise<HotspotData[]> {
  const res = await fetch(`${API_BASE}/hotspots`);
  if (!res.ok) throw new Error('Failed to load hotspots');
  return res.json();
}

export async function fetchForecast(locationId: string): Promise<ForecastData> {
  const res = await fetch(`${API_BASE}/forecast?location_id=${encodeURIComponent(locationId)}`);
  if (!res.ok) throw new Error('Failed to load forecast');
  return res.json();
}

export async function fetchAlerts(locationId?: string): Promise<{
  active_alerts: AlertItem[];
  forecast_alerts: AlertItem[];
  resolved_alerts: AlertItem[];
}> {
  const url = locationId ? `${API_BASE}/alerts?location_id=${encodeURIComponent(locationId)}` : `${API_BASE}/alerts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load alerts');
  return res.json();
}

export async function fetchExplanation(locationId: string): Promise<XAIExplanationResponse> {
  const res = await fetch(`${API_BASE}/explain?location_id=${encodeURIComponent(locationId)}`);
  if (!res.ok) throw new Error('Failed to load AI explanation');
  return res.json();
}

export async function setDemoStep(step: number): Promise<{ status: string; demo_step: number; mode: string }> {
  const res = await fetch(`${API_BASE}/demo/step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step })
  });
  if (!res.ok) throw new Error('Failed to set demo step');
  return res.json();
}

export async function setMode(mode: string): Promise<{ status: string; mode: string; demo_active: boolean }> {
  const res = await fetch(`${API_BASE}/demo/mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode })
  });
  if (!res.ok) throw new Error('Failed to set mode');
  return res.json();
}

export async function createCustomLocation(lat: number, lon: number, name?: string, city?: string): Promise<{ status: string; location: StationLocation; all_locations: StationLocation[] }> {
  const res = await fetch(`${API_BASE}/locations/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lon, name, city })
  });
  if (!res.ok) throw new Error('Failed to create custom location');
  return res.json();
}

export async function setManualTelemetry(payload: {
  location_id: string;
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  wind_speed?: number;
  wind_direction?: number;
  temperature?: number;
  humidity?: number;
}): Promise<{ status: string; location_id: string; mode: string }> {
  const res = await fetch(`${API_BASE}/manual/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to set manual telemetry');
  return res.json();
}

export async function resetManualTelemetry(locationId?: string): Promise<{ status: string; mode: string }> {
  const res = await fetch(`${API_BASE}/manual/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location_id: locationId })
  });
  if (!res.ok) throw new Error('Failed to reset manual telemetry');
  return res.json();
}
