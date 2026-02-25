import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* pomocná funkcia – Wh/km → kWh/100km | kWh/100mi */
function convertElectricValue(whPerKm, fuelUnit) {
  if (!whPerKm) return '';
  const n = parseFloat(whPerKm);
  if (isNaN(n)) return '';
  const kWhPer100km = n * 0.1;
  if (fuelUnit === 'imperial') {
    const kWhPer100mi = (n / 1.609344) / 10;
    return kWhPer100mi.toFixed(2);
  }
  return kWhPer100km.toFixed(2);
}

function CarSelector({
  /* props z App.js */
  selectedVehicleType, setSelectedVehicleType,
  selectedYear,         setSelectedYear,
  selectedBrand,        setSelectedBrand,
  selectedModel,        setSelectedModel,
  selectedEngine,       setSelectedEngine,
  selectedTransmission, setSelectedTransmission,
  selectedFuelType,     setSelectedFuelType,
  onConsumptionChange,
  fuelUnit
}) {
  const { t } = useTranslation();

  /* dáta */
  const [years,       setYears]       = useState(['Without year']);
  const [smallData,   setSmallData]   = useState([]);   // cars_data_cleaned
  const [bigData,     setBigData]     = useState([]);   // tabulka_vozidiel (aktuálne vybraný rok)
  const [evData,      setEvData]      = useState([]);   // ev_dataset
  const [loadingYear, setLoadingYear] = useState(false);

  /* 1️⃣ načítame roky + malé tabuľky hneď po mount‑e */
  useEffect(() => {
    (async () => {
      const yrs = await fetch('/api/get-years').then(r => r.json());
      setYears(yrs);

      const small = await fetch('/api/get-car-data').then(r => r.json());
      setSmallData(small.cars_data_cleaned);
      setEvData   (small.ev_dataset);
    })();
  }, []);

  /* 2️⃣ načítame veľké dáta až keď user zvolí rok */
  useEffect(() => {
    if (selectedVehicleType !== 'combustion') { setBigData([]); return; }

    // Without year -> používame smallData, žiadny fetch
    if (!selectedYear || selectedYear === 'Without year') {
      setBigData([]);
      return;
    }

    let cancelled = false;
    setLoadingYear(true);

    (async () => {
      const PAGE = 1000;
      let all = [], from = 0;

      while (true) {
        const part = await fetch(`/api/get-cars-by-year?year=${selectedYear}&from=${from}&to=${from + PAGE - 1}`)
                             .then(r => r.json());
        if (cancelled) return;
        all = all.concat(part);
        if (part.length < PAGE) break;
        from += PAGE;
      }
      setBigData(all);
      setLoadingYear(false);
    })();

    return () => { cancelled = true; };
  }, [selectedYear, selectedVehicleType]);

  /* ---- odvodené polia podľa výberu ---- */
  const relevantCombustion = (
    selectedYear === 'Without year' || !selectedYear
      ? smallData
      : bigData
  );

  const availableBrandsComb = [...new Set(relevantCombustion.map(i => i.Brand).filter(Boolean))].sort();
  const availableModelsComb = selectedBrand
      ? [...new Set(relevantCombustion.filter(i => i.Brand === selectedBrand).map(i => i.Model))]
      : [];
  const availableEnginesComb = (selectedBrand && selectedModel)
      ? [...new Set(relevantCombustion
                      .filter(i => i.Brand === selectedBrand && i.Model === selectedModel)
                      .map(i => i.Engine || '(none)'))]
      : [];
  const availableTransComb = selectedEngine
      ? [...new Set(relevantCombustion
                      .filter(i => i.Brand === selectedBrand && i.Model === selectedModel &&
                                   (i.Engine || '(none)') === selectedEngine)
                      .map(i => i.Transmission || '(none)'))]
      : [];
  const availableFuelTypesComb = selectedEngine
      ? [...new Set(relevantCombustion
                      .filter(i => i.Brand === selectedBrand && i.Model === selectedModel &&
                                   (i.Engine || '(none)') === selectedEngine)
                      .map(i => i['Fuel type'] || '(none)'))]
      : [];

  /* EV výbery */
  const availableBrandsEV  = [...new Set(evData.map(i => i.Brand).filter(Boolean))].sort();
  const availableModelsEV  = selectedBrand
      ? [...new Set(evData.filter(i => i.Brand === selectedBrand).map(i => i.Model))]
      : [];
  const availableBatsEV    = (selectedBrand && selectedModel)
      ? [...new Set(evData.filter(i => i.Brand === selectedBrand && i.Model === selectedModel)
                           .map(i => i['Battery (kWh)']))]
      : [];

  /* 3️⃣ keď sa zmení výber, nastav spotrebu */
  useEffect(() => {
    if (selectedVehicleType === 'combustion') {
      if (!selectedBrand || !selectedModel) { onConsumptionChange(''); return; }
      const rec = relevantCombustion.find(i => {
        const eng  = i.Engine        || '(none)';
        const trn  = i.Transmission  || '(none)';
        const fuel = i['Fuel type']  || '(none)';
        if (i.Brand !== selectedBrand)       return false;
        if (i.Model !== selectedModel)       return false;
        if (eng !== (selectedEngine || '(none)')) return false;
        if (selectedTransmission && trn !== selectedTransmission) return false;
        if (selectedFuelType      && fuel !== selectedFuelType)   return false;
        return true;
      });
      if (rec) {
        const c = fuelUnit === 'imperial' ? rec['Combined (MPG)']
                                          : rec['Combined (l/100km)'];
        onConsumptionChange(c?.toString() || '');
      } else {
        onConsumptionChange('');
      }
    } else {            // electric
      if (!selectedBrand || !selectedModel || !selectedEngine) { onConsumptionChange(''); return; }
      const rec = evData.find(i =>
        i.Brand === selectedBrand &&
        i.Model === selectedModel &&
        i['Battery (kWh)'] === selectedEngine
      );
      if (rec) {
        const val = convertElectricValue(rec['Efficiency (Wh/km)'], fuelUnit);
        onConsumptionChange(val);
      } else {
        onConsumptionChange('');
      }
    }
  }, [selectedVehicleType, selectedYear, selectedBrand, selectedModel,
      selectedEngine, selectedTransmission, selectedFuelType,
      fuelUnit, relevantCombustion, evData, onConsumptionChange]);

  /* ---------- UI ---------- */
  return (
    <div className="car-selector">
      <h2>{t('selectCar')}</h2>

      {/* vehicle type */}
      <div className="dropdown-group">
        <label>{t('vehicleType')}</label>
        <select
          value={selectedVehicleType}
          onChange={e => {
            setSelectedVehicleType(e.target.value);
            setSelectedYear('');
            setSelectedBrand('');
            setSelectedModel('');
            setSelectedEngine('');
            setSelectedTransmission('');
            setSelectedFuelType('');
          }}
        >
          <option value="combustion">{t('combustionVehicle')}</option>
          <option value="electric">{t('electricVehicle')}</option>
        </select>
      </div>

      {/* year */}
      {selectedVehicleType === 'combustion' && (
        <div className="dropdown-group">
          <label>{t('year')}</label>
          <select
            value={selectedYear}
            onChange={e => {
              setSelectedYear(e.target.value);
              setSelectedBrand(''); setSelectedModel('');
              setSelectedEngine(''); setSelectedTransmission('');
              setSelectedFuelType('');
            }}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {loadingYear && <small>{t('loading')}…</small>}
        </div>
      )}

      {/* brand */}
      <div className="dropdown-group">
        <label>{t('brand')}</label>
        <select
          value={selectedBrand}
          onChange={e => {
            setSelectedBrand(e.target.value);
            setSelectedModel(''); setSelectedEngine('');
            setSelectedTransmission(''); setSelectedFuelType('');
          }}
          disabled={selectedVehicleType === 'combustion' && !selectedYear}
        >
          <option value="">{t('selectBrand')}</option>
          {(selectedVehicleType === 'combustion' ? availableBrandsComb : availableBrandsEV)
            .map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* model */}
      <div className="dropdown-group">
        <label>{t('model')}</label>
        <select
          value={selectedModel}
          onChange={e => {
            setSelectedModel(e.target.value);
            setSelectedEngine('');
            setSelectedTransmission('');
            setSelectedFuelType('');
          }}
          disabled={!selectedBrand}
        >
          <option value="">{t('selectModel')}</option>
          {(selectedVehicleType === 'combustion' ? availableModelsComb : availableModelsEV)
            .map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* engine / battery */}
      <div className="dropdown-group">
        <label>{selectedVehicleType === 'electric' ? t('battery') : t('engine')}</label>
        <select
          value={selectedEngine}
          onChange={e => {
            setSelectedEngine(e.target.value);
            setSelectedTransmission('');
            setSelectedFuelType('');
          }}
          disabled={!selectedModel}
        >
          <option value="">
            {selectedVehicleType === 'electric' ? t('selectBattery') : t('selectEngine')}
          </option>
          {(selectedVehicleType === 'combustion' ? availableEnginesComb : availableBatsEV)
            .map(x => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>

      {/* transmission + fuel type (combustion only) */}
      {selectedVehicleType === 'combustion' && (
        <>
          <div className="dropdown-group">
            <label>{t('transmission')}</label>
            <select
              value={selectedTransmission}
              onChange={e => setSelectedTransmission(e.target.value)}
              disabled={!selectedEngine}
            >
              <option value="">{t('selectTransmission')}</option>
              {availableTransComb.map(tr => <option key={tr} value={tr}>{tr}</option>)}
            </select>
          </div>

          <div className="dropdown-group">
            <label>{t('fuelTypeLabel')}</label>
            <select
              value={selectedFuelType}
              onChange={e => setSelectedFuelType(e.target.value)}
              disabled={!selectedEngine}
            >
              <option value="">{t('selectFuelType')}</option>
              {availableFuelTypesComb.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default CarSelector;
