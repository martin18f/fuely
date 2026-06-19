import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

let App;
let mockDirectionsRoute;

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

jest.mock('./components/GoogleMapsLoader', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: ({ onStateChange }) => {
      React.useEffect(() => {
        onStateChange?.({ isLoaded: true, loadError: null });
      }, [onStateChange]);

      return null;
    },
  };
});

jest.mock('./components/MapView', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: ({ directions, markers = [] }) => (
      <div
        data-testid="map"
        data-has-directions={directions ? 'true' : 'false'}
      >
        {markers.map((marker) => (
          <span key={`${marker.type}-${marker.label}`}>
            {marker.type} {marker.label}
          </span>
        ))}
      </div>
    ),
  };
});

jest.mock('./components/SearchBar', () => {
  const React = require('react');

  const getLocation = (placeholder) => {
    const normalizedPlaceholder = placeholder.toLowerCase();

    if (
      normalizedPlaceholder.includes('start') ||
      normalizedPlaceholder.includes('štart')
    ) {
      return {
        address: 'Start City',
        position: { lat: 48.1486, lng: 17.1077 },
      };
    }

    if (
      normalizedPlaceholder.includes('destination') ||
      normalizedPlaceholder.includes('cieľ')
    ) {
      return {
        address: 'Destination City',
        position: { lat: 48.7164, lng: 21.2611 },
      };
    }

    return {
      address: `${placeholder} City`,
      position: { lat: 49.2232, lng: 18.7394 },
    };
  };

  return {
    __esModule: true,
    default: ({
      defaultValue = '',
      onLocationSelect,
      onActivate,
      placeholder,
    }) => (
      <div>
        <input
          aria-label={placeholder}
          readOnly
          role="combobox"
          value={defaultValue}
        />
        <button
          type="button"
          onClick={() => {
            onActivate?.();
            onLocationSelect?.(getLocation(placeholder));
          }}
        >
          select {placeholder}
        </button>
        <button
          type="button"
          onClick={() => onLocationSelect?.(null)}
        >
          clear {placeholder}
        </button>
      </div>
    ),
  };
});

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

beforeAll(() => {
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY = 'test-google-maps-key';
  App = require('./App').default;
});

beforeEach(() => {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value: 'en-GB',
  });
  window.localStorage.clear();
  mockDirectionsRoute = jest.fn((request, callback) => {
    const waypointCount = request.waypoints?.length || 0;
    const distanceMeters = waypointCount > 0 ? 150000 : 100000;

    callback(
      {
        routes: [
          {
            summary: `route-with-${waypointCount}-stops`,
            legs: [
              {
                distance: { value: distanceMeters },
                duration: { value: waypointCount > 0 ? 7200 : 3600 },
              },
            ],
          },
        ],
      },
      'OK'
    );
  });
  window.google = {
    maps: {
      DirectionsService: jest.fn(() => ({
        route: mockDirectionsRoute,
      })),
      TravelMode: { DRIVING: 'DRIVING' },
    },
  };

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
  delete window.google;
});

const clickButton = (name) => {
  fireEvent.click(screen.getByRole('button', { name }));
};

const getLastRouteRequest = () =>
  mockDirectionsRoute.mock.calls[mockDirectionsRoute.mock.calls.length - 1][0];

const expectCalculationDistance = (distancePattern) => {
  expect(screen.getByText(/fuel used|spotrebované palivo/i)).toHaveTextContent(
    distancePattern
  );
};

test('renders travel cost calculator', async () => {
  render(<App />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  const heading = await screen.findByRole('heading', {
    name: /fuely fuel cost calculator|palivová kalkulačka fuely/i,
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

test('recalculates route, cost, and map markers when a stop is added and removed', async () => {
  render(<App />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  clickButton(/select (start|štart)/i);
  clickButton(/select (destination|cieľ)/i);

  await waitFor(() => expect(mockDirectionsRoute).toHaveBeenCalledTimes(1));
  expect(getLastRouteRequest().waypoints).toEqual([]);
  expect(screen.getByTestId('map')).toHaveAttribute(
    'data-has-directions',
    'true'
  );
  expectCalculationDistance(/100\s?km/);

  clickButton(/add stop|pridať zastávku/i);
  clickButton(/select (stop|zastávka) 1/i);

  await waitFor(() => expect(mockDirectionsRoute).toHaveBeenCalledTimes(2));
  expect(getLastRouteRequest().waypoints).toHaveLength(1);
  expect(screen.getByTestId('map')).toHaveTextContent('stop 1');
  expectCalculationDistance(/150\s?km/);

  clickButton(/remove 1|odstrániť 1/i);

  await waitFor(() => expect(mockDirectionsRoute).toHaveBeenCalledTimes(3));
  expect(getLastRouteRequest().waypoints).toEqual([]);
  expect(screen.getByTestId('map')).not.toHaveTextContent('stop 1');
  expectCalculationDistance(/100\s?km/);
});

test('clears stale route, cost, and map directions when start or destination is deleted', async () => {
  render(<App />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  clickButton(/select (start|štart)/i);
  clickButton(/select (destination|cieľ)/i);

  await waitFor(() => expect(mockDirectionsRoute).toHaveBeenCalledTimes(1));
  expect(screen.getByTestId('map')).toHaveAttribute(
    'data-has-directions',
    'true'
  );

  clickButton(/clear (start|štart)/i);

  await waitFor(() =>
    expect(screen.getByTestId('map')).toHaveAttribute(
      'data-has-directions',
      'false'
    )
  );
  expect(
    screen.getByText(/enter a distance|zadajte vzdialenosť/i)
  ).toBeInTheDocument();

  clickButton(/select (start|štart)/i);

  await waitFor(() => expect(mockDirectionsRoute).toHaveBeenCalledTimes(2));
  expect(screen.getByTestId('map')).toHaveAttribute(
    'data-has-directions',
    'true'
  );

  clickButton(/clear (destination|cieľ)/i);

  await waitFor(() =>
    expect(screen.getByTestId('map')).toHaveAttribute(
      'data-has-directions',
      'false'
    )
  );
  expect(mockDirectionsRoute).toHaveBeenCalledTimes(2);
  expect(
    screen.getByText(/enter a distance|zadajte vzdialenosť/i)
  ).toBeInTheDocument();
});
