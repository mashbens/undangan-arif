// Server undangan: menyajikan hasil build (dist/) + API ucapan & RSVP.
// Tanpa dependency. Data disimpan di DATA_DIR/wishes.json.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.env.DATA_DIR || './data');
const STATIC_DIR = process.env.STATIC_DIR ? path.resolve(process.env.STATIC_DIR) : null;
const DATA_FILE = path.join(DATA_DIR, 'wishes.json');

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
const wishes = loadWishes();
const lastPostByIp = new Map();

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
const publicWish = ({ id, name, attendance, message, createdAt }) => ({ id, name, attendance, message, createdAt });

// ---------- API ----------

async function handleApi(req, res, pathname) {
  if (pathname === '/api/health') return sendJson(res, 200, { ok: true });

  if (pathname !== '/api/wishes') return sendJson(res, 404, { error: 'Tidak ditemukan' });

  if (req.method === 'GET') return sendJson(res, 200, wishes.map(publicWish));

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
  wishes.unshift(wish);
  saveWishes();
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
});

// Penulisan data sinkron, jadi aman langsung keluar
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => process.exit(0));
