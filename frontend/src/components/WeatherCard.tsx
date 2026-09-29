import React from 'react';
import { Thermometer, Droplets, Wind, Navigation, AlertCircle, Compass } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const { temperature, humidity, wind_speed, wind_direction, wind_direction_cardinal } = weather;

  // Scientifically responsible dispersion status
  const getDispersionAssessment = (ws: number) => {
    if (ws < 1.8) {
      return {
        level: "Reduced Ventilation",
        color: "bg-[#FFB3A0] text-[#2D2D2D]",
        text: "Low wind velocity may be associated with diminished horizontal advection and localized particulate accumulation."
      };
    } else if (ws < 4.5) {
      return {
        level: "Moderate Ventilation",
        color: "bg-[#FFE5A0] text-[#2D2D2D]",
        text: "Moderate wind velocity observed alongside gradual particulate transit across urban corridors."
      };
    } else {
      return {
        level: "Active Dispersion",
        color: "bg-[#B8E6D5] text-[#2D2D2D]",
        text: "Active surface winds are correlated with favorable atmospheric dilution and plume clearance."
      };
    }
  };

  const assessment = getDispersionAssessment(wind_speed);

  return (
    <div className="bg-white clay-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6B6B]">
                Microclimate Dynamics
              </span>
            </div>
            <h3 className="text-lg font-black text-[#2D2D2D] tracking-tight">
              Meteorological Coupling
            </h3>
          </div>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${assessment.color}`}>
            {assessment.level}
          </span>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
          {/* Temperature */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5F2] clay-inset flex flex-col items-center text-center">
            <Thermometer className="w-5 h-5 text-[#C9B8E8] mb-1" strokeWidth={2.5} />
            <span className="text-xs font-bold text-[#6B6B6B]">Temperature</span>
            <span className="text-xl font-black text-[#2D2D2D] mt-0.5">{temperature}°C</span>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5F2] clay-inset flex flex-col items-center text-center">
            <Droplets className="w-5 h-5 text-[#A8D5E2] mb-1" strokeWidth={2.5} />
            <span className="text-xs font-bold text-[#6B6B6B]">Humidity</span>
            <span className="text-xl font-black text-[#2D2D2D] mt-0.5">{humidity}%</span>
          </div>

          {/* Wind Speed */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5F2] clay-inset flex flex-col items-center text-center">
            <Wind className="w-5 h-5 text-[#B8E6D5] mb-1" strokeWidth={2.5} />
            <span className="text-xs font-bold text-[#6B6B6B]">Wind Speed</span>
            <span className="text-xl font-black text-[#2D2D2D] mt-0.5">{wind_speed} <span className="text-xs font-normal">m/s</span></span>
          </div>

          {/* Wind Direction with Visual Compass Angle */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5F2] clay-inset flex flex-col items-center text-center">
            <Navigation
              className="w-5 h-5 text-[#2D2D2D] mb-1 transition-transform duration-700"
              style={{ transform: `rotate(${wind_direction}deg)` }}
              strokeWidth={2.5}
            />
            <span className="text-xs font-bold text-[#6B6B6B]">Wind Heading</span>
            <span className="text-xl font-black text-[#2D2D2D] mt-0.5">{wind_direction_cardinal} <span className="text-xs font-normal font-bold">({wind_direction}°)</span></span>
          </div>
        </div>
      </div>

      {/* Atmospheric Dispersion Analysis */}
      <div className="mt-4 p-3.5 rounded-2xl bg-[#F0EBE5]/60 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#6B6B6B] shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-xs font-semibold text-[#6B6B6B] leading-relaxed">
          <strong className="text-[#2D2D2D]">Dispersion Correlation: </strong>
          {assessment.text}
        </p>
      </div>
    </div>
  );
};
