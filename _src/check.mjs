// Local QA: serves the built site, loads every page on desktop and mobile widths,
// reports console errors / failed requests and saves screenshots.
//   node check.mjs [outDir]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2] || path.join(ROOT, '_src', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return fs.createReadStream(path.join(ROOT, '404.html')).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const exe = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(fs.existsSync);
const browser = await puppeteer.launch({ executablePath: exe, headless: true });
const routes = ['/', '/services/', '/industries/', '/tech-stack/', '/projects/', '/about/', '/estimator/', '/contact/',
  '/privacy/', '/terms/', '/case-study/?id=cloudmetrics-saas-platform', '/services/mobile-app-development/', '/software-development-company-mumbai/', '/does-not-exist/'];
for (const r of routes) {
  for (const [label, vp] of [['desktop', { width: 1366, height: 900 }], ['mobile', { width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 }]]) {
    const page = await browser.newPage();
    const problems = [];
    page.on('console', (m) => m.type() === 'error' && problems.push('console: ' + m.text()));
    page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
    page.on('requestfailed', (q) => problems.push('failed: ' + q.url()));
    page.on('response', (s) => s.status() >= 400 && !r.includes('does-not-exist') && problems.push(`${s.status()}: ${s.url()}`));
    await page.setViewport(vp);
    await page.goto(base + r, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('active')));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) problems.push(`horizontal overflow ${overflow}px`);
    const name = (r.replace(/[/?=]+/g, '_').replace(/^_|_$/g, '') || 'home') + '-' + label + '.png';
    await page.screenshot({ path: path.join(OUT, name), fullPage: true });
    console.log(`${r} [${label}] ${problems.length ? problems.join(' | ') : 'OK'}`);
    await page.close();
  }
}
await browser.close();
server.close();
