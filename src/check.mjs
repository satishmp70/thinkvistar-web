// Browser route sweep over dist/ (build first).   node check.mjs [--screenshots <dir>]
//
// Loads every page from the manifest (pages.mjs) at mobile and desktop widths, plus every
// service page at 320/360/390/768/1024 px, the intentional 404, and a valid and an invalid
// blueprint. A route fails on: wrong HTTP status, console errors, page errors, failed or
// 4xx/5xx requests, horizontal overflow, or a wrong number of <h1>. Any failure exits 1.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { pages } from './pages.mjs';
import { launchOptions } from './lib/browser.mjs';
import { startStaticServer } from './lib/static-server.mjs';

const args = process.argv.slice(2);
const shotDir = args.includes('--screenshots') ? args[args.indexOf('--screenshots') + 1] : null;
if (shotDir) fs.mkdirSync(shotDir, { recursive: true });

const MOBILE = { width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 };
const DESKTOP = { width: 1366, height: 900 };
const SERVICE_WIDTHS = [320, 360, 390, 768, 1024];

const indexable = pages.filter((p) => p.sitemap);
const services = indexable.filter((p) => /^\/services\/[^/]+\/$/.test(p.path));
const firstProject = JSON.parse(fs.readFileSync(new URL('./site-data.json', import.meta.url), 'utf8')).projects[0].id;

/** @type {{route:string, viewport:object, label:string, status:number, h1:number|null}[]} */
const cases = [];
for (const p of indexable) {
  cases.push({ route: p.path, viewport: MOBILE, label: 'mobile 390', status: 200, h1: 1 });
  cases.push({ route: p.path, viewport: DESKTOP, label: 'desktop 1366', status: 200, h1: 1 });
}
for (const p of services) {
  for (const width of SERVICE_WIDTHS) {
    cases.push({ route: p.path, viewport: { width, height: 800, isMobile: width < 768 }, label: `${width}px`, status: 200, h1: 1 });
  }
}
for (const [route, h1] of [[`/case-study/?id=${firstProject}`, 1], ['/case-study/?id=does-not-exist', 0]]) {
  cases.push({ route, viewport: MOBILE, label: 'mobile 390', status: 200, h1 });
  cases.push({ route, viewport: DESKTOP, label: 'desktop 1366', status: 200, h1 });
}
cases.push({ route: '/this-page-does-not-exist/', viewport: MOBILE, label: 'mobile 390', status: 404, h1: 1 });
cases.push({ route: '/this-page-does-not-exist/', viewport: DESKTOP, label: 'desktop 1366', status: 404, h1: 1 });

const server = await startStaticServer();
const browser = await puppeteer.launch(launchOptions());
const failures = [];
try {
  for (const c of cases) {
    const page = await browser.newPage();
    const problems = [];
    page.on('console', (m) => m.type() === 'error' && !/status of 404/.test(m.text()) && problems.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`request failed: ${r.url()}`));
    page.on('response', (r) => {
      if (r.status() >= 400 && r.request().resourceType() !== 'document') problems.push(`HTTP ${r.status()}: ${r.url()}`);
    });
    await page.setViewport(c.viewport);
    const response = await page.goto(server.base + c.route, { waitUntil: 'networkidle0' });
    if (response.status() !== c.status) problems.push(`status ${response.status()} (expected ${c.status})`);
    // Compare with the configured width: in mobile emulation window.innerWidth grows to fit
    // overflowing content, which would hide exactly the defect being looked for.
    const measured = await page.evaluate((width) => ({
      overflow: document.documentElement.scrollWidth - width,
      h1: document.querySelectorAll('h1').length,
      main: Boolean(document.querySelector('main')),
    }), c.viewport.width);
    if (measured.overflow > 0) problems.push(`horizontal overflow ${measured.overflow}px`);
    if (c.h1 !== null && measured.h1 !== c.h1) problems.push(`${measured.h1} <h1> (expected ${c.h1})`);
    if (!measured.main) problems.push('no <main> landmark');
    const line = `${c.route} [${c.label}]`;
    if (problems.length) {
      failures.push(`${line}: ${problems.join(' | ')}`);
      console.log(`FAIL ${line}: ${problems.join(' | ')}`);
      if (shotDir) await page.screenshot({ path: path.join(shotDir, `${c.route.replace(/[^\w]+/g, '_')}-${c.label.replace(/\W+/g, '')}.png`), fullPage: true });
    }
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}

if (failures.length) {
  console.error(`\ncheck: ${failures.length} of ${cases.length} route checks failed`);
  process.exit(1);
}
console.log(`check: ${cases.length} route checks passed (${indexable.length} indexable routes x 2 widths, ${services.length} service pages x ${SERVICE_WIDTHS.length} widths, blueprints, 404)`);
