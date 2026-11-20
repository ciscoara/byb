/**
 * Believe Your Beauty: landing page sign-ups -> this Google Sheet.
 * Paste into Extensions > Apps Script of the sheet, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone). Copy the /exec URL into assets/js/config.js.
 */
var SHEET_NAME = 'Signups';
var HEADERS = ['Signed up', 'Email', 'Source', 'Page', 'Referrer'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    var email = String(p.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return json_({ ok: false, error: 'invalid_email' });
    }
    var sheet = getSheet_();
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0]).toLowerCase() === email) return json_({ ok: true, duplicate: true });
      }
    }
    sheet.appendRow([new Date(), email, clean_(p.source), clean_(p.page), clean_(p.referrer)]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'byb-signups' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Keep values short and stop spreadsheet formula injection (=, +, -, @).
function clean_(v) {
  v = String(v || '').slice(0, 500);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
