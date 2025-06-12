

import React, { useState, useEffect } from 'react';

const GeolocationComponent = () => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }

          const data = await response.json();

          setAddress(data.display_name);

          // Store address in localStorage
          localStorage.setItem('userAddress', data.display_name);
        } catch (error) {
          setError(`Error fetching address: ${error.message}`);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('User denied the request for geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
      }
    );
  }, []); // Empty dependency array ensures this effect runs once on component mount

  return (
    <div>
      {address ? (
        <></>
        // <p>Your current address: {address}</p>
      ) : (
        // <p>{error ? `Error: ${error}` : 'Fetching your current location...'}</p>
        <></>
      )}
    </div>
  );
};

export default GeolocationComponent;
