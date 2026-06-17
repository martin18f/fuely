import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import FuelPriceInput from './components/FuelPriceInput';
import i18n from './i18n';
import useLocalStorage from './components/useLocalStorage';
import CookieBanner from './components/CookieBanner';
import TrackingScripts from './components/TrackingScripts';
import ThemeToggle from './components/ThemeToggle';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  hasCookieConsent as readCookieConsent,
} from './components/cookieConsent';
import LanguageSwitcher from './components/LanguageSwitcher';
import FuelUnitSwitcher from './components/FuelUnitSwitcher';
import SearchBar from './components/SearchBar';
import GoogleMapsLoader from './components/GoogleMapsLoader';
import CustomCheckbox from './components/CustomCheckbox';
import CurrencySwitcher from './components/CurrencySwitcher';
import PolicyLinks from './PolicyLinks';
import DeleteButton from './components/DeleteButton';
import FuelTypeRadioGroup from './components/FuelTypeRadioGroup';
import VehicleTypeSwitcher from './components/VehicleTypeSwitcher';
import ShareButton from './components/ShareButton';
import { getLocaleDefaults } from './utils/localeDefaults';
import {
  calculateTripCost,
  LITERS_PER_US_GALLON,
  METERS_PER_MILE,
} from './utils/tripCalculation';

import './App.css';

