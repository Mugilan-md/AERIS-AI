import React, { useState, useEffect, useRef } from 'react';
import {
  fetchLocations,
  fetchDashboard,
  fetchAlerts,
  fetchExplanation,
  setDemoStep,
  setMode,
  resetManualTelemetry,
  subscribeBackendStatus,
  getBackendStatus,
  BackendConnectionStatus
} from './services/api';
import { fallbackEngine } from './services/fallbackEngine';
import {
  StationLocation,
  DashboardResponse,
  AlertItem,
  XAIExplanationResponse
} from './types';

import { Navbar } from './components/Navbar';
import { DemoController } from './components/DemoController';
import { AnomalyBanner } from './components/AnomalyBanner';
import { AQIHeroCard } from './components/AQIHeroCard';
import { PollutantGrid } from './components/PollutantGrid';
import { WeatherCard } from './components/WeatherCard';
import { ForecastSection } from './components/ForecastSection';
import { HotspotsSection } from './components/HotspotsSection';
import { AlertsSection } from './components/AlertsSection';
import { MapSection } from './components/MapSection';
import { HistoricalSection } from './components/HistoricalSection';
import { ExplainableAIModal } from './components/ExplainableAIModal';
import { ManualTestPanel } from './components/ManualTestPanel';

import { Sparkles, AlertTriangle, ShieldCheck, Flame, RefreshCw, Compass, Radio } from 'lucide-react';

