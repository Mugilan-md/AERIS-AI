import React from 'react';
import { AlertTriangle, Zap, ArrowUpRight, Sparkles } from 'lucide-react';
import { AnomalyData } from '../types';

interface AnomalyBannerProps {
  anomaly: AnomalyData;
  onOpenExplain: () => void;
}

export const AnomalyBanner: React.FC<AnomalyBannerProps> = ({
  anomaly,
  onOpenExplain
}) => {
  if (!anomaly.has_anomaly || !anomaly.anomalies.length) return null;

  const top = anomaly.anomalies[0];

  return (
    <div className="bg-white clay-card p-4 sm:p-5 mb-6 ring-2 ring-[#FFB3A0] shadow-[0_8px_24px_rgba(255,179,160,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all animate-in slide-in-from-top-2">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-[#FFB3A0] flex items-center justify-center shrink-0 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)]">
          <Zap className="w-5 h-5 text-[#2D2D2D]" strokeWidth={2.5} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFB3A0] text-[#2D2D2D]">
              Statistical Anomaly Detected
            </span>
            <span className="text-xs font-bold text-[#6B6B6B]">
              Z-Score: +{top.z_score}σ
            </span>
          </div>
          <h4 className="text-base font-black text-[#2D2D2D] mt-0.5">
            Sudden {top.pollutant_name} Spike (+{top.rate_of_change_pct}%)
          </h4>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            {top.explanation}
          </p>
        </div>
      </div>

      <button
        onClick={onOpenExplain}
        className="self-end sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#2D2D2D] text-white text-xs font-bold clay-button shrink-0"
      >
        <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span>Investigate Cause</span>
      </button>
    </div>
  );
};
