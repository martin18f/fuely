import React from "react";
import { useTranslation } from "react-i18next";
import "./FuelTypeRadioGroup.css";

const FuelTypeRadioGroup = ({ fuelType, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="fuelTypeContainer">
      <div className="fuelTypeTabs">
        {/* Gasoline */}
        <input
          type="radio"
          id="radio-gasoline"
          name="fuelType"
          value="gasoline"
          checked={fuelType === "gasoline"}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="fuelTypeTab" htmlFor="radio-gasoline">
          {t("fuelTypeGasoline")}
        </label>

        {/* Diesel */}
        <input
          type="radio"
          id="radio-diesel"
          name="fuelType"
          value="diesel"
          checked={fuelType === "diesel"}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="fuelTypeTab" htmlFor="radio-diesel">
          {t("fuelTypeDiesel")}
        </label>

        {/* Glider */}
        <div className="fuelTypeGlider"></div>
      </div>
    </div>
  );
};

export default FuelTypeRadioGroup;
