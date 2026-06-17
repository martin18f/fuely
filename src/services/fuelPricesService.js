import Papa from 'papaparse';

const CSV_CONFIG = {
  gasoline: {
    fileName: '/gasoline_prices.csv',
    priceColumn: 'Cena v €/l paliva (Benzín)',
    resultKey: 'gasoline_price',
  },
  diesel: {
    fileName: '/diesel_prices.csv',
    priceColumn: 'Cena v €/l paliva (Diesel)',
    resultKey: 'diesel_price',
  },
};

async function loadCsvPrices(fuelType) {
  const config = CSV_CONFIG[fuelType];
  const response = await fetch(config.fileName);

  if (!response.ok) {
    throw new Error(`CSV file error: ${response.status}`);
  }

  const csvText = await response.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    delimiter: ',',
  });

  if (parsed.errors.length) {
    throw new Error(parsed.errors[0].message);
  }

  return parsed.data.map((row) => ({
    country: row.Krajina,
    [config.resultKey]: Number.parseFloat(row[config.priceColumn]),
  }));
}

async function loadCsvFallback() {
  const [gasolineRows, dieselRows] = await Promise.all([
    loadCsvPrices('gasoline'),
    loadCsvPrices('diesel'),
  ]);
  const pricesByCountry = new Map();

  [...gasolineRows, ...dieselRows].forEach((row) => {
    if (!row.country) return;
    pricesByCountry.set(row.country, {
      ...(pricesByCountry.get(row.country) || { country: row.country }),
      ...row,
    });
  });

  return [...pricesByCountry.values()];
}

export async function getFuelPrices() {
  try {
    const response = await fetch('/api/get-fuel-prices');
    const contentType = response.headers?.get?.('content-type') || '';

    if (!response.ok || !contentType.includes('application/json')) {
      throw new Error(`Fuel price API unavailable: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Fuel price API returned an invalid response.');
    }

    return data;
  } catch (error) {
    console.warn('Using local fuel price CSV fallback:', error);
    return loadCsvFallback();
  }
}
