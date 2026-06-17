import { getLocaleDefaults } from './localeDefaults';

test('uses metric EUR defaults for Slovakia', () => {
  expect(getLocaleDefaults('sk-SK')).toMatchObject({
    fuelUnit: 'metric',
    selectedCurrency: 'eur',
    fuelConsumption: '6.5',
  });
});

test('uses imperial USD defaults for the United States', () => {
  expect(getLocaleDefaults('en-US')).toMatchObject({
    fuelUnit: 'imperial',
    selectedCurrency: 'usd',
    fuelConsumption: '36.19',
  });
});

test('keeps metric units while selecting GBP for the United Kingdom', () => {
  expect(getLocaleDefaults('en-GB')).toMatchObject({
    fuelUnit: 'metric',
    selectedCurrency: 'gbp',
  });
});
