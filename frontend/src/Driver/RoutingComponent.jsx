import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine'; // Import Leaflet Routing Machine

const RoutingComponent = ({ routePoints }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (routingControlRef.current) {
      // Remove existing routing control if it exists
      map.removeControl(routingControlRef.current);
    }

    if (routePoints.length > 0) {
      // Create new routing control
      routingControlRef.current = L.Routing.control({
        waypoints: routePoints.map(point => L.latLng(point.lat, point.lon)),
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(),
      }).addTo(map);
    }

    // Cleanup on unmount or when routePoints change
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null; // Reset the ref
      }
    };
  }, [routePoints, map]);

  return null; // This component doesn't render anything
};

export default RoutingComponent;
