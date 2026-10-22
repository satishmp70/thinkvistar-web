// Local preview of the built site (dist/):   npm run preview     then open http://127.0.0.1:4173
// Uses the production Content-Security-Policy and a stand-in /api/contact.php that sends NOTHING,
// so you can try the contact form safely. Run `npm run build` first. Stop with Ctrl+C.
import fs from 'node:fs';
import os from 'node:os';
import { startStaticServer, DIST } from './lib/static-server.mjs';

if (!fs.existsSync(`${DIST}/index.html`)) {
  console.error('dist/ is empty. Run "npm run build" first.');
  process.exit(1);
}
const port = Number(process.env.PORT || 4173);
// HOST=0.0.0.0 makes the preview reachable from other computers (use it when this machine is a remote server).
const host = process.env.HOST || '127.0.0.1';

const fakeContact = async (req, res, url) => {
  if (url.pathname !== '/api/contact.php') return false;
  for await (const chunk of req) void chunk; // read and discard the body
  const wantsJson = (req.headers.accept || '').includes('application/json');
  const message = 'Local preview: your enquiry was NOT sent anywhere.';
  res.writeHead(req.method === 'POST' ? 200 : 405, { 'Content-Type': wantsJson ? 'application/json' : 'text/html; charset=utf-8' });
  res.end(wantsJson ? JSON.stringify({ success: true, message }) : `<!doctype html><meta charset="utf-8"><title>Preview</title><p>${message}</p><p><a href="/contact/">Back</a></p>`);
  return true;
};

// If the port is taken (for example by another dev server), use the next free one.
let server;
for (let candidate = port; candidate < port + 20 && !server; candidate++) {
  try {
    server = await startStaticServer({ handlers: [fakeContact], port: candidate, host });
  } catch (error) {
    if (error.code !== 'EADDRINUSE') throw error;
    console.log(`Port ${candidate} is busy, trying ${candidate + 1}...`);
  }
}
if (!server) {
  console.error(`No free port between ${port} and ${port + 19}. Stop the other program or set PORT=<number>.`);
  process.exit(1);
}
const actualPort = new URL(server.base).port;
const lines = [`Open this address in the browser ON THIS MACHINE:   http://127.0.0.1:${actualPort}/`];
if (host !== '127.0.0.1') {
  const addresses = Object.values(os.networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
  for (const address of addresses) lines.push(`From another computer on the same network:           http://${address}:${actualPort}/`);
} else {
  lines.push('Using this machine over SSH or remote desktop? Stop (Ctrl+C) and run:  HOST=0.0.0.0 npm run preview');
}
console.log(`\n  =====================================================\n   Preview is running.\n\n${lines.map((l) => `   ${l}`).join('\n')}\n\n   Ctrl+C in this terminal stops it.\n  =====================================================\n`);
