const DEFAULT_RATING_WEBHOOK_URLS = [
  'https://script.google.com/macros/s/AKfycbzHNRvqen4b1-DpRTS11JfMYFAEtaXestfTjWKJwwLhsYQ0QGF472ZzXWV6sSxDl6BG/exec',
  'https://script.google.com/macros/s/AKfycbzuDdNQarLlpxh5w5H2RZbiOdzw5zEhXTCt2ffOROC_EoxOy4B2FDctCa3GM8_HUsVJKg/exec',
];

const MAX_COMMENT_LENGTH = 1200;
const REQUEST_TIMEOUT_MS = 10000;

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function getRatingWebhookUrls() {
  const configured =
    process.env.RATING_APPS_SCRIPT_URLS ||
    process.env.RATING_APPS_SCRIPT_URL ||
    '';
  const urls = configured
    .split(/[\s,]+/)
    .map((url) => url.trim())
    .filter(Boolean);

  return [...new Set(urls.length > 0 ? urls : DEFAULT_RATING_WEBHOOK_URLS)];
}

function normalizeText(value, maxLength = MAX_COMMENT_LENGTH) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeRatingPayload(body, req) {
  const rating = Number(body?.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const error = new Error('Rating must be an integer from 1 to 5.');
    error.statusCode = 400;
    throw error;
  }

  return {
    rating,
    comment: normalizeText(body.comment),
    date: body.date || new Date().toISOString(),
    device: normalizeText(body.device, 30),
    isReturningUser: Boolean(body.isReturningUser),
    locale: normalizeText(body.locale, 40),
    firstVisitDate: normalizeText(body.firstVisitDate, 80),
    page: normalizeText(body.page, 250),
    source: 'fuely-rating-popup',
    userAgent: normalizeText(req.headers['user-agent'], 300),
  };
}

async function readRequestBody(req) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

async function postToWebhook(url, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });
    const text = await response.text();
    const preview = text.slice(0, 250);

    if (!response.ok) {
      const error = new Error(`Webhook returned HTTP ${response.status}`);
      error.statusCode = response.status;
      error.responsePreview = preview;
      throw error;
    }

    if ((response.headers.get('content-type') || '').includes('application/json')) {
      try {
        const data = JSON.parse(text);
        if (data?.ok === false || data?.success === false) {
          const error = new Error(data.error || 'Webhook rejected the rating.');
          error.statusCode = 502;
          error.responsePreview = preview;
          throw error;
        }
      } catch (parseError) {
        if (parseError.statusCode) throw parseError;
      }
    }

    return {
      status: response.status,
      responsePreview: preview,
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, {
      ok: false,
      error: 'METHOD_NOT_ALLOWED',
    });
  }

  let payload;

  try {
    const body = await readRequestBody(req);
    payload = normalizeRatingPayload(body, req);
  } catch (error) {
    return sendJson(res, error.statusCode || 400, {
      ok: false,
      error: 'INVALID_RATING_PAYLOAD',
      message: error.message,
    });
  }

  const webhookUrls = getRatingWebhookUrls();
  const failures = [];

  for (const url of webhookUrls) {
    try {
      const result = await postToWebhook(url, payload);
      return sendJson(res, 200, {
        ok: true,
        destination: 'google-sheets',
        status: result.status,
      });
    } catch (error) {
      failures.push({
        urlHost: (() => {
          try {
            return new URL(url).host;
          } catch (_) {
            return 'invalid-url';
          }
        })(),
        status: error.statusCode || 0,
        message: error.message,
      });
      console.error('Rating webhook failed:', {
        status: error.statusCode,
        message: error.message,
        responsePreview: error.responsePreview,
      });
    }
  }

  return sendJson(res, 502, {
    ok: false,
    error: 'RATING_WEBHOOK_FAILED',
    message:
      'Rating could not be delivered to Google Sheets. Check Apps Script deployment access.',
    failures,
  });
};
