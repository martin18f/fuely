const INDEX_NOW_HOST = 'fuely.martinsulak.dev';
const INDEX_NOW_KEY = 'ae5b6d134baf45379a94f378e3a29508';
const INDEX_NOW_ENDPOINT = 'https://www.bing.com/indexnow';

const normalizeFuelyUrl = (url) => {
  const parsedUrl = new URL(url, `https://${INDEX_NOW_HOST}`);

  if (parsedUrl.hostname !== INDEX_NOW_HOST) {
    throw new Error(`IndexNow URL must belong to ${INDEX_NOW_HOST}`);
  }

  return parsedUrl.toString();
};

export async function notifyIndexNowSingle(changedUrl) {
  const url = normalizeFuelyUrl(changedUrl);
  const endpoint = `${INDEX_NOW_ENDPOINT}?url=${encodeURIComponent(url)}&key=${INDEX_NOW_KEY}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`IndexNow request failed with HTTP ${response.status}`);
  }

  return response;
}

export async function notifyIndexNowBatch(urls) {
  const payload = {
    host: INDEX_NOW_HOST,
    key: INDEX_NOW_KEY,
    keyLocation: `https://${INDEX_NOW_HOST}/${INDEX_NOW_KEY}.txt`,
    urlList: urls.map(normalizeFuelyUrl),
  };

  const response = await fetch(INDEX_NOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`IndexNow batch request failed with HTTP ${response.status}`);
  }

  return response;
}
