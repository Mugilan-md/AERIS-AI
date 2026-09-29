import React, { useState } from 'react';
import { AlertTriangle, Bell, Clock, ShieldCheck, Sparkles, Filter, CheckCircle2, AlertOctagon } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertsSectionProps {
  alerts: AlertItem[];
  resolvedAlerts: AlertItem[];
  onOpenExplain: () => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  alerts,
  resolvedAlerts,
  onOpenExplain
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'ACTIVE' | 'FORECAST' | 'RESOLVED'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const combinedAlerts = [
    ...alerts,
    ...resolvedAlerts
  ];

  const filteredAlerts = combinedAlerts.filter(a => {
    if (filterType === 'ACTIVE' && a.status !== 'ACTIVE') return false;
    if (filterType === 'FORECAST' && a.status !== 'FORECAST') return false;
    if (filterType === 'RESOLVED' && a.status !== 'RESOLVED') return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'clay-hazardous text-[#2D2D2D]';
      case 'WARNING':
        return 'clay-unhealthy text-[#2D2D2D]';
      case 'ADVISORY':
        return 'clay-moderate text-[#2D2D2D]';
      case 'RESOLVED':
        return 'clay-good text-[#2D2D2D]';
      default:
        return 'bg-[#F0EBE5] text-[#2D2D2D]';
    }
  };

  return (
    <div className="bg-white clay-card p-6 lg:p-8 space-y-6">
      {/* Header & Status Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
              Context-Aware Decision Support
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFB3A0] text-[#2D2D2D]">
              Multi-Trigger Rules
            </span>
          </div>
          <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight mt-0.5">
            Smart Alert Center
          </h3>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            Automated alerts synthesized from threshold triggers, statistical anomalies, and forecast models
          </p>
        </div>

        {/* Global XAI Explain Trigger */}
        <button
          onClick={onOpenExplain}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F0EBE5] hover:bg-[#E8E2DC] text-xs font-bold text-[#2D2D2D] clay-button"
        >
          <Sparkles className="w-4 h-4 text-[#2D2D2D]" strokeWidth={2.5} />
          <span>Why This Alert?</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-[#F8F5F2] rounded-full clay-inset">
          {[
            { id: 'ALL', label: `All (${combinedAlerts.length})` },
            { id: 'ACTIVE', label: `Active (${alerts.filter(a => a.status === 'ACTIVE').length})` },
            { id: 'FORECAST', label: `Forecast Alerts (${alerts.filter(a => a.status === 'FORECAST').length})` },
            { id: 'RESOLVED', label: `Resolved (${resolvedAlerts.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterType === tab.id
                  ? 'bg-[#2D2D2D] text-white shadow-sm'
                  : 'text-[#6B6B6B] hover:text-[#2D2D2D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Severity Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#6B6B6B]" strokeWidth={2.5} />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs font-bold text-[#2D2D2D] bg-[#F8F5F2] px-3 py-1.5 rounded-xl clay-inset cursor-pointer focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="ADVISORY">Advisory</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-[#F8F5F2] rounded-2xl clay-inset">
            <ShieldCheck className="w-10 h-10 text-[#B8E6D5] mx-auto mb-2" strokeWidth={2.5} />
            <h4 className="text-sm font-black text-[#2D2D2D]">No alerts matching criteria</h4>
            <p className="text-xs font-semibold text-[#6B6B6B] mt-1">
              All monitored atmospheric parameters in this category are nominal.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl clay-inset flex flex-col justify-between transition-all ${
                alert.status === 'RESOLVED' ? 'bg-[#FDFBF7] opacity-80' : 'bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${getSeverityStyle(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F0EBE5] text-[#2D2D2D]">
                    {alert.type}
                  </span>
                  <h4 className="text-base font-black text-[#2D2D2D] tracking-tight">
                    {alert.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B6B]">
                  <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              {/* Alert Content Body */}
              <div className="space-y-2.5 my-1">
                <p className="text-xs font-bold text-[#2D2D2D] leading-relaxed">
                  {alert.reason}
                </p>

                {alert.forecast_note && (
                  <div className="text-xs font-semibold text-[#6B6B6B] bg-[#F8F5F2] p-2.5 rounded-xl">
                    <strong className="text-[#2D2D2D]">Near-term expectation: </strong>
                    {alert.forecast_note}
                  </div>
                )}

                {/* Practical non-medical recommendation */}
                <div className="p-3 rounded-xl bg-[#F0EBE5]/70 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2D2D2D] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-xs font-bold text-[#2D2D2D] leading-relaxed">
                    <span className="font-extrabold text-[#2D2D2D]">Actionable Advisory: </span>
                    {alert.recommendation}
                  </p>
                </div>
              </div>

              {/* Footer info & XAI hook */}
              <div className="mt-4 pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs font-bold text-[#6B6B6B]">
                  <span>Zone: <strong className="text-[#2D2D2D]">{alert.location_name}</strong></span>
                  <span>•</span>
                  <span>AQI: <strong className="text-[#2D2D2D]">{alert.current_aqi}</strong></span>
                  <span>•</span>
                  <span>Leading Pollutant: <strong className="text-[#2D2D2D]">{alert.dominant_pollutant}</strong></span>
                </div>

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={onOpenExplain}
                    className="text-xs font-bold text-[#2D2D2D] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#2D2D2D]" strokeWidth={2.5} />
                    <span>Explain Diagnostic Chain →</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
