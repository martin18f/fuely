import { getFuelPrices } from './fuelPricesService';

afterEach(() => {
  jest.restoreAllMocks();
});

test('falls back to bundled CSV files when the local API returns HTML', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'text/html' },
    })
    .mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(
          'Krajina,Cena v €/l paliva (Benzín)\nSlovakia,1.55'
        ),
    })
    .mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(
          'Krajina,Cena v €/l paliva (Diesel)\nSlovakia,1.49'
        ),
    });

  await expect(getFuelPrices()).resolves.toEqual([
    {
      country: 'Slovakia',
      gasoline_price: 1.55,
      diesel_price: 1.49,
    },
  ]);
});
