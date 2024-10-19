import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import BusLogo from '../Driver/bus_logo.png'; 

const StudentRoute = () => {
  const [routePoints, setRoutePoints] = useState([]);
  const [driverPosition, setDriverPosition] = useState(null);
  const [studentPosition, setStudentPosition] = useState(null); 

  const driverIcon = L.icon({
    iconUrl: BusLogo,
    iconSize: [20, 20], 
  });

  useEffect(() => {
    const savedRoute = localStorage.getItem('savedRoute');
    if (savedRoute) {
      setRoutePoints(JSON.parse(savedRoute));
    }
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDriverPosition([latitude, longitude])
      },
      (error) => {
        console.error('Error getting driver position:', error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const getStudentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setStudentPosition([latitude, longitude]);
          },
          (error) => {
            console.error('Error getting student location:', error);
          }
        );
      }
    };
    getStudentLocation(); 
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h3>Driver Live Location on Route</h3>
      {routePoints.length > 0 ? (
        <MapContainer
          className="map-container"
          center={driverPosition || [routePoints[0]?.lat, routePoints[0]?.lon]} 
          zoom={13}
          style={{ height: '90vh', width: '100vh' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          <Polyline
            positions={routePoints.map((point) => [point.lat, point.lon])}
            color="blue"
          />

          {driverPosition && (
            <Marker position={driverPosition} icon={driverIcon}>
            </Marker>
          )}

          {studentPosition && (
            <Marker position={studentPosition} icon={L.icon({ iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Map_marker.svg', iconSize: [20, 20] })}>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <div>No route points available to display.</div>
      )}
    </div>
  );
};

export default StudentRoute;
