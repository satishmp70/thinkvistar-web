// Static SEO + integrity checks on dist/ (no browser needed):  node verify.mjs
// Fails on: not exactly one <h1>, missing/duplicate title or description, title or
// description out of length range, missing canonical / Open Graph / valid JSON-LD,
// images without alt, sitemap and canonicals out of sync, indexable pages missing
// from the sitemap, or links to local files that do not exist.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
// Pages whose heading/canonical are injected at runtime from ?id=.
const DYNAMIC = new Set(['404.html', 'case-study/index.html']);
const SKIP = new Set(['vendor']);

function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const exists = (urlPath) => {
  const f = path.join(ROOT, decodeURIComponent(urlPath));
  if (!f.startsWith(ROOT)) return false;
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return true;
  return fs.existsSync(path.join(f, 'index.html'));
};

const problems = [];
const decode = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const sitemap = new Set([...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const robotsTxt = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
if (!/Sitemap:\s*https:\/\/thinkvistar\.com\/sitemap\.xml/.test(robotsTxt)) problems_push('robots.txt: missing Sitemap line');
if (/Disallow:\s*\/(assets|images|fonts)?\s*$/m.test(robotsTxt)) problems_push('robots.txt: blocks the site or its assets');
for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
  if (!robotsTxt.includes(`User-agent: ${bot}`)) problems_push(`robots.txt: ${bot} (AI crawler) is not explicitly allowed`);
}
for (const f of ['llms.txt', 'llms-full.txt']) {
  const t = fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), 'utf8') : '';
  if (!t.includes('Thinkvistar')) problems_push(`${f}: missing or empty`);
}
const seen = { title: new Map(), description: new Map() };
const canonicals = new Set();
function problems_push(m) { problems.push(m); }

let count = 0;
for (const file of htmlFiles(ROOT)) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  count++;
  if (!DYNAMIC.has(rel)) {
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) problems.push(`${rel}: ${h1} <h1> elements (expected 1)`);
    const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '');
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
    const canon = html.match(/<link rel="canonical" href="(https:\/\/thinkvistar\.com\/[^"]*)"/)?.[1];
    if (title.length < 20 || title.length > 65) problems.push(`${rel}: title length ${title.length} (want 20-65)`);
    if (desc.length < 70 || desc.length > 160) problems.push(`${rel}: description length ${desc.length} (want 70-160)`);
    for (const [k, v] of [['title', title], ['description', desc]]) {
      if (seen[k].has(v)) problems.push(`${rel}: duplicate ${k} (also ${seen[k].get(v)})`);
      else seen[k].set(v, rel);
    }
    if (!canon) problems.push(`${rel}: missing canonical`);
    else {
      canonicals.add(canon);
      if (!sitemap.has(canon)) problems.push(`${rel}: canonical ${canon} is not in sitemap.xml`);
    }
    for (const tag of ['og:title', 'og:description', 'og:image', 'twitter:card']) {
      if (!html.includes(tag)) problems.push(`${rel}: missing ${tag}`);
    }
    if (/noindex/.test(html)) problems.push(`${rel}: unexpectedly noindex`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    if (!ld.length) problems.push(`${rel}: no JSON-LD`);
    for (const m of ld) { try { JSON.parse(m[1]); } catch { problems.push(`${rel}: invalid JSON-LD`); } }
  }
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt=/.test(img)) problems.push(`${rel}: <img> without alt: ${img.slice(0, 80)}`);
  }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    if (m[1] !== '/' && !exists(m[1])) problems.push(`${rel}: broken local reference ${m[1]}`);
  }
}

// ---- Output hygiene: dist/ must contain only what the web server should serve ----
const FORBIDDEN_IN_DIST = [/(^|\/)\.env/, /(^|\/)node_modules(\/|$)/, /(^|\/)src(\/|$)/, /(^|\/)\.github(\/|$)/, /\.(map|mjs|py|bat|md)$/,
  /(^|\/)(package(-lock)?|composer)\.(json|lock)$/, /(^|\/)lastmod\.json$/, /(^|\/)site-data\.json$/, /(^|\/)\.git/];
function* allFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* allFiles(p);
    else yield p;
  }
}
const SECRET_PATTERNS = [/SMTP_PASSWORD\s*=\s*\S+/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /AKIA[0-9A-Z]{16}/, /ghp_[A-Za-z0-9]{30,}/];
for (const file of allFiles(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (rel.startsWith('vendor/')) continue; // production dependency added by CI
  if (FORBIDDEN_IN_DIST.some((re) => re.test(rel))) problems.push(`dist contains a file that must not be deployed: ${rel}`);
  if (/\.(html|js|css|txt|xml|php|json)$/.test(rel)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const re of SECRET_PATTERNS) if (re.test(text)) problems.push(`${rel}: looks like it contains a secret (${re})`);
  }
}
const apiFiles = fs.readdirSync(path.join(ROOT, 'api')).sort().join(',');
if (apiFiles !== 'config.php,contact.php') problems.push(`dist/api should contain only config.php and contact.php, found: ${apiFiles}`);

// ---- Source rules ----
const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));
for (const file of allFiles(path.join(SRC_DIR, 'js'))) {
  const text = fs.readFileSync(file, 'utf8');
  if (/dataLoader-|from\s+["']\.\/icons-[\w-]+\.js["']/.test(text)) problems.push(`${path.relative(SRC_DIR, file)}: imports a hashed build artefact; use stable module paths`);
}

// ---- Contact form contract: HTML options must match the PHP allowlist; native fallback must be intact ----
const contactHtml = fs.readFileSync(path.join(ROOT, 'contact', 'index.html'), 'utf8');
const php = fs.readFileSync(path.join(ROOT, 'api', 'contact.php'), 'utf8');
const phpList = (name) => [...php.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`))[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
const optionValues = (id) => [...contactHtml.match(new RegExp(`<select[^>]*id="${id}"[^>]*>([\\s\\S]*?)</select>`))[1].matchAll(/<option value="([^"]*)"/g)]
  .map((m) => decode(m[1])).filter(Boolean);
for (const [select, constant] of [['projectScope', 'SCOPES'], ['projectTimeline', 'TIMELINES']]) {
  const a = optionValues(select).sort().join('|'), b = phpList(constant).sort().join('|');
  if (a !== b) problems.push(`contact form <select id="${select}"> options differ from ${constant} in api/contact.php`);
}
const formTag = contactHtml.match(/<form[^>]*id="contactForm"[^>]*>/)?.[0] ?? '';
if (!/method="post"/i.test(formTag) || !/action="\/api\/contact\.php"/.test(formTag)) problems.push('contact form must declare method="post" action="/api/contact.php" for the no-JavaScript path');
if (/novalidate/.test(formTag)) problems.push('contact form HTML must not ship novalidate (JavaScript sets it)');

// ---- Rendered pages: finished at build time, no runtime state baked in, dates consistent ----
const sitemapDates = new Map([...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map((m) => [m[1], m[2]]));
for (const file of htmlFiles(ROOT)) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  if (rel !== 'case-study/index.html' && !/<html lang="en" data-prerendered>/.test(html)) problems.push(`${rel}: not pre-rendered (missing data-prerendered)`);
  if (/reveal-armed|class="[^"]*\bis-invalid\b/.test(html)) problems.push(`${rel}: runtime-only state was saved into the HTML`);
  if (html.includes('{{LASTMOD}}')) problems.push(`${rel}: unreplaced {{LASTMOD}} placeholder`);
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const modified = html.match(/"dateModified":"([^"]+)"/)?.[1];
  if (canon && sitemapDates.has(canon) && modified !== sitemapDates.get(canon)) problems.push(`${rel}: dateModified ${modified} differs from sitemap lastmod ${sitemapDates.get(canon)}`);
}

// ---- Fonts are fingerprinted (so "immutable" caching is safe) and every reference resolves ----
const fontRefs = new Set();
for (const file of allFiles(ROOT)) {
  if (!/\.(html|css)$/.test(file)) continue;
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/\/fonts\/[\w.-]+\.woff2/g)) fontRefs.add(m[0]);
}
if (fontRefs.size === 0) problems.push('no font references found');
for (const ref of fontRefs) {
  if (!/\.[A-Za-z0-9_-]{8}\.woff2$/.test(ref)) problems.push(`font URL is not fingerprinted: ${ref}`);
  if (!fs.existsSync(path.join(ROOT, ref))) problems.push(`font file missing: ${ref}`);
}
for (const file of fs.readdirSync(path.join(ROOT, 'fonts'))) {
  if (!fontRefs.has(`/fonts/${file}`)) problems.push(`unreferenced font file: ${file}`);
}

// ---- Marketing pages must not make unqualified absolute promises (see docs/legal-compliance) ----
// Terms and Privacy are excluded: they legitimately say things like "we cannot guarantee absolute security".
const ABSOLUTE_CLAIMS = [/zero[- ]downtime/i, /zero data loss/i, /\b100\s?%\s+(secure|safe|uptime)\b/i, /guarantee[ds]?\b/i,
  /\b24\/7\b/, /SLA-backed/i, /error-?free/i, /bug-?free/i, /unlimited (support|revisions)/i, /in line with India's DPDP/i, /(will|shall) rank/i];
for (const file of htmlFiles(ROOT)) {
  const rel = path.relative(ROOT, file);
  if (/^(privacy|terms)\//.test(rel)) continue;
  const text = fs.readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, (m) => (m.includes('ld+json') ? m : '')).replace(/<style[\s\S]*?<\/style>/g, '');
  for (const re of ABSOLUTE_CLAIMS) {
    const hit = text.match(re);
    if (hit && !(re.source.startsWith('guarantee') && /not guarantees?|no guarantee/i.test(text.slice(Math.max(0, hit.index - 40), hit.index + 40)))) {
      problems.push(`${rel}: unqualified absolute claim "${hit[0]}" (${re})`);
    }
  }
}

// ---- Legal text: the published Terms must keep the protective structure (see docs/legal-compliance) ----
const termsHtml = fs.readFileSync(path.join(ROOT, 'terms', 'index.html'), 'utf8');
for (const required of ['Order of Precedence', 'Change Requests', 'Delivery, Acceptance', 'Term, Termination, Cancellation', 'Intellectual Property Rights', 'Limitation of Liability', 'Force Majeure', 'Governing Law', 'Data Protection']) {
  if (!termsHtml.includes(required)) problems.push(`terms: required clause heading missing: ${required}`);
}
if (/non-refundable/i.test(termsHtml) && /initial deposits and milestone payments for completed phases are non-refundable/i.test(termsHtml)) problems.push('terms: blanket non-refundable deposit wording is back');
if (/without notice or refund/i.test(termsHtml)) problems.push('terms: forfeiture "without notice or refund" wording is back');
const privacyHtml = fs.readFileSync(path.join(ROOT, 'privacy', 'index.html'), 'utf8');
if (/you consent to the practices described/i.test(privacyHtml)) problems.push('privacy: consent-by-browsing wording is back');
if (!/Grievance Officer/.test(privacyHtml)) problems.push('privacy: Grievance Officer section missing');

// ---- Estimator wording (no guarantees or achieved compliance) ----
const estimatorText = fs.readFileSync(path.join(ROOT, 'estimator', 'index.html'), 'utf8') +
  fs.readdirSync(path.join(ROOT, 'assets')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(ROOT, 'assets', f), 'utf8')).join('\n');
for (const re of [/Guaranteed\s+SLA/i, /SOC 2\s*(&amp;|&)\s*GDPR\s*Ready/i, /HIPAA\s*\/\s*PCI-DSS\s*Level\s*1/i, /Mission-Critical SLA/i]) {
  if (re.test(estimatorText)) problems.push(`estimator presents an unqualified guarantee/compliance claim: ${re}`);
}

for (const u of sitemap) {
  if (!canonicals.has(u)) problems.push(`sitemap.xml: ${u} has no page with that canonical`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`verify: ${count} pages OK`);
