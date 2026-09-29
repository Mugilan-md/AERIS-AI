import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Wind, Flame, Compass, MapPin, Eye, Check, Globe, Navigation } from 'lucide-react';
import { HotspotData, StationLocation, WeatherData } from '../types';

interface MapSectionProps {
  hotspots: HotspotData[];
  selectedLocation: StationLocation;
  weather: WeatherData;
  onSelectLocation: (id: string) => void;
}

const CITY_COORDINATES: { [key: string]: { center: [number, number]; zoom: number; label: string } } = {
  all: { center: [20.5937, 78.9629], zoom: 5, label: 'All India View' },
  delhi: { center: [28.60, 77.24], zoom: 11, label: 'Delhi NCR' },
  mumbai: { center: [19.08, 72.85], zoom: 12, label: 'Mumbai' },
  bengaluru: { center: [12.95, 77.68], zoom: 12, label: 'Bengaluru' },
};

export const MapSection: React.FC<MapSectionProps> = ({
  hotspots,
  selectedLocation,
  weather,
  onSelectLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const circlesRef = useRef<L.Circle[]>([]);
  const [activeLayer, setActiveLayer] = useState<'AQI' | 'HOTSPOTS' | 'WIND'>('AQI');
  const [activeCityFilter, setActiveCityFilter] = useState<string>('current');

  const selectedHotspot = hotspots.find(h => h.location_id === selectedLocation.id) || hotspots[0];

  // Initialize and maintain map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered on the selected location
      const map = L.map(mapContainerRef.current, {
        center: [selectedLocation.lat, selectedLocation.lon],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // 100% Free OpenStreetMap raster tiles - Reliable, Universal, NO API Key needed
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Gentle zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Invalidate size after mounting to prevent gray tile bugs
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Update center when selectedLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([selectedLocation.lat, selectedLocation.lon], 12, {
      duration: 1.0
    });
  }, [selectedLocation.id, selectedLocation.lat, selectedLocation.lon]);

  // Render markers and layer effects
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers & circles
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};
    circlesRef.current.forEach(c => c.remove());
    circlesRef.current = [];

    // Render markers for all stations
    hotspots.forEach(h => {
      const isSelected = h.location_id === selectedLocation.id;
      const isCritical = h.hotspot_score >= 60;

      // Add ambient radial zone circle
      if (activeLayer === 'AQI' || activeLayer === 'HOTSPOTS') {
        const radius = isCritical ? 3500 : 2200;
        const circle = L.circle([h.lat, h.lon], {
          radius: radius,
          color: h.severity_color,
          fillColor: h.severity_color,
          fillOpacity: activeLayer === 'HOTSPOTS' && isCritical ? 0.35 : 0.18,
          weight: isSelected ? 2 : 1,
        }).addTo(map);
        circlesRef.current.push(circle);
      }

      // Short readable name
      const shortName = h.location_name
        .replace(' Eco-Station', '')
        .replace(' Sensor Hub', '')
        .replace(' Industrial Area Phase-II', '')
        .replace(' (BKC)', '')
        .replace(' Metro Corridor', '')
        .replace(' Junction', '')
        .replace(' IT & Tech Park', '');

      // Tactile claymorphic pin HTML
      const markerHtml = `
        <div class="custom-pin-wrapper cursor-pointer" style="display: flex; align-items: center; justify-content: center; width: 130px; height: 38px;">
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px 4px 6px;
            background: #FFFFFF;
            border-radius: 999px;
            box-shadow: ${isSelected ? '0 0 0 3px #2D2D2D, 0 8px 24px rgba(0,0,0,0.22)' : '0 6px 18px rgba(0,0,0,0.12)'};
            transform: ${isSelected ? 'scale(1.08)' : 'scale(1.0)'};
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            white-space: nowrap;
          ">
            <!-- AQI Indicator Circle -->
            <div style="
              width: 26px;
              height: 26px;
              border-radius: 999px;
              background-color: ${h.severity_color};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: 900;
              color: #2D2D2D;
              box-shadow: inset 0 -1px 2px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06);
            ">
              ${h.aqi}
            </div>

            <!-- Station Label -->
            <div style="display: flex; flex-direction: column; text-align: left; overflow: hidden;">
              <span style="font-size: 11px; font-weight: 800; color: #2D2D2D; line-height: 1.1; max-width: 80px; overflow: hidden; text-overflow: ellipsis;">
                ${shortName}
              </span>
              <span style="font-size: 9px; font-weight: 700; color: #6B6B6B;">
                ${h.city.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-clay-pin',
        html: markerHtml,
        iconSize: [130, 38],
        iconAnchor: [65, 19]
      });

      const marker = L.marker([h.lat, h.lon], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectLocation(h.location_id);
      });

      // Bind rich popup
      marker.bindPopup(`
        <div style="font-family: 'Nunito', sans-serif; padding: 6px; min-width: 170px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #6B6B6B;">${h.city}</div>
          <div style="font-size: 14px; font-weight: 900; color: #2D2D2D; margin-bottom: 4px;">${h.location_name}</div>
          <div style="display: flex; gap: 6px; margin-bottom: 8px;">
            <span style="background: ${h.severity_color}; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 900; color: #2D2D2D;">
              AQI ${h.aqi} • ${h.aqi_category}
            </span>
          </div>
          <div style="font-size: 11px; color: #6B6B6B; font-weight: 600; margin-bottom: 2px;">Dominant Pollutant: <strong style="color: #2D2D2D;">${h.dominant_pollutant}</strong></div>
          <div style="font-size: 11px; color: #6B6B6B; font-weight: 600;">Hotspot Index: <strong style="color: #2D2D2D;">${h.hotspot_score} / 100</strong></div>
        </div>
      `);

      markersRef.current[h.location_id] = marker;
    });

  }, [hotspots, selectedLocation, activeLayer]);

  // Jump to specific region
  const handleJumpToCity = (cityKey: string) => {
    setActiveCityFilter(cityKey);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (cityKey === 'all') {
      // Fit bounds to all hotspots
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.2), { duration: 1.0 });
    } else {
      const cfg = CITY_COORDINATES[cityKey];
      if (cfg) {
        map.flyTo(cfg.center, cfg.zoom, { duration: 1.0 });
      }
    }
  };

  return (
    <div className="bg-white clay-card p-6 lg:p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
              Geospatial Atmospheric Intelligence
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A8D5E2] text-[#2D2D2D]">
              OpenStreetMap Verified
            </span>
          </div>
          <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight mt-0.5">
            Urban Sensor Network & Hotspot Map
          </h3>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            Interactive station telemetry across Delhi NCR, Mumbai, and Bengaluru corridors
          </p>
        </div>

        {/* Layer Switches */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F8F5F2] rounded-full clay-inset self-start sm:self-auto">
          {[
            { id: 'AQI', label: 'AQI Intensity' },
            { id: 'HOTSPOTS', label: 'Hotspot Pulse' },
            { id: 'WIND', label: 'Wind Dynamics' }
          ].map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeLayer === layer.id
                  ? 'bg-[#2D2D2D] text-white shadow-sm'
                  : 'text-[#6B6B6B] hover:text-[#2D2D2D]'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Regional Quick Jump Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#6B6B6B] flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#2D2D2D]" strokeWidth={2.5} />
          Jump to Region:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'delhi', label: 'Delhi NCR (3 Stations)' },
            { id: 'mumbai', label: 'Mumbai (2 Stations)' },
            { id: 'bengaluru', label: 'Bengaluru (2 Stations)' },
            { id: 'all', label: 'All India Overview' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => handleJumpToCity(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all clay-pill ${
                activeCityFilter === btn.id
                  ? 'bg-[#2D2D2D] text-white shadow-sm'
                  : 'bg-[#F8F5F2] text-[#6B6B6B] hover:text-[#2D2D2D]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Telemetry Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative min-h-[420px] h-[480px] rounded-2xl overflow-hidden clay-inset shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Wind Vector Compass Overlay */}
          <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F0EBE5] flex items-center justify-center shadow-inner">
              <Compass
                className="w-5 h-5 text-[#2D2D2D] transition-transform duration-700"
                style={{ transform: `rotate(${weather.wind_direction}deg)` }}
                strokeWidth={2.5}
              />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase text-[#6B6B6B]">Surface Wind</div>
              <div className="text-xs font-black text-[#2D2D2D]">
                {weather.wind_direction_cardinal} ({weather.wind_direction}°) • {weather.wind_speed} m/s
              </div>
            </div>
          </div>
        </div>

        {/* Selected Station Telemetry Inspector */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#F8F5F2] clay-inset flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase text-[#6B6B6B]">
                Inspected Station
              </span>
              <span
                className="text-xs font-black px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: selectedHotspot.severity_color, color: '#2D2D2D' }}
              >
                {selectedHotspot.severity} HOTSPOT
              </span>
            </div>

            <h4 className="text-lg font-black text-[#2D2D2D] mb-0.5">
              {selectedHotspot.location_name}
            </h4>
            <p className="text-xs font-semibold text-[#6B6B6B] mb-4">
              {selectedHotspot.zone_type} • {selectedHotspot.city}
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B6B6B]">AQI Index</span>
                <span className="text-xl font-black text-[#2D2D2D]">{selectedHotspot.aqi}</span>
              </div>

              <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B6B6B]">Dominant Pollutant</span>
                <span className="text-xs font-black text-[#2D2D2D]">{selectedHotspot.dominant_pollutant}</span>
              </div>

              <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B6B6B]">Hotspot Index</span>
                <span className="text-xs font-black text-[#2D2D2D]">{selectedHotspot.hotspot_score} / 100</span>
              </div>

              <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B6B6B]">Dispersion Status</span>
                <span className="text-xs font-bold text-[#2D2D2D] text-right truncate max-w-[160px]">
                  {selectedHotspot.dispersion_status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5">
            <div className="text-[11px] font-bold text-[#6B6B6B] mb-2">
              Click any station pin on the map to inspect live parameters.
            </div>
            <button
              onClick={() => onSelectLocation(selectedHotspot.location_id)}
              className="w-full py-2.5 rounded-xl bg-[#2D2D2D] text-white text-xs font-bold clay-button text-center cursor-pointer"
            >
              Focus Command Center Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
