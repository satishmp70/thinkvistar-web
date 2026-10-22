// Interaction and resilience tests in a real browser against dist/ (build first).
//   node test-browser.mjs
// Covers AUD-001 (no-JS / blocked-module form posts), AUD-008 (error association),
// AUD-009 (estimator semantics), AUD-010 (drawer focus), AUD-011 (content visibility
// when scripts fail, reduced motion). A fake /api/contact.php records requests; nothing
// is ever sent anywhere.
import puppeteer from 'puppeteer-core';
import { launchOptions } from './lib/browser.mjs';
import { startStaticServer } from './lib/static-server.mjs';

const failures = [];
let checks = 0;
const check = (name, ok, detail = '') => { checks++; if (!ok) failures.push(`${name}${detail ? ` — ${detail}` : ''}`); };

// A crash in one section (for example a missing element) is reported as a failure together
// with everything recorded so far, instead of hiding the earlier results.
function report() {
  if (failures.length) { console.error(`FAILED ${failures.length}/${checks}\n- ` + failures.join('\n- ')); process.exit(1); }
  console.log(`test-browser: ${checks} checks passed`);
}
process.on('uncaughtException', (error) => { failures.push(`crash: ${error.message.split('\n')[0]}`); report(); });

const requests = [];
const fakeApi = async (req, res, url) => {
  if (url.pathname !== '/api/contact.php') return false;
  let body = '';
  for await (const chunk of req) body += chunk;
  requests.push({ method: req.method, url: req.url, body, accept: req.headers.accept || '' });
  const wantsJson = (req.headers.accept || '').includes('application/json');
  res.writeHead(200, { 'Content-Type': wantsJson ? 'application/json' : 'text/html' });
  res.end(wantsJson ? JSON.stringify({ success: true, message: 'Thank you for your enquiry.' }) : '<!doctype html><title>Thank you</title><p>Thank you</p>');
  return true;
};

const server = await startStaticServer({ handlers: [fakeApi] });
const browser = await puppeteer.launch(launchOptions());
const SECRET_NAME = 'Synthetic Tester';
const FILL = {
  '#clientName': SECRET_NAME, '#clientCompany': 'Example Co', '#clientEmail': 'tester@example.com',
  '#clientPhone': '+91 98765 43210', '#projectOverview': 'We would like a multi-tenant SaaS platform for logistics.',
};

async function openContact({ javascript = true, block = [], viewport = { width: 1280, height: 900 } } = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.setJavaScriptEnabled(javascript);
  if (block.length) {
    await page.setRequestInterception(true);
    page.on('request', (r) => (block.some((re) => re.test(r.url())) ? r.abort() : r.continue()));
  }
  await page.goto(`${server.base}/contact/`, { waitUntil: 'networkidle0' });
  return page;
}

async function fillAndSubmit(page) {
  for (const [selector, value] of Object.entries(FILL)) await page.type(selector, value);
  await page.select('#projectScope', 'Custom SaaS Platform Development');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }).catch(() => null),
    page.click('#contactForm button[type="submit"]'),
  ]);
}

// ------------------------------------------------------------- AUD-001
for (const [label, options] of [['JavaScript disabled', { javascript: false }], ['main module blocked', { block: [/\/assets\/main-/] }]]) {
  requests.length = 0;
  const page = await openContact(options);
  const attrs = await page.$eval('#contactForm', (f) => ({ method: f.method, action: new URL(f.action).pathname, novalidate: f.noValidate }));
  check(`${label}: form posts to the API`, attrs.method === 'post' && attrs.action === '/api/contact.php', JSON.stringify(attrs));
  check(`${label}: native validation active`, attrs.novalidate === false);

  // Submitting empty must be stopped by the browser (no request at all)
  await page.click('#contactForm button[type="submit"]');
  await new Promise((r) => setTimeout(r, 300));
  check(`${label}: empty form is blocked natively`, requests.length === 0);

  await fillAndSubmit(page);
  const post = requests.at(-1);
  check(`${label}: one POST sent`, requests.length === 1 && post?.method === 'POST', `${requests.length} requests`);
  check(`${label}: no query string on the API URL`, post && !post.url.includes('?'), post?.url);
  check(`${label}: fields travel in the body`, post && post.body.includes('clientName') && post.body.includes('Synthetic'));
  const landed = new URL(page.url());
  check(`${label}: browser URL holds no enquiry data`, landed.search === '' && !decodeURIComponent(landed.href).includes(SECRET_NAME) && !landed.href.includes('example.com'), landed.href);
  await page.close();
}

