import React, { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MIN_QUERY_LENGTH = 3;
const SEARCH_DELAY_MS = 250;
const PLACES_RETRY_DELAY_MS = 100;
const PLACES_RETRY_COUNT = 50;

const wait = (duration) =>
  new Promise((resolve) => window.setTimeout(resolve, duration));

const getPredictionKey = (prediction) =>
  prediction.placeId || prediction.place_id || prediction.text?.toString();

const getPredictionText = (prediction) =>
  prediction.text?.toString() || prediction.description || '';

async function createPlacesAdapter() {
  for (let attempt = 0; attempt < PLACES_RETRY_COUNT; attempt += 1) {
    const maps = window.google?.maps;

    if (maps) {
      let placesApi = maps.places;

      if (maps.importLibrary) {
        try {
          placesApi = await maps.importLibrary('places');
        } catch (error) {
          placesApi = maps.places;
        }
      }

      if (placesApi?.AutocompleteSuggestion) {
        return {
          createSessionToken: () =>
            placesApi.AutocompleteSessionToken
              ? new placesApi.AutocompleteSessionToken()
              : undefined,
          fetchSuggestions: async (input, sessionToken) => {
            const request = { input };
            if (sessionToken) request.sessionToken = sessionToken;

            const response =
              await placesApi.AutocompleteSuggestion.fetchAutocompleteSuggestions(
                request
              );

            return response.suggestions
              .map(({ placePrediction }) => placePrediction)
              .filter(Boolean);
          },
          resolvePrediction: async (prediction) => {
            const place = prediction.toPlace();
            await place.fetchFields({
              fields: ['displayName', 'formattedAddress', 'location'],
            });

            if (!place.location) {
              throw new Error('missing-location');
            }

            return {
              address:
                place.formattedAddress ||
                place.displayName ||
                getPredictionText(prediction),
              position: {
                lat: place.location.lat(),
                lng: place.location.lng(),
              },
            };
          },
        };
      }

      const legacyPlaces = placesApi || maps.places;
      if (legacyPlaces?.AutocompleteService && maps.Geocoder) {
        const autocompleteService = new legacyPlaces.AutocompleteService();
        const geocoder = new maps.Geocoder();

        return {
          createSessionToken: () =>
            legacyPlaces.AutocompleteSessionToken
              ? new legacyPlaces.AutocompleteSessionToken()
              : undefined,
          fetchSuggestions: (input, sessionToken) =>
            new Promise((resolve, reject) => {
              const request = { input };
              if (sessionToken) request.sessionToken = sessionToken;

              autocompleteService.getPlacePredictions(
                request,
                (predictions, status) => {
                  if (status === 'OK') {
                    resolve(predictions || []);
                  } else if (status === 'ZERO_RESULTS') {
                    resolve([]);
                  } else {
                    reject(new Error(status || 'autocomplete-failed'));
                  }
                }
              );
            }),
          resolvePrediction: (prediction) =>
            new Promise((resolve, reject) => {
              geocoder.geocode(
                { placeId: prediction.place_id },
                (results, status) => {
                  const result = results?.[0];
                  if (status !== 'OK' || !result?.geometry?.location) {
                    reject(new Error(status || 'place-details-failed'));
                    return;
                  }

                  resolve({
                    address:
                      result.formatted_address ||
                      getPredictionText(prediction),
                    position: {
                      lat: result.geometry.location.lat(),
                      lng: result.geometry.location.lng(),
                    },
                  });
                }
              );
            }),
        };
      }
    }

    await wait(PLACES_RETRY_DELAY_MS);
  }

  throw new Error('places-not-ready');
}

const SearchBar = ({
  onLocationSelect,
  placeholder,
  defaultValue,
  isGoogleLoaded,
  loadError,
  onActivate,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(defaultValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [isPlacesReady, setIsPlacesReady] = useState(false);
  const suggestionsId = useId();
  const rootRef = useRef(null);
  const placesAdapterRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const requestIdRef = useRef(0);
  const skipSearchForValueRef = useRef(defaultValue || '');
  const selectedValueRef = useRef(defaultValue || '');
  const keepQueryAfterParentClearRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    if (!isGoogleLoaded || loadError) {
      setIsPlacesReady(false);
      return undefined;
    }

    createPlacesAdapter()
      .then((adapter) => {
        if (cancelled) return;

        placesAdapterRef.current = adapter;
        sessionTokenRef.current = adapter.createSessionToken();
        setIsPlacesReady(true);
        setError('');
      })
      .catch(() => {
        if (!cancelled) {
          setIsPlacesReady(false);
          setError(t('locationSearchLoadError'));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isGoogleLoaded, loadError, t]);

  useEffect(() => {
    if (query === skipSearchForValueRef.current) {
      setSuggestions([]);
      return undefined;
    }

    const trimmedQuery = query.trim();
    if (!isPlacesReady || trimmedQuery.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return undefined;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const timeoutId = window.setTimeout(async () => {
      try {
        const nextSuggestions =
          await placesAdapterRef.current.fetchSuggestions(
            trimmedQuery,
            sessionTokenRef.current
          );

        if (requestId === requestIdRef.current) {
          setSuggestions(nextSuggestions);
          setError('');
        }
      } catch (searchError) {
        if (requestId === requestIdRef.current) {
          setSuggestions([]);
          setError(t('locationSearchRequestError'));
        }
      }
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isPlacesReady, query, t]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const nextDefaultValue = defaultValue || '';
    skipSearchForValueRef.current = nextDefaultValue;
    selectedValueRef.current = nextDefaultValue;

    if (keepQueryAfterParentClearRef.current && !nextDefaultValue) {
      keepQueryAfterParentClearRef.current = false;
      setSuggestions([]);
      return;
    }

    keepQueryAfterParentClearRef.current = false;
    setQuery(nextDefaultValue);
    setSuggestions([]);
  }, [defaultValue]);

  const handleSelect = async (prediction) => {
    try {
      const locationData =
        await placesAdapterRef.current.resolvePrediction(prediction);

      skipSearchForValueRef.current = locationData.address;
      selectedValueRef.current = locationData.address;
      setQuery(locationData.address);
      setSuggestions([]);
      setError('');
      onLocationSelect?.(locationData);
      sessionTokenRef.current =
        placesAdapterRef.current.createSessionToken();
    } catch (selectionError) {
      setError(
        selectionError?.message === 'missing-location'
          ? t('locationMissingCoordinates')
          : t('locationDetailsError')
      );
    }
  };

  const configurationError = loadError
    ? t('googleMapsLoadError')
    : '';

  return (
    <div className="formField locationSearch" ref={rootRef}>
      <input
        type="text"
        value={query}
        onFocus={onActivate}
        onChange={(event) => {
          const nextQuery = event.target.value;

          onActivate?.();
          if (
            selectedValueRef.current &&
            nextQuery !== selectedValueRef.current
          ) {
            selectedValueRef.current = '';
            keepQueryAfterParentClearRef.current = true;
            onLocationSelect?.(null);
          }

          skipSearchForValueRef.current = '';
          setQuery(nextQuery);
          setError('');
        }}
        placeholder=""
        autoComplete="off"
        aria-label={placeholder}
        aria-busy={isGoogleLoaded && !isPlacesReady}
        aria-controls={suggestionsId}
        aria-autocomplete="list"
        aria-expanded={suggestions.length > 0}
        role="combobox"
        required
      />
      <span>{placeholder}</span>

      {suggestions.length > 0 && (
        <div
          className="locationSuggestions"
          id={suggestionsId}
          role="listbox"
        >
          {suggestions.map((prediction) => (
            <button
              type="button"
              role="option"
              aria-selected="false"
              key={getPredictionKey(prediction)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(prediction)}
            >
              {getPredictionText(prediction)}
            </button>
          ))}
        </div>
      )}

      {(configurationError || error) && (
        <small className="locationSearchError">
          {configurationError || error}
        </small>
      )}
    </div>
  );
};

export default SearchBar;
