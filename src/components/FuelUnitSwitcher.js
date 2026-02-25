// FuelUnitSwitcher.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Switchers.css';

const FuelUnitSwitcher = ({ fuelUnit, setFuelUnit, selectedVehicleType }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(fuelUnit === 'imperial');

  useEffect(() => {
    setChecked(fuelUnit === 'imperial');
  }, [fuelUnit]);

  const handleToggle = (e) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    setFuelUnit(newValue ? 'imperial' : 'metric');
  };

  // Dynamicky určíme, aké popisky chceme vľavo a vpravo
  let leftLabel, rightLabel;
  if (selectedVehicleType === 'electric') {
    // EV => prepíname kWh/100km vs. kWh/100mi
    leftLabel = t('efficiencyMetricShort');   // "kWh/100km"
    rightLabel = t('efficiencyImperialShort'); // "kWh/100mi"
  } else {
    // Spaľovacie => l/100km vs. MPG
    leftLabel = t('fuelUnitMetric');   // "l/100km"
    rightLabel = t('fuelUnitImperial'); // "MPG"
  }

  return (
    <div className="switcher">
      <span className="left-label">{leftLabel}</span>
      <input
        type="checkbox"
        className="checkbox"
        id="fuel-switch"
        checked={checked}
        onChange={handleToggle}
      />
      <label className="slider" htmlFor="fuel-switch"></label>
      <span className="right-label">{rightLabel}</span>
    </div>
  );
};

export default FuelUnitSwitcher;
