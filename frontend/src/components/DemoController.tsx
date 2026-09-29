import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface DemoControllerProps {
  currentStep: number;
  totalSteps: number;
  phaseName: string;
  isRecovery: boolean;
  onSelectStep: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

const STEP_DESCRIPTIONS = [
  { step: 0, title: "1. Baseline Monitoring", desc: "AQI starts at 118 (Satisfactory). Moderate traffic, normal dispersion (5.5 m/s wind)." },
  { step: 1, title: "2. Concentration Rise", desc: "PM2.5 begins rising (+25%). Surface wind softens to 3.8 m/s." },
  { step: 2, title: "3. Anomaly Triggered", desc: "Particulate surge flagged by rolling Z-Score (>2.5) & rate of change (+55%)." },
  { step: 3, title: "4. Hotspot Formation", desc: "Hotspot composite score elevates (>65). Spatial excess over regional network detected." },
  { step: 4, title: "5. AQI Exceeds Unhealthy", desc: "AQI breaches 280+ (Poor/Very Poor). Dominant PM2.5 sub-index drives index." },
  { step: 5, title: "6. ML Forecast Inversion", desc: "Random Forest model projects prolonged inversion & deterioration over +3h and +6h." },
  { step: 6, title: "7. Smart Alert Dispatched", desc: "Critical multi-trigger alert fires with actionable non-medical exposure advice." },
  { step: 7, title: "8. Explainable AI Diagnosis", desc: "Causal diagnostic tree explains emissions accumulation + calm wind aerodynamic trap." },
  { step: 8, title: "9. Wind Dispersion Recovery", desc: "Strong 8.8 m/s wind arrives! Natural atmospheric clearing returns AQI to clean baseline." }
];

export const DemoController: React.FC<DemoControllerProps> = ({
  currentStep,
  totalSteps,
  phaseName,
  isRecovery,
  onSelectStep,
  isPlaying,
  onTogglePlay,
  onClose
}) => {
  const currentInfo = STEP_DESCRIPTIONS[Math.min(currentStep, STEP_DESCRIPTIONS.length - 1)];

  return (
    <div className="bg-white clay-card p-5 mb-8 transition-all relative overflow-hidden">
      {/* Soft color header bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${isRecovery ? 'bg-[#B8E6D5]' : currentStep >= 4 ? 'bg-[#D4A5A5]' : 'bg-[#FFE5A0]'}`} />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Header Title & Status */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)] ${
            isRecovery ? 'bg-[#B8E6D5]' : currentStep >= 4 ? 'bg-[#FFB3A0]' : 'bg-[#FFE5A0]'
          }`}>
            {isRecovery ? (
              <ShieldCheck className="w-5 h-5 text-[#2D2D2D]" strokeWidth={2.5} />
            ) : currentStep >= 2 ? (
              <AlertTriangle className="w-5 h-5 text-[#2D2D2D]" strokeWidth={2.5} />
            ) : (
              <Zap className="w-5 h-5 text-[#2D2D2D]" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#6B6B6B]">
                Hackathon Demo Scenario Stepper
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F0EBE5] text-[#2D2D2D]">
                Step {currentStep + 1} of {totalSteps + 1}
              </span>
            </div>
            <h3 className="text-lg font-black text-[#2D2D2D] tracking-tight">
              {currentInfo.title}
            </h3>
            <p className="text-xs font-semibold text-[#6B6B6B]">
              {currentInfo.desc}
            </p>
          </div>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => onSelectStep(0)}
            className="px-3.5 py-2 rounded-2xl bg-[#F8F5F2] hover:bg-[#F0EBE5] text-xs font-bold text-[#6B6B6B] hover:text-[#2D2D2D] flex items-center gap-1.5 clay-pill"
            title="Reset to Step 0"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Reset</span>
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 clay-button ${
              isPlaying ? 'bg-[#FFE5A0] text-[#2D2D2D]' : 'bg-[#2D2D2D] text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" strokeWidth={2.5} />
                <span>Auto Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectStep((currentStep + 1) % (totalSteps + 1))}
            className="px-4 py-2 rounded-2xl bg-[#A8D5E2] text-[#2D2D2D] text-xs font-bold flex items-center gap-1.5 clay-button"
            title="Advance to Next Phase"
          >
            <span>Next Phase</span>
            <SkipForward className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-xs font-bold text-[#6B6B6B] hover:text-[#2D2D2D] ml-2"
            title="Exit Demo Mode"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Stepper Timeline Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mt-4 pt-4 border-t border-black/5">
        {STEP_DESCRIPTIONS.map((s) => {
          const isCurrent = s.step === currentStep;
          const isPassed = s.step < currentStep;
          return (
            <button
              key={s.step}
              onClick={() => onSelectStep(s.step)}
              className={`p-2 rounded-xl text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#2D2D2D] text-white shadow-[0_4px_12px_rgba(45,45,45,0.25)] scale-[1.03]'
                  : isPassed
                  ? 'bg-[#F0EBE5] text-[#2D2D2D] hover:bg-[#E8E2DC]'
                  : 'bg-white/50 text-[#6B6B6B] hover:bg-white'
              }`}
            >
              <div className="text-[10px] font-bold opacity-75">Phase {s.step + 1}</div>
              <div className="text-xs font-black truncate">{s.title.split('. ')[1]}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
