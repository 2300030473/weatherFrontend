import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Ensure the CSS file is imported

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="header">
        <img src="/icons/logo.png" alt="Logo" />
        <div>
          <Link to="/register">
            <button id="get-started-button" className="get-started-button">Get Started</button>
          </Link>
          <Link to="/login">
            <button id="login-button" className="login-button">Login</button>
          </Link>
        </div>
      </div>
      <h1 id="home-title">Welcome to Atmos</h1>
      <p id="home-description">Breathe easy with accurate and reliable weather information, always at your fingertips.</p>
      <Link to="/weather" className="weather-link">
        <button className="go-to-weather-button">Go to Weather</button>
      </Link>     

      <div className="project-details">
        <h2>About Atmos</h2>
        <div className="project-details-card">
          <p><strong>Mission:</strong> To provide accurate weather forecasts and air quality insights to help you plan your day better.</p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>Real-time weather updates</li>
            <li>Air quality monitoring</li>
            <li>3-hour forecast</li>
            <li>5-day and 16-day forecasts</li>
          </ul>
          <p><strong>Why Atmos?</strong> Because your health and safety matter. Stay informed, stay prepared.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;