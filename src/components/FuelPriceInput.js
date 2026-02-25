import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './FuelPriceInput.css';

function FuelPriceInput({ 
  value, 
  onChange, 
  selectedVehicleType, 
  useAutoConsumption 
}) {
  const { t } = useTranslation();
  
  const showIcon = (selectedVehicleType === 'combustion') || (!useAutoConsumption);

  // Ovládanie popupu
  const [showPopup, setShowPopup] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);

  // Typ paliva: "gasoline" alebo "diesel"
  const [fuelType, setFuelType] = useState('gasoline');

  // Dáta z API
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stav pre vyhľadávací reťazec (filter)
  const [searchQuery, setSearchQuery] = useState('');

  // Mapa krajinných kódov pre vlajky (country => "sk", "cz", ...)
  const countryCodeMap = {
    'Austria': 'at',
    'Czech Republic': 'cz',
    'Hungary': 'hu',
    'Poland': 'pl',
    'Slovakia': 'sk',
    'Germany': 'de',
    'Iran': 'ir',
    'Libya': 'ly',
    'Venezuela': 've',
    'Angola': 'ao',
    'Egypt': 'eg',
    'Kuwait': 'kw',
    'Algeria': 'dz',
    'Turkmenistan': 'tm',
    'Malaysia': 'my',
    'Kazakhstan': 'kz',
    'Bahrain': 'bh',
    'Bolivia': 'bo',
    'Nigeria': 'ng',
    'Qatar': 'qa',
    'Oman': 'om',
    'Saudi Arabia': 'sa',
    'Azerbaijan': 'az',
    'Iraq': 'iq',
    'Russia': 'ru',
    'Sudan': 'sd',
    'UAE': 'ae',
    'Ecuador': 'ec',
    'Lebanon': 'lb',
    'Belarus': 'by',
    'Bhutan': 'bt',
    'Ethiopia': 'et',
    'Tunisia': 'tn',
    'Kyrgyzstan': 'kg',
    'Indonesia': 'id',
    'Vietnam': 'vn',
    'Afghanistan': 'af',
    'Liberia': 'lr',
    'Paraguay': 'py',
    'Syria': 'sy',
    'USA': 'us',
    'Maldives': 'mv',
    'Pakistan': 'pk',
    'Puerto Rico': 'pr',
    'Panama': 'pa',
    'Brazil': 'br',
    'Taiwan': 'tw',
    'Gabon': 'ga',
    'Uzbekistan': 'uz',
    'Ghana': 'gh',
    'Colombia': 'co',
    'Guyana': 'gy',
    'El Salvador': 'sv',
    'Burma': 'mm',
    'Bangladesh': 'bd',
    'DR Congo': 'cd',
    'Australia': 'au',
    'Honduras': 'hn',
    'Botswana': 'bw',
    'Togo': 'tg',
    'Guatemala': 'gt',
    'Lesotho': 'ls',
    'Benin': 'bj',
    'Swaziland': 'sz',
    'Mali': 'ml',
    'Haiti': 'ht',
    'China': 'cn',
    'Georgia': 'ge',
    'Peru': 'pe',
    'Philippines': 'ph',
    'Cambodia': 'kh',
    'Trinidad & Tobago': 'tt',
    'Namibia': 'na',
    'Tanzania': 'tz',
    'India': 'in',
    'Madagascar': 'mg',
    'Rwanda': 'rw',
    'Curacao': 'cw',
    'South Africa': 'za',
    'Jamaica': 'jm',
    'Grenada': 'gd',
    'Nepal': 'np',
    'Fiji': 'fj',
    'Suriname': 'sr',
    'Canada': 'ca',
    'Zambia': 'zm',
    'Argentina': 'ar',
    'Dom. Rep.': 'do',
    'Japan': 'jp',
    'Mexico': 'mx',
    'Turkey': 'tr',
    'Sri Lanka': 'lk',
    'Cuba': 'cu',
    'Moldova': 'md',
    'South Korea': 'kr',
    'Mauritius': 'mu',
    'Dominica': 'dm',
    'Nicaragua': 'ni',
    'Costa Rica': 'cr',
    'N. Maced.': 'mk',
    'Thailand': 'th',
    'Bosnia & Herz.': 'ba',
    'Mozambique': 'mz',
    'Aruba': 'aw',
    'Saint Lucia': 'lc',
    'Armenia': 'am',
    'Cape Verde': 'cv',
    'Cameroon': 'cm',
    'Kenya': 'ke',
    'Bulgaria': 'bg',
    'Burkina Faso': 'bf',
    'Uganda': 'ug',
    'Morocco': 'ma',
    'Burundi': 'bi',
    'Chile': 'cl',
    'Laos': 'la',
    'Sierra Leone': 'sl',
    'Guinea': 'gn',
    'Ivory Coast': 'ci',
    'Ukraine': 'ua',
    'Seychelles': 'sc',
    'Malta': 'mt',
    'Cayman Islands': 'ky',
    'Malawi': 'mw',
    'Bahamas': 'bs',
    'Andorra': 'ad',
    'Mongolia': 'mn',
    'Cyprus': 'cy',
    'Zimbabwe': 'zw',
    'New Zealand': 'nz',
    'Jordan': 'jo',
    'Sweden': 'se',
    'Senegal': 'sn',
    'Romania': 'ro',
    'Lithuania': 'lt',
    'Luxembourg': 'lu',
    'Montenegro': 'me',
    'Slovenia': 'si',
    'Spain': 'es',
    'Croatia': 'hr',
    'Latvia': 'lv',
    'Serbia': 'rs',
    'Belgium': 'be',
    'Estonia': 'ee',
    'Albania': 'al',
    'Belize': 'bz',
    'San Marino': 'sm',
    'C. Afr. Rep.': 'cf',
    'UK': 'gb',
    'Monaco': 'mc',
    'Uruguay': 'uy',
    'Portugal': 'pt',
    'France': 'fr',
    'Wallis and Futuna': 'wf',
    'Finland': 'fi',
    'Norway': 'no',
    'Mayotte': 'yt',
    'Ireland': 'ie',
    'Barbados': 'bb',
    'Greece': 'gr',
    'Italy': 'it',
    'Switzerland': 'ch',
    'Liechtenstein': 'li',
    'Israel': 'il',
    'Singapore': 'sg',
    'Netherlands': 'nl',
    'Denmark': 'dk',
    'Iceland': 'is',
    'Hong Kong': 'hk'
  };

  // Načítame dáta z /api/get-fuel-prices len raz pri mount
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/api/get-fuel-prices')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Data from Supabase:', data);
        setCountries(data); // Očakávame pole objektov s {country, diesel_price, gasoline_price}
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOpenPopup = () => {
    // mobil / desktop logika ...
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        setShowPopup(true);
        setPlusOpen(true);
      }, 500);
    } else {
      setShowPopup(true);
      setPlusOpen(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPlusOpen(false);
    setSearchQuery('');
  };

  const handleFuelTypeChange = (e) => {
    setFuelType(e.target.value);
  };

  // Filtrovanie krajín na základe fuelType a searchQuery
  const filteredCountries = countries
    .filter((row) => {
      if (fuelType === 'diesel') {
        // zobrazíme len tie, ktoré majú diesel_price
        return row.diesel_price !== null && row.diesel_price !== undefined;
      } else {
        // fuelType === 'gasoline'
        return row.gasoline_price !== null && row.gasoline_price !== undefined;
      }
    })
    .filter((row) => {
      // country -> toLowerCase -> searchQuery
      return row.country?.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleSelectCountry = (row) => {
    // Podľa druhu paliva zistíme správnu cenu
    let price;
    if (fuelType === 'gasoline') {
      price = row.gasoline_price;
    } else {
      price = row.diesel_price;
    }

    if (price !== null && price !== undefined) {
      onChange(price.toString());
    } else {
      onChange('');
      console.warn("Cena pre", fuelType, "nie je dostupná v riadku:", row);
    }
    handleClosePopup();
  };

  return (
    <div className="fuelPriceContainer">
      <input
        type="text"
        className="inputFuelPrice"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {showIcon && (
        <div
          className="plusWrapper"
          onClick={handleOpenPopup}
          title={t('fuelDropdownTitle')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="36"
            height="36"
            viewBox="0 0 30 40"
            className="searchSvg"
          >
            <path d="M 13 3 C 7.4886661 3 3 7.4886661 3 13 C 3 18.511334 7.4886661 23 13 23 C 15.396652 23 17.59741 22.148942 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148942 17.59741 23 15.396652 23 13 C 23 7.4886661 18.511334 3 13 3 z M 13 5 C 17.430666 5 21 8.5693339 21 13 C 21 17.430666 17.430666 21 13 21 C 8.5693339 21 5 17.430666 5 13 C 5 8.5693339 8.5693339 5 13 5 z" />
          </svg>
        </div>
      )}

      {showPopup && showIcon && (
        <>
          <div className="popupOverlay" onClick={handleClosePopup}></div>
          <div className="popupContent">
            <h2>{t('fuelDropdownTitle')}</h2>
            <div className="fuelTypeRow">
              <label>
                <input
                  type="radio"
                  value="gasoline"
                  checked={fuelType === 'gasoline'}
                  onChange={handleFuelTypeChange}
                />
                {t('fuelDropdownPetrol')}
              </label>
              <label>
                <input
                  type="radio"
                  value="diesel"
                  checked={fuelType === 'diesel'}
                  onChange={handleFuelTypeChange}
                />
                {t('fuelDropdownDiesel')}
              </label>
            </div>

            {/* Vyhľadávací input pre krajiny */}
            <div className="searchCountry">
              <input
                type="text"
                placeholder={t('searchCountry')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Loading / Error */}
            {loading && <p className="loading">{t('fuelDropdownLoading')}</p>}
            {error && <p className="error">{t('fuelDropdownError')}: {error}</p>}

            {/* Ak nie je loading ani error, zobrazíme krajiny */}
            {!loading && !error && (
              <>
                <h4>{t('fuelDropdownCountriesTitle')}:</h4>
                <div className="countryList">
                  {filteredCountries.map((row) => (
                    <div 
                      key={row.country} 
                      className="countryItem" 
                      onClick={() => handleSelectCountry(row)}
                    >
                      <img
                        src={
                          countryCodeMap[row.country]
                            ? `https://flagcdn.com/w320/${countryCodeMap[row.country]}.png`
                            : ''
                        }
                        alt={row.country}
                        className="flagIcon"
                      />
                      <span>{row.country}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button className="closeBtn" onClick={handleClosePopup}>
              {t('fuelDropdownClose')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FuelPriceInput;
