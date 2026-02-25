import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onLocationSelect, placeholder, defaultValue }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(defaultValue || '');
  const inputRef = useRef(null);

  useEffect(() => {
    let intervalId;
    let listener;
    let observer;

    const initAutocomplete = () => {
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.places ||
        !inputRef.current
      ) {
        return false;
      }

      // Vytvoríme Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['(cities)'] }
      );
      autocomplete.setFields(['formatted_address', 'geometry', 'name']);

      // Namiesto natívneho placeholderu (ktorý by Google mohol prepísať) ho nastavíme na prázdny reťazec.
      inputRef.current.setAttribute('placeholder', '');

      // Observer pre stráženie placeholderu
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'placeholder'
          ) {
            if (inputRef.current.getAttribute('placeholder') !== '') {
              inputRef.current.setAttribute('placeholder', '');
            }
          }
        });
      });
      observer.observe(inputRef.current, { attributes: true });

      // Listener pre výber miesta
      listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          // Máme geometry => uložíme priamo
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const locationData = {
            address: place.formatted_address || place.name,
            position: { lat, lng }
          };
          setQuery(locationData.address);
          onLocationSelect?.(locationData);
        } else {
          // Nemáme geometry => skúsime fallback geocoder
          const geocoder = new window.google.maps.Geocoder();
          const address = place.formatted_address || place.name;
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const lat = results[0].geometry.location.lat();
              const lng = results[0].geometry.location.lng();
              const locationData = {
                address: results[0].formatted_address,
                position: { lat, lng }
              };
              setQuery(locationData.address);
              onLocationSelect?.(locationData);
            } else {
              console.error('Geokódovanie zlyhalo:', status);
              // Tu môžeš dať alert alebo setState, že nevieme získať polohu
            }
          });
        }
      });
      return true;
    };

    // Skúsime inicializovať autocomplete hneď, alebo to robíme v intervale
    if (!initAutocomplete()) {
      intervalId = setInterval(() => {
        if (initAutocomplete()) {
          clearInterval(intervalId);
        }
      }, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (listener && window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.removeListener(listener);
      }
      if (observer) observer.disconnect();
    };
  }, [onLocationSelect]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setQuery(defaultValue || '');
  }, [defaultValue]);

  return (
    <div className="formField">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder=""
        required
      />
      <span>{placeholder}</span>
    </div>
  );
};

export default SearchBar;
