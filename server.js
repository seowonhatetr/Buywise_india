'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const PRODUCTS_FILE = path.join(ROOT, 'data', 'products.json');
const STATIC_TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.md': 'text/markdown; charset=utf-8' };

function readProducts() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  if (!Array.isArray(data)) throw new Error('Product catalogue must be an array');
  return data;
}
function normalise(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function scoreProduct(product, query) {
  if (!query) return 0;
  const terms = normalise(query).split(/[^a-z0-9]+/).filter(Boolean);
  const name = normalise(product.name);
  const brand = normalise(product.brand);
  const haystack = normalise([product.name, product.brand, product.type, product.description, product.tags, ...(product.specs || [])].join(' '));
  let score = 0;
  for (const term of terms) {
    if (name === term) score += 12;
    else if (name.startsWith(term)) score += 7;
    else if (name.includes(term)) score += 5;
    else if (brand.includes(term)) score += 4;
    else if (haystack.includes(term)) score += 2;
    else return 0;
  }
  return score;
}
function findProducts(params) {
  const query = params.get('query') || '';
  const category = params.get('category') || 'all';
  const type = params.get('type') || 'all';
  const sort = params.get('sort') || 'relevance';
  let products = readProducts().filter(p => (category === 'all' || p.category === category) && (type === 'all' || p.type === type));
  if (query.trim()) products = products.map(p => ({ ...p, _score: scoreProduct(p, query) })).filter(p => p._score > 0);
  if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') products.sort((a, b) => b.price - a.price);
  else if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
  else if (query.trim()) products.sort((a, b) => b._score - a._score || a.price - b.price);
  else products.sort((a, b) => a.category.localeCompare(b.category) || a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
  return products.map(({ _score, ...p }) => p);
}
function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(payload);
}
function serveStatic(req, res, pathname) {
  let target = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const filePath = path.resolve(ROOT, '.' + target);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== path.join(ROOT, 'index.html')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Forbidden'); return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); return; }
    const type = STATIC_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { status: 'ok', service: 'buywise-api', timestamp: new Date().toISOString() });
  }
  if (req.method === 'GET' && url.pathname === '/api/products') {
    try { return sendJson(res, 200, findProducts(url.searchParams)); }
    catch (err) { console.error('Catalogue error:', err); return sendJson(res, 500, { error: 'Could not load the product catalogue.' }); }
  }
  const productMatch = url.pathname.match(/^\/api\/products\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'GET' && productMatch) {
    try {
      const product = readProducts().find(p => p.id === productMatch[1]);
      return product ? sendJson(res, 200, product) : sendJson(res, 404, { error: 'Product not found.' });
    } catch (err) { console.error('Product lookup error:', err); return sendJson(res, 500, { error: 'Could not load the product.' }); }
  }
  if (url.pathname.startsWith('/api/')) return sendJson(res, 404, { error: 'API endpoint not found.' });
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Method not allowed'); }
  return serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => console.log(`BuyWise India running at http://localhost:${PORT}`));