// ------------------------------------------------------------- normal JS submit + AUD-008
{
  requests.length = 0;
  const page = await openContact();
  const noValidate = await page.$eval('#contactForm', (f) => f.noValidate);
  check('JS: native validation replaced by inline errors', noValidate === true);

  await page.click('#contactForm button[type="submit"]');
  const state = await page.evaluate(() => {
    const fields = ['clientName', 'clientCompany', 'clientEmail', 'projectScope', 'projectOverview'];
    return fields.map((id) => {
      const el = document.getElementById(id);
      const describedBy = (el.getAttribute('aria-describedby') || '').split(/\s+/);
      const error = document.getElementById(`${id}Error`);
      return { id, invalid: el.getAttribute('aria-invalid'), linked: describedBy.includes(`${id}Error`), text: error?.textContent || '' };
    });
  });
  check('errors: every invalid field is aria-invalid', state.every((f) => f.invalid === 'true'), JSON.stringify(state.filter((f) => f.invalid !== 'true')));
  check('errors: each error is linked by aria-describedby', state.every((f) => f.linked));
  check('errors: each error has text', state.every((f) => f.text.length > 5));
  const focused = await page.evaluate(() => document.activeElement.id);
  check('errors: focus moves to the first invalid field', focused === 'clientName', focused);
  const summary = await page.$eval('#formStatus', (el) => ({ role: el.getAttribute('role'), live: el.getAttribute('aria-live'), text: el.textContent }));
  check('errors: summary region announces and names the fields', summary.role === 'status' && /Your Full Name/.test(summary.text), JSON.stringify(summary));

  // fixing a field clears its message but keeps the association
  await page.type('#clientName', 'Synthetic Tester');
  const cleared = await page.evaluate(() => ({ text: document.getElementById('clientNameError').textContent, linked: (document.getElementById('clientName').getAttribute('aria-describedby') || '').includes('clientNameError'), invalid: document.getElementById('clientName').getAttribute('aria-invalid') }));
  check('errors: clearing keeps the association', cleared.text === '' && cleared.linked && cleared.invalid === 'false', JSON.stringify(cleared));

  await page.type('#clientCompany', 'Example Co');
  await page.type('#clientEmail', 'tester@example.com');
  await page.select('#projectScope', 'Custom SaaS Platform Development');
  await page.type('#projectOverview', 'We would like a multi-tenant SaaS platform for logistics.');
  await page.click('#contactForm button[type="submit"]');
  await page.waitForFunction(() => /Thank you/.test(document.getElementById('formStatus').textContent), { timeout: 3000 }).catch(() => null);
  check('JS submit: exactly one fetch POST with Accept JSON', requests.length === 1 && requests[0].accept.includes('application/json'), `${requests.length}`);
  check('JS submit: no query string', !requests[0]?.url.includes('?'));
  check('JS submit: success shown', await page.$eval('#formStatus', (el) => el.classList.contains('success')));
  await page.close();
}