const CarSelector = lazy(() => import('./CarSelector'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const CookiePolicy = lazy(() => import('./CookiePolicy'));
const MapView = lazy(() => import('./components/MapView'));
const PalivovaKalkulacka = lazy(() => import('./PalivovaKalkulacka'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const RatingPopup = lazy(() => import('./components/RatingPopup'));
const TermsOfUse = lazy(() => import('./TermsOfUse'));

const GOOGLE_MAPS_LIBRARIES = ['places'];
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const SITE_URL = 'https://fuely.martinsulak.dev';

const getAbsoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const getDirectionsErrorMessage = (status, t) => {
  const translatedMessage = t(`routeError_${status}`, {
    defaultValue: '',
  });

  return translatedMessage || t('routeErrorGeneric', { status: status || '?' });
};

const sanitizeNumericInput = (value) => value.replace(',', '.').trim();

let stopId = 0;
const createStop = () => ({
  id: `${Date.now()}-${stopId += 1}`,
  location: null,
});

const getRouteSummary = (route) => {
  const legs = route?.legs || [];
  const distanceMeters = legs.reduce(
    (total, leg) => total + (leg.distance?.value || 0),
    0
  );
  const durationSeconds = legs.reduce(
    (total, leg) => total + (leg.duration?.value || 0),
    0
  );
  const totalMinutes = Math.round(durationSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    distanceMeters,
    durationText:
      hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`,
  };
};

function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Fuely</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h2 className="notFoundTitle">
        404 - Page Not Found
      </h2>
    </>
  );
}

function App() {
  const { t } = useTranslation();
  const localeDefaults = useRef(
    getLocaleDefaults(
      typeof navigator === 'undefined' ? 'en' : navigator.language
    )
  ).current;

  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(() =>
    readCookieConsent()
  );

  const [useAutoConsumption, setUseAutoConsumption] = useLocalStorage(
    'useAutoConsumption',
    false
  );
  const [fuelConsumption, setFuelConsumption] = useLocalStorage(
    'fuelConsumption',
    localeDefaults.fuelConsumption
  );
  const [selectedYear, setSelectedYear] = useLocalStorage(
    'csYear',
    'Without year'
  );
  const [selectedBrand, setSelectedBrand] = useLocalStorage('csBrand', '');
  const [selectedModel, setSelectedModel] = useLocalStorage('csModel', '');
  const [selectedEngine, setSelectedEngine] = useLocalStorage('csEngine', '');
  const [selectedTransmission, setSelectedTransmission] = useLocalStorage(
    'csTransmission',
    ''
  );
  const [selectedFuelType, setSelectedFuelType] = useLocalStorage(
    'csFuelType',
    ''
  );
  const [selectedVehicleType, setSelectedVehicleType] = useLocalStorage(
    'csVehicleType',
    'combustion'
  );
  const [startLocation, setStartLocation] = useLocalStorage(
    'startLocation',
    null
  );
  const [destinationLocation, setDestinationLocation] = useLocalStorage(
    'destinationLocation',
    null
  );
  const [avoidHighways, setAvoidHighways] = useLocalStorage(
    'avoidHighways',
    false
  );
  const [distance, setDistance] = useLocalStorage(
    'distance',
    localeDefaults.distanceMeters
  );
  const [travelTime, setTravelTime] = useLocalStorage('travelTime', null);
  const [fuelPriceLocal, setFuelPriceLocal] = useLocalStorage(
    'fuelPriceLocal',
    localeDefaults.fuelPrice
  );
  const [fuelUnit, setFuelUnit] = useLocalStorage(
    'fuelUnit',
    localeDefaults.fuelUnit
  );
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage(
    'selectedCurrency',
    localeDefaults.selectedCurrency
  );
  const [stopLocations, setStopLocations] = useLocalStorage(
    'stopLocations',
    []
  );
  const [tolls, setTolls] = useLocalStorage('tolls', '0');
  const [shouldLoadGoogleMaps, setShouldLoadGoogleMaps] = useState(false);
  const [googleMapsState, setGoogleMapsState] = useState({
    isLoaded: false,
    loadError: null,
  });

  const [directionsResult, setDirectionsResult] = useState(null);
  const [routeAlternatives, setRouteAlternatives] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [directions, setDirections] = useState(null);
  const [fuelPriceEur, setFuelPriceEur] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [resetKey, setResetKey] = useState(0);

  const routeRequestIdRef = useRef(0);
  const previousFuelUnitRef = useRef(fuelUnit);
  const waypointKey = stopLocations
    .filter((stop) => stop.location?.position)
    .map(
      (stop) =>
        `${stop.location.position.lat},${stop.location.position.lng}`
    )
    .join(';');
  const { isLoaded: isGoogleLoaded, loadError: googleMapsLoadError } =
    googleMapsState;

  const requestGoogleMapsLoad = useCallback(() => {
    if (GOOGLE_MAPS_API_KEY) {
      setShouldLoadGoogleMaps(true);
    }
  }, []);

  useEffect(() => {
    const language = i18n.resolvedLanguage || i18n.language || 'en';
    if (!language.startsWith('sk') && !language.startsWith('en')) {
      i18n.changeLanguage('en');
    }
  }, []);

  useEffect(() => {
    const handleConsentChange = (event) => {
      setHasAnalyticsConsent(Boolean(event.detail?.accepted));
    };
    const handleStorageChange = (event) => {
      if (event.key === COOKIE_CONSENT_KEY) {
        setHasAnalyticsConsent(event.newValue === 'true');
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme !== 'dark');
  }, [theme]);

  useEffect(() => {
    if (
      startLocation?.position ||
      destinationLocation?.position ||
      stopLocations.some((stop) => stop.location?.position)
    ) {
      requestGoogleMapsLoad();
    }
  }, [
    destinationLocation,
    requestGoogleMapsLoad,
    startLocation,
    stopLocations,
  ]);

  useEffect(() => {
    const primaryUrl =
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json';
    const fallbackUrl =
      'https://latest.currency-api.pages.dev/v1/currencies/eur.json';

    fetch(primaryUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .catch(() =>
        fetch(fallbackUrl).then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
      )
      .then((data) => {
        if (data?.eur) setExchangeRates(data.eur);
      })
      .catch((error) => {
        console.error('Currency rates could not be loaded:', error);
      });
  }, []);

  useEffect(() => {
    if (fuelPriceEur !== null) return;

    const localPrice = Number.parseFloat(fuelPriceLocal);
    const currentRate = exchangeRates[selectedCurrency];
    if (Number.isFinite(localPrice) && currentRate) {
      setFuelPriceEur(localPrice / currentRate);
    }
  }, [exchangeRates, fuelPriceEur, fuelPriceLocal, selectedCurrency]);

  const handleFuelPriceChange = useCallback(
    (value) => {
      const sanitized = sanitizeNumericInput(value);
      setFuelPriceLocal(sanitized);

      const localPrice = Number.parseFloat(sanitized);
      const currentRate = exchangeRates[selectedCurrency];
      setFuelPriceEur(
        Number.isFinite(localPrice) && currentRate
          ? localPrice / currentRate
          : null
      );
    },
    [exchangeRates, selectedCurrency, setFuelPriceLocal]
  );

  const handlePresetFuelPriceChange = useCallback(
    (eurPerLiterValue) => {
      const eurPerLiter = Number.parseFloat(eurPerLiterValue);
      const currencyRate =
        selectedCurrency === 'eur' ? 1 : exchangeRates[selectedCurrency];

      if (!Number.isFinite(eurPerLiter) || !currencyRate) {
        handleFuelPriceChange(eurPerLiterValue);
        return;
      }

      const unitMultiplier =
        selectedVehicleType === 'combustion' && fuelUnit === 'imperial'
          ? LITERS_PER_US_GALLON
          : 1;
      const convertedPrice =
        eurPerLiter * currencyRate * unitMultiplier;
      handleFuelPriceChange(
        Number.parseFloat(convertedPrice.toFixed(3)).toString()
      );
    },
    [
      exchangeRates,
      fuelUnit,
      handleFuelPriceChange,
      selectedCurrency,
      selectedVehicleType,
    ]
  );

  const handleCurrencyChange = useCallback(
    (nextCurrency) => {
      const currentPrice = Number.parseFloat(fuelPriceLocal);
      const currentRate = exchangeRates[selectedCurrency];
      const nextRate = exchangeRates[nextCurrency];
      const priceInEur =
        fuelPriceEur ??
        (Number.isFinite(currentPrice) && currentRate
          ? currentPrice / currentRate
          : null);

      if (priceInEur !== null && nextRate) {
        setFuelPriceLocal(
          Number.parseFloat((priceInEur * nextRate).toFixed(3)).toString()
        );
        setFuelPriceEur(priceInEur);
      }
      setSelectedCurrency(nextCurrency);
    },
    [
      exchangeRates,
      fuelPriceEur,
      fuelPriceLocal,
      selectedCurrency,
      setFuelPriceLocal,
      setSelectedCurrency,
    ]
  );

  const handleFuelConsumptionChange = useCallback(
    (value) => setFuelConsumption(sanitizeNumericInput(value)),
    [setFuelConsumption]
  );

  const handleConsumptionChange = useCallback(
    (value) => {
      if (useAutoConsumption) setFuelConsumption(value);
    },
    [setFuelConsumption, useAutoConsumption]
  );

  useEffect(() => {
    const previousUnit = previousFuelUnitRef.current;
    if (fuelUnit === previousUnit) return;

    const consumption = Number.parseFloat(fuelConsumption);
    const localPrice = Number.parseFloat(fuelPriceLocal);
    const movingToImperial = fuelUnit === 'imperial';

    if (!useAutoConsumption && Number.isFinite(consumption) && consumption > 0) {
      if (selectedVehicleType === 'combustion') {
        setFuelConsumption((235.214583 / consumption).toFixed(2));
      } else {
        const convertedConsumption = movingToImperial
          ? consumption * 1.609344
          : consumption / 1.609344;
        setFuelConsumption(convertedConsumption.toFixed(2));
      }
    }

    if (
      selectedVehicleType === 'combustion' &&
      Number.isFinite(localPrice) &&
      localPrice > 0
    ) {
      const priceMultiplier = movingToImperial
        ? LITERS_PER_US_GALLON
        : 1 / LITERS_PER_US_GALLON;
      setFuelPriceLocal(
        Number.parseFloat((localPrice * priceMultiplier).toFixed(3)).toString()
      );
      setFuelPriceEur((currentPrice) =>
        currentPrice === null ? null : currentPrice * priceMultiplier
      );
    }

    previousFuelUnitRef.current = fuelUnit;
  }, [
    fuelConsumption,
    fuelPriceLocal,
    fuelUnit,
    selectedVehicleType,
    setFuelConsumption,
    setFuelPriceLocal,
    useAutoConsumption,
  ]);

  const setSelectedDirections = useCallback((result, index) => {
    setDirections({ ...result, routes: [result.routes[index]] });
  }, []);

  const requestRoute = useCallback(() => {
    if (
      googleMapsLoadError ||
      !isGoogleLoaded ||
      !window.google?.maps ||
      !startLocation ||
      !destinationLocation
    ) {
      return;
    }

    const requestId = routeRequestIdRef.current + 1;
    routeRequestIdRef.current = requestId;
    setLoading(true);
    setRouteError('');

    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = waypointKey
      ? waypointKey.split(';').map((coordinates) => {
          const [lat, lng] = coordinates.split(',').map(Number);
          return {
            location: { lat, lng },
            stopover: true,
          };
        })
      : [];

    directionsService.route(
      {
        origin: startLocation.position,
        destination: destinationLocation.position,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: waypoints.length === 0,
        avoidHighways,
      },
      (result, status) => {
        if (requestId !== routeRequestIdRef.current) return;

        setLoading(false);
        if (status === 'OK' && result?.routes?.length) {
          setDirectionsResult(result);
          setRouteAlternatives(result.routes);
          setSelectedRouteIndex(0);
          setSelectedDirections(result, 0);
          const routeSummary = getRouteSummary(result.routes[0]);
          setDistance(routeSummary.distanceMeters);
          setTravelTime(routeSummary.durationText);
          setRouteError('');
        } else {
          console.error('Directions request failed:', status);
          setRouteError(getDirectionsErrorMessage(status, t));
        }
      }
    );
  }, [
    avoidHighways,
    destinationLocation,
    googleMapsLoadError,
    isGoogleLoaded,
    setDistance,
    setSelectedDirections,
    setTravelTime,
    startLocation,
    t,
    waypointKey,
  ]);

  useEffect(() => {
    if (!startLocation || !destinationLocation || !isGoogleLoaded) return;

    const timeoutId = window.setTimeout(requestRoute, 250);
    return () => window.clearTimeout(timeoutId);
  }, [destinationLocation, isGoogleLoaded, requestRoute, startLocation]);

  const selectRouteAlternative = (index) => {
    if (!directionsResult || !routeAlternatives[index]) return;

    const route = directionsResult.routes[index];
    const routeSummary = getRouteSummary(route);
    setSelectedRouteIndex(index);
    setSelectedDirections(directionsResult, index);
    setDistance(routeSummary.distanceMeters);
    setTravelTime(routeSummary.durationText);
  };

  const handleDistanceChange = (value) => {
    const sanitized = sanitizeNumericInput(value);
    if (!sanitized) {
      setDistance(null);
      return;
    }

    const parsedDistance = Number.parseFloat(sanitized);
    if (!Number.isFinite(parsedDistance)) return;

    setDistance(
      fuelUnit === 'imperial'
        ? parsedDistance * METERS_PER_MILE
        : parsedDistance * 1000
    );
  };

  const calculation = useMemo(
    () =>
      calculateTripCost({
        distanceMeters: distance,
        consumption: fuelConsumption,
        fuelPrice: fuelPriceLocal,
        fuelUnit,
        vehicleType: selectedVehicleType,
        tolls,
      }),
    [
      distance,
      fuelConsumption,
      fuelPriceLocal,
      fuelUnit,
      selectedVehicleType,
      tolls,
    ]
  );

  const emissions = useMemo(() => {
    if (!calculation || selectedVehicleType !== 'combustion') return null;

    const liters =
      fuelUnit === 'imperial'
        ? calculation.energyUsed * LITERS_PER_US_GALLON
        : calculation.energyUsed;
    return liters * (fuelType === 'diesel' ? 2.684 : 2.338);
  }, [calculation, fuelType, fuelUnit, selectedVehicleType]);

  const displayLocale =
    (i18n.resolvedLanguage || i18n.language || 'en').startsWith('sk')
      ? 'sk-SK'
      : 'en-US';
  const currencyCode = selectedCurrency.toUpperCase();
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(displayLocale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [currencyCode, displayLocale]
  );
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(displayLocale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [displayLocale]
  );

  const formatCurrency = useCallback(
    (value) => currencyFormatter.format(value),
    [currencyFormatter]
  );
  const formatNumber = useCallback(
    (value) => numberFormatter.format(value),
    [numberFormatter]
  );

  const calculationBreakdown = useMemo(() => {
    if (!calculation) return '';

    const distancePart = `${formatNumber(calculation.distance)} ${
      calculation.distanceUnit
    }`;
    const pricePart = `${formatCurrency(calculation.fuelPrice)}/${
      calculation.priceUnit
    }`;
    let formula;

    if (
      selectedVehicleType === 'combustion' &&
      fuelUnit === 'imperial'
    ) {
      formula = `${distancePart} / ${formatNumber(
        calculation.consumption
      )} MPG x ${pricePart}`;
    } else {
      formula = `${distancePart} / 100 x ${formatNumber(
        calculation.consumption
      )} ${calculation.consumptionUnit} x ${pricePart}`;
    }

    if (calculation.tolls > 0) {
      formula += ` + ${formatCurrency(calculation.tolls)} ${t('tolls')}`;
    }

    return `${formula} = ${formatCurrency(calculation.exactCost)}`;
  }, [
    calculation,
    formatCurrency,
    formatNumber,
    fuelUnit,
    selectedVehicleType,
    t,
  ]);

  const distanceInputValue =
    distance === null
      ? ''
      : Number.parseFloat(
          (
            fuelUnit === 'imperial'
              ? distance / METERS_PER_MILE
              : distance / 1000
          ).toFixed(2)
        ).toString();

  const consumptionLabel =
    selectedVehicleType === 'electric'
      ? fuelUnit === 'imperial'
        ? t('efficiencyImperial')
        : t('efficiencyMetric')
      : fuelUnit === 'imperial'
        ? t('fuelConsumptionImperial')
        : t('fuelConsumptionMetric');

  const handleConsumptionModeToggle = () => {
    setUseAutoConsumption((currentValue) => {
      const nextValue = !currentValue;
      if (nextValue) {
        setFuelConsumption('');
      } else if (!fuelConsumption) {
        setFuelConsumption(fuelUnit === 'imperial' ? '36.19' : '6.5');
      }
      return nextValue;
    });
  };

  const renderConsumptionSwitcher = () => (
    <div className="unique-switcher-container">
      <div className="unique-switcher-text-col">
        <div
          className={`unique-switcher-text-top ${
            useAutoConsumption ? 'active' : ''
          }`}
        >
          {t('autoConsumptionOption')}
        </div>
        <div
          className={`unique-switcher-text-bottom ${
            !useAutoConsumption ? 'active' : ''
          }`}
        >
          {t('manualConsumptionOption')}
        </div>
      </div>
      <div className="unique-switcher-toggle-col">
        <label className="unique-switch">
          <input
            type="checkbox"
            className="unique-chk"
            checked={!useAutoConsumption}
            onChange={handleConsumptionModeToggle}
          />
          <span className="unique-slider" />
        </label>
      </div>
    </div>
  );

  const addStop = () => {
    setStopLocations((currentStops) => [...currentStops, createStop()]);
  };

  const updateStop = (id, location) => {
    setStopLocations((currentStops) =>
      currentStops.map((stop) =>
        stop.id === id ? { ...stop, location } : stop
      )
    );
  };

  const removeStop = (id) => {
    setStopLocations((currentStops) =>
      currentStops.filter((stop) => stop.id !== id)
    );
  };

  const handleDelete = () => {
    setStartLocation(null);
    setDestinationLocation(null);
    setAvoidHighways(false);
    setDirectionsResult(null);
    setRouteAlternatives([]);
    setSelectedRouteIndex(0);
    setDirections(null);
    setDistance(localeDefaults.distanceMeters);
    setTravelTime(null);
    setFuelConsumption(localeDefaults.fuelConsumption);
    setFuelPriceLocal(localeDefaults.fuelPrice);
    setFuelPriceEur(null);
    setFuelUnit(localeDefaults.fuelUnit);
    previousFuelUnitRef.current = localeDefaults.fuelUnit;
    setSelectedCurrency(localeDefaults.selectedCurrency);
    setStopLocations([]);
    setTolls('0');
    setUseAutoConsumption(false);
    setFuelType('gasoline');
    setSelectedYear('Without year');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedEngine('');
    setSelectedTransmission('');
    setSelectedFuelType('');
    setSelectedVehicleType('combustion');
    setRouteError('');
    setResetKey((currentKey) => currentKey + 1);
  };

  const getGoogleMapsNavigationUrl = () => {
    if (!startLocation || !destinationLocation) return '';
    const origin = `${startLocation.position.lat},${startLocation.position.lng}`;
    const destination = `${destinationLocation.position.lat},${destinationLocation.position.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  const markers = [];
  if (startLocation?.position) {
    markers.push({
      position: startLocation.position,
      label: 'A',
      type: 'start',
    });
  }
  stopLocations.forEach((stop, index) => {
    if (stop.location?.position) {
      markers.push({
        position: stop.location.position,
        label: `${index + 1}`,
        type: 'stop',
      });
    }
  });
  if (destinationLocation?.position) {
    markers.push({
      position: destinationLocation.position,
      label: 'B',
      type: 'destination',
    });
  }
  const shouldRenderMap = markers.length > 0 || directions || googleMapsLoadError;

  const resultPlaceholder = !distance
    ? t('resultNeedsDistance')
    : !fuelConsumption
      ? t('resultNeedsConsumption')
      : t('resultNeedsFuelPrice');
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'sk')
    .startsWith('sk')
    ? 'sk'
    : 'en';
  const seoTitle = t('seoTitle');
  const seoDescription = t('seoDescription');
  const rootUrl = getAbsoluteUrl('/');
  const appStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${rootUrl}#organization`,
      name: 'Fuely',
      url: rootUrl,
      logo: getAbsoluteUrl('/logo512.png'),
      contactPoint: [
        {
          '@type': 'ContactPoint',
          url: rootUrl,
          contactType: 'customer support',
          availableLanguage: ['sk', 'en'],
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${rootUrl}#web-application`,
      name: 'Fuely',
      url: rootUrl,
      applicationCategory: 'TravelApplication',
      operatingSystem: 'Web',
      inLanguage: ['sk', 'en'],
      isAccessibleForFree: true,
      description: seoDescription,
      publisher: {
        '@id': `${rootUrl}#organization`,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      featureList: [
        'Fuel cost calculator',
        'Electric vehicle trip cost calculator',
        'Google Maps route distance',
        'Multiple route stops',
        'Currency and unit conversion',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: currentLanguage === 'sk'
            ? 'Čo je palivová kalkulačka?'
            : 'What is a fuel cost calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: currentLanguage === 'sk'
              ? 'Palivová kalkulačka je nástroj na výpočet orientačných nákladov na cestu podľa trasy, spotreby vozidla a ceny paliva.'
              : 'A fuel cost calculator estimates trip expenses from your route, vehicle consumption, and fuel price.',
          },
        },
        {
          '@type': 'Question',
          name: currentLanguage === 'sk'
            ? 'Vie Fuely počítať aj s elektromobilom?'
            : 'Can Fuely calculate electric vehicle trip costs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: currentLanguage === 'sk'
              ? 'Áno. Fuely podporuje spaľovacie aj elektrické vozidlá, vrátane ceny elektriny a spotreby v kWh.'
              : 'Yes. Fuely supports combustion and electric vehicles, including electricity price and kWh consumption.',
          },
        },
        {
          '@type': 'Question',
          name: currentLanguage === 'sk'
            ? 'Podporuje Fuely zastávky na trase?'
            : 'Does Fuely support route stops?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: currentLanguage === 'sk'
              ? 'Áno. Medzi štart a cieľ môžete pridať viacero zastávok a aplikácia automaticky prepočíta vzdialenosť, čas jazdy a odhadované náklady.'
              : 'Yes. You can add multiple stops between the start and destination and Fuely automatically recalculates distance, travel time and estimated cost.',
          },
        },
        {
          '@type': 'Question',
          name: currentLanguage === 'sk'
            ? 'Ako Fuely používa vzdialenosť, spotrebu a cenu paliva?'
            : 'How does Fuely use distance, consumption and fuel price?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: currentLanguage === 'sk'
              ? 'Fuely spojí vzdialenosť trasy, spotrebu vozidla a cenu paliva alebo elektriny. Z týchto údajov vypočíta orientačné náklady na cestu od štartu po cieľ.'
              : 'Fuely combines route distance, vehicle consumption and fuel or electricity price to estimate trip costs from start to destination.',
          },
        },
        {
          '@type': 'Question',
          name: currentLanguage === 'sk'
            ? 'Podporuje Fuely EUR, USD a ďalšie meny?'
            : 'Does Fuely support EUR, USD and other currencies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: currentLanguage === 'sk'
              ? 'Áno. Fuely podporuje výpočet nákladov vo viacerých menách vrátane EUR a USD, takže sa hodí aj pri plánovaní zahraničnej trasy.'
              : 'Yes. Fuely supports trip cost estimates in multiple currencies including EUR and USD, which helps with international route planning.',
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Fuely',
          item: rootUrl,
        },
      ],
    },
  ];

  return (
    <Router>
      <div className={`App ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
        {shouldLoadGoogleMaps && GOOGLE_MAPS_API_KEY && (
          <GoogleMapsLoader
            apiKey={GOOGLE_MAPS_API_KEY}
            libraries={GOOGLE_MAPS_LIBRARIES}
            onStateChange={setGoogleMapsState}
          />
        )}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(appStructuredData)}
          </script>
          <html lang={currentLanguage} />
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
          <link rel="canonical" href={rootUrl} />
          <link rel="alternate" href="https://fuely.martinsulak.dev/?lng=sk" hrefLang="sk" />
          <link rel="alternate" href="https://fuely.martinsulak.dev/?lng=en" hrefLang="en" />
          <link rel="alternate" href={rootUrl} hrefLang="x-default" />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:url" content={rootUrl} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Fuely" />
          <meta property="og:locale" content={currentLanguage === 'sk' ? 'sk_SK' : 'en_US'} />
          <meta property="og:image" content={getAbsoluteUrl('/logo512.png')} />
          <meta property="og:image:alt" content="Fuely fuel cost calculator logo" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={getAbsoluteUrl('/logo512.png')} />
          <meta name="twitter:image:alt" content="Fuely fuel cost calculator logo" />
        </Helmet>

        <CookieBanner onConsentChange={setHasAnalyticsConsent} />
        <TrackingScripts enabled={hasAnalyticsConsent} />
        <h1 className="headingMain">{t('welcome')}</h1>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="switcher-container">
                  <LanguageSwitcher />
                  <FuelUnitSwitcher
                    fuelUnit={fuelUnit}
                    setFuelUnit={setFuelUnit}
                    selectedVehicleType={selectedVehicleType}
                  />
                </div>

                <div className="switch-wrapper">
                  <ThemeToggle
                    theme={theme}
                    onToggle={() =>
                      setTheme((currentTheme) =>
                        currentTheme === 'light' ? 'dark' : 'light'
                      )
                    }
                  />
                </div>

                <div className="section locationSearchSection startLocationSection">
                  <SearchBar
                    defaultValue={startLocation?.address || ''}
                    onLocationSelect={setStartLocation}
                    onActivate={requestGoogleMapsLoad}
                    placeholder={t('start')}
                    isGoogleLoaded={isGoogleLoaded}
                    loadError={googleMapsLoadError}
                  />
                </div>

                <div className="stopAddRow">
                  <button
                    type="button"
                    className="addStopButton"
                    onClick={addStop}
                    aria-label={t('addStop')}
                    title={t('addStop')}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>

                {stopLocations.map((stop, index) => (
                  <div
                    className={`section locationSearchSection stopLocationSection stopLayer-${Math.min(index, 9)}`}
                    key={stop.id}
                  >
                    <div className="stopRemoveRow">
                      <button
                        type="button"
                        className="removeStopButton"
                        onClick={() => removeStop(stop.id)}
                        aria-label={`${t('removeStop')} ${index + 1}`}
                      >
                        {t('removeStop')}
                      </button>
                    </div>
                    <SearchBar
                      defaultValue={stop.location?.address || ''}
                      onLocationSelect={(location) =>
                        updateStop(stop.id, location)
                      }
                      onActivate={requestGoogleMapsLoad}
                      placeholder={`${t('stop')} ${index + 1}`}
                      isGoogleLoaded={isGoogleLoaded}
                      loadError={googleMapsLoadError}
                    />
                  </div>
                ))}

                <div className="section locationSearchSection destinationLocationSection">
                  <SearchBar
                    defaultValue={destinationLocation?.address || ''}
                    onLocationSelect={setDestinationLocation}
                    onActivate={requestGoogleMapsLoad}
                    placeholder={t('destination')}
                    isGoogleLoaded={isGoogleLoaded}
                    loadError={googleMapsLoadError}
                  />
                </div>

                <div className="form-row">
                  <CustomCheckbox
                    checked={avoidHighways}
                    onChange={(event) =>
                      setAvoidHighways(event.target.checked)
                    }
                  />
                </div>

                {renderConsumptionSwitcher()}

                {!useAutoConsumption && (
                  <VehicleTypeSwitcher
                    vehicleType={selectedVehicleType}
                    setVehicleType={setSelectedVehicleType}
                  />
                )}

                {useAutoConsumption && (
                  <Suspense fallback={null}>
                    <CarSelector
                      selectedVehicleType={selectedVehicleType}
                      setSelectedVehicleType={setSelectedVehicleType}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                      selectedBrand={selectedBrand}
                      setSelectedBrand={setSelectedBrand}
                      selectedModel={selectedModel}
                      setSelectedModel={setSelectedModel}
                      selectedEngine={selectedEngine}
                      setSelectedEngine={setSelectedEngine}
                      selectedTransmission={selectedTransmission}
                      setSelectedTransmission={setSelectedTransmission}
                      selectedFuelType={selectedFuelType}
                      setSelectedFuelType={setSelectedFuelType}
                      onConsumptionChange={handleConsumptionChange}
                      fuelUnit={fuelUnit}
                    />
                  </Suspense>
                )}

                <div className="section fuelSection">
                  <label
                    htmlFor="distance-input"
                    className="labelFuelConsumption"
                  >
                    {t('distance')} ({fuelUnit === 'imperial' ? 'mi' : 'km'})
                  </label>
                  <input
                    id="distance-input"
                    type="text"
                    inputMode="decimal"
                    className="inputFuelConsumption"
                    value={distanceInputValue}
                    onChange={(event) =>
                      handleDistanceChange(event.target.value)
                    }
                  />
                  <small className="inputHint">{t('distanceHint')}</small>

                  <label
                    htmlFor="consumption-input"
                    className="labelFuelConsumption"
                  >
                    {consumptionLabel}
                  </label>
                  <input
                    id="consumption-input"
                    type="text"
                    inputMode="decimal"
                    className="inputFuelConsumption"
                    value={fuelConsumption}
                    readOnly={useAutoConsumption}
                    onChange={(event) =>
                      handleFuelConsumptionChange(event.target.value)
                    }
                  />

                  <label
                    htmlFor="fuel-price-input"
                    className="labelFuelPrice"
                  >
                    {selectedVehicleType === 'electric'
                      ? `${t('electricityPrice')} (${currencyCode}/kWh)`
                      : `${t('fuelPrice')} (${currencyCode}/${
                          fuelUnit === 'imperial' ? 'gal' : 'L'
                        })`}
                  </label>
                  <FuelPriceInput
                    id="fuel-price-input"
                    value={fuelPriceLocal}
                    onChange={handleFuelPriceChange}
                    onPresetSelect={handlePresetFuelPriceChange}
                    selectedVehicleType={selectedVehicleType}
                    useAutoConsumption={useAutoConsumption}
                  />
                </div>

                {selectedVehicleType === 'combustion' && (
                  <FuelTypeRadioGroup
                    fuelType={fuelType}
                    onChange={setFuelType}
                  />
                )}

                <div className="section">
                  <CurrencySwitcher
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={handleCurrencyChange}
                  />
                </div>

                <details className="section advancedSection">
                  <summary>{t('advancedOptions')}</summary>

                  <div className="tollsControl">
                    <label htmlFor="tolls-input">
                      {t('tolls')} ({currencyCode})
                    </label>
                    <input
                      id="tolls-input"
                      type="text"
                      inputMode="decimal"
                      className="inputFuelConsumption"
                      value={tolls}
                      onChange={(event) =>
                        setTolls(sanitizeNumericInput(event.target.value))
                      }
                    />
                  </div>
                </details>

                <section
                  className="section resultsSection liveResults"
                  aria-live="polite"
                >
                  <div className="resultHeader">
                    <div>
                      <span className="resultEyebrow">
                        {t('liveEstimate')}
                      </span>
                      <h2>{t('estimatedRange')}</h2>
                    </div>
                    {loading && (
                      <span className="routeStatus">{t('updatingRoute')}</span>
                    )}
                  </div>

                  {calculation ? (
                    <>
                      <p className="estimatedRangeValue">
                        {formatCurrency(calculation.estimatedMin)}
                        <span aria-hidden="true"> - </span>
                        {formatCurrency(calculation.estimatedMax)}
                      </p>
                      <div className="exactCalculation">
                        <span>{t('exactCalculation')}</span>
                        <strong>
                          {formatCurrency(calculation.exactCost)}
                        </strong>
                      </div>
                      <p className="calculationMeta">
                        {t('distance')}: {formatNumber(calculation.distance)}{' '}
                        {calculation.distanceUnit}
                        {' | '}
                        {t('fuelUsed')}: {formatNumber(calculation.energyUsed)}{' '}
                        {calculation.energyUnit}
                        {travelTime ? ` | ${t('travelTime')}: ${travelTime}` : ''}
                        {emissions !== null
                          ? ` | ${t('emissions')}: ${formatNumber(emissions)} kg`
                          : ''}
                      </p>
                      <div className="calculationBreakdown">
                        <span>{t('basedOn')}</span>
                        <code>{calculationBreakdown}</code>
                      </div>
                      <p className="resultNote">{t('actualCostNote')}</p>
                    </>
                  ) : (
                    <div className="resultPlaceholder">
                      <strong>{t('resultWaitingTitle')}</strong>
                      <span>{resultPlaceholder}</span>
                    </div>
                  )}

                  {routeError && (
                    <p className="routeError" role="alert">
                      {routeError}
                    </p>
                  )}
                </section>

                <div
                  className="section buttonsSection resultActions"
                >
                  <div className="deleteAction">
                    <DeleteButton onClick={handleDelete} />
                  </div>
                  <ShareButton theme={theme} />
                </div>

                {routeAlternatives.length > 1 && (
                  <div className="section">
                    <h3 className="headingRoutes">{t('selectRoute')}</h3>
                    <div className="routeButtonsWrapper">
                      {routeAlternatives.map((route, index) => (
                        <button
                          key={`${route.summary}-${index}`}
                          onClick={() => selectRouteAlternative(index)}
                          className={`routeButton ${
                            index === selectedRouteIndex ? 'activeRoute' : ''
                          }`}
                        >
                          {`${t('route')} ${index + 1} (${formatNumber(
                            fuelUnit === 'imperial'
                              ? getRouteSummary(route).distanceMeters /
                                  METERS_PER_MILE
                              : getRouteSummary(route).distanceMeters / 1000
                          )} ${fuelUnit === 'imperial' ? 'mi' : 'km'})`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {startLocation && destinationLocation && (
                  <div className="section navigationSection">
                    <button
                      onClick={() =>
                        window.open(getGoogleMapsNavigationUrl(), '_blank')
                      }
                      className="navigationButton"
                    >
                      <span>{t('openNavigation')}</span>
                    </button>
                  </div>
                )}

                {shouldRenderMap ? (
                  <Suspense fallback={null}>
                    <MapView
                      directions={directions}
                      markers={markers}
                      resetKey={resetKey}
                      theme={theme}
                      isGoogleLoaded={isGoogleLoaded}
                      loadError={googleMapsLoadError}
                    />
                  </Suspense>
                ) : (
                  <section className="section mapPreview">
                    <h2>{t('mapPreviewTitle')}</h2>
                    <p>{t('mapPreviewText')}</p>
                  </section>
                )}

                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>

                <div className="seo-section">
                  <h2>{t('detailTitle')}</h2>
                  <p>{t('detailParagraph1')}</p>
                  <p>{t('detailParagraph2')}</p>
                  <p>{t('detailParagraph3')}</p>
                  <p>{t('detailParagraph4')}</p>
                  <p>{t('detailParagraph5')}</p>
                  <p>{t('detailParagraph6')}</p>
                </div>

                <div className="seo-section trip-planning-section">
                  <h2>{t('planningTitle')}</h2>
                  <h3>{t('planningHeadingDistance')}</h3>
                  <p>{t('planningDistanceText')}</p>
                  <h3>{t('planningHeadingFuelPrice')}</h3>
                  <p>{t('planningFuelPriceText')}</p>
                  <h3>{t('planningHeadingCurrencies')}</h3>
                  <p>{t('planningCurrenciesText')}</p>
                </div>

                <div className="faq-section">
                  <h2>{t('faqTitle')}</h2>
                  <h3>{t('faqQ1')}</h3>
                  <p>{t('faqA1')}</p>
                  <h3>{t('faqQ2')}</h3>
                  <p>{t('faqA2')}</p>
                  <h3>{t('faqQ3')}</h3>
                  <p>{t('faqA3')}</p>
                  <h3>{t('faqQ4')}</h3>
                  <p>{t('faqA4')}</p>
                  <h3>{t('faqQ5')}</h3>
                  <p>{t('faqA5')}</p>
                  <h3>{t('faqQ6')}</h3>
                  <p>{t('faqA6')}</p>
                  <h3>{t('faqQ7')}</h3>
                  <p>{t('faqA7')}</p>
                  <h3>{t('faqQ8')}</h3>
                  <p>{t('faqA8')}</p>
                  <Link to="/palivova-kalkulacka">
                    {t('moreAboutCalculator')}
                  </Link>
                </div>

                <PolicyLinks />
                {hasAnalyticsConsent && <SpeedInsights />}
              </>
            }
          />

          <Route path="/cookie-policy" element={<Suspense fallback={null}><CookiePolicy /></Suspense>} />
          <Route path="/terms-of-use" element={<Suspense fallback={null}><TermsOfUse /></Suspense>} />
          <Route path="/privacy-policy" element={<Suspense fallback={null}><PrivacyPolicy /></Suspense>} />
          <Route path="/palivova-kalkulacka" element={<Suspense fallback={null}><PalivovaKalkulacka /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Analytics />
        {hasAnalyticsConsent && (
          <Suspense fallback={null}>
            <RatingPopup />
          </Suspense>
        )}
      </div>
    </Router>
  );
}

export default App;
