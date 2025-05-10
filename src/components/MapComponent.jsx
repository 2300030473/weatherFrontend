import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_KEY = import.meta.env.VITE_API_KEY;

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setNearbyCities }) {
  const map = useMapEvents({
    moveend: async () => {
      const center = map.getCenter();
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/find?lat=${center.lat}&lon=${center.lng}&cnt=10&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setNearbyCities(data.list);
      } catch (error) {
        console.error('Error fetching nearby cities:', error);
      }
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);

          // Ensure the map is initialized before calling setView
          if (map) {
            map.setView([latitude, longitude], 12); // Auto-zoom to current location
          }

          // Fetch nearby cities' temperatures initially
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=10&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            setNearbyCities(data.list);
          } catch (error) {
            console.error('Error fetching nearby cities:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, [map, setPosition, setNearbyCities]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Your Location</Popup>
    </Marker>
  );
}

function MapComponent() {
  const [position, setPosition] = useState(null);
  const [nearbyCities, setNearbyCities] = useState([]);

  return (
    <MapContainer center={position || [51.505, -0.09]} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker position={position} setPosition={setPosition} setNearbyCities={setNearbyCities} />
      {nearbyCities.map((city) => (
        <Marker key={city.id} position={[city.coord.lat, city.coord.lon]}>
          <Popup>
            {city.name}: {city.main.temp.toFixed(1)}°C
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;