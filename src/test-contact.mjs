// End-to-end tests for static/api/contact.php using PHP's built-in server, an
// isolated copy of the api folder, a private rate-limit directory and a fake mail
// transport (MAIL_TRANSPORT=file). Nothing is ever emailed.   node test-contact.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
let checks = 0;
const check = (name, ok, detail = '') => { checks++; if (!ok) failures.push(`${name} ${detail}`); };

const VALID = {
  clientName: 'Test Person', clientCompany: 'Acme Ltd', clientEmail: 'test@example.com', clientPhone: '+91 98765 43210',
  projectScope: 'Custom SaaS Platform Development', projectTimeline: 'Next Quarter (1-3 Months)',
  projectOverview: 'We need a multi-tenant SaaS platform for our logistics team.',
};
const ORIGIN = 'https://thinkvistar.com';

async function withServer(env, run, { readonlyParent = false } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tv-contact-'));
  const site = path.join(tmp, 'site');
  fs.mkdirSync(site);
  fs.cpSync(path.join(ROOT, 'static', 'api'), path.join(site, 'api'), { recursive: true });
  const mailFile = path.join(tmp, 'mail.jsonl');
  const rateDir = path.join(tmp, 'rate');
  const port = 8200 + Math.floor(Math.random() * 500);
  if (readonlyParent) fs.chmodSync(tmp, 0o555);
  const server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', site], {
    env: { ...process.env, PHP_CLI_SERVER_WORKERS: '8', MAIL_TRANSPORT: 'file', MAIL_FILE_PATH: mailFile,
      RATE_LIMIT_DIR: readonlyParent ? '/proc/none' : rateDir, MAIL_MAX_PER_HOUR: '5', ...env },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    try { await fetch(`http://127.0.0.1:${port}/api/contact.php`); break; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  const post = (fields, headers = {}) => fetch(`http://127.0.0.1:${port}/api/contact.php`, {
    method: 'POST', headers: { Accept: 'application/json', Origin: ORIGIN, ...headers },
    body: new URLSearchParams(fields),
  }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null), res: r }));
  const mails = () => (fs.existsSync(mailFile) ? fs.readFileSync(mailFile, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);
  try { await run({ post, mails, url: `http://127.0.0.1:${port}/api/contact.php` }); }
  finally { server.kill(); fs.chmodSync(tmp, 0o755); fs.rmSync(tmp, { recursive: true, force: true }); }
}

// ---- Field contract (AUD-006) -------------------------------------------------
await withServer({ MAIL_MAX_PER_HOUR: '100' }, async ({ post, mails, url }) => {
  let r = await post(VALID);
  check('valid payload accepted', r.status === 200 && r.body?.success === true, JSON.stringify(r.body));
  check('valid payload delivered once', mails().length === 1);
  check('Reply-To is clientEmail', mails()[0]?.reply_to === 'test@example.com');

  const before = mails().length;
  const cases = {
    'email-only unrelated field': { misc: 'audit@example.invalid' },
    'missing name': { ...VALID, clientName: '' },
    'missing company': { ...VALID, clientCompany: '' },
    'missing message': { ...VALID, projectOverview: '' },
    'short message': { ...VALID, projectOverview: 'too short' },
    'oversized message': { ...VALID, projectOverview: 'x'.repeat(2001) },
    'oversized name': { ...VALID, clientName: 'A'.repeat(61) },
    'invalid email': { ...VALID, clientEmail: 'not-an-email' },
    'email with newline': { ...VALID, clientEmail: 'a@b.co\nBcc: x@y.z' },
    'invalid scope': { ...VALID, projectScope: 'Something else' },
    'missing scope': { ...VALID, projectScope: '' },
    'invalid timeline': { ...VALID, projectTimeline: 'Yesterday' },
    'invalid phone': { ...VALID, clientPhone: 'call me' },
    'unrelated email in other field': { ...VALID, clientEmail: '', other: 'a@b.co' },
  };
  for (const [name, fields] of Object.entries(cases)) {
    r = await post(fields);
    check(`rejects ${name}`, r.status === 422 && r.body?.success === false, `status ${r.status}`);
  }
  // arrays
  for (const f of ['clientEmail', 'clientName', 'projectScope', 'projectOverview']) {
    const body = new URLSearchParams(VALID); body.delete(f); body.append(`${f}[]`, 'x');
    const res = await fetch(url, { method: 'POST', headers: { Accept: 'application/json', Origin: ORIGIN }, body });
    check(`rejects array ${f}`, res.status === 422, `status ${res.status}`);
  }
  const manyFields = { ...VALID }; for (let i = 0; i < 25; i++) manyFields[`extra${i}`] = 'x';
  r = await post(manyFields);
  check('rejects too many fields', r.status === 422, `status ${r.status}`);
  check('no mail sent for rejected input', mails().length === before, `${mails().length} vs ${before}`);

  r = await post({ ...VALID, clientPhone: '' });
  check('optional phone may be empty', r.status === 200);
  r = await post({ ...VALID, injected: 'ignored', clientEmail: 'real@example.com' });
  check('unknown fields ignored, not rendered', r.status === 200 && !JSON.stringify(mails().at(-1) ?? {}).includes('injected'));

  r = await post({ ...VALID, website: 'http://spam.example' });
  check('honeypot silently accepted', r.status === 200);
  check('honeypot sends nothing', !mails().some((m) => m.text.includes('spam.example')));

  const get = await fetch(url);
  check('GET rejected 405', get.status === 405 && get.headers.get('allow') === 'POST', `status ${get.status}`);

  // AUD-001: native form post (no JavaScript) gets an HTML page, not JSON, and no query string is involved
  const html = await fetch(url, { method: 'POST', headers: { Origin: ORIGIN, Accept: 'text/html' }, body: new URLSearchParams(VALID) });
  const text = await html.text();
  check('native post gets HTML success page', html.status === 200 && /text\/html/.test(html.headers.get('content-type')) && /Thank you/.test(text));
  const bad = await fetch(url, { method: 'POST', headers: { Origin: ORIGIN, Accept: 'text/html' }, body: new URLSearchParams({ ...VALID, clientEmail: 'x' }) });
  const badText = await bad.text();
  check('native invalid post gets HTML 422 with reasons', bad.status === 422 && /valid email/.test(badText));
  check('error page does not echo submitted data', !badText.includes('Acme Ltd') && !badText.includes('logistics'));
});

