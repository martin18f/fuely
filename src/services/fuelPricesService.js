// Príklad: 

import Papa from 'papaparse';

export async function getEuropeanFuelPrices(fuelType = 'gasoline') {
  const fileName =
    fuelType === 'gasoline'
      ? '/gasoline_prices.csv'
      : '/diesel_prices.csv';
  const response = await fetch(fileName);
  if (!response.ok) {
    throw new Error(`CSV file error: ${response.statusText}`);
  }
  const csvText = await response.text();
  const data = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    delimiter: ','
  }).data;
  return data;
}
