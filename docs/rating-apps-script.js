const SHEET_NAME = 'cheatsheet';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const rating = Number(payload.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return jsonResponse({
        ok: false,
        error: 'Invalid rating',
      });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'date',
        'rating',
        'comment',
        'device',
        'locale',
        'isReturningUser',
        'firstVisitDate',
        'page',
        'source',
        'userAgent',
      ]);
    }

    sheet.appendRow([
      payload.date || new Date().toISOString(),
      rating,
      payload.comment || '',
      payload.device || '',
      payload.locale || '',
      Boolean(payload.isReturningUser),
      payload.firstVisitDate || '',
      payload.page || '',
      payload.source || 'fuely-rating-popup',
      payload.userAgent || '',
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message,
    });
  }
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: 'fuely-rating-webhook',
  });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
