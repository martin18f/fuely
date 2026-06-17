import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => {
  const React = require('react');

  return {
    BrowserRouter: ({ children }) => <>{children}</>,
    Routes: ({ children }) => <>{children}</>,
    Route: ({ path, element }) => (path === '/' ? element : null),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
}, { virtual: true });

jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: false, loadError: null }),
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  Marker: () => null,
  DirectionsRenderer: () => null,
}));

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}), { virtual: true });

jest.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => null,
}), { virtual: true });

jest.mock('./CarSelector', () => () => <div data-testid="car-selector" />);
jest.mock('./components/FuelPriceInput', () => ({ value, onChange }) => (
  <input
    aria-label="fuel price"
    value={value}
    onChange={(event) => onChange(event.target.value)}
  />
));

beforeEach(() => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve(
          String(url).includes('/api/get-fuel-prices')
            ? []
            : { eur: { eur: 1, usd: 1, gbp: 1, czk: 1, jpy: 1, aud: 1, cad: 1, chf: 1 } }
        ),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders travel cost calculator', async () => {
  render(<App />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  const heading = await screen.findByRole('heading', {
    name: /travel cost calculator|výpočet nákladov na cestovanie/i,
  });
  expect(heading).toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: /estimated range|odhadovaný rozsah/i,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/exact calculation|presný výpočet/i)
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('button', {
      name: /calculate route|vypočítať trasu/i,
    })
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(/advanced options|pokročilé možnosti/i)
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', {
      name: /add stop|pridať zastávku/i,
    })
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/extra cost|dodatočné náklady/i)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/estimate variance|odchýlka odhadu/i)
  ).not.toBeInTheDocument();
});

test('adds a stop between the start and destination fields', async () => {
  render(<App />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  fireEvent.click(
    screen.getByRole('button', {
      name: /add stop|pridať zastávku/i,
    })
  );

  const locationFields = screen.getAllByRole('combobox');
  expect(locationFields.slice(0, 3).map((field) => field.getAttribute('aria-label')))
    .toEqual(['Start', 'Stop 1', 'Destination']);
});
