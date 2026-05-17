// src/App.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useJsApiLoader } from '@react-google-maps/api';

import FuelPriceInput from './components/FuelPriceInput';
import PalivovaKalkulacka from './PalivovaKalkulacka';
import i18n from './i18n';
import useLocalStorage from './components/useLocalStorage';
import CookieBanner from './components/CookieBanner';
import RatingPopup from './components/RatingPopup';
import TrackingScripts from './components/TrackingScripts';
import ThemeToggle from './components/ThemeToggle';
import CookiePolicy from './CookiePolicy';
import TermsOfUse from './TermsOfUse';
import PrivacyPolicy from './PrivacyPolicy';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  hasCookieConsent as readCookieConsent,
} from './components/cookieConsent';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/react';

import LanguageSwitcher from './components/LanguageSwitcher';
import FuelUnitSwitcher from './components/FuelUnitSwitcher';
import SearchBar from './components/SearchBar';
import MapView from './components/MapView';
import CustomCheckbox from './components/CustomCheckbox';
import CarSelector from './CarSelector';
import CurrencySwitcher from './components/CurrencySwitcher';
import ContactForm from './components/ContactForm';
import PolicyLinks from './PolicyLinks';
import DeleteButton from './components/DeleteButton';
import FuelTypeRadioGroup from "./components/FuelTypeRadioGroup";
import VehicleTypeSwitcher from './components/VehicleTypeSwitcher';
import ShareButton from './components/ShareButton';

import './App.css';

const GOOGLE_MAPS_LIBRARIES = ['places'];
const GOOGLE_MAPS_API_KEY =
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyByASDfSznBhQU1vZ-2yVhfTUI5gtCPotA';



// Fallback 404
function NotFound() {
  return (
    <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>
      404 – Page Not Found
    </h2>
  );
}

