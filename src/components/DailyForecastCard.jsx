import React from 'react';
import './DailyForecastCard.css';

function DailyForecastCard({ dailyForecastData }) {
  return (
    <div className="daily-forecast-card">
      <h3>16-Day Forecast</h3>
      <div className="daily-forecast-items">
        {dailyForecastData.map((item, index) => (
          <div key={index} className="daily-forecast-item">
            <p>{item.day}</p>
            <p>{item.date}</p> {/* Display the date */}
            <img
              src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt="Weather Icon"
            />
            <p>{item.temperature.toFixed(1)}°C</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyForecastCard;