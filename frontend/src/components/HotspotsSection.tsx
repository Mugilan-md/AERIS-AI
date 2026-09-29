import React, { useState } from 'react';
import { Flame, MapPin, ArrowUpRight, Wind, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { HotspotData } from '../types';

interface HotspotsSectionProps {
  hotspots: HotspotData[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
}

export const HotspotsSection: React.FC<HotspotsSectionProps> = ({
  hotspots,
  selectedLocationId,
  onSelectLocation
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(selectedLocationId);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'clay-hazardous text-[#2D2D2D]';
      case 'HIGH':
        return 'clay-unhealthy text-[#2D2D2D]';
      case 'MODERATE':
        return 'clay-moderate text-[#2D2D2D]';
      default:
        return 'clay-good text-[#2D2D2D]';
    }
  };

  return (
    <div className="bg-white clay-card p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
              Spatial Intelligence & Network Analytics
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE5A0] text-[#2D2D2D]">
              Composite Scoring
            </span>
          </div>
          <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight mt-0.5">
            Urban Pollution Hotspots
          </h3>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            Transparent spatial density, baseline excess, and microclimate ventilation scoring
          </p>
        </div>

        <div className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-[#F0EBE5] text-[#2D2D2D] self-start sm:self-auto">
          {hotspots.filter(h => h.hotspot_score >= 50).length} Elevated Zones Active
        </div>
      </div>

      {/* Hotspots List */}
      <div className="space-y-3">
        {hotspots.map((h) => {
          const isSelected = h.location_id === selectedLocationId;
          const isExpanded = expandedId === h.location_id;

          return (
            <div
              key={h.location_id}
              className={`rounded-2xl transition-all ${
                isSelected ? 'ring-2 ring-[#2D2D2D]/30 bg-[#F8F5F2]' : 'bg-[#FDFBF7] hover:bg-[#F8F5F2]'
              } clay-inset p-4`}
            >
              {/* Summary Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${getSeverityBadge(
                      h.severity
                    )}`}
                  >
                    <Flame className="w-5 h-5 text-[#2D2D2D]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[#2D2D2D]">
                        {h.location_name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#6B6B6B]">
                        {h.city}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#6B6B6B] flex items-center gap-2 mt-0.5">
                      <span>AQI: <strong className="text-[#2D2D2D]">{h.aqi}</strong> ({h.aqi_category})</span>
                      <span>•</span>
                      <span>Primary: <strong className="text-[#2D2D2D]">{h.dominant_pollutant}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Hotspot Score Pill & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                      Hotspot Index
                    </span>
                    <div className="text-lg font-black text-[#2D2D2D]">
                      {h.hotspot_score} <span className="text-xs font-normal text-[#6B6B6B]">/ 100</span>
                    </div>
                  </div>

                  <span className={`text-xs font-black px-3 py-1 rounded-full ${getSeverityBadge(h.severity)}`}>
                    {h.severity}
                  </span>

                  {/* Switch to this location */}
                  {!isSelected && (
                    <button
                      onClick={() => onSelectLocation(h.location_id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0EBE5] text-xs font-bold text-[#2D2D2D] clay-pill"
                    >
                      Focus
                    </button>
                  )}

                  {/* Toggle Explain Factors */}
                  <button
                    onClick={() => toggleExpand(h.location_id)}
                    className="p-1.5 rounded-xl bg-white text-[#6B6B6B] hover:text-[#2D2D2D]"
                    title="Toggle Factor Breakdown"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Factor Decomposition: "WHY IS THIS A HOTSPOT?" */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-black/5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2D2D2D] mb-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#2D2D2D]" strokeWidth={2.5} />
                    <span>Why Is This A Hotspot? (Transparent Factor Decomposition)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {h.factors.map((factor, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#6B6B6B]">{factor.name}</span>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#F0EBE5] text-[#2D2D2D]">
                            {factor.impact}
                          </span>
                        </div>
                        <div className="text-sm font-black text-[#2D2D2D] my-1">
                          {factor.value}
                        </div>
                        <div className="text-[10px] font-semibold text-[#6B6B6B]">
                          {factor.detail}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 text-[11px] font-bold text-[#6B6B6B] flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Atmospheric condition: <strong>{h.dispersion_status}</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
