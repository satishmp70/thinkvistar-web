// Tells Bing, Yandex and other IndexNow engines that the site changed.
//   node indexnow.mjs [--dry-run]       run AFTER the new version is live
// (Google does not use IndexNow: submit the sitemap in Search Console instead.)
//
// Exit status is 0 only when the notification was accepted. Rejections (403 bad key, 422
// URLs not on the host, 429 rate limit, 5xx) and network errors exit 1 with the reason;
// 429 and 5xx responses and timeouts are retried a few times with a delay first.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE } from './pages.mjs';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const ACCEPTED = new Set([200, 202]);
const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const REASONS = {
  400: 'bad request (invalid format)',
  403: 'key not valid or key file not found on the site',
  422: 'URLs do not belong to the host, or the key does not match',
  429: 'too many requests (rate limited)',
};

/**
 * Submits `urls`; resolves with { status, attempts } when accepted, otherwise throws.
 * `fetchImpl`, `retries`, `retryDelayMs` and `timeoutMs` are injectable for tests.
 */
export async function submitIndexNow({ urls, host, key, keyLocation, fetchImpl = fetch, retries = 3, retryDelayMs = 2000, timeoutMs = 10000 }) {
  if (!urls.length) throw new Error('No URLs to submit.');
  let lastProblem = '';
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const res = await fetchImpl(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (ACCEPTED.has(res.status)) return { status: res.status, attempts: attempt };
      lastProblem = `HTTP ${res.status}: ${REASONS[res.status] || 'unexpected response'}`;
      if (!RETRYABLE.has(res.status)) throw new Error(`IndexNow rejected the submission (${lastProblem}).`);
    } catch (error) {
      if (error.message.startsWith('IndexNow rejected')) throw error;
      lastProblem = error.name === 'TimeoutError' || error.name === 'AbortError' ? `no response within ${timeoutMs} ms` : `network error: ${error.message}`;
    }
    if (attempt <= retries) await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
  }
  throw new Error(`IndexNow submission failed after ${retries + 1} attempts (${lastProblem}).`);
}

/** The key file must be reachable and contain the key, otherwise engines will refuse the submission. */
export async function checkKeyFile({ keyLocation, key, fetchImpl = fetch, timeoutMs = 10000 }) {
  const res = await fetchImpl(keyLocation, { signal: AbortSignal.timeout(timeoutMs) });
  if (res.status !== 200) throw new Error(`Key file ${keyLocation} returned HTTP ${res.status}; deploy the site before notifying.`);
  if ((await res.text()).trim() !== key) throw new Error(`Key file ${keyLocation} does not contain the IndexNow key.`);
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const options = {
    urls, host: new URL(SITE.origin).host, key: SITE.indexNowKey, keyLocation: `${SITE.origin}/${SITE.indexNowKey}.txt`,
  };
  if (process.argv.includes('--dry-run')) {
    console.log(`IndexNow dry run: would submit ${urls.length} URLs for ${options.host}`);
    return;
  }
  await checkKeyFile(options);
  const result = await submitIndexNow(options);
  console.log(`IndexNow: accepted (HTTP ${result.status}) for ${urls.length} URLs after ${result.attempts} attempt(s)`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exit(1); });
}
