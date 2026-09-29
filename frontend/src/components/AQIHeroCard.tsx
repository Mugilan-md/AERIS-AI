import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { AQIData, StationLocation } from '../types';

interface AQIHeroCardProps {
  aqiData: AQIData;
  location: StationLocation;
  onOpenExplain: () => void;
}

export const AQIHeroCard: React.FC<AQIHeroCardProps> = ({
  aqiData,
  location,
  onOpenExplain
}) => {
  const { aqi, category, color, dominant_pollutant_name, health_advisory, contributions } = aqiData;

  // Determine trend style & icon
  const dominantPct = contributions[aqiData.dominant_pollutant] || 0;

  // Visual status background for the gauge center
  const getCategoryClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'good':
      case 'satisfactory':
        return 'clay-good text-[#2D2D2D]';
      case 'moderately polluted':
        return 'clay-moderate text-[#2D2D2D]';
      case 'poor':
      case 'unhealthy':
        return 'clay-unhealthy text-[#2D2D2D]';
      case 'very poor':
      case 'severe':
      case 'hazardous':
        return 'clay-hazardous text-[#2D2D2D]';
      default:
        return 'bg-white text-[#2D2D2D]';
    }
  };

  return (
    <div className="bg-white clay-card clay-hero p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between">
      {/* Top Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
              National Ambient Air Quality (CPCB)
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F0EBE5] text-[#2D2D2D]">
              Deterministic Sub-Index
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-[#2D2D2D] mt-0.5">
            {location.name}
          </h2>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            {location.zone_type} • {location.city}
          </p>
        </div>

        {/* Explainability Trigger Button */}
        <button
          onClick={onOpenExplain}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F0EBE5] hover:bg-[#E8E2DC] text-xs font-bold text-[#2D2D2D] clay-button transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2D2D2D]" strokeWidth={2.5} />
          <span>Why is AQI Changing?</span>
        </button>
      </div>

      {/* Main Gauge & Category Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
        {/* Giant Inflated Tactile AQI Dial */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative flex items-center justify-center">
            {/* Outer soft shadow ring */}
            <div className={`w-44 h-44 lg:w-52 lg:h-52 rounded-full flex items-center justify-center p-3 ${getCategoryClass(category)} transition-all duration-500`}>
              {/* Inner crisp white core */}
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.06),inset_0_-3px_8px_rgba(255,255,255,0.9)]">
                <span className="text-xs font-black uppercase tracking-widest text-[#6B6B6B]">
                  AQI INDEX
                </span>
                <span className="text-5xl lg:text-6xl font-black text-[#2D2D2D] tracking-tighter">
                  {aqi}
                </span>
                <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-[#F0EBE5] text-[#2D2D2D] mt-1">
                  0–500 Scale
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown & Dominant Pollutant */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                Current Air Quality Category
              </span>
            </div>
            <div className="text-2xl lg:text-3xl font-black text-[#2D2D2D] tracking-tight">
              {category}
            </div>
          </div>

          {/* Dominant Pollutant Insight Card */}
          <div className="p-4 rounded-2xl bg-[#F8F5F2] clay-inset">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A8D5E2]" />
                <span className="text-xs font-extrabold text-[#2D2D2D]">
                  Dominant Driver: <strong className="text-base text-[#2D2D2D]">{dominant_pollutant_name}</strong>
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#2D2D2D] shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                {dominantPct}% AQI Sub-index
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-2 font-medium">
              Calculated deterministically using highest sub-index via CPCB piecewise linear breakpoints.
            </p>
          </div>

          {/* Health Advisory */}
          <div className="flex items-start gap-2.5 pt-1">
            <ShieldAlert className="w-4 h-4 text-[#6B6B6B] shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="text-xs font-bold text-[#6B6B6B] leading-relaxed">
              {health_advisory}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Index Progress Bar */}
      <div className="mt-6 pt-5 border-t border-black/5">
        <div className="flex items-center justify-between text-xs font-bold text-[#6B6B6B] mb-2">
          <span>CPCB Air Quality Standard Scale</span>
          <span>{category} ({aqi} / 500)</span>
        </div>
        <div className="h-3 w-full bg-[#F0EBE5] rounded-full overflow-hidden p-0.5 flex">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(5, (aqi / 500) * 100))}%`,
              backgroundColor: color
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-[#6B6B6B] mt-1.5 px-0.5">
          <span>0 (Good)</span>
          <span>100 (Satisfactory)</span>
          <span>200 (Moderate)</span>
          <span>300 (Poor)</span>
          <span>400 (Very Poor)</span>
          <span>500 (Severe)</span>
        </div>
      </div>
    </div>
  );
};
