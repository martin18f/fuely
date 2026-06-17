const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support');
const tough = require('tough-cookie');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const getSupabaseClient = () => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable'
    );
  }

  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
};

// Presne replikuje logiku Python requests session (cookies)
async function scrapePrices(url) {
  const jar = new tough.CookieJar();
  const session = wrapper(axios.create({ jar }));

  // Presne ako tvoj Python skript, najskôr POST (nastaví EUR/liter)
  await session.post(url, new URLSearchParams({
    literGallon: 'liter',
    currency: 'EUR'
  }));

  // Potom GET už s uloženými cookies (menu EUR, liter)
  const response = await session.get(url);
  const $ = cheerio.load(response.data);

  // Získanie krajín (tvoja pôvodná logika)
  const countries = [];
  $('div#outsideLinks div.outsideTitleElement').each((_, el) => {
    if (countries.length < 169) {
      countries.push($(el).text().replace('*', '').trim());
    }
  });

  // Získanie cien (tvoja pôvodná logika)
  const priceElements = $('div#graphPageLeft div[style*="position: absolute"]');
  const prices = [];
  priceElements.each((i, el) => {
    if (i % 2 === 0 && prices.length < 169) {
      const text = $(el).text().trim().replace(',', '.');
      const price = parseFloat(text);
      if (!isNaN(price)) {
        prices.push(parseFloat(price.toFixed(3)));
      }
    }
  });

  // Spojenie krajín a cien
  return countries.map((country, index) => ({
    country,
    price: prices[index] || null
  }));
}

module.exports = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const dieselUrl = 'https://www.globalpetrolprices.com/diesel_prices/?currency=EUR';
    const gasolineUrl = 'https://www.globalpetrolprices.com/gasoline_prices/?currency=EUR';

    const dieselData = await scrapePrices(dieselUrl);
    const gasolineData = await scrapePrices(gasolineUrl);

    const combinedData = {};
    dieselData.forEach(({ country, price }) => {
      combinedData[country] = { country, diesel_price: price };
    });

    gasolineData.forEach(({ country, price }) => {
      if (!combinedData[country]) {
        combinedData[country] = { country };
      }
      combinedData[country].gasoline_price = price;
    });

    const rowsToUpsert = Object.values(combinedData);

    const { data, error } = await supabase
      .from('fuel_prices')
      .upsert(rowsToUpsert, { onConflict: 'country' });

    if (error) throw error;

    const updatedCount = data ? data.length : rowsToUpsert.length;

    res.status(200).json({ message: 'Cron job dokončený', updatedCount });

  } catch (error) {
    console.error('❌ Chyba:', error);
    res.status(500).json({ error: error.message });
  }
};
