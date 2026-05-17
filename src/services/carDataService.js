import Papa from 'papaparse';

const WITHOUT_YEAR = 'Without year';

let smallDataPromise;
let yearsPromise;
let fullCombustionDataPromise;

const trimRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.trim(),
      typeof value === 'string' ? value.trim() : value,
    ])
  );

const parseCsv = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  const csv = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length) {
          reject(new Error(errors[0].message));
          return;
        }

        resolve(data.map(trimRow));
      },
      error: reject,
    });
  });
};

export const loadBaseCarData = () => {
  if (!smallDataPromise) {
    smallDataPromise = Promise.all([
      parseCsv('/cars_data_cleaned.csv'),
      parseCsv('/ev_dataset.csv'),
    ]).then(([carsDataCleaned, evDataset]) => ({
      cars_data_cleaned: carsDataCleaned,
      ev_dataset: evDataset,
    }));
  }

  return smallDataPromise;
};

export const loadYears = async () => {
  if (!yearsPromise) {
    yearsPromise = fetch('/tabulka_vozidiel.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load years: ${response.status}`);
        }
        return response.text();
      })
      .then((csv) => {
        const years = new Set();
        const lines = csv.split(/\r?\n/);

        for (let index = 1; index < lines.length; index += 1) {
          const year = lines[index].split(',')[0]?.trim();
          if (year) {
            years.add(year);
          }
        }

        return [
          WITHOUT_YEAR,
          ...Array.from(years).sort((a, b) => Number(b) - Number(a)),
        ];
      });
  }

  return yearsPromise;
};

export const loadCarsByYear = async (year) => {
  if (!year || year === WITHOUT_YEAR) {
    return [];
  }

  if (!fullCombustionDataPromise) {
    fullCombustionDataPromise = parseCsv('/tabulka_vozidiel.csv');
  }

  const rows = await fullCombustionDataPromise;
  return rows
    .filter((row) => String(row.year) === String(year))
    .sort((a, b) => (a.Brand || '').localeCompare(b.Brand || ''));
};

export { WITHOUT_YEAR };
