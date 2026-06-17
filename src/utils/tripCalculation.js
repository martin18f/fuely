export const KM_PER_MILE = 1.609344;
export const METERS_PER_MILE = 1609.344;
export const LITERS_PER_US_GALLON = 3.785411784;
export const ESTIMATE_RANGE_FACTOR = 0.07;

const toNumber = (value) => {
  const parsed = typeof value === 'string'
    ? Number.parseFloat(value.replace(',', '.'))
    : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const toNonNegativeNumber = (value) => {
  const parsed = toNumber(value);
  return parsed !== null && parsed > 0 ? parsed : 0;
};

export function calculateTripCost({
  distanceMeters,
  consumption,
  fuelPrice,
  fuelUnit = 'metric',
  vehicleType = 'combustion',
  tolls = 0,
}) {
  const distance = toNumber(distanceMeters);
  const consumptionValue = toNumber(consumption);
  const priceValue = toNumber(fuelPrice);

  if (
    distance === null ||
    distance <= 0 ||
    consumptionValue === null ||
    consumptionValue <= 0 ||
    priceValue === null ||
    priceValue <= 0
  ) {
    return null;
  }

  const isImperial = fuelUnit === 'imperial';
  const isElectric = vehicleType === 'electric';
  const distanceValue = isImperial
    ? distance / METERS_PER_MILE
    : distance / 1000;

  let energyUsed;
  let energyUnit;
  let consumptionUnit;
  let priceUnit;

  if (isElectric) {
    energyUsed = (distanceValue / 100) * consumptionValue;
    energyUnit = 'kWh';
    consumptionUnit = isImperial ? 'kWh/100 mi' : 'kWh/100 km';
    priceUnit = 'kWh';
  } else if (isImperial) {
    energyUsed = distanceValue / consumptionValue;
    energyUnit = 'gal';
    consumptionUnit = 'MPG';
    priceUnit = 'gal';
  } else {
    energyUsed = (distanceValue / 100) * consumptionValue;
    energyUnit = 'L';
    consumptionUnit = 'L/100 km';
    priceUnit = 'L';
  }

  const fuelCost = energyUsed * priceValue;
  const tollCost = toNonNegativeNumber(tolls);
  const exactCost = fuelCost + tollCost;
  return {
    distance: distanceValue,
    distanceUnit: isImperial ? 'mi' : 'km',
    consumption: consumptionValue,
    consumptionUnit,
    energyUsed,
    energyUnit,
    fuelPrice: priceValue,
    priceUnit,
    fuelCost,
    tolls: tollCost,
    exactCost,
    estimatedMin: exactCost * (1 - ESTIMATE_RANGE_FACTOR),
    estimatedMax: exactCost * (1 + ESTIMATE_RANGE_FACTOR),
  };
}
