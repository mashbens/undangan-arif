// Server undangan: menyajikan hasil build (dist/) + API ucapan & RSVP.
// Tanpa dependency. Data disimpan di DATA_DIR/wishes.json.
// Kalau SHEET_URL & SHEET_KEY diisi, Google Sheet jadi database utama (lihat deploy/google-sheet.gs)
// dan wishes.json hanya cadangan untuk saat Google tidak bisa dihubungi.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.env.DATA_DIR || './data');
const STATIC_DIR = process.env.STATIC_DIR ? path.resolve(process.env.STATIC_DIR) : null;
const DATA_FILE = path.join(DATA_DIR, 'wishes.json');
const IMPORTED_FLAG = path.join(DATA_DIR, 'sheet-imported');
const SHEET_URL = process.env.SHEET_URL || '';
const SHEET_KEY = process.env.SHEET_KEY || '';
const SHEET_REFRESH_MS = 60_000; // baca ulang Sheet paling sering 1x per menit, hanya jika ada pengunjung

const ATTENDANCE = ['hadir', 'tidak', 'ragu'];
const MAX_NAME = 60;
const MAX_MESSAGE = 500;
const MAX_BODY = 10 * 1024;
const RATE_LIMIT_MS = 15_000; // jeda minimal antar kiriman dari IP yang sama

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

// ---------- penyimpanan ----------

function loadWishes() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!Array.isArray(data)) throw new Error('isi file bukan array');
    return data;
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    // Jangan lanjut dengan data kosong: bisa menimpa file yang rusak.
    console.error(`Gagal membaca ${DATA_FILE}: ${err.message}`);
    process.exit(1);
  }
}

