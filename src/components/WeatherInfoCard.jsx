import React from 'react';
import { FaWind } from 'react-icons/fa';
import { WiHumidity, WiSunrise, WiSunset } from 'react-icons/wi';
import FeelsLikeIndicator from './FeelsLikeIndicator';

function WeatherInfoCard({ weatherData, sunriseSunset, unit, toggleUnit, convertTemperature }) {
  return (
    <div className="weather-info-card">
      {/* City Name */}
      <p className="weather-location">{weatherData.name}</p>

      {/* Current Temperature */}
      <p className="weather-temperature">
        {convertTemperature(weatherData.main.temp - 273.15)}°{unit}
      </p>

      {/* Feels Like Indicator */}
      <FeelsLikeIndicator
        temp={convertTemperature(weatherData.main.temp - 273.15)}
        feelsLike={convertTemperature(weatherData.main.feels_like - 273.15)}
        unit={unit}
      />

      {/* Humidity */}
      <p className="weather-humidity">
        <WiHumidity size={30} color="#FFFFFF" /> Humidity: {weatherData.main.humidity}%
      </p>

      {/* Wind Speed */}
      <p className="weather-wind">
        <FaWind size={30} color="#FFFFFF" /> Wind Speed: {weatherData.wind.speed} m/s
      </p>

      {/* Sunrise Time */}
      <p className="weather-sunrise">
        <WiSunrise size={30} color="#FFA500" /> Sunrise: {sunriseSunset.sunriseTime || 'N/A'}
      </p>

      {/* Sunset Time */}
      <p className="weather-sunset">
        <WiSunset size={30} color="#FFA500" /> Sunset: {sunriseSunset.sunsetTime || 'N/A'}
      </p>

      {/* Weather Icon */}
      <img
        className="weather-icon"
        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt="Weather Icon"
      />

      {/* Weather Description */}
      <p className="weather-description">{weatherData.weather[0].description}</p>

      {/* Unit Toggle Button */}
      <button className="unit-toggle-button" onClick={toggleUnit}>
        Show in °{unit === 'C' ? 'F' : 'C'}
      </button>
    </div>
  );
}

export default WeatherInfoCard;