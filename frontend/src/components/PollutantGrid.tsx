import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Activity, ShieldAlert } from 'lucide-react';
import { PollutantDetail } from '../types';

interface PollutantGridProps {
  pollutants: Record<string, PollutantDetail>;
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ pollutants }) => {
  const pollutantKeys = ['pm25', 'pm10', 'no2', 'co'];

  const getStatusColor = (change: number, isDominant: boolean) => {
    if (isDominant) return '#FFB3A0';
    if (change > 15) return '#FFE5A0';
    return '#B8E6D5';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[#2D2D2D] tracking-tight">
            Pollutant Intelligence Matrix
          </h3>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            Real-time concentration, baseline delta, and sub-index contribution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pollutantKeys.map((key) => {
          const item = pollutants[key];
          if (!item) return null;

          const isRising = item.trend === 'Rising';
          const isDropping = item.trend === 'Dropping';

          return (
            <div
              key={key}
              className={`bg-white clay-card clay-card-hover p-5 relative overflow-hidden flex flex-col justify-between ${
                item.is_dominant ? 'ring-2 ring-[#FFB3A0]/60' : ''
              }`}
            >
              {/* Top Row: Name and Dominant Indicator */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-[#2D2D2D]">
                    {item.name}
                  </span>
                  {item.is_dominant && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFB3A0] text-[#2D2D2D]">
                      Dominant
                    </span>
                  )}
                </div>

                {/* Trend Badge */}
                <div
                  className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isRising
                      ? 'bg-[#FFB3A0]/40 text-[#2D2D2D]'
                      : isDropping
                      ? 'bg-[#B8E6D5]/60 text-[#2D2D2D]'
                      : 'bg-[#F0EBE5] text-[#6B6B6B]'
                  }`}
                >
                  {isRising && <ArrowUpRight className="w-3 h-3 text-[#2D2D2D]" strokeWidth={2.5} />}
                  {isDropping && <ArrowDownRight className="w-3 h-3 text-[#2D2D2D]" strokeWidth={2.5} />}
                  {!isRising && !isDropping && <Minus className="w-3 h-3 text-[#6B6B6B]" strokeWidth={2.5} />}
                  <span>{item.recent_change_pct > 0 ? `+${item.recent_change_pct}%` : `${item.recent_change_pct}%`}</span>
                </div>
              </div>

              {/* Main Reading & Unit */}
              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#2D2D2D] tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-xs font-bold text-[#6B6B6B]">
                    {item.unit}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#6B6B6B] mt-0.5">
                  Baseline avg: {item.baseline_avg} {item.unit}
                </div>
              </div>

              {/* Sub-index & AQI Contribution Bar */}
              <div className="mt-4 pt-3 border-t border-black/5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#6B6B6B] mb-1.5">
                  <span>Sub-index: <strong className="text-[#2D2D2D]">{item.sub_index}</strong></span>
                  <span>{item.contribution_pct}% of total</span>
                </div>
                {/* Fully rounded bar */}
                <div className="w-full h-2.5 bg-[#F0EBE5] rounded-[99px] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-[99px] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(6, item.contribution_pct))}%`,
                      backgroundColor: getStatusColor(item.recent_change_pct, item.is_dominant)
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
