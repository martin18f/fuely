// GET /api/get-cars-by-year?year=2015&from=0&to=999
// vracia max 1000 riadkov pre daný rok (stránkovanie)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { year, from = '0', to = '999' } = req.query;
  if (!year) return res.status(400).json({ error: 'Missing year' });

  const start = parseInt(from, 10);
  const end   = parseInt(to,   10);

  const { data, error } = await supabase
    .from('tabulka_vozidiel')
    .select('*')
    .eq('year', year)
    .order('Brand', { ascending: true })
    .range(start, end);               // ⬅️ Supabase stránkovanie

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);                     // pole max 1000 riadkov
}
