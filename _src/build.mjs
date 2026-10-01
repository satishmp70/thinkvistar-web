// Builds the static Thinkvistar site into the repository root.
//
//   cd _src && npm install && npm run build
//
// 1. Fingerprints CSS/JS into /assets (safe for long-term browser caching).
// 2. Assembles every page from layout.mjs + pages/<name>.html + pages.mjs meta.
// 3. Pre-renders the JavaScript-driven sections with headless Edge/Chrome so the
//    delivered HTML already contains navigation, services, projects, etc.
//    (crawlers and no-JS visitors see the full content; main.js still hydrates).
// 4. Writes sitemap.xml.
//
// Edit content in site-data.json / pages/*.html / pages.mjs — never the generated
// HTML in the root, which is overwritten on every build.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SITE, pages } from './pages.mjs';
import { renderPage } from './layout.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..');
const ASSETS = path.join(ROOT, 'assets');
const prerender = !process.argv.includes('--no-prerender');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const hash = (s) => crypto.createHash('sha256').update(s).digest('base64url').slice(0, 8);

// ---------------------------------------------------------------- assets
const data = JSON.parse(read('site-data.json'));
fs.mkdirSync(ASSETS, { recursive: true });
const produced = new Set();
function emit(base, ext, content) {
  const name = `${base}-${hash(content)}.${ext}`;
  fs.writeFileSync(path.join(ASSETS, name), content);
  produced.add(name);
  return name;
}

const assets = {};
assets.data = emit('data', 'js',
  `const siteData=${JSON.stringify(data)};async function g(){return siteData}export{g,siteData};\n`);
assets.icons = emit('icons', 'js', read('js/icons.js'));
const link = (src) => src
  .replace(/\.\/dataLoader-[\w-]+\.js|\.\/data\.js/g, `./${assets.data}`)
  .replace(/\.\/icons-[\w-]+\.js|\.\/icons\.js/g, `./${assets.icons}`);
for (const n of ['main', 'case-study', 'privacy', 'terms']) assets[n] = emit(n, 'js', link(read(`js/${n}.js`)));
assets.css = emit('site', 'css', read('css/fonts.css') + read('css/site.css') + '\n' + read('css/additions.css') + '\n' + read('css/premium.css'));

for (const f of fs.readdirSync(ASSETS)) {
  if (/\.(js|css)$/.test(f) && !produced.has(f)) fs.unlinkSync(path.join(ASSETS, f));
}

// ---------------------------------------------------------------- pages
const outFile = (p) => path.join(ROOT, p.out);
const LASTMOD_FILE = path.join(SRC, 'lastmod.json');
const lastmod = fs.existsSync(LASTMOD_FILE) ? JSON.parse(fs.readFileSync(LASTMOD_FILE, 'utf8')) : {};
for (const p of pages) {
  const body = p.bodyHtml ? p.bodyHtml(data) : read(`pages/${p.body}`);
  fs.mkdirSync(path.dirname(outFile(p)), { recursive: true });
  const html = renderPage(p, body, { assets, data });
  fs.writeFileSync(outFile(p), html);
  // Track real content changes for sitemap <lastmod>: hash the page without the
  // fingerprinted asset names, and only move the date when that hash changes.
  const h = hash(html.replace(/\/assets\/[\w.-]+/g, ''));
  if (lastmod[p.path]?.hash !== h) lastmod[p.path] = { hash: h, date: new Date().toISOString().slice(0, 10) };
}
fs.writeFileSync(LASTMOD_FILE, JSON.stringify(lastmod, null, 1) + '\n');
console.log(`Wrote ${pages.length} pages`);

// ---------------------------------------------------------------- prerender
if (prerender) {
  const { default: puppeteer } = await import('puppeteer-core');
  const browserPath = [
    process.env.CHROME_PATH,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].find((p) => p && fs.existsSync(p));
  if (!browserPath) throw new Error('No Chrome/Edge found. Set CHROME_PATH or run with --no-prerender.');

  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.json': 'application/json' };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
  try {
    for (const p of pages.filter((p) => p.prerender !== false)) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(base + p.path, { waitUntil: 'networkidle0' });
      const bodyHtml = await page.evaluate(() => {
        // Reset runtime-only state so the snapshot equals the initial render.
        document.querySelectorAll('.reveal.active').forEach((el) => el.classList.remove('active'));
        document.querySelector('.site-header')?.classList.remove('scrolled');
        document.body.classList.remove('no-scroll');
        return document.body.innerHTML;
      });
      if (errors.length) throw new Error(`${p.path}: ${errors.join('; ')}`);
      const html = fs.readFileSync(outFile(p), 'utf8');
      const start = html.indexOf('<body>') + 6, end = html.lastIndexOf('</body>');
      fs.writeFileSync(outFile(p), html.slice(0, start) + '\n' + bodyHtml.trim() + '\n' + html.slice(end));
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log('Pre-rendered pages');
}

// ---------------------------------------------------------------- sitemap
const urls = pages.filter((p) => p.sitemap).map((p) =>
  `  <url><loc>${SITE.origin}${p.path}</loc><lastmod>${lastmod[p.path].date}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`sitemap.xml: ${urls.length} URLs`);
