import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // 1) Načítame hodnoty z env premenných
    //    Ak ste ich nazvali NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY,
    //    budú takto dostupné:
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    //    (Ak máte iné názvy, upravte)

    // 2) Vytvoríme Supabase klienta
    //    Uistite sa, že ste do dependencies pridali "@supabase/supabase-js"
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3) SELECT z vašej tabuľky "fuel_prices"
    const { data, error } = await supabase
      .from('fuel_prices')
      .select('*');

    if (error) {
      // ak je error, vyvoláme 500
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: error.message });
    }

    // 4) Vrátime JSON
    //    data by malo byť pole objektov: [ {country, diesel_price, gasoline_price}, ...]
    res.status(200).json(data);

  } catch (err) {
    // ak spadne createClient alebo iné
    console.error('GET-FUEL-PRICES unexpected error:', err);
    res.status(500).json({ error: err.message });
  }
}
