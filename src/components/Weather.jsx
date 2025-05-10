import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import WeatherInfoCard from './WeatherInfoCard';
import WeatherChartCard from './WeatherChartCard';
import ForecastCard from './ForecastCard';
import MapComponent from './MapComponent';
import AirPollution from './AirPollution';
import DailyForecastCard from './DailyForecastCard';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import 'animate.css';
import '../styles/Weather.css';

const API_KEY = import.meta.env.VITE_API_KEY;

function convertUnixTimestamp(timestamp) {
  let date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
async function getSunriseSunset(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  let sunriseTime = convertUnixTimestamp(data.sys.sunrise);
  let sunsetTime = convertUnixTimestamp(data.sys.sunset);

  return { sunriseTime, sunsetTime };
}

function Weather() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [sunriseSunset, setSunriseSunset] = useState({ sunriseTime: '', sunsetTime: '' });
  const [unit, setUnit] = useState('C'); 
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [chartData, setChartData] = useState([]);
  const [forecastData, setForecastData] = useState([]); 
  const [dailyForecastData, setDailyForecastData] = useState([]);
  const navigate = useNavigate(); // For navigation

  const handleProfileClick = () => {
    // Replace with actual user data from login or authentication context
    const username = ''; 
    const email = ''; 
    navigate('/profile', { state: { username, email } }); // Navigate to Profile page
  };
  // useEffect(() => {
  //   const validate = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:6500/isAuthenticated",{ withCredentials: true });
  //       console.log(response.data);
        
  //       if (!response.data.success) {
  //         navigate("/login");
  //       }
  //     } catch   (error) {
  //       console.error("Error during authentication", error);
  //     }
  //   };
  
  //   validate();
  // }, []); 
  useEffect(() => {
    // Helper function to read a cookie by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const token = getCookie("token");
    if (!token) {
      // If no token is found, redirect to login page
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetchWeatherDataByCoords(latitude, longitude);
        fetchWeatherChartData(latitude, longitude);
        fetchForecastData(latitude, longitude);
        fetchSunriseSunset(latitude, longitude);
      });
    }
  }, []);

  const fetchWeatherDataByCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchSunriseSunset = async (latitude, longitude) => {
    try {
      const result = await getSunriseSunset(latitude, longitude);
      setSunriseSunset(result);
    } catch (error) {
      console.error('Error fetching sunrise and sunset data:', error);
    }
  };

  const fetchWeatherChartData = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.list) {
        const hourlyData = result.list.slice(0, 40).map((item) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: item.main.temp,
        }));
        setChartData(hourlyData);
      }
    } catch (error) {
      console.error('Error fetching weather chart data:', error);
    }
  };

  const fetchForecastData = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.list) {
        const dailyData = result.list
          .filter((item, index) => index % 8 === 0)
          .map((item) => ({
            day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
            temperature: item.main.temp,
            icon: item.weather[0].icon,
            description: item.weather[0].description,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
          }));
        setForecastData(dailyData);
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const fetchDailyForecastData = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=16&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.list) {
        const dailyData = result.list.map((item) => ({
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Add date
          temperature: item.temp.day,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        }));
        setDailyForecastData(dailyData);
      }
    } catch (error) {
      console.error('Error fetching daily forecast data:', error);
    }
  };

  useEffect(() => {
    if (coords.lat && coords.lon) {
      fetchDailyForecastData(coords.lat, coords.lon);
    }
  }, [coords]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
      setCoords({ lat: data.coord.lat, lon: data.coord.lon });
      fetchWeatherChartData(data.coord.lat, data.coord.lon);
      fetchForecastData(data.coord.lat, data.coord.lon);
      fetchSunriseSunset(data.coord.lat, data.coord.lon);
    } catch (error) {
      alert('Error fetching weather data: ' + error.message);
    }
  };

  const handleMapClick = (latlng) => {
    setCoords({ lat: latlng.lat, lon: latlng.lng });
    fetchWeatherDataByCoords(latlng.lat, latlng.lng);
    fetchWeatherChartData(latlng.lat, latlng.lng);
    fetchForecastData(latlng.lat, latlng.lng);
    fetchSunriseSunset(latlng.lat, latlng.lng);
  };

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  const convertTemperature = (temp) => {
    return unit === 'C' ? temp.toFixed(2) : ((temp * 9) / 5 + 32).toFixed(2);
  };

  const [weatherRef, weatherInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [forecastRef, forecastInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [pollutionRef, pollutionInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [dailyForecastRef, dailyForecastInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="weather-page">
      <h1>Weather Information</h1>
      <form onSubmit={handleSearch} className="search-form">
       <div style={{
        display:"flex",
       }}>
       <div style={{
        display:"flex"
       }}>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
        </div>
        <div>
        <CgProfile
          className="profile-icon"
          onClick={handleProfileClick}
          size={50}
          color='white'
        />
        </div>
       </div>
      </form>
      <MapComponent position={coords} onMapClick={handleMapClick} />
      {weatherData && weatherData.main && (
        <div
          ref={weatherRef}
          className={`weather-content ${weatherInView ? 'animate__animated animate__fadeInUp' : ''}`}
        >
          <WeatherInfoCard
            weatherData={weatherData}
            sunriseSunset={sunriseSunset}
            unit={unit}
            toggleUnit={toggleUnit}
            convertTemperature={convertTemperature}
          />
          <WeatherChartCard chartData={chartData} />
        </div>
      )}
      {forecastData.length > 0 && (
        <div
          ref={forecastRef}
          className={`forecast-section ${forecastInView ? 'animate__animated animate__fadeInUp' : ''}`}
        >
          <ForecastCard
            forecastData={forecastData}
            convertTemperature={convertTemperature}
            unit={unit}
          />
        </div>
      )}
      {coords.lat && coords.lon && (
        <div
          ref={pollutionRef}
          className={`pollution-section ${pollutionInView ? 'animate__animated animate__fadeInUp' : ''}`}
        >
          <AirPollution coords={coords} />
        </div>
      )}
      {dailyForecastData.length > 0 && (
        <div
          ref={dailyForecastRef}
          className={`daily-forecast-section ${dailyForecastInView ? 'animate__animated animate__fadeInUp' : ''}`}
        >
          <DailyForecastCard dailyForecastData={dailyForecastData} />
        </div>
      )}
    </div>
  );
}

export default Weather;