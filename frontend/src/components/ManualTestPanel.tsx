import React, { useState } from 'react';
import { FlaskConical, RotateCcw, Send, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { StationLocation } from '../types';
import { setManualTelemetry, resetManualTelemetry } from '../services/api';

interface ManualTestPanelProps {
  locations: StationLocation[];
  selectedLocationId: string;
  onApply: (locationId: string) => void;
  onReset: () => void;
}

const PRESET_SCENARIOS = [
  {
    label: 'Severe Smog Event',
    color: '#D4A5A5',
    values: { pm25: 185, pm10: 320, no2: 88, co: 3.1, wind_speed: 1.3, wind_direction: 250, temperature: 29.0, humidity: 70 }
  },
  {
    label: 'Moderate Urban',
    color: '#FFE5A0',
    values: { pm25: 65, pm10: 130, no2: 44, co: 1.4, wind_speed: 3.8, wind_direction: 290, temperature: 28.2, humidity: 59 }
  },
  {
    label: 'Clean Recovery (Wind)',
    color: '#B8E6D5',
    values: { pm25: 32, pm10: 68, no2: 26, co: 0.8, wind_speed: 8.8, wind_direction: 315, temperature: 27.2, humidity: 48 }
  },
  {
    label: 'Baseline (Good AQI)',
    color: '#A8D5E2',
    values: { pm25: 18, pm10: 42, no2: 18, co: 0.5, wind_speed: 6.5, wind_direction: 270, temperature: 26.5, humidity: 55 }
  }
];

export const ManualTestPanel: React.FC<ManualTestPanelProps> = ({
  locations,
  selectedLocationId,
  onApply,
  onReset
}) => {
  const [locationId, setLocationId] = useState(selectedLocationId);
  const [pm25, setPm25] = useState('85');
  const [pm10, setPm10] = useState('160');
  const [no2, setNo2] = useState('52');
  const [co, setCo] = useState('1.8');
  const [windSpeed, setWindSpeed] = useState('4.2');
  const [windDir, setWindDir] = useState('290');
  const [temp, setTemp] = useState('28.5');
  const [humidity, setHumidity] = useState('58');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const applyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    const v = preset.values;
    setPm25(String(v.pm25));
    setPm10(String(v.pm10));
    setNo2(String(v.no2));
    setCo(String(v.co));
    setWindSpeed(String(v.wind_speed));
    setWindDir(String(v.wind_direction));
    setTemp(String(v.temperature));
    setHumidity(String(v.humidity));
  };

  const handleApply = async () => {
    setStatus('loading');
    setStatusMsg('Injecting telemetry into pipeline…');
    try {
      await setManualTelemetry({
        location_id: locationId,
        pm25: parseFloat(pm25),
        pm10: parseFloat(pm10),
        no2: parseFloat(no2),
        co: parseFloat(co),
        wind_speed: parseFloat(windSpeed),
        wind_direction: parseInt(windDir),
        temperature: parseFloat(temp),
        humidity: parseFloat(humidity)
      });
      setStatus('success');
      setStatusMsg('Telemetry active — Dashboard now reflects your custom values!');
      onApply(locationId);
      setTimeout(() => { setStatus('idle'); setStatusMsg(''); }, 5000);
    } catch {
      setStatus('error');
      setStatusMsg('Failed to push telemetry. Is the backend running?');
      setTimeout(() => { setStatus('idle'); setStatusMsg(''); }, 4000);
    }
  };

  const handleReset = async () => {
    setStatus('loading');
    try {
      await resetManualTelemetry(locationId);
      setStatus('idle');
      setStatusMsg('');
      onReset();
    } catch {
      setStatus('error');
      setStatusMsg('Reset failed.');
      setTimeout(() => { setStatus('idle'); setStatusMsg(''); }, 3000);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-xl bg-[#F8F5F2] clay-inset text-xs font-bold text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#A8D5E2] placeholder:text-[#9B9B9B] transition-all";
  const labelCls = "text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B] mb-1 block";

  return (
    <div className="bg-white clay-card p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C9B8E8] flex items-center justify-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)]">
            <FlaskConical className="w-5 h-5 text-[#2D2D2D]" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
              Sensor Injection Lab
            </span>
            <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight">
              Manual Telemetry Testing
            </h3>
            <p className="text-xs font-semibold text-[#6B6B6B]">
              Inject custom pollutant values — all AI engines respond in real-time
            </p>
          </div>
        </div>

        {status !== 'idle' && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold ${
            status === 'success' ? 'bg-[#B8E6D5] text-[#2D2D2D]' :
            status === 'error' ? 'bg-[#FFB3A0] text-[#2D2D2D]' :
            'bg-[#FFE5A0] text-[#2D2D2D] animate-pulse'
          }`}>
            {status === 'success' && <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />}
            {status === 'error' && <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />}
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Preset Scenarios */}
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] mb-3 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
          Quick Presets — Click to auto-fill values
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_SCENARIOS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="p-3 rounded-2xl text-left transition-all hover:scale-[1.02] clay-button border border-black/5"
              style={{ backgroundColor: p.color }}
            >
              <div className="text-[11px] font-black text-[#2D2D2D]">{p.label}</div>
              <div className="text-[10px] font-semibold text-[#2D2D2D]/70 mt-0.5">
                PM2.5 {p.values.pm25} µg/m³
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Selector */}
      <div>
        <label className={labelCls}>Target Station</label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className={inputCls}
        >
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name} — {loc.city}
            </option>
          ))}
        </select>
      </div>

      {/* Pollutant Inputs */}
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] mb-3">
          Pollutant Concentrations
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>PM2.5 (µg/m³)</label>
            <input type="number" min="0" max="500" step="0.1" value={pm25}
              onChange={e => setPm25(e.target.value)} className={inputCls} placeholder="e.g. 85" />
          </div>
          <div>
            <label className={labelCls}>PM10 (µg/m³)</label>
            <input type="number" min="0" max="600" step="0.1" value={pm10}
              onChange={e => setPm10(e.target.value)} className={inputCls} placeholder="e.g. 160" />
          </div>
          <div>
            <label className={labelCls}>NO₂ (µg/m³)</label>
            <input type="number" min="0" max="200" step="0.1" value={no2}
              onChange={e => setNo2(e.target.value)} className={inputCls} placeholder="e.g. 52" />
          </div>
          <div>
            <label className={labelCls}>CO (mg/m³)</label>
            <input type="number" min="0" max="10" step="0.01" value={co}
              onChange={e => setCo(e.target.value)} className={inputCls} placeholder="e.g. 1.8" />
          </div>
        </div>
      </div>

      {/* Weather Inputs */}
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] mb-3">
          Microclimate Conditions (Optional)
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Wind Speed (m/s)</label>
            <input type="number" min="0" max="30" step="0.1" value={windSpeed}
              onChange={e => setWindSpeed(e.target.value)} className={inputCls} placeholder="e.g. 4.2" />
          </div>
          <div>
            <label className={labelCls}>Wind Dir (°)</label>
            <input type="number" min="0" max="359" step="1" value={windDir}
              onChange={e => setWindDir(e.target.value)} className={inputCls} placeholder="e.g. 290" />
          </div>
          <div>
            <label className={labelCls}>Temperature (°C)</label>
            <input type="number" min="-10" max="50" step="0.1" value={temp}
              onChange={e => setTemp(e.target.value)} className={inputCls} placeholder="e.g. 28.5" />
          </div>
          <div>
            <label className={labelCls}>Humidity (%)</label>
            <input type="number" min="0" max="100" step="0.1" value={humidity}
              onChange={e => setHumidity(e.target.value)} className={inputCls} placeholder="e.g. 58" />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-[#F0EBE5]/60 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#6B6B6B] shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-xs font-semibold text-[#6B6B6B] leading-relaxed">
          <strong className="text-[#2D2D2D]">How it works: </strong>
          Your values are pushed directly into the AERIS AI backend pipeline. The AQI engine, anomaly detector, ML forecast, hotspot scorer, and smart alert engine all re-run immediately with your custom telemetry.
          After clicking <strong className="text-[#2D2D2D]">Inject & Analyse</strong>, switch to the <strong className="text-[#2D2D2D]">Command Center</strong> tab to see the full dashboard respond.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black/5">
        <button
          onClick={handleApply}
          disabled={status === 'loading'}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#2D2D2D] text-white text-xs font-bold clay-button transition-all disabled:opacity-60"
        >
          {status === 'loading' ? (
            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          <span>Inject &amp; Analyse</span>
        </button>

        <button
          onClick={handleReset}
          disabled={status === 'loading'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F8F5F2] text-[#6B6B6B] text-xs font-bold clay-button hover:text-[#2D2D2D] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Reset to Simulated</span>
        </button>

        <span className="text-[10px] font-semibold text-[#9B9B9B] ml-auto hidden sm:block">
          Mode: MANUAL — overrides all sensor simulation
        </span>
      </div>
    </div>
  );
};

