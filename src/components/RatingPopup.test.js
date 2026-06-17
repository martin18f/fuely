import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '../i18n';
import RatingPopup from './RatingPopup';

let consoleErrorSpy;

const showPopup = () => {
  act(() => {
    jest.advanceTimersByTime(1300);
  });
};

const flushPromises = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  window.localStorage.clear();
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ ok: true }),
  });
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  jest.useRealTimers();
  jest.clearAllMocks();
  window.localStorage.clear();
});

test('submits ratings through the Fuely API endpoint', async () => {
  render(<RatingPopup />);
  showPopup();

  fireEvent.click(screen.getByRole('radio', { name: /5/i }));
  fireEvent.click(
    screen.getByRole('button', { name: /submit|odoslať/i })
  );
  await flushPromises();

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/submit-rating',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  );
  expect(window.localStorage.getItem('lastRated')).toEqual(expect.any(String));
});

test('keeps the popup retryable when rating submission fails', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 502,
    json: jest.fn().mockResolvedValue({
      ok: false,
      message: 'Google Apps Script is not public',
    }),
  });

  render(<RatingPopup />);
  showPopup();

  fireEvent.click(screen.getByRole('radio', { name: /4/i }));
  fireEvent.click(
    screen.getByRole('button', { name: /submit|odoslať/i })
  );
  await flushPromises();

  expect(screen.getByRole('alert')).toHaveTextContent(
    /could not be submitted|nepodarilo odoslať/i
  );
  expect(window.localStorage.getItem('lastRated')).toBeNull();
});
