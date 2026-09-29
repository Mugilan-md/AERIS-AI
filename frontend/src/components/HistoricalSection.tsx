import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { History, Calendar, Clock, Layers } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoricalSectionProps {
  history: HistoryRecord[];
  locationName: string;
}

export const HistoricalSection: React.FC<HistoricalSectionProps> = ({
  history,
  locationName
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'pm25' | 'pm10' | 'no2' | 'co' | 'wind_speed' | 'temp'>('pm25');

  const metricConfig = {
    pm25: { name: 'PM2.5 Concentration', unit: 'µg/m³', color: '#A8D5E2', stroke: '#71B2C4' },
    pm10: { name: 'PM10 Concentration', unit: 'µg/m³', color: '#FFE5A0', stroke: '#E8C56A' },
    no2: { name: 'NO2 Concentration', unit: 'µg/m³', color: '#C9B8E8', stroke: '#9F87CC' },
    co: { name: 'CO Concentration', unit: 'mg/m³', color: '#FFB3A0', stroke: '#E28670' },
    wind_speed: { name: 'Wind Velocity', unit: 'm/s', color: '#B8E6D5', stroke: '#7EC4AD' },
    temp: { name: 'Ambient Temperature', unit: '°C', color: '#FFE5A0', stroke: '#E8C56A' }
  };

  const currentCfg = metricConfig[selectedMetric];

  const chartData = history.map(h => ({
    time: `${h.hour}:00`,
    value: h[selectedMetric]
  }));

  return (
    <div className="bg-white clay-card p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
              Diurnal Baselines & Cycles
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0EBE5] text-[#2D2D2D]">
              24-Hour Buffer
            </span>
          </div>
          <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight mt-0.5">
            Historical Atmospheric Trends
          </h3>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            Continuous sensor time-series for {locationName}
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8F5F2] rounded-full clay-inset">
          {[
            { id: 'pm25', label: 'PM2.5' },
            { id: 'pm10', label: 'PM10' },
            { id: 'no2', label: 'NO2' },
            { id: 'co', label: 'CO' },
            { id: 'wind_speed', label: 'Wind' },
            { id: 'temp', label: 'Temp' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedMetric === m.id
                  ? 'bg-[#2D2D2D] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#2D2D2D]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentCfg.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentCfg.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFD9" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B6B6B', fontSize: 11, fontWeight: 700 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B6B6B', fontSize: 11, fontWeight: 700 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-xs border-none font-nunito">
                      <div className="font-extrabold text-[#2D2D2D] mb-1">{label}</div>
                      <div className="font-bold text-[#6B6B6B]">
                        {currentCfg.name}: <strong className="text-[#2D2D2D]">{payload[0].value} {currentCfg.unit}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={currentCfg.stroke}
              strokeWidth={5}
              strokeLinecap="round"
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
