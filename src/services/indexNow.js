// src/services/indexNow.js

// Notifikácia pre jednu URL (GET požiadavka)
export async function notifyIndexNowSingle(changedUrl) {
    const key = 'ae5b6d134baf45379a94f378e3a29508'; // Váš kľúč
    const endpoint = `https://www.bing.com/indexnow?url=${encodeURIComponent(changedUrl)}&key=${key}`;
  
    try {
      // Dôležitý je parameter mode: 'no-cors'
      const response = await fetch(endpoint, { mode: 'no-cors' });
      console.log('Odoslané s no-cors. Odpoveď (opaque):', response);
    } catch (error) {
      console.error('IndexNow – výnimka:', error);
    }
  }
  
  // Notifikácia pre viacero URL (POST JSON požiadavka)
  export async function notifyIndexNowBatch(urls) {
    const host = 'www.vasadomena.sk'; // Nahraďte svojou doménou
    const key = 'ae5b6d134baf45379a94f378e3a29508';
  
    const payload = {
      host,
      key,
      urlList: urls, // Pole URL, ktoré chcete odoslať
    };
  
    try {
      const response = await fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        console.log('IndexNow (batch) – odoslané URL:', urls);
      } else {
        console.error('IndexNow (batch) – chyba:', response.status, await response.text());
      }
    } catch (error) {
      console.error('IndexNow (batch) – výnimka:', error);
    }
  }
  