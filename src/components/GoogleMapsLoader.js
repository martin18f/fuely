import { useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

function GoogleMapsLoader({ apiKey, libraries, onStateChange }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'fuely-google-maps-script',
    googleMapsApiKey: apiKey,
    libraries,
    version: 'weekly',
  });

  useEffect(() => {
    onStateChange?.({
      isLoaded,
      loadError: loadError || null,
    });
  }, [isLoaded, loadError, onStateChange]);

  return null;
}

export default GoogleMapsLoader;