// ------------------------------------------------------------- AUD-011: failed scripts
async function visibility(page) {
  return page.evaluate(() => {
    const hidden = [...document.querySelectorAll('.reveal')].filter((el) => getComputedStyle(el).opacity < 0.99).length;
    const cta = [...document.querySelectorAll('main a.btn')].filter((a) => a.offsetParent !== null && getComputedStyle(a).opacity > 0.99).length;
    return { reveal: document.querySelectorAll('.reveal').length, hidden, cta, h1: document.querySelector('h1')?.textContent.trim() };
  });
}
for (const route of ['/', '/services/saas-development/', '/about/']) {
  for (const [label, block] of [['main module blocked', [/\/assets\/main-/]], ['all asset scripts blocked', [/\/assets\/.*\.js/]], ['icon/data chunk blocked', [/\/assets\/chunk-/]]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.setRequestInterception(true);
    page.on('request', (r) => (block.some((re) => re.test(r.url())) ? r.abort() : r.continue()));
    await page.goto(server.base + route, { waitUntil: 'networkidle0' });
    const v = await visibility(page);
    check(`${route} (${label}): no content left invisible`, v.hidden === 0 && v.reveal > 0, JSON.stringify(v));
    check(`${route} (${label}): headline and call to action present`, Boolean(v.h1) && v.cta > 0, JSON.stringify(v));
    await page.close();
  }
}

// ------------------------------------------------------------- motion: normal and reduced
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${server.base}/services/`, { waitUntil: 'networkidle0' });
  const armed = await page.evaluate(() => document.querySelectorAll('.reveal-armed:not(.active)').length);
  check('motion: below-the-fold content is armed for reveal', armed > 0, `${armed}`);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1200));
  const stillHidden = await page.evaluate(() => [...document.querySelectorAll('.reveal-armed:not(.active)')].filter((el) => el.getBoundingClientRect().top < innerHeight).length);
  check('motion: armed content appears once scrolled into view', stillHidden === 0, `${stillHidden}`);
  await page.close();

  const reduced = await browser.newPage();
  await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await reduced.setViewport({ width: 1280, height: 800 });
  await reduced.goto(`${server.base}/services/`, { waitUntil: 'networkidle0' });
  const r = await reduced.evaluate(() => ({ armed: document.querySelectorAll('.reveal-armed').length, hidden: [...document.querySelectorAll('.reveal')].filter((el) => getComputedStyle(el).opacity < 0.99).length }));
  check('reduced motion: nothing is armed or hidden', r.armed === 0 && r.hidden === 0, JSON.stringify(r));
  await reduced.close();
}

// ------------------------------------------------------------- AUD-023: responsive logo candidates
for (const [label, viewport, expected] of [
  ['mobile DPR 1', { width: 390, height: 844, deviceScaleFactor: 1 }, '-240'],
  ['mobile DPR 1.75', { width: 390, height: 844, deviceScaleFactor: 1.75 }, '-240'],
  ['mobile DPR 2', { width: 390, height: 844, deviceScaleFactor: 2 }, '-360'],
  ['desktop DPR 1', { width: 1366, height: 900, deviceScaleFactor: 1 }, '-240'],
  ['desktop DPR 2', { width: 1366, height: 900, deviceScaleFactor: 2 }, '-360'],
  ['desktop DPR 3', { width: 1366, height: 900, deviceScaleFactor: 3 }, 'thinkvistar-logo.webp'],
]) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(`${server.base}/contact/`, { waitUntil: 'networkidle0' });
  const logo = await page.$eval('.site-header .brand-logo-img', (img) => ({ src: img.currentSrc, natural: img.naturalWidth, shown: Math.round(img.getBoundingClientRect().width) }));
  check(`logo ${label}: picks an appropriately sized candidate`, logo.src.includes(expected), JSON.stringify(logo));
  // naturalWidth is density-corrected for srcset w descriptors, so read the real pixel width from the file name.
  const filePixels = Number(logo.src.match(/-(\d+)\.webp$/)?.[1] ?? 480);
  const needed = logo.shown * viewport.deviceScaleFactor;
  check(`logo ${label}: sharp (file ${filePixels}px for ${Math.round(needed)} device px) and not wastefully large`, (filePixels >= needed * 0.97 || filePixels === 480) && filePixels <= Math.max(240, needed * 1.6), JSON.stringify({ ...logo, filePixels, needed }));
  await page.close();
}

// ------------------------------------------------------------- AUD-010: drawer
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(`${server.base}/contact/`, { waitUntil: 'networkidle0' });
  const closed = await page.evaluate(() => ({ inert: document.getElementById('mobileNavDrawer').inert, hidden: document.getElementById('mobileNavDrawer').getAttribute('aria-hidden') }));
  check('drawer: closed drawer is inert and hidden from AT', closed.inert && closed.hidden === 'true', JSON.stringify(closed));
  await page.focus('#hamburgerBtn');
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 200));
  const open = await page.evaluate(() => ({ expanded: document.getElementById('hamburgerBtn').getAttribute('aria-expanded'), role: document.getElementById('mobileNavDrawer').getAttribute('role'), modal: document.getElementById('mobileNavDrawer').getAttribute('aria-modal'), mainInert: document.querySelector('main').inert, inDrawer: document.getElementById('mobileNavDrawer').contains(document.activeElement) }));
  check('drawer: opens as a modal dialog with focus inside', open.expanded === 'true' && open.role === 'dialog' && open.modal === 'true' && open.mainInert && open.inDrawer, JSON.stringify(open));
  const visited = new Set();
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press('Tab');
    visited.add(await page.evaluate(() => {
      const el = document.activeElement;
      const inside = el.id === 'hamburgerBtn' || document.getElementById('mobileNavDrawer').contains(el);
      return inside ? 'inside' : `OUTSIDE:${el.tagName}#${el.id}.${el.className}`;
    }));
  }
  check('drawer: Tab never leaves the menu', [...visited].every((v) => v === 'inside'), [...visited].join(', '));
  const back = new Set();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.down('Shift'); await page.keyboard.press('Tab'); await page.keyboard.up('Shift');
    back.add(await page.evaluate(() => (document.activeElement.id === 'hamburgerBtn' || document.getElementById('mobileNavDrawer').contains(document.activeElement)) ? 'inside' : 'OUTSIDE'));
  }
  check('drawer: Shift+Tab never leaves the menu', [...back].every((v) => v === 'inside'));
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 200));
  const after = await page.evaluate(() => ({ open: document.getElementById('mobileNavDrawer').classList.contains('open'), focus: document.activeElement.id, mainInert: document.querySelector('main').inert }));
  check('drawer: Escape closes and restores focus to the menu button', !after.open && after.focus === 'hamburgerBtn' && !after.mainInert, JSON.stringify(after));
  await page.close();
}

