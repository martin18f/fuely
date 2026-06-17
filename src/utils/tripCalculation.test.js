import { calculateTripCost, METERS_PER_MILE } from './tripCalculation';

test('calculates a metric trip with a realistic range and extras', () => {
  const result = calculateTripCost({
    distanceMeters: 120000,
    consumption: 6.5,
    fuelPrice: 1.65,
    tolls: 5,
  });

  expect(result.energyUsed).toBeCloseTo(7.8);
  expect(result.exactCost).toBeCloseTo(17.87);
  expect(result.estimatedMin).toBeCloseTo(16.6191);
  expect(result.estimatedMax).toBeCloseTo(19.1209);
});

test('uses miles, MPG, and gallons for imperial calculations', () => {
  const result = calculateTripCost({
    distanceMeters: 100 * METERS_PER_MILE,
    consumption: 25,
    fuelPrice: 3.5,
    fuelUnit: 'imperial',
  });

  expect(result.distance).toBeCloseTo(100);
  expect(result.energyUsed).toBeCloseTo(4);
  expect(result.exactCost).toBeCloseTo(14);
  expect(result.consumptionUnit).toBe('MPG');
});

test('adds tolls to an electric trip', () => {
  const result = calculateTripCost({
    distanceMeters: 100000,
    consumption: 20,
    fuelPrice: 0.25,
    vehicleType: 'electric',
    tolls: 4,
  });

  expect(result.distance).toBeCloseTo(100);
  expect(result.energyUsed).toBeCloseTo(20);
  expect(result.exactCost).toBeCloseTo(9);
});
