// src/components/MapView.js
import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { darkMapStyle } from './mapStyles';
function MapView({ language, markers = [], directions, resetKey, onGoogleLoad, theme }) {
  const isDark = theme === 'dark';
  const initialZoom = 5;
  const mapContainerStyle = {
    height: '400px',
    width: '100vw',
    marginTop: '20px',
    marginLeft: 'calc(50% - 50vw)',
  };

  const handleMapError = (e) => {
    console.error("Google Maps script error:", e);
  };

  const mapOptions = {
    styles: isDark ? darkMapStyle : [],
    disableDefaultUI: false,
    fullscreenControl: true,
  };
  return (
    <LoadScript
      key={`${language}-${resetKey}`}
      googleMapsApiKey="AIzaSyByASDfSznBhQU1vZ-2yVhfTUI5gtCPotA"
      libraries={['places']}
      language={language}
      onError={handleMapError}
      onLoad={onGoogleLoad}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markers.length > 0 ? markers[0].position : { lat: 48.669, lng: 19.699 }}
        zoom={initialZoom}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {!directions && markers.map((m, idx) => (
          <Marker
            key={idx}
            position={m.position}
            label={m.label}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapView;
