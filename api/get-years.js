// pages/api/get-years.js
import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(_req, res) {
  const { data, error } = await sb.from('distinct_years').select('year');
  if (error) return res.status(500).json({ error: error.message });
  res.json(['Without year', ...data.map(r => r.year)]);
}
