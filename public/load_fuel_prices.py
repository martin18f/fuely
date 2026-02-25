#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import math
from supabase import create_client, Client
from tqdm import tqdm

# -- KONFIGURÁCIA SÚBOROV ----------------------
DIESEL_CSV = "diesel_prices.csv"
GASOLINE_CSV = "gasoline_prices.csv"

# -- SEM VKLADÁME VAŠE HODNOTY -----------------
SUPABASE_URL = "https://cyjauhagjcjrhjpgekgp.supabase.co"

# Toto vyzerá ako anonymný (public) key:
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5amF1aGFnamNqcmhqcGdla2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MDY3MDksImV4cCI6MjA1MTQ4MjcwOX0.y0S58TUsuyCMEq76PvrWLdI7bD6PAAppBGGXWcBMR7w"

# Toto vyzerá ako service_role key:
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5amF1aGFnamNqcmhqcGdla2dwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTkwNjcwOSwiZXhwIjoyMDUxNDgyNzA5fQ.0iHXWKGoH88QEeE39Y-ltLxnPF9W-ootRtiYdOdlqxs"

# Toto vyzerá ako JWT SECRET (ak by ste ho potrebovali):
JWT_SECRET = "uKDU9GIB+UWVxlh8Lv6qbDncoWsJ+uekpmlYsmfUC26b7oey/xHsFXw7cN9TtFQzyjfT1qLr7ytBjsuiSxgjeg=="

# -- ČI BUDETE POUŽÍVAŤ SERVICE_KEY ALEBO ANON_KEY? --
# Pre upsert (zápis) je vhodné použiť service_role key
# => Zvolím service role key:
SUPABASE_KEY = SERVICE_ROLE_KEY

# -- NASTAVENIA UPLOADU ------------------------
UPSERT_CHUNK_SIZE = 50  # Koľko riadkov naraz

def get_supabase_client() -> Client:
    """
    Vytvorí Supabase klienta pomocou URL + key (service role).
    """
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def load_csv_into_dict(file_path: str, is_diesel: bool) -> dict:
    data = {}
    print(f"Načítavam CSV: {file_path} (diesel={is_diesel})")

    import os
    if not os.path.exists(file_path):
        print(f"  [VAROVANIE] CSV súbor '{file_path}' neexistuje.")
        return data

    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        row_count = 0
        for row in reader:
            row_count += 1
            country = row.get("Krajina", "").strip()
            if not country:
                continue

            if is_diesel:
                price_str = row.get("Cena v €/l paliva (Diesel)", "").strip()
                col_key = "diesel"
            else:
                price_str = row.get("Cena v €/l paliva (Benzín)", "").strip()
                col_key = "gasoline"

            if not price_str:
                continue

            try:
                price_val = float(price_str)
            except ValueError:
                price_val = None

            if country not in data:
                data[country] = {}

            data[country][col_key] = price_val

        print(f"  → Načítaných riadkov: {row_count}. Krajín s hodnotou: {len(data)}.")
    return data

def combine_diesel_gasoline(diesel_data: dict, gasoline_data: dict) -> dict:
    combined = {}
    # Diesel
    for country, vals in diesel_data.items():
        if country not in combined:
            combined[country] = {}
        combined[country].update(vals)
    # Benzín
    for country, vals in gasoline_data.items():
        if country not in combined:
            combined[country] = {}
        combined[country].update(vals)
    return combined

def chunker(seq, size):
    for pos in range(0, len(seq), size):
        yield seq[pos:pos + size]

def main():
    diesel_data = load_csv_into_dict(DIESEL_CSV, is_diesel=True)
    gasoline_data = load_csv_into_dict(GASOLINE_CSV, is_diesel=False)

    print("Spájam diesel a benzín do jedného datasetu...")
    combined = combine_diesel_gasoline(diesel_data, gasoline_data)
    print(f"  → Výsledný počet krajín: {len(combined)}")

    rows_to_upsert = []
    for country, vals in combined.items():
        diesel_price = vals.get("diesel")
        gasoline_price = vals.get("gasoline")
        if diesel_price is None and gasoline_price is None:
            continue
        rows_to_upsert.append({
            "country": country,
            "diesel_price": diesel_price,
            "gasoline_price": gasoline_price
        })

    if not rows_to_upsert:
        print("Žiadne dáta na upsert, končím.")
        return

    print(f"Idem upsertovať {len(rows_to_upsert)} riadkov do tabuľky 'fuel_prices'.")
    supabase = get_supabase_client()

    chunks = list(chunker(rows_to_upsert, UPSERT_CHUNK_SIZE))
    total_chunks = len(chunks)
    print(f"Rozdeľujem do {total_chunks} balíkov (chunkov), každý max {UPSERT_CHUNK_SIZE} riadkov.")

    for i, chunk_data in enumerate(tqdm(chunks, desc="Upserting", unit="chunk"), start=1):
        result = supabase.table("fuel_prices") \
                         .upsert(chunk_data, on_conflict="country") \
                         .execute()

        # Nový prístup: result.status, result.data
        if result.status not in (200, 201):
            print(f"  [CHUNK {i}/{total_chunks}] → Chyba pri upserte (HTTP {result.status}): {result.data}")
        else:
            upserted_count = len(result.data or [])
            print(f"  [CHUNK {i}/{total_chunks}] OK. {upserted_count} riadkov upsertnutých.")

    print("Hotovo! Palivové údaje by mali byť v Supabase.")

if __name__ == "__main__":
    main()
