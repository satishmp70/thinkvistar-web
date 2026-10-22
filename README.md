# Thinkvistar website

Static marketing site for https://thinkvistar.com plus one PHP endpoint (`api/contact.php`)
that emails contact-form enquiries through Hostinger SMTP.

## How it fits together

```
 you edit            GitHub Actions                    Hostinger
 src/ + static/  ->  build, SEO/link checks,   ->  pulls `deploy` branch
 push to main        PHPMailer added,                 into public_html
                     result pushed to `deploy`        (+ .env above public_html)
```

| Path | What it is |
| --- | --- |
| `src/` | Page templates, `site-data.json`, CSS, JS, build and check scripts. Edit content here. |
| `static/` | Copied as-is into the site: `images/`, `fonts/` (fingerprinted by the build), `api/`, `robots.txt`, `.htaccess`. |
| `dist/` | **Generated** (git-ignored). Deleted and rebuilt on every build. Never edit. |
| `.github/workflows/` | CI: build, verify, publish to the `deploy` branch. |

Only the contents of `dist/` ever reach the server. Source, docs, CI config and `composer.json` do not.

## Local build and checks

Needs Node 18+ (22 recommended), PHP 8.1+ and Chrome/Chromium/Edge (used to pre-render pages, and by the browser checks).

```bash
cd src
npm ci
npm run build          # CHROME_PATH=/path/to/chrome if it is not auto-detected
npm test               # verify + route sweep + browser tests + contact endpoint + IndexNow tests
npm run lighthouse     # pinned Lighthouse, median of 3 runs, mobile profile
npm run test:lastmod   # real builds proving sitemap/dateModified behaviour (~2 min)
npm run audit:deps     # npm advisories (CI also runs `composer audit --locked`)
```

| Command | What it proves |
| --- | --- |
| `verify` | SEO metadata, links, structured data, sitemap/canonical/`dateModified` agreement, output hygiene (no source, secrets or dev files in `dist/`), contact form HTML matches the PHP allowlist, estimator wording |
| `check` | Every indexable route at mobile and desktop widths, every service page at 320/360/390/768/1024 px, the 404 and valid/invalid blueprints: HTTP status, console/page errors, failed requests, horizontal overflow, h1 count. Runs under the production CSP. Exit 1 on any failure |
| `test:browser` | Contact form with JavaScript disabled and with the main module blocked (POST only, nothing in the URL), accessible form errors, drawer focus trap, estimator radio groups and announcements, reduced motion, content visible when scripts fail |
| `test:contact` | `static/api/contact.php` against PHP's server with a fake mail transport and private rate-limit folder: field contract, origins, concurrency, fail-closed storage |
| `test:indexnow` | IndexNow success/rejection/retry/timeout handling with a mocked `fetch` |

## How the pages are produced

`layout.mjs` renders the shell (header, navigation with the active page, footer, social links) and each `pages/*.html` template. The build then opens every page in headless Chrome, runs `js/sections.js` once to fill the content sections from `site-data.json`, and saves the result. Pages carry `data-prerendered`, so in production the browser bundle (`js/main.js`) only adds interaction: it does not download the site data or re-render anything. `--no-prerender` skips this step and the bundle renders in the browser instead (development only).

JavaScript source (`src/js/`) uses plain, stable ES module imports and is bundled and minified by esbuild; each route loads only what it uses (the project data is bundled only into the blueprint page).

## Deploy

`deploy.bat` (or just `git push` to `main`). CI does the rest. See `DEPLOYMENT.md` for one-time server setup.

## Security notes

- Secrets live only in `.env`, kept **above** `public_html` on the server. `.env.example` is the template.
- `.htaccess` sets HTTPS/host redirects, security headers and a Content-Security-Policy that allows exactly one
  inline script, by hash. If you change that snippet in `src/layout.mjs`, update the hash:
  `printf %s "document.documentElement.classList.add('js')" | openssl dgst -sha256 -binary | openssl base64`
- Do not add third-party scripts, fonts or embeds without adding their origin to the CSP.

## Content you maintain

- Copy, services, projects, team: `src/site-data.json`. Team members accept optional `role`, `bio` and `profiles` (`[{ "label": "LinkedIn", "url": "https://…" }]`); they appear on the About page only when filled in.
- Page titles, descriptions and FAQs: `src/pages.mjs`, `src/service-pages.mjs`.
- Logos: edit the 480px masters in `static/images/logo/`, then run `python3 src/tools/make-logo-variants.py` and commit the generated `-240`/`-360` files.
- Modification dates: `npm run build` locally updates `src/lastmod.json` when a page's finished content changed. Commit it; CI never rewrites it and warns if it is stale.
