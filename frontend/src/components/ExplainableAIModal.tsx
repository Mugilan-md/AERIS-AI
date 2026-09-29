import React from 'react';
import { X, Brain, Wind, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';
import { XAIExplanationResponse } from '../types';

interface ExplainableAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: XAIExplanationResponse | null;
  loading: boolean;
}

export const ExplainableAIModal: React.FC<ExplainableAIModalProps> = ({
  isOpen,
  onClose,
  data,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white clay-card max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C9B8E8] flex items-center justify-center shadow-[inset_0_-2px_4px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)]">
              <Brain className="w-6 h-6 text-[#2D2D2D]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
                  Explainable AI (XAI) Engine
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B8E6D5] text-[#2D2D2D]">
                  Causal Reasoning
                </span>
              </div>
              <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight">
                Why Is Air Quality Changing?
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-[#F0EBE5] hover:bg-[#E8E2DC] flex items-center justify-center text-[#2D2D2D] clay-button"
            title="Close"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {loading || !data ? (
          <div className="p-12 text-center text-[#6B6B6B]">
            <Brain className="w-8 h-8 text-[#A8D5E2] animate-bounce mx-auto mb-2" strokeWidth={2.5} />
            <p className="text-sm font-bold">Synthesizing causal diagnostic chain...</p>
          </div>
        ) : (
          <div className="space-y-6 pt-5">
            {/* Plain English Summary Card */}
            <div className="p-5 rounded-2xl bg-[#F8F5F2] clay-inset">
              <div className="flex items-center gap-2 text-xs font-black text-[#2D2D2D] mb-2">
                <Sparkles className="w-4 h-4 text-[#C9B8E8]" strokeWidth={2.5} />
                <span>Executive Diagnostic Summary</span>
              </div>
              <p className="text-sm font-bold text-[#2D2D2D] leading-relaxed">
                {data.plain_english_summary}
              </p>
            </div>

            {/* Step-by-Step Causal Chain Flow */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-[#2D2D2D] tracking-tight uppercase">
                  Multi-Stage Atmospheric Causal Chain
                </h4>
                <span className="text-xs font-bold text-[#6B6B6B]">
                  Sequential Attribution
                </span>
              </div>

              <div className="space-y-3">
                {data.causal_chain.map((step) => (
                  <div
                    key={step.step_num}
                    className="p-4 rounded-2xl bg-white clay-card flex items-start gap-3.5 transition-all hover:translate-x-1"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#F0EBE5] flex items-center justify-center font-black text-xs text-[#2D2D2D] shrink-0">
                      {step.step_num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-black text-[#2D2D2D]">
                          {step.step_title}
                        </h5>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          step.status === 'High Risk' || step.status === 'Critical'
                            ? 'bg-[#FFB3A0] text-[#2D2D2D]'
                            : step.status === 'Warning' || step.status === 'Elevated'
                            ? 'bg-[#FFE5A0] text-[#2D2D2D]'
                            : 'bg-[#B8E6D5] text-[#2D2D2D]'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#6B6B6B] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Physical Evidence Breakdown */}
            <div>
              <h4 className="text-sm font-black text-[#2D2D2D] tracking-tight uppercase mb-3">
                Observed Physical Factors & Aerodynamic Impact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.evidence_factors.map((factor, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#F8F5F2] clay-inset">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#6B6B6B]">{factor.parameter}</span>
                      <span className="text-xs font-black text-[#2D2D2D] px-2 py-0.5 rounded-full bg-white">
                        {factor.observation}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#2D2D2D] mt-2">
                      {factor.relationship}
                    </p>
                    <p className="text-[11px] font-semibold text-[#6B6B6B] mt-1">
                      {factor.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meteorological Attribution & Scientific Language Note */}
            <div className="p-4 rounded-2xl bg-[#F0EBE5]/70 flex items-start gap-3">
              <Wind className="w-5 h-5 text-[#2D2D2D] shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className="text-xs font-bold text-[#6B6B6B] leading-relaxed">
                <span className="text-[#2D2D2D] font-extrabold">Scientific Rigor Notice: </span>
                {data.weather_attribution.scientific_note} All diagnostic factors are correlated from empirical sensor readings and validated fluid transport models.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
