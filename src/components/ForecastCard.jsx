import React from 'react';
import { FaWind } from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';
import './ForecastCard.css'; // Ensure the CSS file is imported
function ForecastCard({ forecastData, convertTemperature, unit }) {
  return (
    <div className="forecast-card">
      <h3>5-Day Forecast</h3>
      <div className="forecast-items">
        {forecastData.map((item, index) => (
          <div key={index} className="forecast-item">
            <p>{item.day}</p>
            <img src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`} alt="Weather Icon" />
            <p>{convertTemperature(item.temperature)}°{unit}</p>
            <p>{item.description}</p>
            <p>
              <WiHumidity size={30} color="#FFFFFF" /> Humidity: {item.humidity}%
            </p>
            <p>
              <FaWind size={30} color="#FFFFFF" /> Wind Speed: {item.windSpeed} m/s
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastCard;