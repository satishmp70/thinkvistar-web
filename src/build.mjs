// Builds the static Thinkvistar site into dist/.
//
//   cd src && npm ci && npm run build
//
// 1. Recreates dist/ and copies static/ (images, fonts, api, robots.txt, .htaccess) into it.
// 2. Fingerprints fonts, bundles + minifies JS (esbuild, code-split) and CSS.
// 3. Assembles every page from layout.mjs + pages/<name>.html + pages.mjs metadata.
// 4. Pre-renders the content sections with headless Chrome and saves the finished HTML,
//    so visitors and crawlers get complete pages without running the section renderer.
// 5. Writes sitemap.xml, llms.txt and llms-full.txt.
//
// Edit content in src/site-data.json, src/pages/*.html, src/pages.mjs and static/.
// Never edit dist/: it is deleted and rebuilt on every build.
//
// Flags: --no-prerender  skip step 4 (quick checks only; do not deploy)
//        --keep-lastmod  never write lastmod.json (CI); stale pages are reported as warnings

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { SITE, pages } from './pages.mjs';
import { renderPage } from './layout.mjs';
import { buildLlms } from './llms.mjs';
import { launchOptions } from './lib/browser.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..');
const OUT = path.join(ROOT, 'dist');
const ASSETS = path.join(OUT, 'assets');
const prerender = !process.argv.includes('--no-prerender');
const keepLastmod = process.argv.includes('--keep-lastmod');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const hash = (s) => crypto.createHash('sha256').update(s).digest('base64url').slice(0, 8);
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

const data = JSON.parse(read('site-data.json'));

// ---------------------------------------------------------------- output folder + fonts
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'static'), OUT, { recursive: true });
fs.mkdirSync(ASSETS, { recursive: true });

// Fonts get a content hash in their filename so they can be cached "immutable" safely.
const fonts = {};
for (const file of fs.readdirSync(path.join(OUT, 'fonts')).filter((f) => f.endsWith('.woff2'))) {
  const base = file.replace(/\.woff2$/, '');
  const bytes = fs.readFileSync(path.join(OUT, 'fonts', file));
  const hashed = `${base}.${hash(bytes)}.woff2`;
  fs.renameSync(path.join(OUT, 'fonts', file), path.join(OUT, 'fonts', hashed));
  fonts[base] = `/fonts/${hashed}`;
}

// ---------------------------------------------------------------- CSS + JS
const assets = { fonts };

let css = [read('css/fonts.css'), read('css/site.css'), read('css/additions.css'), read('css/premium.css')].join('\n');
for (const [base, url] of Object.entries(fonts)) css = css.split(`/fonts/${base}.woff2`).join(url);
const minifiedCss = (await esbuild.transform(css, { loader: 'css', minify: true })).code;
assets.css = `site-${hash(minifiedCss)}.css`;
fs.writeFileSync(path.join(ASSETS, assets.css), minifiedCss);

const bundle = await esbuild.build({
  absWorkingDir: SRC,
  entryPoints: { main: 'js/main.js', 'case-study': 'js/case-study.js' },
  bundle: true,
  splitting: true,
  format: 'esm',
  target: 'es2020',
  minify: true,
  legalComments: 'none',
  outdir: ASSETS,
  entryNames: '[name]-[hash]',
  chunkNames: '[name]-[hash]',
  metafile: true,
  logLevel: 'warning',
});
for (const [file, info] of Object.entries(bundle.metafile.outputs)) {
  if (info.entryPoint) assets[path.basename(info.entryPoint, '.js')] = path.basename(file);
}

// ---------------------------------------------------------------- pages
const outFile = (p) => path.join(OUT, p.out);
const LASTMOD_FILE = path.join(SRC, 'lastmod.json');
const lastmod = fs.existsSync(LASTMOD_FILE) ? JSON.parse(fs.readFileSync(LASTMOD_FILE, 'utf8')) : {};
for (const p of pages) {
  const body = p.bodyHtml ? p.bodyHtml(data) : read(`pages/${p.body}`);
  fs.mkdirSync(path.dirname(outFile(p)), { recursive: true });
  fs.writeFileSync(outFile(p), renderPage(p, body, { assets, data }));
}
console.log(`Wrote ${pages.length} pages`);

// ---------------------------------------------------------------- prerender
if (prerender) {
  const { default: puppeteer } = await import('puppeteer-core');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.json': 'application/json' };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(OUT, p);
    if (!f.startsWith(OUT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch(launchOptions());
  try {
    for (const p of pages.filter((page) => page.prerender !== false)) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
      await page.evaluateOnNewDocument(() => { window.__THINKVISTAR_PRERENDER__ = true; });
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
      const finished = html.slice(0, start) + '\n' + bodyHtml.trim() + '\n' + html.slice(end);
      // Marks the page as rendered at build time, so the browser bundle does not render it again.
      fs.writeFileSync(outFile(p), finished.replace('<html lang="en">', '<html lang="en" data-prerendered>'));
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log('Pre-rendered pages');
}

// ---------------------------------------------------------------- modification dates
// A page's date moves only when its finished content changes. The hash covers the whole
// final HTML (copy, headings, links, structured data) minus fingerprinted file names and
// the date placeholder itself, so a change to any data the page uses is detected.
const ALGORITHM = 2;
const contentHash = (html) => hash(html.replace(/\/(assets|fonts)\/[\w.-]+/g, '/$1/X').replace(/ data-prerendered/, ''));
const stale = [];
if (lastmod._algorithm !== ALGORITHM && !keepLastmod) {
  // One-time migration from the older hash: adopt the new hashes and keep every existing date.
  for (const p of pages.filter((page) => page.sitemap)) {
    lastmod[p.path] = { hash: contentHash(fs.readFileSync(outFile(p), 'utf8')), date: lastmod[p.path]?.date || today() };
  }
  lastmod._algorithm = ALGORITHM;
}
for (const p of pages.filter((page) => page.sitemap)) {
  let html = fs.readFileSync(outFile(p), 'utf8');
  const h = contentHash(html);
  const known = lastmod[p.path];
  if (!known) {
    if (!keepLastmod) lastmod[p.path] = { hash: h, date: today() };
    else stale.push(`${p.path} (new page)`);
  } else if (known.hash !== h) {
    if (!keepLastmod) lastmod[p.path] = { hash: h, date: today() };
    else stale.push(p.path);
  }
  html = html.split('{{LASTMOD}}').join((lastmod[p.path] || known || { date: today() }).date);
  fs.writeFileSync(outFile(p), html);
}
for (const p of pages.filter((page) => !page.sitemap)) {
  fs.writeFileSync(outFile(p), fs.readFileSync(outFile(p), 'utf8').split('{{LASTMOD}}').join(today()));
}
if (!keepLastmod) fs.writeFileSync(LASTMOD_FILE, JSON.stringify(lastmod, null, 1) + '\n');
if (stale.length) console.warn(`WARNING: content changed but lastmod.json was not updated for: ${stale.join(', ')}. Run "npm run build" locally and commit src/lastmod.json.`);

// ---------------------------------------------------------------- sitemap + AI reference files
const urls = pages.filter((p) => p.sitemap).map((p) =>
  `  <url><loc>${SITE.origin}${p.path}</loc><lastmod>${lastmod[p.path].date}</lastmod></url>`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`sitemap.xml: ${urls.length} URLs`);

const llms = buildLlms(data, pages);
fs.writeFileSync(path.join(OUT, 'llms.txt'), llms.short);
fs.writeFileSync(path.join(OUT, 'llms-full.txt'), llms.full);
console.log('llms.txt, llms-full.txt');
