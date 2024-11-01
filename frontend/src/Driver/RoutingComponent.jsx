import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine'; // Import Leaflet Routing Machine

const RoutingComponent = ({ routePoints }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    // Check for valid route points
    if (routePoints.length < 2) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null; // Reset the ref
      }
      return; // Exit if there are not enough points to create a route
    }

    // If a routing control already exists, remove it
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create new routing control
    routingControlRef.current = L.Routing.control({
      waypoints: routePoints.map(point => L.latLng(point.lat, point.lon)),
      routeWhileDragging: false, // Disable route updating while dragging
      createMarker: () => null, // Disable marker creation
      show: false, // Hide the routing box
      geocoder: L.Control.Geocoder.nominatim(), // Optional: Geocoder
    }).addTo(map);

    // Cleanup on unmount or when routePoints change
    // console.log("Route Points:", routePoints);
// console.log("Current Routing Control:", routingControlRef.current);

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
