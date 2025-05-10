import React, { useEffect, useState } from 'react';
import './AirPollution.css';

const API_KEY = import.meta.env.VITE_API_KEY;

function getAQIDescription(aqi) {
  if (aqi <= 50) return 'Good: Air quality is considered satisfactory. No risk.';
  if (aqi <= 100) return 'Moderate: Acceptable. Some pollutants may affect sensitive people.';
  if (aqi <= 150) return 'Unhealthy for sensitive groups: Sensitive people may experience health effects.';
  if (aqi <= 200) return 'Unhealthy: Everyone may begin to experience health effects.';
  return 'Very Unhealthy: Health alert. Everyone may experience serious health effects.';
}

function getPollutantDescription(pollutant, value) {
  switch (pollutant) {
    case 'pm2_5':
      if (value <= 12) return 'Good';
      if (value <= 35.4) return 'Moderate';
      if (value <= 55.4) return 'Unhealthy for sensitive groups';
      return 'Unhealthy';
    case 'pm10':
      if (value <= 54) return 'Good';
      if (value <= 154) return 'Moderate';
      return 'Unhealthy';
    case 'co':
      if (value <= 4400) return 'Good';
      if (value <= 9400) return 'Moderate';
      return 'Unhealthy';
    case 'no2':
      if (value <= 40) return 'Good';
      if (value <= 100) return 'Moderate';
      return 'Unhealthy';
    case 'o3':
      if (value <= 100) return 'Good to Moderate';
      if (value <= 160) return 'Unhealthy for sensitive groups';
      return 'Unhealthy';
    default:
      return 'No data available';
  }
}

function AirPollution({ coords }) {
  const [pollutionData, setPollutionData] = useState(null);

  useEffect(() => {
    if (coords.lat && coords.lon) {
      fetchAirPollutionData(coords.lat, coords.lon);
    }
  }, [coords]);

  const fetchAirPollutionData = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const data = await response.json();
      setPollutionData(data);
    } catch (error) {
      console.error('Error fetching air pollution data:', error);
    }
  };

  return (
    <div className="air-pollution-card">
      <h2>Air Pollution</h2>
      {pollutionData ? (
        <div className="pollution-details">
          <p><strong>AQI:</strong> {pollutionData.list[0].main.aqi} - {getAQIDescription(pollutionData.list[0].main.aqi)}</p>
          <p><strong>PM2.5:</strong> {pollutionData.list[0].components.pm2_5} µg/m³ - {getPollutantDescription('pm2_5', pollutionData.list[0].components.pm2_5)}</p>
          <p><strong>PM10:</strong> {pollutionData.list[0].components.pm10} µg/m³ - {getPollutantDescription('pm10', pollutionData.list[0].components.pm10)}</p>
          <p><strong>CO:</strong> {pollutionData.list[0].components.co} µg/m³ - {getPollutantDescription('co', pollutionData.list[0].components.co)}</p>
          <p><strong>NO₂:</strong> {pollutionData.list[0].components.no2} µg/m³ - {getPollutantDescription('no2', pollutionData.list[0].components.no2)}</p>
          <p><strong>O₃:</strong> {pollutionData.list[0].components.o3} µg/m³ - {getPollutantDescription('o3', pollutionData.list[0].components.o3)}</p>
        </div>
      ) : (
        <p>Loading air pollution data...</p>
      )}
    </div>
  );
}

export default AirPollution;
