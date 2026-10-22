// Tiny static server for dist/ used by the browser checks. Unknown paths get 404.html
// with a 404 status (like Apache's ErrorDocument). `handlers` can intercept requests,
// e.g. a fake /api/contact.php; return true from a handler when it answered.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

/** The Content-Security-Policy from static/.htaccess, so browser tests run under the real policy. */
export const CSP = fs.readFileSync(new URL('../../static/.htaccess', import.meta.url), 'utf8').match(/Content-Security-Policy "([^"]+)"/)?.[1];
if (!CSP) throw new Error('Could not find the Content-Security-Policy header in static/.htaccess');

export const DIST = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };

/** `compress: true` gzips text responses, like the production host, so lab numbers reflect real transfer sizes. */
export async function startStaticServer({ handlers = [], compress = false, port = 0, host = '127.0.0.1' } = {}) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    for (const handler of handlers) {
      if (await handler(req, res, url)) return;
    }
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(DIST, p);
    if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { 'Content-Type': TYPES['.html'], 'Content-Security-Policy': CSP });
      return fs.createReadStream(path.join(DIST, '404.html')).pipe(res);
    }
    const type = TYPES[path.extname(file)] || 'application/octet-stream';
    if (compress && /html|css|javascript|xml|svg|text|json/.test(type)) {
      res.writeHead(200, { 'Content-Type': type, 'Content-Encoding': 'gzip', 'Content-Security-Policy': CSP });
      return res.end(zlib.gzipSync(fs.readFileSync(file)));
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Security-Policy': CSP });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
  return { base: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}
