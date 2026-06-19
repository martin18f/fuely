import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../i18n';
import SearchBar from './SearchBar';

test('loads and selects a place using Places API New', async () => {
  const onLocationSelect = jest.fn();
  const fetchFields = jest.fn().mockResolvedValue(undefined);
  const placePrediction = {
    placeId: 'bratislava',
    text: { toString: () => 'Bratislava, Slovakia' },
    toPlace: () => ({
      displayName: 'Bratislava',
      formattedAddress: 'Bratislava, Slovakia',
      location: {
        lat: () => 48.1486,
        lng: () => 17.1077,
      },
      fetchFields,
    }),
  };
  const fetchAutocompleteSuggestions = jest.fn().mockResolvedValue({
    suggestions: [{ placePrediction }],
  });

  window.google = {
    maps: {
      importLibrary: jest.fn().mockResolvedValue({
        AutocompleteSessionToken: class AutocompleteSessionToken {},
        AutocompleteSuggestion: { fetchAutocompleteSuggestions },
      }),
    },
  };

  render(
    <SearchBar
      defaultValue=""
      isGoogleLoaded
      onLocationSelect={onLocationSelect}
      placeholder="Start"
    />
  );

  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'Bratislava' },
  });

  await screen.findByRole(
    'option',
    { name: 'Bratislava, Slovakia' },
    { timeout: 1500 }
  );
  fireEvent.click(screen.getByRole('option'));

  await waitFor(() => {
    expect(fetchFields).toHaveBeenCalledWith({
      fields: ['displayName', 'formattedAddress', 'location'],
    });
    expect(onLocationSelect).toHaveBeenCalledWith({
      address: 'Bratislava, Slovakia',
      position: {
        lat: 48.1486,
        lng: 17.1077,
      },
    });
  });
});

test('initializes autocomplete when Places becomes available after first render', async () => {
  const prediction = {
    place_id: 'kosice',
    description: 'Kosice, Slovakia',
  };
  const getPlacePredictions = jest.fn((request, callback) => {
    callback([prediction], 'OK');
  });
  const geocode = jest.fn((request, callback) => {
    callback(
      [
        {
          formatted_address: 'Kosice, Slovakia',
          geometry: {
            location: {
              lat: () => 48.7164,
              lng: () => 21.2611,
            },
          },
        },
      ],
      'OK'
    );
  });

  window.google = { maps: {} };

  render(
    <SearchBar
      defaultValue=""
      isGoogleLoaded
      onLocationSelect={jest.fn()}
      placeholder="Start"
    />
  );

  await act(async () => {
    window.google.maps.places = {
      AutocompleteService: class AutocompleteService {
        getPlacePredictions(...args) {
          return getPlacePredictions(...args);
        }
      },
    };
    window.google.maps.Geocoder = class Geocoder {
      geocode(...args) {
        return geocode(...args);
      }
    };
    await new Promise((resolve) => setTimeout(resolve, 150));
  });

  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'Kosice' },
  });

  expect(
    await screen.findByRole('option', { name: 'Kosice, Slovakia' })
  ).toBeInTheDocument();
  expect(getPlacePredictions).toHaveBeenCalled();
});

test('clears the selected location when the user edits the selected text', () => {
  const onLocationSelect = jest.fn();
  const { rerender } = render(
    <SearchBar
      defaultValue="Bratislava, Slovakia"
      isGoogleLoaded={false}
      onLocationSelect={onLocationSelect}
      placeholder="Start"
    />
  );
  const input = screen.getByRole('combobox');

  fireEvent.change(input, {
    target: { value: 'Bratislava main station' },
  });

  expect(onLocationSelect).toHaveBeenCalledWith(null);
  expect(input).toHaveValue('Bratislava main station');

  rerender(
    <SearchBar
      defaultValue=""
      isGoogleLoaded={false}
      onLocationSelect={onLocationSelect}
      placeholder="Start"
    />
  );

  expect(input).toHaveValue('Bratislava main station');
});
