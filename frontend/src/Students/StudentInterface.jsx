import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutBtn from '../Components/LogoutBtn';

const StudentInterface = () => {
  const [vehicles, setVehicles] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestType: 'getVehicles' }),
        });
        const data = await response.json();
        const flattenedData = data.flat();
        setVehicles(flattenedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
  
    fetchVehicles(); // Initial fetch on component mount
  
    const intervalId = setInterval(fetchVehicles, 5000); // Poll every 5 seconds
  
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);
  

  return (
    <>
      <div className="vehicle-container">
        <h2 className="vehicle-title">Vehicle number:</h2>
        <div className="vehicle-buttons">
          {loading ? (
            <p>Loading...</p>
          ) : (
            vehicles.map((vehicle) => (
              <Link key={vehicle._id} to={`/student/VehicleRoute-${vehicle.vehicleName}`}>
                <button className="vehicle-button">
                  {vehicle.vehicleName} 
                </button>
              </Link>
            ))
          )}
        </div>
      </div>
      <LogoutBtn />
    </>
  );
};

export default StudentInterface;
