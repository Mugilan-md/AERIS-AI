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
  return (
    <header className="sticky top-0 z-50 bg-[#F0EBE5]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start shrink-0">
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
                {backendStatus === 'CLOUD_LIVE' ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#B8E6D5]/90 text-[#1F3D30] border border-[#A2D9C3] shadow-sm whitespace-nowrap shrink-0"
                    title="Connected to live cloud computing container"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    Cloud Live
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FFE5A0]/90 text-[#594200] border border-[#ECD182] shadow-sm whitespace-nowrap shrink-0 animate-pulse"
                    title="Resilient Edge Engine active with zero downtime while cloud container warms up"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-ping" />
                    Edge Active • Cloud Warming
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-[#6B6B6B] tracking-tight leading-tight mt-1 hidden sm:block whitespace-nowrap">
                See the Air. Predict the Risk. Act Before It Peaks.
              </p>
            </div>
          </div>

          {/* Mobile refresh / mode */}
          <div className="flex items-center gap-2 md:hidden">
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

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1.5 bg-white/70 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] overflow-x-auto max-w-full">
          {[
            { id: 'command', label: 'Command Center', icon: Activity },
            { id: 'map', label: 'Pollution Map', icon: Compass },
            { id: 'forecast', label: 'ML Forecast', icon: Wind },
            { id: 'alerts', label: 'Alert Center', icon: AlertTriangle },
            { id: 'manual', label: 'Manual Test', icon: FlaskConical },
            { id: 'explain', label: 'Explainable AI', icon: Brain },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2D2D2D] text-white shadow-[0_4px_12px_rgba(45,45,45,0.25)]'
                    : 'text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-white/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Location Selector & Demo Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Location Dropdown */}
          <div className="relative flex-1 md:flex-initial">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white clay-inset text-xs font-bold text-[#2D2D2D]">
              <MapPin className="w-3.5 h-3.5 text-[#C9B8E8]" strokeWidth={2.5} />
              <select
                value={selectedLocationId}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#2D2D2D] cursor-pointer focus:outline-none pr-2"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Demo Mode Toggle Button */}
          <button
            onClick={onToggleDemoMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold clay-button transition-all ${
              demoActive
                ? 'bg-[#FFB3A0] text-[#2D2D2D] shadow-[0_4px_14px_rgba(255,179,160,0.5)] animate-pulse'
                : 'bg-white text-[#2D2D2D]'
            }`}
            title="Toggle Hackathon Controlled Demo Scenario"
          >
            <PlayCircle className="w-4 h-4 text-[#2D2D2D]" strokeWidth={2.5} />
            <span className="hidden sm:inline">
              {demoActive ? 'Demo Mode Active' : 'Launch Demo'}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="w-9 h-9 rounded-2xl bg-white hidden md:flex items-center justify-center clay-button text-[#2D2D2D]"
            title="Refresh live data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
};
