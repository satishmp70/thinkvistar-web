// Finds an installed Chrome/Chromium/Edge for pre-rendering and browser checks.
import fs from 'node:fs';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

/** Path to a usable browser, or throws an error that says how to fix it. */
export function findBrowser() {
  const found = CANDIDATES.find((candidate) => candidate && fs.existsSync(candidate));
  if (!found) {
    const hint = process.env.CHROME_PATH ? ` (CHROME_PATH is set to "${process.env.CHROME_PATH}" but that file does not exist)` : '';
    throw new Error(`No Chrome, Chromium or Edge found${hint}. Install one, or set CHROME_PATH to its executable.`);
  }
  return found;
}

/** Launch options shared by every script (the sandbox flag is needed in most containers/CI). */
export function launchOptions() {
  return { executablePath: findBrowser(), headless: true, args: ['--no-sandbox'] };
}
