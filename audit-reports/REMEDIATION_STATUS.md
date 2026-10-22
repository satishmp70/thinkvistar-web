# Remediation status

Remediation date: 22 October 2026 (Asia/Kolkata). Scope: local implementation only. Nothing was pushed, deployed, emailed, submitted to a search engine or sent to any third party. The original audit reports are unchanged; `COMPLETE_ISSUE_REGISTER.md` has a completion-notes section appended at the end.

**Implemented** means the change is in the source. **Verified** means a command or browser run exercised the acceptance criterion and passed (results below). Where only code inspection was possible this is stated.

## Result in one view

| Outcome | IDs |
|---|---|
| Resolved (implemented and verified locally) | AUD-001, 002 (preserved), 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015, 016, 017, 020, 021, 022, 023 |
| Partially resolved | AUD-019 (data-driven team section built and verified; approved roles/bios not supplied) |
| Externally blocked | AUD-018 (needs approved client case facts) |
| Unresolved | none |

Resolved means "acceptance criteria met on the local build". Several still need an owner or production check before they can be called proven on the live site; those are listed in the second half of this file, separately from the local results.

## Status table

| ID | Initial status | Current status | Files changed | Verification evidence | Remaining dependency |
|---|---|---|---|---|---|
| AUD-001 | Open / High | **Resolved** | `src/pages/contact.html`, `static/api/contact.php`, `src/js/forms.js`, `src/test-browser.mjs`, `src/verify.mjs` | Form is `method="post" action="/api/contact.php"` with native constraints; JS only adds `novalidate`. `test:browser`: with JavaScript disabled and with `main-*.js` blocked, empty submit is stopped natively (0 requests), a valid submit is one POST, the API URL has no query string and the landed URL holds none of the entered values. The same test run on the previously deployed build fails with `GET …/contact/?website=&clientName=Synthetic+Tester&…` (defect reproduced). Server answers native posts with an HTML page, JSON for `Accept: application/json` (`test:contact`). `php -l` passes | Real SMTP delivery of one approved test enquiry (not performed) |
| AUD-002 | Resolved (external) | **Resolved (preserved, re-verified)** | `src/lighthouse-check.mjs` (async launch kept; additionally pinned `lighthouse@12.8.2`, median of N runs, per-run timeout, `--pages`, `--min-performance`), `src/lib/static-server.mjs` | `npm run lighthouse` completes for all four pages (3 runs each). Forced failure: `--min-performance 101` exits 1 with `median performance 100 < 101` and the server closes. CI step order unchanged and reachable | none |
| AUD-003 | Open / High | **Resolved** | `src/package.json`, `src/package-lock.json` | `puppeteer-core` 24.43.1 → 25.15.0 (the major upgrade the audit named as a candidate); `esbuild` added. `npm audit`: **0 vulnerabilities** (was 7 high). `composer audit --locked`: no advisories. Prerender, route sweep and all browser tests pass on 25.15.0 with Chrome from `/usr/bin/google-chrome`. Dev dependencies are absent from `dist/` (`verify` output-hygiene check) | none |
| AUD-004 | Open / High | **Resolved** | `src/css/additions.css` (`minmax(0,1fr)` + `min-width:0` on `.service-detail-grid`, included-list grid) | `check`: all seven service pages at 320, 360, 390, 768 and 1024 px have no horizontal overflow (35 checks). The same check on the previously deployed build fails with 149 px at 390 px, 178 at 360, 218 at 320 (matches the audit's 148 px) | none |
| AUD-005 | Open / Medium | **Resolved** | `static/api/contact.php`, `static/api/config.php`, `.env.example` | `test:contact`: 20 parallel same-IP requests with limit 5 → exactly 5 admitted, 15 × 429, exactly 5 messages recorded (PHP built-in server, 8 workers). `flock` held across read, prune, check, write. Counters live in a private folder (`RATE_LIMIT_DIR`, else home, else temp); idle-counter pruning is implemented but was not separately exercised. **Follow-up (22 Oct, found by an intermittent test failure):** a race when the counter folder was first created could give a concurrent request its own counter (6 admitted instead of 5); fixed by re-checking the folder after a failed create; 40 consecutive clean runs afterwards. Unwritable storage → HTTP 503, nothing sent, cause logged (fail closed) | Behaviour of `flock` on the actual Hostinger filesystem is unverified (see below) |
| AUD-006 | Open / Medium | **Resolved** | `static/api/contact.php`, `src/verify.mjs` | `test:contact` (46 checks): allowlisted scalar fields only; email-only payload, unrelated-field email, missing name/company/message/scope, short/oversized message, oversized name, invalid/newline email, invalid scope/timeline/phone, array-valued fields and >20 fields all return 422 and send nothing. Reply-To comes only from `clientEmail`. Unknown fields ignored and never rendered. `verify` fails if the HTML `<select>` options and the PHP `SCOPES`/`TIMELINES` lists drift apart | Owner approval of the field contract (implemented as the existing form's fields) |
| AUD-007 | Open / Low | **Resolved** | `static/api/contact.php`, `static/api/config.php`, `.env.example`, `DEPLOYMENT.md` | `test:contact` origin matrix: `https://thinkvistar.com`, `https://www.thinkvistar.com`, `https://THINKVISTAR.com:443` → 200; `http://thinkvistar.com`, `:8443`, `:9999`, `https://evil.invalid`, `thinkvistar.com.evil.invalid`, `null` → 403. Absent `Origin` is allowed by explicit, documented policy (not an authentication control) and tested | Staging origins must be added to `ALLOWED_ORIGINS` if staging posts the form; confirm the host forwards `Origin` unchanged |
| AUD-008 | Open / Medium | **Resolved** | `src/js/forms.js`, `src/pages/contact.html` | `test:browser`: all six invalid fields are `aria-invalid="true"`, each `aria-describedby` includes its error id, each error has text, focus lands on the first invalid field, a status region (`role="status"`) names the fields, clearing a message keeps the association. Previously deployed build fails these (errors unlinked, no status role) | Manual screen-reader pass (not performed) |
| AUD-009 | Open / Medium | **Resolved** | `src/js/estimator.js`, `src/pages/estimator.html`, `src/css/additions.css` | `test:browser`: five groups are `role="radiogroup"` named by their heading, each has exactly one `aria-checked="true"` and one tab stop, arrow keys select and move focus, a debounced polite live region announces "Estimate updated: …"; the result panel itself is not a live region. Lighthouse accessibility 100 on `/estimator/` | Manual screen-reader pass (not performed) |
| AUD-010 | Open / Medium | **Resolved** | `src/js/shell.js`, `src/layout.mjs` | `test:browser` at 390 px: closed drawer is `inert`; open drawer is a modal dialog with focus inside and the page `inert`; 24 Tab and 12 Shift+Tab presses never leave the menu; Escape closes and returns focus to the menu button. Previously deployed build fails (focus reached form fields behind the menu) | Manual screen-reader pass (not performed) |
| AUD-011 | Open / Medium | **Resolved** | `src/js/motion.js`, `src/css/premium.css`, `src/css/site.css` | Content is visible by default; only below-the-fold elements are armed after the observer exists. `test:browser`: on `/`, a service page and `/about/`, with the main module, all asset scripts, or the shared chunk blocked, 0 `.reveal` elements are hidden and headline + CTAs are present; below-fold content appears when scrolled; with `prefers-reduced-motion` nothing is armed. Previously deployed build: 19 of 19 hidden on `/` | none |
| AUD-012 | Open / Medium | **Resolved** | `src/layout.mjs`, `src/js/main.js`, `src/js/sections.js`, `src/build.mjs` | Shell (navigation with active page, footer, social links) is rendered only by `layout.mjs`; no browser code rebuilds it. Section content is rendered once, at build time. Finished pages carry `data-prerendered`, and `verify` fails if one does not. Text comparison of all 20 pages against the previously deployed build (final build): **17 pages identical; the only 3 that differ are the intentional edits** (contact phone label: 2 lines, privacy sentence: 2 lines, estimator wording: 17 lines) | none |
| AUD-013 | Open / Medium | **Resolved** | `src/js/` (new modules: `main`, `shell`, `motion`, `forms`, `estimator`, `projects`, `sections`, `case-study`, `lib/dom`, `lib/icons`, `lib/nav-icons`), `src/build.mjs`, `src/package.json`, `src/verify.mjs` | Descriptive names and stable relative imports; esbuild bundles and splits. `verify` fails if source imports a hashed artefact (`dataLoader-…`, `icons-…js`); none exist. All 77 routes, the form, estimator, drawer and legal pages behave as before (route sweep + 71 browser checks) | none |
| AUD-014 | Open / Low | **Resolved** (acceptance criteria met; optional CSS splitting evaluated, deferred) | `src/build.mjs`, `src/js/main.js`, `src/js/sections.js`, `src/layout.mjs` | No route preloads or downloads site data (the ~60 KB data chunk is bundled only into the blueprint page; `test:browser` asserts the project filter makes no data download). Contact page JS: 33.6 KB gz (data + icons + main) → 6.8 KB gz (main + a 255-byte shared chunk); CSS 16.2 → 14.5 KB gz (minified). Lighthouse medians, previous build → now (3 runs, lab): contact transfer 190 KB → 130 KB, LCP 2105 → 1804 ms, performance 99 → 100. CSS coverage at a 390 px viewport shows 60–86 % unused per route, but that includes desktop media queries, and a purge tool cannot see classes added by JavaScript; splitting a hand-written stylesheet was judged riskier than its benefit | Optional: route CSS split if later field data justifies it |
| AUD-015 | Open / Medium | **Resolved** | `src/build.mjs`, `src/layout.mjs` (`{{LASTMOD}}` token), `src/lastmod.json`, `src/test-lastmod.mjs` | Dates are driven by a hash of each finished page. `test:lastmod` (real builds in an isolated copy): unchanged rebuild preserves all dates and hashes; a hero-only change moves only `/`; a service-copy change moves exactly the pages whose HTML contains it; `dateModified` equals sitemap `lastmod` on every page; `--keep-lastmod` (CI) leaves `lastmod.json` byte-identical and warns when stale. `verify` also checks the agreement. The repository's `lastmod.json` was migrated: pages with real text changes today (contact, privacy, estimator) are dated 2026-10-22, the rest keep 2026-09-29 | none |
| AUD-016 | Open / Medium | **Resolved** | `src/lib/browser.mjs`, `src/check.mjs`, `src/build.mjs` | One resolver honours `CHROME_PATH`, then standard Linux/macOS/Windows paths, and throws an actionable error naming the variable; used by build, check, tests. `npm run check` runs on Linux with Chrome (77 checks). try/finally closes browser and server | Supported Windows/macOS paths not exercised here |
| AUD-017 | Open / Medium | **Resolved** | `src/check.mjs`, `src/test-browser.mjs`, `src/lib/static-server.mjs`, `.github/workflows/check.yml` | Routes come from `pages.mjs` (18 indexable × 2 widths, 7 service pages × 5 widths, valid and invalid blueprint, intentional 404). Failures are aggregated and exit 1. Run against the previously deployed build it reports 149 px overflow on all seven service pages. Tests run under the production CSP from `static/.htaccess`. CI runs check, browser tests, contact, IndexNow and date tests and uploads screenshots/results on failure | CI run on GitHub (not performed) |
| AUD-018 | Open / Medium | **Externally blocked** | none | The four projects remain `isPlaceholder` blueprints, honestly labelled; nothing was invented | Owner: client permission and approved facts (see below) |
| AUD-019 | Open / Low | **Partially resolved** | `src/site-data.json` (`team`), `src/pages/about.html`, `src/js/sections.js`, `src/css/additions.css` | Team cards are generated from data; optional `role`, `bio`, `profiles` render only when supplied. The owner supplied three LinkedIn URLs (22 Oct 2026); each now shows as a labelled profile link on the About page (`aria-label="<name> on LinkedIn"`, `rel="noopener noreferrer"`), the `?isSelfProfile=true` parameter was dropped from one URL, and the About date moved to 2026-10-22. Build, `verify`, 77 route checks and 71 browser checks pass. Profile pages were not fetched, so their contents and availability are unchecked. No role, bio or credential was invented | Owner: approved roles, short bios, profile URLs (see below) |
| AUD-020 | Open / Low | **Resolved** | `src/build.mjs`, `src/layout.mjs`, `src/css/fonts.css` (rewritten at build), `src/verify.mjs` | Font files are renamed with a content hash (`inter-latin.<hash>.woff2`); CSS and preloads use the hashed URLs. `verify` fails on any unfingerprinted, missing or unreferenced font. The long-lived `immutable` header is now safe for them | `curl -I` of a font on the live host (not performed) |
| AUD-021 | Open / Low | **Resolved** | `src/indexnow.mjs`, `src/test-indexnow.mjs` | `test:indexnow` (15 checks, mocked `fetch`): 200/202 succeed; 400/403/422 fail immediately with the reason; 429/5xx and timeouts are retried a bounded number of times then fail; network errors reported; request carries a timeout signal; key file must be reachable and match. Exits 1 on failure. `--dry-run` prints the count only | Live notification after approved deployment (not performed) |
| AUD-022 | Open / Medium | **Resolved** | `src/pages/estimator.html`, `src/js/estimator.js`, `src/css/additions.css`, `src/verify.mjs` | Labels now read "Indicative Uptime Target" with "uptime target" values, "SOC 2 / GDPR-Aligned Controls", "HIPAA / PCI-DSS-Aligned Controls … assessed/scoped separately", and a visible note says estimates are indicative, uptime is a design target, and certifications need separate assessment. `verify` fails if the removed claims (`Guaranteed SLA`, `SOC 2 & GDPR Ready`, `HIPAA / PCI-DSS Level 1`, `Mission-Critical SLA`) return; `test:browser` re-checks the rendered panel after changing scale and security; `verify` checks the default markup and bundles | Engineering and commercial owner should approve the wording |
| AUD-023 | Open / Low | **Resolved** | `src/layout.mjs`, `static/images/logo/thinkvistar-logo{,-light}-{240,360}.webp`, `src/tools/make-logo-variants.py` | `srcset` 240/360/480 with `sizes` matching the CSS heights. `test:browser` (`img.currentSrc`): mobile DPR 1, 1.75 → 240 px file; DPR 2 → 360; desktop DPR 1 → 240, DPR 2 → 360, DPR 3 → 480 (largest available); never smaller than the device pixels needed. Header logo bytes on mobile 34,310 → 11,192; footer 17,648 → 8,154 | Brand-owner visual sign-off on the downsized logos |

## Verification results (final run, clean `npm ci`, 22 October 2026)

| Command | Result |
|---|---|
| `npm ci` + `npm audit` | 0 vulnerabilities (before: 7 high) |
| `composer audit --locked` | No security vulnerability advisories found |
| `php -l static/api/contact.php`, `config.php` | No syntax errors |
| `npm run build` (full, prerendered) | 20 pages, 18 sitemap URLs; a second build leaves `lastmod.json` unchanged |
| `npm run verify` | `verify: 20 pages OK` |
| `npm run check` | 77 route checks passed |
| `npm run test:browser` | 71 checks passed |
| `npm run test:contact` | 46 checks passed |
| `npm run test:indexnow` | 15 checks passed |
| `npm run test:lastmod` | 7 checks passed |
| `npm run lighthouse` | OK (median of 3, Lighthouse 12.8.2) |

**Lighthouse, mobile lab profile, gzip-serving local static server, median of 3 runs.** Lab data only: no field INP/LCP/CLS was measured and none of this is a Core Web Vitals verdict.

| Page | Performance | Accessibility | Best practices | SEO | LCP (ms, runs) | CLS | TBT (ms) | Transfer |
|---|---:|---:|---:|---:|---|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 1878 (1881/1878/1877) | 0 | 0 | 158 KB |
| `/contact/` | 100 | 100 | 100 | 100 | 1804 (1804/1657/1807) | 0 | 0 | 130 KB |
| `/services/saas-development/` | 100 | 100 | 100 | 100 | 1804 (1806/1654/1804) | 0 | 0 | 130 KB |
| `/estimator/` | 100 | 100 | 100 | 100 | 1807 (1807/1807/1803) | 0 | 0 | 131 KB |

Previous build, same tool and method: performance 99, LCP 2,105–2,180 ms, transfers 190–218 KB; accessibility 96 on contact and 95 on estimator. One regression was caught and fixed during remediation: the new estimator disclaimer first rendered dark text on the dark panel (contrast 2.02:1, accessibility 96); it now passes.

**Test sensitivity.** The route sweep and the browser suite were also run against the previously deployed build (extracted from git). They fail there on exactly the audited defects, so a passing run is meaningful.

**Output hygiene.** `verify` fails if `dist/` contains `.env`, `src/`, `node_modules`, package/composer files, `.map`/`.mjs`/`.md`/`.py`/`.bat` files, `lastmod.json`, site-data, anything under `api/` except `config.php` and `contact.php`, or text matching common secret patterns. It passes.

## Not performed: proposed checks that need production, an account or the owner

These are deliberately separate from the results above. None was attempted.

**Production host (needs the live site or a staging copy)**
- `curl -sI https://thinkvistar.com/` and `/contact/`, one fingerprinted asset and one font: status, redirects (http→https, www→apex, `/index.html`→`/`), `Cache-Control`, `Content-Security-Policy`, HSTS, `Content-Type` of `llms.txt`.
- Confirm Hostinger forwards the `Origin` header unchanged to PHP, and whether `REMOTE_ADDR` is the visitor or a proxy (decides `TRUST_PROXY_HEADERS`).
- Confirm `flock` works on the filesystem that holds `RATE_LIMIT_DIR` (some network filesystems do not honour it); submit 6 enquiries quickly from one connection and expect the 6th to be refused.
- Confirm the PHP version is 8.1+ and that the CSP does not block anything the live host injects.

**SMTP and mail**
- One approved end-to-end test enquiry through the live form; confirm delivery, the Reply-To address, spam-folder placement; check SPF/DKIM/DMARC for the sending domain.
- Rotate the mailbox password if the historical exposure described in `SEO-REPORT.md` is confirmed; create the production `.env` above `public_html`.

**Search consoles and indexing**
- Verify Google Search Console and Bing Webmaster Tools (DNS or HTML tag in `SITE.verification`), submit `sitemap.xml`, inspect the home, contact and one service URL, review coverage and canonical selection.
- After the approved deploy: `node src/indexnow.mjs` (it checks the key file first).
- Rich Results Test on the live URLs.

**Field performance**
- Real-user LCP/INP/CLS from Search Console or CrUX after traffic exists.

**Assistive technology**
- A manual pass with NVDA/VoiceOver on the contact form errors, estimator and mobile menu. Automated checks cover roles, names, focus and live-region text only.

**CI**
- A first run of `.github/workflows/check.yml` on GitHub (it has been validated as YAML and every step's command was run locally, but not on GitHub's runner).

## Owner-supplied facts still required

- **AUD-018 (client case narrative).** Written client permission; for each case: client name as they want it shown, the problem and scope, what Thinkvistar delivered and when, constraints, technologies actually used, and outcomes the client approves for publication (with how they were measured). Optional: approved logo/screenshots. Until then the four items stay labelled "Sample blueprint".
- **AUD-019 (team expertise).** Profile links are done. Still needed for each of Rahul Dubey, Satish Mishra and Chandan Yadav: the role/title to publish and a two-to-three sentence factual bio (relevant experience, areas they lead). Add them as `role` and `bio` in `team` in `src/site-data.json`; no code change is needed. `Person` structured data was not added because it would need these same facts.
- **AUD-022 wording.** Engineering and commercial owner approval of the new "indicative target / aligned controls / assessed separately" wording.
- **AUD-023.** Brand-owner sign-off that the 240/360 px logo files look right.

## Decisions and limitations to be aware of

- **Dependency added:** `esbuild` (dev only, no runtime or transitive dependencies; `npm audit` clean). Justified by AUD-013/014: stable imports, minification and per-route loading.
- **The static architecture is unchanged:** no framework, database, queue or server runtime was added. The one new server behaviour is a small private counter folder for rate limiting.
- **Behaviour changes:** a staging host that posts the form must now be listed in `ALLOWED_ORIGINS` (the old hostname-only same-origin shortcut is gone); the form refuses (HTTP 503) rather than running unlimited when no counter folder is writable; the mailto fallback after a failed send is now a visible link the visitor chooses to click, not an automatic redirect.
- **The deployed site is not changed by this work.** The release criteria below describe the local implementation.
- **Inherited line-ending note:** the original source used Windows line endings; `.gitattributes` now forces LF so hashes and builds are identical across machines.

## Does the local implementation meet the audit's release criteria?

**For the blocking items, yes.** The audit named three blockers for unconditional sign-off: the GET fallback (AUD-001), the dependency advisories (AUD-003) and the mobile service-page overflow (AUD-004). All three are resolved and verified here, together with every P1 item (AUD-005, 006, 011) and every P2/P3 item except the two that need owner content. Build, static verifier, route sweep, browser, endpoint, date and IndexNow tests, advisory scans and Lighthouse all pass.

**For unconditional production sign-off, not yet.** The audit also made that sign-off conditional on actual-host release checks, one approved end-to-end enquiry, search-console URL inspections and post-launch field measurement (the "Not performed" list above), and two content items remain open: AUD-018 (blocked) and AUD-019 (partial). These cannot be closed from the repository.
