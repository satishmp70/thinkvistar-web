// Lab performance / accessibility / SEO gate on dist/ using a PINNED Lighthouse (mobile profile).
//   node lighthouse-check.mjs [--runs 3] [--json results.json] [--pages /,/contact/] [--min-performance 90]
// Each page is measured several times and the MEDIAN is checked, which damps run-to-run noise.
// Lab numbers are a regression guard, not field data: real Core Web Vitals (including INP) come
// from Search Console / CrUX once the site has traffic.
import fs from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { findBrowser } from './lib/browser.mjs';
import { startStaticServer } from './lib/static-server.mjs';

const run = promisify(execFile);
const LIGHTHOUSE = 'lighthouse@12.8.2'; // pinned: score changes between versions would otherwise look like regressions
const args = process.argv.slice(2);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const RUNS = Number(option('--runs', 3));
const PAGES = option('--pages', '/,/contact/,/services/saas-development/,/estimator/').split(',');
// --min-performance exists so the failure path itself can be tested (see the AUD-002 notes).
const MIN = { performance: Number(option('--min-performance', 90)), accessibility: 95, 'best-practices': 90, seo: 95 };
const MAX = { lcpMs: 2500, cls: 0.1 };
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

process.env.CHROME_PATH = findBrowser();
const server = await startStaticServer({ compress: true });
const failures = [];
const report = [];
try {
  for (const page of PAGES) {
    const samples = [];
    for (let i = 0; i < RUNS; i++) {
      // Async on purpose: a blocking call would freeze the static server Lighthouse loads from.
      const { stdout } = await run('npx', ['--yes', LIGHTHOUSE, server.base + page, '--output=json', '--quiet',
        '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new --no-sandbox'],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 240000, shell: process.platform === 'win32' });
      const r = JSON.parse(stdout);
      samples.push({
        scores: Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)])),
        lcp: r.audits['largest-contentful-paint'].numericValue,
        cls: r.audits['cumulative-layout-shift'].numericValue,
        tbt: r.audits['total-blocking-time'].numericValue,
        bytes: r.audits['total-byte-weight'].numericValue,
        version: r.lighthouseVersion,
      });
    }
    const scores = Object.fromEntries(Object.keys(MIN).map((k) => [k, median(samples.map((s) => s.scores[k]))]));
    const row = { page, runs: RUNS, lighthouse: samples[0].version, medianScores: scores, medianLcpMs: Math.round(median(samples.map((s) => s.lcp))),
      medianCls: Number(median(samples.map((s) => s.cls)).toFixed(3)), medianTbtMs: Math.round(median(samples.map((s) => s.tbt))),
      medianTransferKB: Math.round(median(samples.map((s) => s.bytes)) / 1024), lcpMsRuns: samples.map((s) => Math.round(s.lcp)) };
    report.push(row);
    console.log(`${page} x${RUNS} ${JSON.stringify(scores)} LCP ${row.medianLcpMs}ms (runs ${row.lcpMsRuns.join('/')}) CLS ${row.medianCls} TBT ${row.medianTbtMs}ms ${row.medianTransferKB}KB`);
    for (const [k, min] of Object.entries(MIN)) if (scores[k] < min) failures.push(`${page}: median ${k} ${scores[k]} < ${min}`);
    if (row.medianLcpMs > MAX.lcpMs) failures.push(`${page}: median LCP ${row.medianLcpMs}ms > ${MAX.lcpMs}`);
    if (row.medianCls > MAX.cls) failures.push(`${page}: median CLS ${row.medianCls} > ${MAX.cls}`);
  }
} finally {
  await server.close();
}
if (option('--json')) fs.writeFileSync(option('--json'), JSON.stringify(report, null, 2));
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`lighthouse-check: OK (median of ${RUNS} runs, ${LIGHTHOUSE}; lab data, not field data)`);
