// Unit tests for indexnow.mjs with a mocked fetch (nothing is sent anywhere).  node test-indexnow.mjs
import { submitIndexNow, checkKeyFile } from './indexnow.mjs';

const failures = [];
let checks = 0;
const check = (name, ok, detail = '') => { checks++; if (!ok) failures.push(`${name} ${detail}`); };
const base = { urls: ['https://example.test/'], host: 'example.test', key: 'k', keyLocation: 'https://example.test/k.txt', retryDelayMs: 1 };
const sequence = (...statuses) => { let i = 0; const calls = []; const fn = async (url, init) => { calls.push(init); const s = statuses[Math.min(i++, statuses.length - 1)]; if (s instanceof Error) throw s; return { status: s, text: async () => '' }; }; fn.calls = calls; return fn; };
const rejects = async (fn) => { try { await fn(); return null; } catch (e) { return e.message; } };

for (const ok of [200, 202]) {
  const f = sequence(ok);
  const r = await submitIndexNow({ ...base, fetchImpl: f });
  check(`HTTP ${ok} accepted`, r.status === ok && f.calls.length === 1);
}
for (const status of [400, 403, 422]) {
  const f = sequence(status);
  const message = await rejects(() => submitIndexNow({ ...base, fetchImpl: f }));
  check(`HTTP ${status} fails clearly without retrying`, message?.includes(`HTTP ${status}`) && f.calls.length === 1, message);
}
{
  const f = sequence(503, 503, 202);
  const r = await submitIndexNow({ ...base, fetchImpl: f });
  check('503 is retried and then succeeds', r.status === 202 && r.attempts === 3);
}
for (const status of [503, 429]) {
  const f = sequence(status);
  const message = await rejects(() => submitIndexNow({ ...base, retries: 2, fetchImpl: f }));
  check(`persistent ${status} stops after bounded retries`, message?.includes('failed after 3 attempts') && f.calls.length === 3, message);
}
{
  const f = sequence(Object.assign(new Error('timed out'), { name: 'TimeoutError' }));
  const message = await rejects(() => submitIndexNow({ ...base, retries: 1, fetchImpl: f }));
  check('timeout fails after bounded retries with a clear reason', message?.includes('no response within') && f.calls.length === 2, message);
}
{
  const f = sequence(new Error('ECONNRESET'));
  const message = await rejects(() => submitIndexNow({ ...base, retries: 0, fetchImpl: f }));
  check('network error reported', message?.includes('network error: ECONNRESET'), message);
}
check('empty URL list rejected', (await rejects(() => submitIndexNow({ ...base, urls: [] })))?.includes('No URLs'));
check('request has a timeout signal', Boolean(sequence(200) && (await (async () => { const f = sequence(200); await submitIndexNow({ ...base, fetchImpl: f }); return f.calls[0].signal; })())));
{
  const good = async () => ({ status: 200, text: async () => 'k\n' });
  check('key file ok', (await rejects(() => checkKeyFile({ keyLocation: 'x', key: 'k', fetchImpl: good }))) === null);
  const missing = async () => ({ status: 404, text: async () => '' });
  check('missing key file fails', (await rejects(() => checkKeyFile({ keyLocation: 'x', key: 'k', fetchImpl: missing })))?.includes('HTTP 404'));
  const wrong = async () => ({ status: 200, text: async () => 'other' });
  check('wrong key content fails', (await rejects(() => checkKeyFile({ keyLocation: 'x', key: 'k', fetchImpl: wrong })))?.includes('does not contain'));
}
if (failures.length) { console.error(`FAILED ${failures.length}/${checks}\n` + failures.join('\n')); process.exit(1); }
console.log(`test-indexnow: ${checks} checks passed`);