// ------------------------------------------------------------- AUD-009: estimator
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${server.base}/estimator/`, { waitUntil: 'networkidle0' });
  const groups = await page.evaluate(() => [...document.querySelectorAll('[role="radiogroup"]')].map((g) => ({
    name: document.getElementById(g.getAttribute('aria-labelledby'))?.textContent.trim(),
    radios: g.querySelectorAll('[role="radio"]').length,
    checked: g.querySelectorAll('[aria-checked="true"]').length,
    tabbable: [...g.querySelectorAll('[role="radio"]')].filter((r) => r.tabIndex === 0).length,
  })));
  check('estimator: five named radio groups', groups.length === 5 && groups.every((g) => g.name), JSON.stringify(groups));
  check('estimator: exactly one selected and one tab stop per group', groups.every((g) => g.checked === 1 && g.tabbable === 1), JSON.stringify(groups));

  await page.focus('#estScaleOptions [aria-checked="true"]');
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 700));
  const moved = await page.evaluate(() => ({
    checked: document.querySelector('#estScaleOptions [aria-checked="true"]').dataset.scale,
    focus: document.activeElement.dataset.scale,
    announce: document.getElementById('estAnnouncer').textContent,
    sla: document.getElementById('estOutputSla').textContent,
    duration: document.getElementById('estOutputDuration').textContent,
  }));
  check('estimator: arrow key selects the next option and moves focus', moved.checked === 'scale' && moved.focus === 'scale', JSON.stringify(moved));
  check('estimator: result is announced politely', /Estimate updated/.test(moved.announce) && /weeks/.test(moved.announce), moved.announce);
  check('estimator: result text updated', /99\.95%/.test(moved.sla) && /\d+ – \d+ Weeks/.test(moved.duration), JSON.stringify(moved));

  await page.click('#estSecurityOptions [data-security="hipaa"]');
  const wording = await page.evaluate(() => document.querySelector('#estSummaryPanel').textContent);
  check('estimator wording: no guarantee or achieved-compliance claims (AUD-022)', !/guarantee(d)?\s+SLA|SOC 2\s*&\s*GDPR\s*Ready|Level 1/i.test(wording) && /target/i.test(wording) && /separate/i.test(wording));
  const live = await page.evaluate(() => document.getElementById('estSummaryPanel').getAttribute('aria-live'));
  check('estimator: result panel itself is not a noisy live region', live === null);
  await page.close();
}

// ------------------------------------------------------------- projects filter (no data at runtime)
{
  const page = await browser.newPage();
  const dataRequests = [];
  // The site data lives in a ~60 KB shared chunk; a 293-byte helper chunk is fine.
  page.on('response', async (r) => {
    if (/\/assets\/(chunk|sections)-/.test(r.url()) && (await r.buffer()).length > 5000) dataRequests.push(r.url());
  });
  await page.goto(`${server.base}/projects/`, { waitUntil: 'networkidle0' });
  const total = await page.$$eval('#projectsContainer [data-category]', (c) => c.length);
  const categories = await page.$$eval('.filter-btn', (b) => b.map((x) => x.dataset.category));
  const target = categories.find((c) => c !== 'All');
  await page.click(`.filter-btn[data-category="${target}"]`);
  const shown = await page.$$eval('#projectsContainer [data-category]', (c) => c.filter((x) => !x.hidden).length);
  const pressed = await page.$eval(`.filter-btn[data-category="${target}"]`, (b) => b.getAttribute('aria-pressed'));
  check('projects: filter narrows the list and reports pressed state', shown > 0 && shown < total && pressed === 'true', `${shown}/${total}`);
  check('projects: filtering needs no site-data download', dataRequests.length === 0, dataRequests.join(','));
  await page.close();
}

await browser.close();
await server.close();
report();
