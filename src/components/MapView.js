import React from 'react';
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';
import { darkMapStyle } from './mapStyles';

const MARKER_COLORS = {
  start: { fill: '#16a567', accent: '#0c7548' },
  stop: { fill: '#1976d2', accent: '#0d47a1' },
  destination: { fill: '#ef5350', accent: '#b71c1c' },
};

const createMarkerIcon = (label, type) => {
  const colors = MARKER_COLORS[type] || MARKER_COLORS.stop;
  const safeLabel = String(label).replace(/[<>&"']/g, '');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="62" viewBox="0 0 52 62">
      <defs>
        <filter id="shadow" x="-40%" y="-30%" width="180%" height="190%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000" flood-opacity=".28"/>
        </filter>
        <linearGradient id="pin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${colors.fill}"/>
          <stop offset="1" stop-color="${colors.accent}"/>
        </linearGradient>
      </defs>
      <path filter="url(#shadow)" fill="url(#pin)"
        d="M26 3C13.3 3 3 13.3 3 26c0 17 23 33 23 33s23-16 23-33C49 13.3 38.7 3 26 3z"/>
      <circle cx="26" cy="26" r="14" fill="#fff" fill-opacity=".97"/>
      <circle cx="26" cy="26" r="11" fill="${colors.fill}" fill-opacity=".12"/>
      <text x="26" y="31" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="15" font-weight="700" fill="${colors.accent}">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

function MapView({
  markers = [],
  directions,
  resetKey,
  theme,
  isGoogleLoaded,
  loadError,
}) {
  const isDark = theme === 'dark';
  const mapOptions = {
    styles: isDark ? darkMapStyle : [],
    disableDefaultUI: false,
    fullscreenControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    clickableIcons: false,
  };

  if (loadError) {
    console.error('Google Maps script error:', loadError);
    return (
      <div className="fuelyMap">
        Google Maps sa nepodarilo načítať.
      </div>
    );
  }

  if (!isGoogleLoaded) {
    return <div className="fuelyMap">Načítavam Google Maps...</div>;
  }

  return (
    <GoogleMap
      key={resetKey}
      mapContainerClassName="fuelyMap"
      center={
        markers.length > 0
          ? markers[0].position
          : { lat: 48.669, lng: 19.699 }
      }
      zoom={5}
      options={mapOptions}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#1976d2',
              strokeOpacity: 0.88,
              strokeWeight: 6,
            },
          }}
        />
      )}
      {markers.map((marker, index) => (
        <Marker
          key={`${marker.type}-${marker.label}-${index}`}
          position={marker.position}
          icon={{
            url: createMarkerIcon(marker.label, marker.type),
            scaledSize: new window.google.maps.Size(46, 55),
            anchor: new window.google.maps.Point(23, 55),
          }}
          zIndex={marker.type === 'stop' ? 2 : 3}
        />
      ))}
    </GoogleMap>
  );
}

export default MapView;
