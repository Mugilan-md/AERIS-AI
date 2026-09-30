import {
  DashboardResponse,
  HotspotData,
  ForecastData,
  AlertItem,
  XAIExplanationResponse,
  StationLocation
} from '../types';
import { fallbackEngine } from './fallbackEngine';

export type BackendConnectionStatus = 'CLOUD_LIVE' | 'WARMING_UP' | 'OFFLINE_FALLBACK';

let currentStatus: BackendConnectionStatus = 'WARMING_UP';
const listeners = new Set<(status: BackendConnectionStatus) => void>();

export function getBackendStatus(): BackendConnectionStatus {
  return currentStatus;
}

export function subscribeBackendStatus(listener: (status: BackendConnectionStatus) => void): () => void {
  listeners.add(listener);
  listener(currentStatus);
  return () => listeners.delete(listener);
}

function notifyStatus(newStatus: BackendConnectionStatus) {
  if (currentStatus !== newStatus) {
    currentStatus = newStatus;
    listeners.forEach((fn) => {
      try {
        fn(newStatus);
      } catch (e) {
        console.error('Error in status listener', e);
      }
    });
  }
}

const rawBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_BASE = rawBase ? `${rawBase}/api` : '/api';

/**
 * Fetch wrapper with strict timeout to prevent long hanging cold-start requests
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 4500): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Background poller to detect when cloud backend wakes up
let pollerActive = false;
function startBackgroundWakeupPoller() {
  if (pollerActive) return;
  pollerActive = true;

  const intervalId = setInterval(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/status`, {}, 3500);
      if (res.ok) {
        notifyStatus('CLOUD_LIVE');
        clearInterval(intervalId);
        pollerActive = false;
      }
    } catch {
      // Still warming up, keep polling
    }
  }, 5000);
}

// Initial silent wake-up probe
(function probeBackend() {
  fetchWithTimeout(`${API_BASE}/status`, {}, 3500)
    .then((res) => {
      if (res.ok) {
        notifyStatus('CLOUD_LIVE');
      } else {
        notifyStatus('WARMING_UP');
        startBackgroundWakeupPoller();
      }
    })
    .catch(() => {
      notifyStatus('WARMING_UP');
      startBackgroundWakeupPoller();
    });
})();

export async function fetchLocations(): Promise<StationLocation[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/locations`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    notifyStatus('CLOUD_LIVE');
    return data;
  } catch (err) {
    console.warn('[AERIS Resilient Engine] Cloud backend warming up, serving edge stations:', err);
    notifyStatus('WARMING_UP');
    startBackgroundWakeupPoller();
    return fallbackEngine.getLocations();
  }
}

export async function fetchDashboard(locationId: string): Promise<DashboardResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/dashboard?location_id=${encodeURIComponent(locationId)}`, {}, 4500);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    notifyStatus('CLOUD_LIVE');
    return data;
  } catch (err) {
    console.warn(`[AERIS Resilient Engine] Cloud backend warming up, computing dashboard for ${locationId}:`, err);
    notifyStatus('WARMING_UP');
    startBackgroundWakeupPoller();
    return fallbackEngine.getDashboard(locationId);
  }
}

export async function fetchHotspots(): Promise<HotspotData[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/hotspots`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    notifyStatus('CLOUD_LIVE');
    return data;
  } catch (err) {
    console.warn('[AERIS Resilient Engine] Serving fallback hotspots');
    return fallbackEngine.getDashboard('delhi-anand-vihar').all_hotspots;
  }
}

export async function fetchForecast(locationId: string): Promise<ForecastData> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/forecast?location_id=${encodeURIComponent(locationId)}`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    notifyStatus('CLOUD_LIVE');
    return data;
  } catch (err) {
    console.warn('[AERIS Resilient Engine] Serving fallback forecast');
    return fallbackEngine.getDashboard(locationId).forecast;
  }
}

export async function fetchAlerts(locationId?: string): Promise<{
  active_alerts: AlertItem[];
  forecast_alerts: AlertItem[];
  resolved_alerts: AlertItem[];
}> {
  try {
    const url = locationId ? `${API_BASE}/alerts?location_id=${encodeURIComponent(locationId)}` : `${API_BASE}/alerts`;
    const res = await fetchWithTimeout(url, {}, 4000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    notifyStatus('CLOUD_LIVE');
    return data;
  } catch (err) {
    console.warn('[AERIS Resilient Engine] Serving fallback alerts');
    const dash = fallbackEngine.getDashboard(locationId || 'delhi-anand-vihar');
    return {
      active_alerts: dash.alerts.filter((a) => a.status === 'ACTIVE'),
      forecast_alerts: dash.alerts.filter((a) => a.status === 'FORECAST'),
      resolved_alerts: [
        {
          id: 'res-delhi-001',
          type: 'THRESHOLD',
          severity: 'RESOLVED',
          severity_color: '#B8E6D5',
          title: 'Severe Peak Exceedance Resolved',
          location_id: 'delhi-anand-vihar',
          location_name: 'Anand Vihar Eco-Station',
          current_aqi: 94,
          dominant_pollutant: 'PM2.5',
          trend: 'Cleared',
          reason: 'Pollutant concentrations subsided below national ambient air quality limit.',
          forecast_note: 'Atmospheric boundary layer well-ventilated.',
          recommendation: 'Air quality safe for outdoor physical exertion.',
          timestamp: '2 hours ago',
          status: 'RESOLVED'
        },
        {
          id: 'res-okhla-002',
          type: 'HOTSPOT',
          severity: 'RESOLVED',
          severity_color: '#B8E6D5',
          title: 'Industrial Microclimate Dissipated',
          location_id: 'delhi-okhla',
          location_name: 'Okhla Industrial Area Phase-II',
          current_aqi: 110,
          dominant_pollutant: 'PM10',
          trend: 'Cleared',
          reason: 'Wind velocity increase (6.8 m/s) restored aerodynamic dispersion.',
          forecast_note: 'Stagnant thermal inversion dissipated.',
          recommendation: 'Normal activity guidelines apply.',
          timestamp: '5 hours ago',
          status: 'RESOLVED'
        }
      ]
    };
  }
}

export async function fetchExplanation(locationId: string): Promise<XAIExplanationResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/explain?location_id=${encodeURIComponent(locationId)}`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    notifyStatus('CLOUD_LIVE');
    return data;
  } catch (err) {
    console.warn('[AERIS Resilient Engine] Serving fallback explanation');
    return fallbackEngine.getExplanation(locationId);
  }
}

export async function setDemoStep(step: number): Promise<{ status: string; demo_step: number; mode: string }> {
  fallbackEngine.setDemoStep(step);
  try {
    const res = await fetchWithTimeout(`${API_BASE}/demo/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step })
    }, 3000);
    if (res.ok) {
      notifyStatus('CLOUD_LIVE');
      return res.json();
    }
  } catch {
    // Cloud backend warming up, fallbackEngine is already updated
  }
  return { status: 'updated', demo_step: step, mode: 'DEMO' };
}

export async function setMode(mode: string): Promise<{ status: string; mode: string; demo_active: boolean }> {
  fallbackEngine.setMode(mode);
  try {
    const res = await fetchWithTimeout(`${API_BASE}/demo/mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    }, 3000);
    if (res.ok) {
      notifyStatus('CLOUD_LIVE');
      return res.json();
    }
  } catch {
    // Fallback updated
  }
  return { status: 'updated', mode, demo_active: mode === 'DEMO' };
}

export async function createCustomLocation(
  lat: number,
  lon: number,
  name?: string,
  city?: string
): Promise<{ status: string; location: StationLocation; all_locations: StationLocation[] }> {
  const localLoc = fallbackEngine.registerCustomLocation(lat, lon, name, city);
  try {
    const res = await fetchWithTimeout(`${API_BASE}/locations/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, name, city })
    }, 3000);
    if (res.ok) {
      notifyStatus('CLOUD_LIVE');
      return res.json();
    }
  } catch {
    // Fallback updated
  }
  return {
    status: 'created',
    location: localLoc,
    all_locations: fallbackEngine.getLocations()
  };
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
  fallbackEngine.setManualTelemetry(payload);
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manual/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }, 3000);
    if (res.ok) {
      notifyStatus('CLOUD_LIVE');
      return res.json();
    }
  } catch {
    // Fallback updated
  }
  return { status: 'updated', location_id: payload.location_id, mode: 'MANUAL' };
}

export async function resetManualTelemetry(locationId?: string): Promise<{ status: string; mode: string }> {
  fallbackEngine.resetManualTelemetry(locationId);
  try {
    const res = await fetchWithTimeout(`${API_BASE}/manual/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location_id: locationId })
    }, 3000);
    if (res.ok) {
      notifyStatus('CLOUD_LIVE');
      return res.json();
    }
  } catch {
    // Fallback updated
  }
  return { status: 'reset', mode: 'SIMULATED' };
}
