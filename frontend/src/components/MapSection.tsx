import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Wind, Flame, Compass, MapPin, Eye, Check } from 'lucide-react';
import { HotspotData, StationLocation, WeatherData } from '../types';

interface MapSectionProps {
  hotspots: HotspotData[];
  selectedLocation: StationLocation;
  weather: WeatherData;
  onSelectLocation: (id: string) => void;
}

export const MapSection: React.FC<MapSectionProps> = ({
  hotspots,
  selectedLocation,
  weather,
  onSelectLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [activeLayer, setActiveLayer] = useState<'AQI' | 'HOTSPOTS' | 'WIND'>('AQI');

  const selectedHotspot = hotspots.find(h => h.location_id === selectedLocation.id) || hotspots[0];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered on Delhi by default
      const map = L.map(mapContainerRef.current, {
        center: [selectedLocation.lat, selectedLocation.lon],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron / Voyager clean pastel tiles fitting claymorphism
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add gentle zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Pan smoothly when location changes
    map.flyTo([selectedLocation.lat, selectedLocation.lon], 12, {
      duration: 1.2
    });

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Render custom claymorphic HTML markers
    hotspots.forEach(h => {
      const isSelected = h.location_id === selectedLocation.id;
      const isCritical = h.hotspot_score >= 60;

      const markerHtml = `
        <div class="relative cursor-pointer transition-transform hover:scale-110 flex items-center justify-center">
          ${isCritical ? `<div class="absolute -inset-2 rounded-full bg-[${h.severity_color}] opacity-40 animate-ping"></div>` : ''}
          <div class="px-2.5 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 transition-all"
               style="background-color: ${h.severity_color}; color: #2D2D2D; border: ${isSelected ? '2.5px solid #2D2D2D' : 'none'}; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
            <span>${h.aqi}</span>
            <span class="text-[9px] font-bold opacity-80">${h.location_name.split(' ')[0]}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-clay-pin',
        html: markerHtml,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });

      const marker = L.marker([h.lat, h.lon], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        onSelectLocation(h.location_id);
      });

      // Bind rich popup
      marker.bindPopup(`
        <div style="font-family: 'Nunito', sans-serif; padding: 6px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6B6B6B;">${h.city}</div>
          <div style="font-size: 14px; font-weight: 900; color: #2D2D2D; margin-bottom: 4px;">${h.location_name}</div>
          <div style="display: flex; gap: 6px; margin-bottom: 6px;">
            <span style="background: ${h.severity_color}; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800; color: #2D2D2D;">
              AQI: ${h.aqi} (${h.aqi_category})
            </span>
          </div>
          <div style="font-size: 11px; color: #6B6B6B; font-weight: 600;">Dominant: <strong>${h.dominant_pollutant}</strong></div>
          <div style="font-size: 11px; color: #6B6B6B; font-weight: 600;">Hotspot Index: <strong>${h.hotspot_score}/100</strong></div>
        </div>
      `);

      markersRef.current[h.location_id] = marker;
    });

  }, [hotspots, selectedLocation]);

  return (
    <div className="bg-white clay-card p-6 lg:p-8 space-y-6">
      {/* Header & Layer Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
              Geospatial Atmospheric Intelligence
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A8D5E2] text-[#2D2D2D]">
              Leaflet Interactive
            </span>
          </div>
          <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight mt-0.5">
            Urban Sensor Network & Hotspot Map
          </h3>
          <p className="text-xs font-semibold text-[#6B6B6B]">
            Real-time station telemetry across NCR, Mumbai, and Bengaluru corridors
          </p>
        </div>

        {/* Layer Switches */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F8F5F2] rounded-full clay-inset self-start sm:self-auto">
          {[
            { id: 'AQI', label: 'AQI Intensity' },
            { id: 'HOTSPOTS', label: 'Hotspot Pulse' },
            { id: 'WIND', label: 'Wind Vector' }
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

      {/* Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative min-h-[380px] h-[440px] rounded-2xl overflow-hidden clay-inset">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Wind Vector Compass Overlay */}
          <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#F0EBE5] flex items-center justify-center">
              <Compass
                className="w-4 h-4 text-[#2D2D2D] transition-transform duration-500"
                style={{ transform: `rotate(${weather.wind_direction}deg)` }}
                strokeWidth={2.5}
              />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase text-[#6B6B6B]">Wind Advection</div>
              <div className="text-xs font-black text-[#2D2D2D]">
                {weather.wind_direction_cardinal} • {weather.wind_speed} m/s
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

            <h4 className="text-base font-black text-[#2D2D2D] mb-1">
              {selectedHotspot.location_name}
            </h4>
            <p className="text-xs font-semibold text-[#6B6B6B] mb-4">
              {selectedHotspot.zone_type} • {selectedHotspot.city}
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B6B6B]">AQI Index</span>
                <span className="text-lg font-black text-[#2D2D2D]">{selectedHotspot.aqi}</span>
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
                <span className="text-xs font-bold text-[#2D2D2D] text-right truncate max-w-[150px]">
                  {selectedHotspot.dispersion_status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5">
            <div className="text-[11px] font-bold text-[#6B6B6B] mb-2">
              Select another station directly from the map or switch via the station dropdown.
            </div>
            <button
              onClick={() => onSelectLocation(selectedHotspot.location_id)}
              className="w-full py-2.5 rounded-xl bg-[#2D2D2D] text-white text-xs font-bold clay-button text-center"
            >
              Focus Command Center Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
