import { METERS_PER_MILE } from './tripCalculation';

const METRIC_DEFAULTS = {
  fuelUnit: 'metric',
  selectedCurrency: 'eur',
  fuelConsumption: '6.5',
  fuelPrice: '1.65',
  distanceMeters: 100000,
};

const REGION_DEFAULTS = {
  US: {
    fuelUnit: 'imperial',
    selectedCurrency: 'usd',
    fuelConsumption: '36.19',
    fuelPrice: '3.40',
    distanceMeters: 100 * METERS_PER_MILE,
  },
  GB: {
    ...METRIC_DEFAULTS,
    selectedCurrency: 'gbp',
    fuelPrice: '1.45',
  },
  CZ: {
    ...METRIC_DEFAULTS,
    selectedCurrency: 'czk',
    fuelPrice: '38',
  },
  CH: {
    ...METRIC_DEFAULTS,
    selectedCurrency: 'chf',
    fuelPrice: '1.85',
  },
  JP: {
    ...METRIC_DEFAULTS,
    selectedCurrency: 'jpy',
    fuelPrice: '175',
  },
  AU: {
    ...METRIC_DEFAULTS,
    selectedCurrency: 'aud',
    fuelPrice: '1.90',
  },
  CA: {
    ...METRIC_DEFAULTS,
    selectedCurrency: 'cad',
    fuelPrice: '1.70',
  },
};

export function getLocaleDefaults(locale) {
  const normalizedLocale = locale || 'en';
  let region = '';

  try {
    region = new Intl.Locale(normalizedLocale).region || '';
  } catch (error) {
    const parts = normalizedLocale.split(/[-_]/);
    region = parts[1]?.toUpperCase() || '';
  }

  return {
    ...METRIC_DEFAULTS,
    ...(REGION_DEFAULTS[region] || {}),
  };
}