export function App() {
  const [locations, setLocations] = useState<StationLocation[]>(() => fallbackEngine.getLocations());
  const [selectedLocationId, setSelectedLocationId] = useState<string>('delhi-anand-vihar');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(() => fallbackEngine.getDashboard('delhi-anand-vihar'));
  const [resolvedAlerts, setResolvedAlerts] = useState<AlertItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('command');
  const [loading, setLoading] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<BackendConnectionStatus>(getBackendStatus());

  // Demo Mode State
  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStepState] = useState<number>(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const demoIntervalRef = useRef<any>(null);

  // XAI Modal State
  const [isXAIModalOpen, setIsXAIModalOpen] = useState<boolean>(false);
  const [xaiData, setXaiData] = useState<XAIExplanationResponse | null>(null);
  const [xaiLoading, setXaiLoading] = useState<boolean>(false);

  // Subscribe to backend status changes (detects when Render finishes warming up)
  useEffect(() => {
    const unsubscribe = subscribeBackendStatus((status) => {
      setBackendStatus(status);
      if (status === 'CLOUD_LIVE') {
        // Automatically fetch live cloud data as soon as Render is awake!
        loadDashboardData(selectedLocationId, true);
      }
    });
    return unsubscribe;
  }, [selectedLocationId]);

  // Initial Load
  useEffect(() => {
    async function init() {
      try {
        const locs = await fetchLocations();
        if (locs && locs.length > 0) {
          setLocations(locs);
        }
        await loadDashboardData(selectedLocationId);
      } catch (err: any) {
        console.warn('Initialization using resilient fallback engine:', err);
        setDashboard(fallbackEngine.getDashboard(selectedLocationId));
      }
    }
    init();
  }, []);

  // Polling / Reload when location changes
  const loadDashboardData = async (locId: string, silent: boolean = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await fetchDashboard(locId);
      setDashboard(data);
      if (data.location.demo_scenario) {
        setDemoStepState(data.location.demo_scenario.step);
        setDemoActive(true);
      }
      // Load alerts archive
      const alts = await fetchAlerts(locId);
      setResolvedAlerts(alts.resolved_alerts);
    } catch (err: any) {
      console.warn('Dashboard fetch handled by resilient engine:', err);
      // Seamlessly fall back without ever showing an error wall
      setDashboard(fallbackEngine.getDashboard(locId));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSelectLocation = async (id: string) => {
    setSelectedLocationId(id);
    await loadDashboardData(id);
  };

  // Demo Mode Handlers
  const handleToggleDemoMode = async () => {
    try {
      const nextMode = demoActive ? 'SIMULATED' : 'DEMO';
      const res = await setMode(nextMode);
      setDemoActive(res.demo_active);
      if (res.demo_active) {
        await handleSelectDemoStep(0);
      } else {
        setIsPlayingDemo(false);
        if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
        await loadDashboardData(selectedLocationId);
      }
    } catch (err) {
      console.error('Failed to toggle demo mode', err);
    }
  };

  const handleSelectDemoStep = async (step: number) => {
    try {
      await setDemoStep(step);
      setDemoStepState(step);
      await loadDashboardData(selectedLocationId);
    } catch (err) {
      console.error('Failed to set demo step', err);
    }
  };

  // Auto-play demo scenario timer
  useEffect(() => {
    if (isPlayingDemo && demoActive) {
      demoIntervalRef.current = setInterval(async () => {
        setDemoStepState(prev => {
          const next = (prev + 1) % 9;
          handleSelectDemoStep(next);
          return next;
        });
      }, 4500);
    } else {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    }
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isPlayingDemo, demoActive]);

  // XAI Explanation Trigger
  const handleOpenExplain = async () => {
    setIsXAIModalOpen(true);
    setXaiLoading(true);
    try {
      const data = await fetchExplanation(selectedLocationId);
      setXaiData(data);
    } catch (err) {
      console.error('Failed to load XAI explanation', err);
      setXaiData(fallbackEngine.getExplanation(selectedLocationId));
    } finally {
      setXaiLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData(selectedLocationId);
  };

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#F0EBE5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white clay-hero flex items-center justify-center mb-4">
          <RefreshCw className="w-8 h-8 text-[#A8D5E2] animate-spin" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-black text-[#2D2D2D]">Initializing AERIS AI Engine...</h2>
        <p className="text-xs font-bold text-[#6B6B6B] mt-1">Starting zero-latency atmospheric telemetry stream</p>
      </div>
    );
  }

  const currentLoc = locations.find(l => l.id === selectedLocationId) || dashboard.location;

  return (
    <div className="min-h-screen bg-[#F0EBE5] text-[#2D2D2D] pb-16">
      {/* Resilient Standby Banner (shows only when cloud server is spinning up from cold-sleep) */}
      {backendStatus === 'WARMING_UP' && (
        <div className="bg-[#FFE5A0]/80 border-b border-[#ECD182] px-4 py-2 text-center text-xs font-bold text-[#594200] flex items-center justify-center gap-2 backdrop-blur-sm transition-all">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping inline-block shrink-0" />
          <span>
            <strong>AERIS Resilient Edge Active:</strong> Cloud backend container is warming up from standby (free-tier cold start). Telemetry, forecasts, and AI calculations are rendering with 100% uptime.
          </span>
        </div>
      )}

      {/* Top Sticky Navigation */}
      <Navbar
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={handleSelectLocation}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mode={dashboard.location.mode || 'SIMULATED'}
        demoActive={demoActive}
        onToggleDemoMode={handleToggleDemoMode}
        onRefresh={handleRefresh}
        loading={loading}
        backendStatus={backendStatus}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* Controlled Hackathon Demo Scenario Controller */}
        {demoActive && (
          <DemoController
            currentStep={demoStep}
            totalSteps={8}
            phaseName={dashboard.location.demo_scenario?.phase_name || ''}
            isRecovery={dashboard.location.demo_scenario?.is_recovery || false}
            onSelectStep={handleSelectDemoStep}
            isPlaying={isPlayingDemo}
            onTogglePlay={() => setIsPlayingDemo(!isPlayingDemo)}
            onClose={handleToggleDemoMode}
          />
        )}

        {/* Statistical Anomaly Notification Banner */}
        <AnomalyBanner
          anomaly={dashboard.anomaly}
          onOpenExplain={handleOpenExplain}
        />

        {/* TAB 1: COMMAND CENTER (Integrated Hero Dashboard) */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            {/* Top Row: Hero AQI Card + Weather Microclimate Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8">
                <AQIHeroCard
                  aqiData={dashboard.aqi}
                  location={currentLoc}
                  onOpenExplain={handleOpenExplain}
                />
              </div>
              <div className="lg:col-span-4">
                <WeatherCard weather={dashboard.weather} />
              </div>
            </div>

            {/* Pollutant Matrix */}
            <PollutantGrid pollutants={dashboard.pollutants} />

            {/* Middle Row: Short-Term Forecast + Active Hotspots */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ForecastSection
                  forecast={dashboard.forecast}
                  history={dashboard.history}
                  currentAqi={dashboard.aqi.aqi}
                />
              </div>
              <div className="lg:col-span-5">
                <HotspotsSection
                  hotspots={dashboard.all_hotspots}
                  selectedLocationId={selectedLocationId}
                  onSelectLocation={handleSelectLocation}
                />
              </div>
            </div>

            {/* Active Smart Alerts Section */}
            <AlertsSection
              alerts={dashboard.alerts}
              resolvedAlerts={resolvedAlerts}
              onOpenExplain={handleOpenExplain}
            />

            {/* Historical 24h Trend Analysis */}
            <HistoricalSection
              history={dashboard.history}
              locationName={dashboard.location.name}
            />
          </div>
        )}

        {/* TAB 2: GEOSPATIAL MAP */}
        {activeTab === 'map' && (
          <MapSection
            hotspots={dashboard.all_hotspots}
            selectedLocation={currentLoc}
            weather={dashboard.weather}
            onSelectLocation={handleSelectLocation}
            onNewCustomLocation={async (newLocId) => {
              // Refresh locations list then select the new custom point
              const locs = await fetchLocations();
              setLocations(locs);
              await handleSelectLocation(newLocId);
            }}
          />
        )}

        {/* TAB 3: ML FORECAST */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <ForecastSection
              forecast={dashboard.forecast}
              history={dashboard.history}
              currentAqi={dashboard.aqi.aqi}
            />
            <HistoricalSection
              history={dashboard.history}
              locationName={dashboard.location.name}
            />
          </div>
        )}

        {/* TAB 4: MANUAL TESTING */}
        {activeTab === 'manual' && (
          <ManualTestPanel
            locations={locations}
            selectedLocationId={selectedLocationId}
            onApply={async (locId) => {
              await handleSelectLocation(locId);
              setActiveTab('command');
            }}
            onReset={async () => {
              try { await resetManualTelemetry(); } catch {}
              await loadDashboardData(selectedLocationId);
            }}
          />
        )}

        {/* TAB 5: ALERT CENTER */}
        {activeTab === 'alerts' && (
          <AlertsSection
            alerts={dashboard.alerts}
            resolvedAlerts={resolvedAlerts}
            onOpenExplain={handleOpenExplain}
          />
        )}

        {/* TAB 6: EXPLAINABLE AI */}
        {activeTab === 'explain' && (
          <div className="bg-white clay-card p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
                  Diagnostic Decision-Support
                </span>
                <h3 className="text-2xl font-black text-[#2D2D2D] tracking-tight mt-0.5">
                  Explainable AI & Environmental Attribution
                </h3>
              </div>
              <button
                onClick={handleOpenExplain}
                className="px-4 py-2 rounded-2xl bg-[#A8D5E2] text-[#2D2D2D] text-xs font-bold clay-button flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Re-Analyze Live Atmosphere</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8F5F2] clay-inset">
                <div className="text-xs font-extrabold text-[#6B6B6B]">Primary Driving Pollutant</div>
                <div className="text-xl font-black text-[#2D2D2D] mt-1">{dashboard.aqi.dominant_pollutant_name}</div>
                <p className="text-xs font-semibold text-[#6B6B6B] mt-2">
                  Highest sub-index among monitored criteria pollutants via Indian National AQI formula.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5F2] clay-inset">
                <div className="text-xs font-extrabold text-[#6B6B6B]">Ventilation Coupling</div>
                <div className="text-xl font-black text-[#2D2D2D] mt-1">{dashboard.weather.wind_speed} m/s ({dashboard.weather.wind_direction_cardinal})</div>
                <p className="text-xs font-semibold text-[#6B6B6B] mt-2">
                  Microclimate surface wind speed provides physical boundary condition for particulate advection.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5F2] clay-inset">
                <div className="text-xs font-extrabold text-[#6B6B6B]">Predictive Trajectory</div>
                <div className="text-xl font-black text-[#2D2D2D] mt-1">{dashboard.forecast.trajectory}</div>
                <p className="text-xs font-semibold text-[#6B6B6B] mt-2">
                  {dashboard.forecast.trajectory_summary}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F0EBE5]/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2D2D2D] shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className="text-xs font-semibold text-[#6B6B6B] leading-relaxed">
                <strong className="text-[#2D2D2D]">Non-Medical Health Guidance: </strong>
                {dashboard.aqi.health_advisory} Actionable interventions should prioritize limiting prolonged strenuous exposure during inversion peaks.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Explainable AI Drawer / Modal */}
      <ExplainableAIModal
        isOpen={isXAIModalOpen}
        onClose={() => setIsXAIModalOpen(false)}
        data={xaiData}
        loading={xaiLoading}
      />
    </div>
  );
}
export default App;
