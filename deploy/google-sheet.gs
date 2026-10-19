// Google Apps Script: Google Sheet sebagai database ucapan & RSVP.
// Pasang: buka Sheet → Extensions → Apps Script → tempel file ini → isi KEY →
// Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
// URL web app + KEY yang sama diisi di .env server (SHEET_URL, SHEET_KEY).
//
// Di Sheet: edit sel untuk mengubah ucapan, centang "Sembunyikan" atau hapus baris
// untuk menghilangkannya dari web (±1 menit). Kolom ID jangan diubah.

const KEY = 'GANTI_DENGAN_KUNCI';
const SHEET_NAME = 'Ucapan';
const HEADERS = ['Waktu', 'Nama', 'Kehadiran', 'Jumlah Tamu', 'Ucapan', 'Sembunyikan', 'ID'];
const LABEL = { hadir: 'Hadir', tidak: 'Tidak Hadir', ragu: 'Masih Ragu' };

function getSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;

  ss.setSpreadsheetTimeZone('Asia/Jakarta');
  sheet = ss.insertSheet(SHEET_NAME);
  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange('C2:C').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(Object.values(LABEL)).build(),
  );
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(5, 420);
  return sheet;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// Teks yang diawali = + - @ akan dianggap rumus oleh Sheets, jadi dipaksa jadi teks biasa
const asText_ = (value) => (/^[=+\-@]/.test(value) ? "'" + value : value);

function toAttendance_(label) {
  const text = String(label).toLowerCase();
  if (text.startsWith('hadir')) return 'hadir';
  if (text.startsWith('tidak')) return 'tidak';
  return 'ragu';
}

// Server membaca semua ucapan
function doGet(e) {
  if (e.parameter.key !== KEY) return json_({ error: 'Kunci salah' });

  const rows = getSheet_().getDataRange().getValues().slice(1);
  const wishes = [];
  rows.forEach((row, i) => {
    const [time, name, attendance, guests, message, hidden, id] = row;
    if (!String(name).trim() || !String(message).trim()) return;
    wishes.push({
      id: String(id || 'baris-' + (i + 2)),
      name: String(name).trim(),
      attendance: toAttendance_(attendance),
      guests: Number(guests) || 0,
      message: String(message).trim(),
      createdAt: time instanceof Date ? time.getTime() : 0,
      hidden: hidden === true,
    });
  });
  return json_({ wishes });
}

// Server menambahkan ucapan baru (ID yang sudah ada dilewati, jadi aman dikirim ulang)
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.key !== KEY) return json_({ error: 'Kunci salah' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet_();
    const last = sheet.getLastRow();
    const existing = new Set(
      last > 1 ? sheet.getRange(2, 7, last - 1, 1).getValues().map((r) => String(r[0])) : [],
    );
    const rows = body.wishes
      .filter((w) => !existing.has(w.id))
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((w) => [
        new Date(w.createdAt),
        asText_(w.name),
        LABEL[w.attendance] || LABEL.ragu,
        w.guests || 0,
        asText_(w.message),
        false,
        w.id,
      ]);

    if (rows.length) {
      const start = sheet.getLastRow() + 1;
      sheet.getRange(start, 1, rows.length, HEADERS.length).setValues(rows);
      sheet.getRange(start, 6, rows.length, 1).insertCheckboxes();
    }
    return json_({ ok: true, added: rows.length });
  } finally {
    lock.releaseLock();
  }
}
