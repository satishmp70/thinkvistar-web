// Verifies sitemap <lastmod> / WebPage dateModified behaviour with real builds in an isolated copy
// of the project (the real src/lastmod.json is never touched).   node test-lastmod.mjs   (~2 minutes)
//   1. an unchanged rebuild preserves every date
//   2. a content-only change moves exactly the pages whose finished HTML contains it
//   3. --keep-lastmod (CI) never rewrites lastmod.json, even when content changed
//   4. sitemap lastmod == dateModified in every page's structured data
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tv-lastmod-'));
const failures = [];
let checks = 0;
const check = (name, ok, detail = '') => { checks++; if (!ok) failures.push(`${name} ${detail}`); };

fs.cpSync(path.join(ROOT, 'static'), path.join(tmp, 'static'), { recursive: true });
fs.cpSync(SRC, path.join(tmp, 'src'), { recursive: true, filter: (p) => !/node_modules|screenshots/.test(p) });
fs.symlinkSync(path.join(SRC, 'node_modules'), path.join(tmp, 'src', 'node_modules'));
const work = path.join(tmp, 'src');
const dist = path.join(tmp, 'dist');
const OLD = '2000-01-01';
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

const build = (...flags) => execFileSync('node', ['build.mjs', ...flags], { cwd: work, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
const readLastmod = () => JSON.parse(fs.readFileSync(path.join(work, 'lastmod.json'), 'utf8'));
const sitemap = () => Object.fromEntries([...fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8').matchAll(/<loc>https:\/\/thinkvistar\.com([^<]*)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map((m) => [m[1], m[2]]));
const pageFile = (route) => path.join(dist, route.replace(/^\//, ''), 'index.html');
const dataFile = path.join(work, 'site-data.json');
const original = fs.readFileSync(dataFile, 'utf8');

try {
  fs.rmSync(path.join(work, 'lastmod.json'), { force: true });
  build();
  const seeded = readLastmod();
  const routes = Object.keys(sitemap());
  for (const key of Object.keys(seeded)) if (seeded[key]?.date) seeded[key].date = OLD;
  fs.writeFileSync(path.join(work, 'lastmod.json'), JSON.stringify(seeded, null, 1) + '\n');

  // 1. unchanged rebuild
  build();
  let map = sitemap();
  check('unchanged rebuild preserves every sitemap date', routes.every((r) => map[r] === OLD), JSON.stringify(Object.entries(map).filter(([, d]) => d !== OLD)));
  check('unchanged rebuild leaves lastmod.json hashes stable', JSON.stringify(readLastmod()) === JSON.stringify(seeded));

  // 2. homepage-only copy change
  const data = JSON.parse(original);
  data.hero.headline = `${data.hero.headline} Updated test headline.`;
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 1));
  build();
  map = sitemap();
  let moved = routes.filter((r) => map[r] !== OLD);
  check('hero copy change moves only the homepage date', moved.length === 1 && moved[0] === '/' && map['/'] === today, JSON.stringify(moved));

  // 3. a shared change (service description) moves exactly the pages that render it
  fs.writeFileSync(path.join(work, 'lastmod.json'), JSON.stringify(Object.fromEntries(Object.entries(readLastmod()).map(([k, v]) => [k, v?.date ? { ...v, date: OLD } : v])), null, 1) + '\n');
  const marker = 'Marker sentence for the lastmod test.';
  data.services[0].description += ` ${marker}`;
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 1));
  build();
  map = sitemap();
  moved = routes.filter((r) => map[r] !== OLD).sort();
  const containing = routes.filter((r) => fs.readFileSync(pageFile(r), 'utf8').includes(marker)).sort();
  check('service copy change moves exactly the pages that contain it', moved.length > 0 && JSON.stringify(moved) === JSON.stringify(containing), `moved=${moved} containing=${containing}`);
  check('pages without the change keep their date', routes.filter((r) => !containing.includes(r)).every((r) => map[r] === OLD));

  // 4. structured data matches the sitemap
  const mismatches = routes.filter((r) => fs.readFileSync(pageFile(r), 'utf8').match(/"dateModified":"([^"]+)"/)?.[1] !== map[r]);
  check('dateModified equals sitemap lastmod on every page', mismatches.length === 0, mismatches.join(','));

  // 5. CI mode never rewrites lastmod.json
  data.hero.headline += ' Changed again for CI.';
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 1));
  const before = fs.readFileSync(path.join(work, 'lastmod.json'), 'utf8');
  const output = execFileSync('node', ['build.mjs', '--keep-lastmod'], { cwd: work, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const stderrNote = fs.readFileSync(path.join(work, 'lastmod.json'), 'utf8');
  check('--keep-lastmod leaves lastmod.json byte-identical', stderrNote === before);
  void output;
} finally {
  fs.writeFileSync(dataFile, original);
  fs.rmSync(tmp, { recursive: true, force: true });
}
if (failures.length) { console.error(`FAILED ${failures.length}/${checks}\n` + failures.join('\n')); process.exit(1); }
console.log(`test-lastmod: ${checks} checks passed`);
