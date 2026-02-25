import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import os

# Explicitné definovanie pracovného priečinka
BASE_DIR = r"C:\Users\pc\Desktop\fuely\fuely-source\public"

url = 'https://www.globalpetrolprices.com/diesel_prices/?currency=EUR'

payload = {
    'literGallon': 'liter',
    'currency': 'EUR'
}

with requests.Session() as s:
    s.post(url, data=payload)
    response = s.get(url)

soup = BeautifulSoup(response.content, 'html.parser')

# Získanie názvov krajín
countries = soup.select('div#outsideLinks div.outsideTitleElement')
country_list = []
for country in countries[:169]:
    country_name = country.get_text(strip=True).replace('*', '')
    country_list.append(country_name)

# Získanie cien paliva (diesel)
divs = soup.select('div#graphPageLeft div[style*="position: absolute"]')
price_list = []
for i, div in enumerate(divs):
    text = div.get_text(strip=True)
    if i % 2 == 0:
        try:
            price = float(text)
            formatted_price = "{:.3f}".format(price)
            price_list.append(formatted_price)
        except ValueError:
            continue
    if len(price_list) >= 169:
        break

# Spojenie krajín a cien do DataFrame
min_length = min(len(country_list), len(price_list))

df = pd.DataFrame({
    'Krajina': country_list[:min_length],
    'Cena v €/l paliva (Diesel)': price_list[:min_length]
})

# Uloženie CSV súboru (Diesel)
csv_path = os.path.join(BASE_DIR, 'diesel_prices.csv')
df.to_csv(csv_path, index=False, sep=',')

print(df)

# LOG
log_path = os.path.join(BASE_DIR, 'log.txt')
with open(log_path, "a") as log_file:
    log_file.write(f"Skript pre diesel bol spusteny: {datetime.now()}\n")