function App() {

  

  const { t } = useTranslation();
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  // Nové stavy pre emisie:
  const [fuelType, setFuelType] = useState('gasoline'); // alebo 'diesel'
  const [emissionsFactor, setEmissionsFactor] = useState(2.31); // default pre benzín
  const [emissions, setEmissions] = useState(null);
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(() => readCookieConsent());

  const {
    isLoaded: isGoogleLoaded,
    loadError: googleMapsLoadError,
  } = useJsApiLoader({
    id: 'fuely-google-maps-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  

  // Detekcia jazyka podľa domény
  useEffect(() => {
    i18n.changeLanguage('en');
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

  // Prepínač témy
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Uplatnenie témy na body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // useLocalStorage stavy (spotreba, destinácia, atď.)
  

  
  // Stavy pre auto/manual + spotrebu
  const [useAutoConsumption, setUseAutoConsumption] = useLocalStorage('useAutoConsumption', true);
  const [fuelConsumption, setFuelConsumption] = useLocalStorage('fuelConsumption', '');


  

  const [selectedYear, setSelectedYear] = useLocalStorage('csYear', 'Without year');
  const [selectedBrand, setSelectedBrand] = useLocalStorage('csBrand', '');
  const [selectedModel, setSelectedModel] = useLocalStorage('csModel', '');
  const [selectedEngine, setSelectedEngine] = useLocalStorage('csEngine', '');

  const [selectedVehicleType, setSelectedVehicleType] = useLocalStorage('csVehicleType', 'combustion'); // 'combustion' alebo 'electric'

  

  const [startLocation, setStartLocation] = useLocalStorage('startLocation', null);
  const [destinationLocation, setDestinationLocation] = useLocalStorage('destinationLocation', null);
  const [avoidHighways, setAvoidHighways] = useLocalStorage('avoidHighways', false);

  const [directionsResult, setDirectionsResult] = useState(null);
  const [routeAlternatives, setRouteAlternatives] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [directions, setDirections] = useState(null);

  const [distance, setDistance] = useLocalStorage('distance', null);
  const [travelTime, setTravelTime] = useLocalStorage('travelTime', null);


  
  const [selectedTransmission, setSelectedTransmission] = useLocalStorage('csTransmission', '');
  const [selectedFuelType, setSelectedFuelType] = useLocalStorage('csFuelType', '');
  
  

  
  const [fuelPriceLocal, setFuelPriceLocal] = useLocalStorage('fuelPriceLocal', '');
  const [fuelUnit, setFuelUnit] = useLocalStorage('fuelUnit', 'metric');
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage('selectedCurrency', 'eur');

  const [fuelPriceEur, setFuelPriceEur] = useState(null);
  const [fuelUsed, setFuelUsed] = useLocalStorage('fuelUsed', null);
  const [fuelCostEur, setFuelCostEur] = useLocalStorage('fuelCostEur', null);

  const [exchangeRates, setExchangeRates] = useState({});
  const [resetKey, setResetKey] = useState(0);

  // Fetch kurzov
  const fetchExchangeRates = (date = 'latest', base = 'eur', apiVersion = 'v1') => {
    const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/${apiVersion}/currencies/${base}.json`;
    const fallbackDomain = date === 'latest' ? 'latest' : date;
    const fallbackUrl = `https://${fallbackDomain}.currency-api.pages.dev/${apiVersion}/currencies/${base}.json`;

    return fetch(primaryUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Primárne API zlyhalo: ${response.status}`);
        }
        return response.json();
      })
      .catch((err) => {
        console.error('Primárne API zlyhalo, skúšam fallback:', err);
        return fetch(fallbackUrl).then((response) => {
          if (!response.ok) {
            throw new Error(`Fallback API zlyhalo: ${response.status}`);
          }
          return response.json();
        });
      });
  };

  useEffect(() => {
    fetchExchangeRates('latest', 'eur', 'v1')
      .then((data) => {
        if (data && data.eur) {
          setExchangeRates(data.eur);
        }
      })
      .catch((error) => {
        console.error('Obe volania API zlyhali:', error);
      });
  }, []);

  // Funkcie na update spotreby a ceny
  const handleFuelConsumptionChange = (value) => {
    const sanitized = value.replace(',', '.');
    setFuelConsumption(sanitized);
  };

  const handleFuelPriceChange = (value) => {
    const sanitized = value.replace(',', '.').trim();
    setFuelPriceLocal(sanitized);

    const val = parseFloat(sanitized);
    if (!isNaN(val) && exchangeRates[selectedCurrency]) {
      setFuelPriceEur(val / exchangeRates[selectedCurrency]);
    } else {
      setFuelPriceEur(null);
    }
  };

  useEffect(() => {
    if (fuelPriceEur !== null && exchangeRates[selectedCurrency]) {
      const localPriceVal = fuelPriceEur * exchangeRates[selectedCurrency];
      const localPriceRounded = parseFloat(localPriceVal.toFixed(3));
      setFuelPriceLocal(localPriceRounded.toString());
    }
    // eslint-disable-next-line
  }, [selectedCurrency, exchangeRates, fuelPriceEur]);

  // Výpočet nákladov

  const handleFuelTypeChange = (value) => {
    setFuelType(value);
    if (value === 'gasoline') {
      setEmissionsFactor(2.338); // ~ kg CO₂/l pre benzín
    } else if (value === 'diesel') {
      setEmissionsFactor(2.684); // ~ kg CO₂/l pre naftu
    }
  };

  // Keď sa zmení množstvo spotrebovaného paliva (fuelUsed) alebo faktor, prepočítame emisie
  useEffect(() => {
    if (fuelUsed !== null && selectedVehicleType === 'combustion') { // ← Pridaná podmienka
      let liters;
      if (fuelUnit === 'imperial') {
        liters = fuelUsed * 3.785411784;
      } else {
        liters = fuelUsed;
      }
      const totalEmissions = liters * emissionsFactor;
      setEmissions(totalEmissions);
    } else {
      setEmissions(null); // Reset pre elektrické autá
    }
  }, [fuelUsed, fuelUnit, selectedVehicleType, emissionsFactor]); // ← Pridaná závislosť

  const calculateFuelCostEur = useCallback(
    (dist) => {
      if (!fuelConsumption || !fuelPriceEur) {
        setFuelCostEur(null);
        setFuelUsed(null);
        return;
      }
  
      const distanceKm = dist / 1000;
      const consumptionVal = parseFloat(fuelConsumption.trim());
  
      if (isNaN(consumptionVal) || consumptionVal <= 0) {
        setFuelCostEur(null);
        setFuelUsed(null);
        return;
      }
  
      if (selectedVehicleType === 'electric') {
        const consumptionKWh = (distanceKm * consumptionVal) / 1000;
        setFuelUsed(consumptionKWh);
        setFuelCostEur(consumptionKWh * fuelPriceEur);
      } else {
        if (fuelUnit === 'imperial') {
          const consumptionLper100km = 235.214583 / consumptionVal;
          const consumptionLiters = (distanceKm / 100) * consumptionLper100km;
          const usedGal = consumptionLiters / 3.785411784;
          setFuelUsed(usedGal);
          setFuelCostEur(consumptionLiters * fuelPriceEur);
        } else {
          const consumptionLiters = (distanceKm / 100) * consumptionVal;
          setFuelUsed(consumptionLiters);
          setFuelCostEur(consumptionLiters * fuelPriceEur);
        }
      }
    },
    [fuelConsumption, fuelPriceEur, fuelUnit, selectedVehicleType, setFuelCostEur, setFuelUsed] // Pridané závislosti
  );

  useEffect(() => {
    if (distance !== null) {
      calculateFuelCostEur(distance);
    }
  }, [distance, fuelPriceEur, fuelConsumption, fuelUnit, calculateFuelCostEur]);

  // Directions
  const setSelectedDirections = useCallback((result, index) => {
    const selected = { ...result, routes: [result.routes[index]] };
    setDirections(selected);
  }, []);

  const calculateEverything = () => {
    if (googleMapsLoadError) {
      alert('Google Maps sa nepodarilo načítať.');
      return;
    }
    if (!isGoogleLoaded || !window.google || !window.google.maps) {
      alert('Google Maps nie je načítané.');
      return;
    }
    if (!startLocation || !destinationLocation) {
      alert(t('Vyberte prosím obe miesta (Štart a Cieľ).'));
      return;
    }
    if (!fuelConsumption) {
      alert('Zadajte spotrebu paliva.');
      return;
    }
    if (!fuelPriceLocal) {
      alert('Zadajte cenu paliva.');
      return;
    }

    setLoading(true);

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation.position,
        destination: destinationLocation.position,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        avoidHighways: avoidHighways,
      },
      (result, status) => {
        setLoading(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResult(result);
          setRouteAlternatives(result.routes);
          setSelectedRouteIndex(0);
          setSelectedDirections(result, 0);

          const dist = result.routes[0].legs[0].distance.value;
          setDistance(dist);

          const durText = result.routes[0].legs[0].duration.text;
          setTravelTime(durText);

          calculateFuelCostEur(dist);
        } else {
          console.error('Chyba pri získavaní trasy', result);
          alert(t('Nastala chyba pri výpočte trasy.'));
        }
      }
    );
  };

  const selectRouteAlternative = (index) => {
    if (directionsResult && routeAlternatives.length > index) {
      setSelectedRouteIndex(index);
      setSelectedDirections(directionsResult, index);

      const dist = directionsResult.routes[index].legs[0].distance.value;
      setDistance(dist);

      const durText = directionsResult.routes[index].legs[0].duration.text;
      setTravelTime(durText);

      calculateFuelCostEur(dist);
    }
  };

  // Prepínač auto/manual
  const renderConsumptionSwitcher = () => (
    <div className="unique-switcher-container">
      <div className="unique-switcher-text-col">
        <div className={`unique-switcher-text-top ${useAutoConsumption ? 'active' : ''}`}>
          {t('autoConsumptionOption')}
        </div>
        <div className={`unique-switcher-text-bottom ${!useAutoConsumption ? 'active' : ''}`}>
          {t('manualConsumptionOption')}
        </div>
      </div>
      <div className="unique-switcher-toggle-col">
        <label className="unique-switch">
          <input
            type="checkbox"
            className="unique-chk"
            checked={!useAutoConsumption}
            onChange={() => setUseAutoConsumption(prev => !prev)}
          />
          <span className="unique-slider"></span>
        </label>
      </div>
    </div>
  );
  
  
  const handleConsumptionChange = (value) => {
    if (useAutoConsumption) {
      // Len ak je zapnutý "auto" režim, prepíšeme
      setFuelConsumption(value);
    }
  };

  let consumptionLabel;
if (selectedVehicleType === 'electric') {
  consumptionLabel = (fuelUnit === 'imperial')
    ? t('efficiencyImperial')   // "Efficiency (kWh/100mi):"
    : t('efficiencyMetric');    // "Efficiency (kWh/100km):"
} else {
  consumptionLabel = (fuelUnit === 'imperial')
    ? t('fuelConsumptionImperial') // "Fuel consumption (MPG):"
    : t('fuelConsumptionMetric');  // "Fuel consumption (l/100km):"
}

const prevFuelUnit = useRef(fuelUnit);

useEffect(() => {
  if (useAutoConsumption) {
    // v auto režime prepočet robí CarSelector
    prevFuelUnit.current = fuelUnit;
    return;
  }

  const val = parseFloat(fuelConsumption);
  if (isNaN(val) || val <= 0) {
    prevFuelUnit.current = fuelUnit;
    return;
  }

  if (fuelUnit !== prevFuelUnit.current) {
    if (selectedVehicleType === 'combustion') {
      // z l/100km => MPG alebo naopak
      if (prevFuelUnit.current === 'metric' && fuelUnit === 'imperial') {
        const mpg = 235.214583 / val;
        setFuelConsumption(mpg.toFixed(2));
      } else if (prevFuelUnit.current === 'imperial' && fuelUnit === 'metric') {
        const lPer100 = 235.214583 / val;
        setFuelConsumption(lPer100.toFixed(2));
      }
    } else if (selectedVehicleType === 'electric') {
      // kWh/100km => kWh/100mi alebo naopak
      if (prevFuelUnit.current === 'metric' && fuelUnit === 'imperial') {
        const kwhPer100mi = val / 1.609344;
        setFuelConsumption(kwhPer100mi.toFixed(2));
      } else if (prevFuelUnit.current === 'imperial' && fuelUnit === 'metric') {
        const kwhPer100km = val * 1.609344;
        setFuelConsumption(kwhPer100km.toFixed(2));
      }
    }
    prevFuelUnit.current = fuelUnit;
  }
}, [
  fuelUnit, 
  fuelConsumption, 
  selectedVehicleType, 
  useAutoConsumption,
  setFuelConsumption
]);

  // Reset všetkého
  const handleDelete = () => {
    setStartLocation(null);
    setDestinationLocation(null);
    setAvoidHighways(false);
    setDirectionsResult(null);
    setRouteAlternatives([]);
    setSelectedRouteIndex(0);
    setDirections(null);
    setDistance(null);
    setTravelTime(null);
    setFuelUsed(null);
    setFuelCostEur(null);

    setFuelConsumption('');
    setFuelPriceLocal('');
    setFuelPriceEur(null);
    setFuelUsed(null);

    setFuelUnit('metric');
    setSelectedCurrency('eur');
    setResetKey((prev) => prev + 1);
    setFuelType('gasoline')
    setEmissions(null)
    setSelectedYear('');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedEngine('');
  };

  // Google Maps Navigation Link
  const getGoogleMapsNavigationUrl = () => {
    if (!startLocation || !destinationLocation) return '';
    const origin = `${startLocation.position.lat},${startLocation.position.lng}`;
    const destination = `${destinationLocation.position.lat},${destinationLocation.position.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  // FuelCost => displayed
  let displayedFuelCost = null;
  if (fuelCostEur !== null && exchangeRates[selectedCurrency]) {
    displayedFuelCost = (fuelCostEur * exchangeRates[selectedCurrency]).toFixed(2);
  }

  // Markery
  const markers = [];
  if (!directions && startLocation?.position) {
    markers.push({ position: startLocation.position, label: 'A' });
  }
  if (!directions && destinationLocation?.position) {
    markers.push({ position: destinationLocation.position, label: 'B' });
  }

  useEffect(() => {
    if (useAutoConsumption) {
      setFuelConsumption('');
    }
    // V prípade manuálneho režimu (useAutoConsumption === false)
    // ponecháme hodnotu nezmenenú.
  }, [useAutoConsumption, setFuelConsumption]);

  return (
    <Router>
      <div className={`App ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Čo je palivová kalkulačka?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Palivová kalkulačka je nástroj pre výpočet nákladov na cestu."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Ako presný je váš fuel cost calculator?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Presnosť závisí od presnosti zadanej spotreby, cien paliva a dopravnej situácie."
                  }
                }
              ]
            })}
          </script>
          <html lang={i18n.language} />
          <title>{t('seoTitle')}</title>
          <meta name="description" content={t('seoDescription')} />
          <link rel="alternate" href="https://martinsulak.dev/fuely/sk" hreflang="sk" />
          <link rel="alternate" href="https://martinsulak.dev/fuely/en" hreflang="en" />
          <link rel="alternate" href="https://martinsulak.dev/fuely/de" hreflang="de" />
        </Helmet>


        <CookieBanner onConsentChange={setHasAnalyticsConsent} />
        <TrackingScripts enabled={hasAnalyticsConsent} />

        <h1 className="headingMain">{t('welcome')}</h1>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Switchery jazyk / fuelUnit */}
                <div className="switcher-container">
                  <LanguageSwitcher />
                  <FuelUnitSwitcher 
  fuelUnit={fuelUnit}
  setFuelUnit={setFuelUnit}
  selectedVehicleType={selectedVehicleType} // ← Pridaná prop
/>
                </div>

                {/* Tlačidlo na prepínanie témy */}
                <div className="switch-wrapper">
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>

                {/* Štart */}
                <div className="section">
                  
                  <SearchBar
                    defaultValue={startLocation?.address || ''}
                    onLocationSelect={setStartLocation}
                    placeholder={t('start')}
                    isGoogleLoaded={isGoogleLoaded}
                    
                  />
                </div>

                {/* Cieľ */}
                <div className="section">
                  
                  <SearchBar
                    defaultValue={destinationLocation?.address || ''}
                    onLocationSelect={setDestinationLocation}
                    placeholder={t('destination')}
                    isGoogleLoaded={isGoogleLoaded}
                  />
                </div>

                

                {/* Vyhnúť sa diaľniciam */}
                <div className="form-row">
                  <CustomCheckbox
                    checked={avoidHighways}
                    onChange={(e) => setAvoidHighways(e.target.checked)}
                  />
                </div>

                {/* Auto/manual spotreba */}
                {renderConsumptionSwitcher()}
                  {!useAutoConsumption && (
                    <VehicleTypeSwitcher
                      vehicleType={selectedVehicleType}
                      setVehicleType={setSelectedVehicleType}
                    />
                  )}
                

                {/* CarSelector ako child komponent */}
      {useAutoConsumption && (
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
      )}

                {/* Spotreba, cena paliva */}
                <div className="section fuelSection">
  {/* Tu použijete premenné consumptionLabel, consumptionPlaceholder */}
  <label className="labelFuelConsumption">{consumptionLabel}</label>
<input
  type="text"
  className="inputFuelConsumption"
  value={fuelConsumption}
  // readOnly len vtedy, keď je auto režim
  readOnly={useAutoConsumption}
  onChange={(e) => handleFuelConsumptionChange(e.target.value)}
/>

<label className="labelFuelPrice">
  {selectedVehicleType === 'electric'
    ? `${t('electricityPrice')} (${selectedCurrency.toUpperCase()}/kWh):`
    : `${t('fuelPrice')} (${selectedCurrency.toUpperCase()}/${
        fuelUnit === 'imperial' ? 'gal' : 'l'
      }):`
  }
</label>
  
<FuelPriceInput
  value={fuelPriceLocal}
  onChange={(newVal) => handleFuelPriceChange(newVal)}
  selectedVehicleType={selectedVehicleType}
  useAutoConsumption={useAutoConsumption}
/>
</div>
    

                
{selectedVehicleType === 'combustion' && (
  <FuelTypeRadioGroup
    fuelType={fuelType}
    onChange={handleFuelTypeChange}
  />
)}

                {/* Mena */}
                <div className="section">
                  <CurrencySwitcher
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={setSelectedCurrency}
                  />
                </div>

                

                {/* Tlačidlá Calculate / Reset */}
                <div
  className="section buttonsSection"
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  }}
>
  {/* Vľavo: Calculate + Delete */}
  <div style={{ display: 'flex', gap: '60px' }}>
    <button onClick={calculateEverything} className="buttonCalculate">
      {loading ? t('calculating') || 'Calculating...' : t('calculate')}
    </button>
    <DeleteButton onClick={handleDelete} />
  </div>

  {/* Vpravo: Share */}
  <ShareButton theme={theme} />
</div>


                {/* Výsledky */}
                {(distance !== null ||
                  fuelUsed !== null ||
                  fuelCostEur !== null ||
                  travelTime !== null ||
                  emissions !== null) && (
                  <div className="section resultsSection">
                    {distance && (
                      <p className="distanceResult">
                        {t('distance')}:{' '}
                        {fuelUnit === 'imperial'
                          ? ((distance / 1000) * 0.621371).toFixed(2)
                          : (distance / 1000).toFixed(2)}{' '}
                        {fuelUnit === 'imperial' ? 'mi' : 'km'}
                      </p>
                    )}
                    {fuelUsed !== null && (
  <p className="fuelUsedResult">
    {t('fuelUsed')}: {fuelUsed.toFixed(2)}{' '}
    {selectedVehicleType === 'electric' 
      ? 'kWh'
      : (fuelUnit === 'imperial' ? 'gal' : 'l')}
  </p>
)}
                    {travelTime && (
                      <p className="travelTimeResult">
                        {t('travelTime')}: {travelTime}
                      </p>
                    )}
                    {fuelCostEur !== null && displayedFuelCost && (
                      <p className="fuelCostResult" style={{ color: 'green' }}>
                        {t('fuelCost')}: {displayedFuelCost}{' '}
                        {selectedCurrency.toUpperCase()}
                      </p>
                    )}
                    {/* Sem pridáme emisie */}
                    {emissions !== null && (
                      <p className="emissionsResult" style={{ color: 'darkred' }}>
                      {t('emissions')}: {emissions.toFixed(2)} kg
                    </p>
                  )}
                  </div>
                )}

                {/* Alternatívne trasy */}
                {routeAlternatives.length > 1 && (
                  <div className="section">
                  <h3 className="headingRoutes">{t('selectRoute')}</h3>
                  <div className="routeButtonsWrapper">
                    {routeAlternatives.map((route, index) => (
                      <button
                        key={index}
                        onClick={() => selectRouteAlternative(index)}
                        className={`routeButton ${index === selectedRouteIndex ? 'activeRoute' : ''}`}
                      >
                        {`Route ${index + 1} (${route.legs[0].distance.text})`}
                      </button>
                    ))}
                  </div>
                </div>
                )}

{startLocation && destinationLocation && (
  <div className="section navigationSection">
    <button
      onClick={() => window.open(getGoogleMapsNavigationUrl(), '_blank')}
      className="navigationButton"
    >
      <div className="loader"></div>
      <span>{t('openNavigation')}</span>
    </button>
  </div>
)}


                {/* Mapa */}
                <MapView
                  directions={directions}
                  markers={markers}
                  resetKey={resetKey}
                  theme={theme}
                  isGoogleLoaded={isGoogleLoaded}
                  loadError={googleMapsLoadError}
                />
              

                {/* Kontakt, policy, speed insights */}
                <ContactForm />

                

                {/* SEO sekcia - texty z i18n */}
                <div className="seo-section">
                  <h2>{t('detailTitle')}</h2>
                  <p>{t('detailParagraph1')}</p>
                  <p>{t('detailParagraph2')}</p>
                  <p>{t('detailParagraph3')}</p>
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

                  {/* Prípadne link na detailnú stránku / PalivovaKalkulacka */}
                  <Link to="/palivova-kalkulacka">
                    {t('Viac o palivovej kalkulačke') /* ak taký kľúč vytvoríš */}
                  </Link>
                </div>

                <PolicyLinks />
                {hasAnalyticsConsent && <SpeedInsights />}
              </>
            }
          />

          {/* Ďalšie cesty */}
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Samostatná podstránka */}
          <Route path="/palivova-kalkulacka" element={<PalivovaKalkulacka />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        

        

        {hasAnalyticsConsent && <Analytics />}
        {hasAnalyticsConsent && <RatingPopup />}
      </div>
      
    </Router>
  );
}

export default App;
