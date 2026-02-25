// GET /api/get-car-data               (vráti iba small + EV)
// používa sa raz pri štarte stránky
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(_req, res) {
  try {
    const [small, ev] = await Promise.all([
      supabase.from('cars_data_cleaned').select('*'),
      supabase.from('ev_dataset').select('*')
    ]);

    if (small.error) throw small.error;
    if (ev.error)    throw ev.error;

    res.json({
      cars_data_cleaned: small.data,   // ~1 500 riadkov
      ev_dataset       : ev.data       // pár stoviek
    });
  } catch (e) {
    console.error('get-car-data error:', e);
    res.status(500).json({ error: e.message });
  }
}
