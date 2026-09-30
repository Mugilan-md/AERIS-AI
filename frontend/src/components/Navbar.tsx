import React from 'react';
import { Wind, MapPin, AlertTriangle, Compass, Activity, Brain, PlayCircle, RefreshCw, FlaskConical } from 'lucide-react';
import { StationLocation } from '../types';
import { BackendConnectionStatus } from '../services/api';

interface NavbarProps {
  locations: StationLocation[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  mode: string;
  demoActive: boolean;
  onToggleDemoMode: () => void;
  onRefresh: () => void;
  loading: boolean;
  backendStatus?: BackendConnectionStatus;
}

export const Navbar: React.FC<NavbarProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  activeTab,
  onSelectTab,
  mode,
  demoActive,
  onToggleDemoMode,
  onRefresh,
  loading,
  backendStatus = 'WARMING_UP'
}) => {
  const tabs = [
    { id: 'command', label: 'Command Center', icon: Activity },
    { id: 'map', label: 'Pollution Map', icon: Compass },
    { id: 'forecast', label: 'ML Forecast', icon: Wind },
    { id: 'alerts', label: 'Alert Center', icon: AlertTriangle },
    { id: 'manual', label: 'Manual Test Sandbox', icon: FlaskConical },
    { id: 'explain', label: 'Explainable AI', icon: Brain },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F0EBE5]/95 backdrop-blur-md px-4 lg:px-8 pt-3 pb-3 border-b border-black/5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex flex-col gap-3.5">
        {/* Tier 1: Brand & Status on Left, Operational Controls on Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand & System Status Badges */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start shrink-0">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-[inset_0_-3px_6px_rgba(0,0,0,0.06),inset_0_3px_6px_rgba(255,255,255,0.9),0_6px_16px_rgba(0,0,0,0.08)]">
                <Wind className="w-5.5 h-5.5 text-[#5ea3b8]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-black tracking-tight text-[#2D2D2D] leading-none">
                    AERIS<span className="text-[#6B6B6B] font-light">.AI</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#B8E6D5]/90 text-[#1F3D30] border border-[#A2D9C3] shadow-sm whitespace-nowrap shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                    C-DAC / CPCB AQI
                  </span>
                  {backendStatus === 'CLOUD_LIVE' && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#B8E6D5]/90 text-[#1F3D30] border border-[#A2D9C3] shadow-sm whitespace-nowrap shrink-0"
                      title="Connected to live cloud computing container"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      Live Cloud Pipeline
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-[#6B6B6B] tracking-tight leading-tight mt-1 hidden sm:block whitespace-nowrap">
                  See the Air. Predict the Risk. Act Before It Peaks.
                </p>
              </div>
            </div>

            {/* Mobile Refresh */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center clay-button text-[#2D2D2D]"
                title="Refresh readings"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right Operational Controls: Location Picker, Demo Button, Refresh */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            {/* Location Selector */}
            <div className="relative flex-1 sm:flex-initial min-w-[210px]">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white clay-inset text-xs font-bold text-[#2D2D2D]">
                <MapPin className="w-4 h-4 text-[#C9B8E8] shrink-0" strokeWidth={2.5} />
                <select
                  value={selectedLocationId}
                  onChange={(e) => onSelectLocation(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#2D2D2D] cursor-pointer focus:outline-none w-full pr-1"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hackathon Demo Mode Trigger */}
            <button
              onClick={onToggleDemoMode}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold clay-button transition-all shrink-0 ${
                demoActive
                  ? 'bg-[#FFB3A0] text-[#2D2D2D] shadow-[0_4px_14px_rgba(255,179,160,0.5)] animate-pulse'
                  : 'bg-white text-[#2D2D2D]'
              }`}
              title="Toggle Hackathon Controlled Demo Scenario"
            >
              <PlayCircle className="w-4 h-4 text-[#2D2D2D]" strokeWidth={2.5} />
              <span>{demoActive ? 'Demo Active' : 'Launch Demo'}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="w-10 h-10 rounded-2xl bg-white hidden sm:flex items-center justify-center clay-button text-[#2D2D2D] shrink-0"
              title="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Tier 2: Enhanced Large Navigation Bar (Increased Size, Height & Length) */}
        <nav className="w-full bg-white/90 rounded-2xl p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between gap-2.5 min-w-max md:min-w-0 md:grid md:grid-cols-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-extrabold transition-all whitespace-nowrap text-center ${
                    isActive
                      ? 'bg-[#2D2D2D] text-white shadow-[0_6px_18px_rgba(0,0,0,0.28)] scale-[1.02]'
                      : 'text-[#555555] hover:text-[#111111] hover:bg-white/90 hover:scale-[1.01]'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={2.5} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
