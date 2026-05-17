// src/components/MapView.js
import React from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { darkMapStyle } from './mapStyles';
function MapView({ markers = [], directions, resetKey, theme, isGoogleLoaded, loadError }) {
  const isDark = theme === 'dark';
  const initialZoom = 5;
  const mapContainerStyle = {
    height: '400px',
    width: '100vw',
    marginTop: '20px',
    marginLeft: 'calc(50% - 50vw)',
  };

  const mapOptions = {
    styles: isDark ? darkMapStyle : [],
    disableDefaultUI: false,
    fullscreenControl: true,
  };

  if (loadError) {
    console.error('Google Maps script error:', loadError);
    return (
      <div style={mapContainerStyle}>
        Google Maps sa nepodarilo načítať.
      </div>
    );
  }

  if (!isGoogleLoaded) {
    return (
      <div style={mapContainerStyle}>
        Načítavam Google Maps...
      </div>
    );
  }

  return (
    <GoogleMap
      key={resetKey}
      mapContainerStyle={mapContainerStyle}
      center={markers.length > 0 ? markers[0].position : { lat: 48.669, lng: 19.699 }}
      zoom={initialZoom}
      options={mapOptions}
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
  );
}

export default MapView;