function saveWishes() {
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(wishes, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

fs.mkdirSync(DATA_DIR, { recursive: true });
let wishes = loadWishes();
const lastPostByIp = new Map();

// ---------- sinkron Google Sheet ----------
// Ucapan baru diberi tanda `pending` sampai berhasil masuk Sheet, supaya tidak hilang
// kalau Google sedang error atau server restart.

let lastSync = 0;
let syncing = null;
let pushing = null;

async function sheetFetch(options = {}) {
  const url = options.method === 'POST' ? SHEET_URL : `${SHEET_URL}?key=${encodeURIComponent(SHEET_KEY)}`;
  const res = await fetch(url, { ...options, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function pushPending() {
  if (pushing) return pushing;
  const batch = wishes.filter((w) => w.pending);
  if (!batch.length) return Promise.resolve();
  pushing = sheetFetch({
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ key: SHEET_KEY, wishes: batch.map(({ pending, ...w }) => w) }),
  })
    .then(() => {
      for (const w of batch) delete w.pending;
      saveWishes();
    })
    .catch((err) => console.error(`Gagal kirim ke Sheet (dicoba lagi nanti): ${err.message}`))
    .finally(() => {
      pushing = null;
    });
  return pushing;
}

function syncFromSheet() {
  if (syncing) return syncing;
  const startedAt = Date.now();
  syncing = (async () => {
    await pushPending();
    const { wishes: fromSheet } = await sheetFetch();
    // Ucapan yang belum masuk Sheet, atau masuk saat Sheet sedang dibaca, tetap dipertahankan
    const ids = new Set(fromSheet.map((w) => w.id));
    const local = wishes.filter((w) => !ids.has(w.id) && (w.pending || w.createdAt >= startedAt));
    wishes = [...local, ...fromSheet].sort((a, b) => b.createdAt - a.createdAt);
    saveWishes();
    lastSync = Date.now();
  })()
    .catch((err) => console.error(`Gagal baca Sheet, pakai data terakhir: ${err.message}`))
    .finally(() => {
      syncing = null;
    });
  return syncing;
}

if (SHEET_URL) {
  // Pertama kali Sheet dipasang: pindahkan semua ucapan lama ke Sheet
  if (!fs.existsSync(IMPORTED_FLAG)) {
    for (const w of wishes) w.pending = true;
    saveWishes();
    fs.writeFileSync(IMPORTED_FLAG, new Date().toISOString());
  }
  syncFromSheet();
}

// ---------- helper ----------

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Data terlalu besar'), { status: 413 }));
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(Object.assign(new Error('JSON tidak valid'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const isVisible = (w) => !w.hidden;
const publicWish = ({ id, name, attendance, message, createdAt }) => ({ id, name, attendance, message, createdAt });

// ---------- API ----------

async function handleApi(req, res, pathname) {
  if (pathname === '/api/health') return sendJson(res, 200, { ok: true });

  if (pathname !== '/api/wishes') return sendJson(res, 404, { error: 'Tidak ditemukan' });

  if (req.method === 'GET') {
    // Jawab dari memori; Sheet dibaca ulang di belakang layar kalau data sudah lewat 1 menit
    if (SHEET_URL && Date.now() - lastSync > SHEET_REFRESH_MS) syncFromSheet();
    return sendJson(res, 200, wishes.filter(isVisible).map(publicWish));
  }

  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method tidak didukung' });

  const ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
  const now = Date.now();
  if (now - (lastPostByIp.get(ip) || 0) < RATE_LIMIT_MS) {
    return sendJson(res, 429, { error: 'Tunggu sebentar sebelum mengirim lagi.' });
  }

  const body = await readJsonBody(req);
  const name = clean(body.name, MAX_NAME);
  const message = clean(body.message, MAX_MESSAGE);
  const attendance = ATTENDANCE.includes(body.attendance) ? body.attendance : 'ragu';
  const guests = attendance === 'hadir' ? Math.min(Math.max(parseInt(body.guests, 10) || 1, 1), 10) : 0;

  if (!name || !message) return sendJson(res, 400, { error: 'Nama dan ucapan wajib diisi.' });

  const wish = { id: `${now}-${Math.random().toString(36).slice(2, 8)}`, name, attendance, guests, message, createdAt: now };
  if (SHEET_URL) wish.pending = true;
  wishes.unshift(wish);
  saveWishes();
  if (SHEET_URL) pushPending();
  lastPostByIp.set(ip, now);
  if (lastPostByIp.size > 5000) lastPostByIp.clear();

  sendJson(res, 201, publicWish(wish));
}

// ---------- file statis ----------

function serveStatic(req, res, pathname) {
  if (!STATIC_DIR) return sendJson(res, 404, { error: 'Tidak ditemukan' });

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return sendJson(res, 400, { error: 'URL tidak valid' });
  }
  let filePath = path.join(STATIC_DIR, path.normalize(decoded));
  if (!filePath.startsWith(STATIC_DIR)) return sendJson(res, 403, { error: 'Dilarang' });

  let stat = fs.statSync(filePath, { throwIfNoEntry: false });
  if (stat?.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
    stat = fs.statSync(filePath, { throwIfNoEntry: false });
  }
  if (!stat) {
    // Asset yang hilang -> 404; path lain -> halaman utama
    if (pathname.startsWith('/assets/')) return sendJson(res, 404, { error: 'Tidak ditemukan' });
    filePath = path.join(STATIC_DIR, 'index.html');
    stat = fs.statSync(filePath);
  }

  res.writeHead(200, {
    'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(filePath).pipe(res);
}

// ---------- server ----------

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  try {
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname);
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { error: 'Method tidak didukung' });
    serveStatic(req, res, pathname);
  } catch (err) {
    if (!err.status) console.error(err);
    if (!res.headersSent) sendJson(res, err.status || 500, { error: err.status ? err.message : 'Terjadi kesalahan server' });
  }
});

server.listen(PORT, () => {
  console.log(`Undangan jalan di http://localhost:${PORT} — ${wishes.length} ucapan tersimpan di ${DATA_FILE}`);
  console.log(SHEET_URL ? 'Database: Google Sheet (wishes.json sebagai cadangan)' : 'Database: wishes.json');
});

// Penulisan data sinkron, jadi aman langsung keluar
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(0));