// ---- Origin handling (AUD-007) ------------------------------------------------
await withServer({ MAIL_MAX_PER_HOUR: '100' }, async ({ post }) => {
  const matrix = [
    ['https://thinkvistar.com', 200], ['https://www.thinkvistar.com', 200], ['https://THINKVISTAR.com:443', 200],
    ['http://thinkvistar.com', 403], ['https://thinkvistar.com:8443', 403], ['http://thinkvistar.com:9999', 403],
    ['https://evil.invalid', 403], ['https://thinkvistar.com.evil.invalid', 403], ['null', 403],
  ];
  for (const [origin, expected] of matrix) {
    const r = await post(VALID, { Origin: origin });
    check(`origin ${origin} -> ${expected}`, r.status === expected, `got ${r.status}`);
  }
  const r = await fetch(`${'http://127.0.0.1'}`).catch(() => null); void r;
});
await withServer({ MAIL_MAX_PER_HOUR: '100' }, async ({ url }) => {
  const res = await fetch(url, { method: 'POST', headers: { Accept: 'application/json' }, body: new URLSearchParams(VALID) });
  check('absent Origin allowed (documented policy)', res.status === 200, `got ${res.status}`);
});

// ---- Rate limit concurrency (AUD-005) ----------------------------------------
await withServer({ MAIL_MAX_PER_HOUR: '5' }, async ({ post, mails }) => {
  const results = await Promise.all(Array.from({ length: 20 }, () => post(VALID)));
  const ok = results.filter((r) => r.status === 200).length;
  const limited = results.filter((r) => r.status === 429).length;
  check('concurrent requests admit exactly the limit', ok === 5 && limited === 15, `ok=${ok} limited=${limited}`);
  check('exactly five mails recorded', mails().length === 5, `${mails().length}`);
  const spoof = await post(VALID, { 'X-Forwarded-For': '9.9.9.9' });
  check('spoofed X-Forwarded-For does not reset the limit', spoof.status === 429, `got ${spoof.status}`);
});

// Unwritable storage must fail closed, observably.
await withServer({ TMPDIR: '/proc/none', MAIL_MAX_PER_HOUR: '5' }, async ({ post, mails }) => {
  const r = await post(VALID);
  check('unwritable rate storage fails closed with 503', r.status === 503, `got ${r.status}`);
  check('nothing sent when storage fails', mails().length === 0);
}, { readonlyParent: true });

if (failures.length) { console.error(`FAILED ${failures.length}/${checks}\n` + failures.join('\n')); process.exit(1); }
console.log(`test-contact: ${checks} checks passed`);
