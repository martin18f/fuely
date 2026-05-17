import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
});
