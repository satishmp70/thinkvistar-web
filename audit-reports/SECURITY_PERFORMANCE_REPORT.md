# Security, performance, accessibility and mobile report

Audit date: 22 October 2026 (Asia/Kolkata). Audited the current working tree at base commit `8662ddb`, including existing staged, unstaged and untracked changes. Source references are relative to the repository root and include line numbers for this snapshot. No application fixes were made by this audit. During the audit, concurrent workspace edits changed the shared head, Lighthouse runner, historical SEO document and generated output. Those changes were preserved; AUD-002 was subsequently resolved and rechecked.

Related: [Summary](WEBSITE_AUDIT_SUMMARY.md) · [Architecture](ARCHITECTURE_ISSUES.md) · [Search](SEO_AEO_GEO_AUDIT.md) · [Security/performance](SECURITY_PERFORMANCE_REPORT.md) · [Complete register](COMPLETE_ISSUE_REGISTER.md) · [Roadmap](WEBSITE_IMPROVEMENT_ROADMAP.md).

## Readiness assessment

The current source has good baseline controls and strong compressed local lab performance. It still requires remediation before unconditional production sign-off: contact fallback privacy (AUD-001), affected development dependencies (AUD-003), and mobile service-page overflow (AUD-004) lead the queue. No Critical-severity issue, active production exploit, confirmed current secret disclosure or PHPMailer advisory was established.

## Existing security strengths

- `static/api/config.php` uses environment values with an outside-web-root .env candidate; the current committed template contains an obvious placeholder password. Config direct access is guarded, and Apache denies config/environment/metadata paths.
- `static/api/contact.php` enforces POST, uses a honeypot and a per-IP rate budget, filters control characters, validates an email, limits combined value length, escapes HTML email cells, and returns generic delivery failures while logging details.
- SMTP uses PHPMailer with TLS/SMTPS configuration rather than embedding credentials in the browser. Composer lock advisory check returned no advisories or abandoned packages on this audit date; this is a point-in-time scan, not a guarantee.
- `static/.htaccess:74–82` configures nosniff, referrer policy, framing restrictions, Permissions Policy, a restricted script CSP and HSTS. Vendor/repository access and directory listing are restricted in the intended Apache configuration.
- External new-tab links generally include noopener/noreferrer. No authenticated session or database query surface was found in this marketing site, so SQL injection/login/password findings were not fabricated.

Actual production modules, response headers, private-file denial, PHP version, DNS mail authentication and SMTP delivery remain unverified.

## Confirmed security issues

| ID | Severity | Confirmed finding | Exact references | Status |
|---|---|---|---|---|
| AUD-001 | High | Contact form submits personal details by GET when JavaScript is unavailable | src/pages/contact.html:47; src/js/main.js:304 | Open |
| AUD-003 | High | Development dependency graph contains known high advisories | src/package-lock.json:212; src/package-lock.json:424; src/package-lock.json:684; src/package.json:13 | Open |
| AUD-005 | Medium | Rate limiting does not lock its read/check/write transaction | static/api/contact.php:78 | Open |
| AUD-006 | Medium | Server accepts enquiries that bypass the actual field contract | static/api/contact.php:150; static/api/contact.php:173; src/js/main.js:296 | Open |
| AUD-007 | Low | Same-origin guard compares hostnames rather than complete origins | static/api/contact.php:47 | Open |

Evidence, root causes, reproduction, business/technical impacts, dependencies, estimates and acceptance tests for these IDs are in the [complete register](COMPLETE_ISSUE_REGISTER.md). Repeated references across reports describe the same issue, not additional entries. AUD-002 describes an initial finding resolved by a concurrent external edit; it is not an open production blocker.

### OWASP-related interpretation

| Observed issue | Relevant control theme | Evidence limit |
|---|---|---|
| AUD-001: GET fallback can serialize personal fields | Sensitive data handling and secure transport of submitted data | Local native form behavior confirmed; no real user disclosure observed. HTTPS alone does not prevent query strings entering history/logs. |
| AUD-003: affected dev dependency graph | Software component and supply-chain management | Advisories and locked versions confirmed; exploitation via this build was not demonstrated; dev packages are excluded from deployed payload. |
| AUD-005: non-atomic, unchecked rate persistence | Abuse resistance, reliable resource controls | Read/check/write defect confirmed from code; real-host bypass volume not measured. |
| AUD-006: arbitrary-field email selection / missing required contract | Server-side input validation | Local incomplete payload reached delivery; no live mail was sent. |
| AUD-007: hostname-only origin comparison | Correct request-origin validation | Scheme/port mismatch accepted locally; public endpoint has no account action and Origin is not authentication. |

These are mappings to review themes, not OWASP certification or a claim that every OWASP category was exploitable. Validation belongs on the server as well as the client; the actual server contract is the defect here. [OWASP input-validation guidance](https://community.owasp.org/vulnerabilities/Improper_Data_Validation).

### Dependency scan details

`npm audit --package-lock-only --json` returned **7 high package entries, 0 critical**, in a dev dependency graph of approximately 80 packages. Treat the chain as one remediation unit (AUD-003), not seven independent application vulnerabilities:

- `basic-ftp@5.3.1`: FTP listing parser denial-of-service advisory [GHSA-c475-qrg2-pj4r](https://github.com/advisories/GHSA-c475-qrg2-pj4r).
- `extract-zip@2.0.1`: symlink/path traversal and file-write advisories [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3).
- Inherited affected entries: `get-uri`, `pac-proxy-agent`, `proxy-agent`, `@puppeteer/browsers`, `puppeteer-core`.

The regular build launches an already installed local browser; no proof was established that it downloads untrusted archives or calls the vulnerable FTP parser. Review exact reachability when prioritizing the tooling update, keep development dependencies out of public artifacts, and avoid blind major-version audit fixes. Advisories can change; rerun at implementation time.

## Performance measurements

These are **single-run local mobile lab measurements** from the initial source snapshot before the concurrent removal of two optional hreflang head lines, Lighthouse **12.8.2**, Headless Chrome **144.0.0.0**, Linux, static output from the audited source. The temporary server applied gzip to HTML/CSS/JS/SVG. Lighthouse used simulated mobile throttling: 412×823 CSS pixels, DPR 1.75, 4× CPU slowdown, RTT 150 ms and throughput 1,638.4 Kbps. It did not execute Apache rewrite rules or PHP, and did not reproduce production cache/security headers. Sampled pages are home, contact, one representative service and estimator. Values are rounded in the table; scores are the tool's actual scores. No median, percentile or field INP was measured. An earlier uncompressed diagnostic was discarded for the score table because it did not model intended compression.

| Page | Performance | Accessibility | Best practices | SEO | LCP (ms) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 99 | 100 | 100 | 100 | 2180 | 0.000 | 0 |
| `/contact/` | 99 | 100 | 100 | 100 | 1954 | 0.000 | 0 |
| `/services/saas-development/` | 99 | 100 | 100 | 100 | 1954 | 0.000 | 2 |
| `/estimator/` | 99 | 100 | 100 | 100 | 1954 | 0.000 | 5 |

The four compressed lab runs satisfy the repository's configured performance ≥90, accessibility ≥95, best-practices ≥90, SEO ≥95, LCP ≤2,500 ms and CLS ≤0.1 thresholds. The initial gate deadlock was repaired by a concurrent workspace edit (AUD-002); the updated actual gate was rerun separately. See the final validation note. A 100 automated accessibility/SEO score does not override the manually confirmed keyboard/state/mobile defects, and is not proof of standards conformance or search indexing.

Core Web Vitals are LCP, INP and CLS. Field assessment uses representative real-user distributions; TBT is a lab responsiveness diagnostic and is not INP. No field INP or real-user CWV pass/fail result was measured. Use the published good thresholds (LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1) at the 75th percentile when field data is available. [web.dev: Web Vitals](https://web.dev/articles/vitals).

### Confirmed performance opportunities

| ID | Severity | Confirmed finding | Exact references | Status |
|---|---|---|---|---|
| AUD-014 | Low | Every route preloads full site data and shares the entire CSS/runtime payload | src/build.mjs:50; src/build.mjs:57; src/layout.mjs:109 | Open |
| AUD-020 | Low | Unversioned font URLs are cached immutable for a year | static/.htaccess:67; src/layout.mjs:109; src/css/fonts.css:1 | Open |
| AUD-023 | Low | Logo images lack appropriately sized responsive variants | src/layout.mjs:13; src/js/main.js:723; static/images/logo/thinkvistar-logo.webp; static/images/logo/thinkvistar-logo-light.webp | Open |

Evidence, root causes, reproduction, business/technical impacts, dependencies, estimates and acceptance tests for these IDs are in the [complete register](COMPLETE_ISSUE_REGISTER.md). Repeated references across reports describe the same issue, not additional entries. AUD-002 describes an initial finding resolved by a concurrent external edit; it is not an open production blocker.

Measured output bytes from the current build:

| Asset | Raw bytes | Local gzip bytes | Observation |
|---|---:|---:|---|
| Shared CSS | 76,559 | 16,169 | Four concatenated stylesheets on every route. |
| Full site data module | 49,822 | 17,274 | Includes unrelated route content and legal/project narratives. |
| Main runtime | 45,424 | 13,013 | Forms, estimator, rendering, shell and motion share one module. |
| Icons module | 15,775 | 3,330 | Globally preloaded. |

These are content compression measurements, excluding HTTP headers, not production transfer totals. On the gzip-enabled local Lighthouse run, contact unused-CSS savings were estimated at 12,595 bytes, SaaS service 12,156 bytes and estimator 12,163 bytes (AUD-014). Header/footer responsive-logo resizing savings were estimated at 38,982 bytes on inner pages (AUD-023); that is not guaranteed without producing acceptable new assets. Global preloads and unminified/unused diagnostics should be optimized only with before/after coverage and repeatable lab tests.

The temporary server intentionally did not reproduce cache headers, so Lighthouse cache warnings are not proof production has no caching. Source config already includes compression and fingerprinted CSS/JS caching. AUD-020 is the narrower confirmed font filename/cache-policy mismatch. No production TTFB bottleneck, hosting-capacity limit or geographic latency was measured.

Animation includes blur/transforms, scroll observers and pointer effects; reduced-motion CSS/runtime handling exists. These effects are not automatically a measured performance defect. The meaningful resilience failure is AUD-011: main-module failure leaves 19 homepage reveal elements hidden even though their HTML was prerendered. Browser automation also skips the runtime motion() polish when navigator.webdriver is true; real-device interactive profiling is still needed before claiming all visitor animation paths are validated.

## Accessibility and mobile behavior

| ID | Severity | Confirmed finding | Exact references | Status |
|---|---|---|---|---|
| AUD-004 | High | All seven service detail pages overflow the mobile viewport | src/css/additions.css:61; src/css/additions.css:186; src/service-pages.mjs:317 | Open |
| AUD-008 | Medium | Form errors are not programmatically linked to their controls | src/js/main.js:67; src/pages/contact.html:53 | Open |
| AUD-009 | Medium | Estimator selections and changing results lack accessible state | src/pages/estimator.html:24; src/js/main.js:596 | Open |
| AUD-010 | Medium | Open mobile drawer allows keyboard focus into obscured page content | src/layout.mjs:146; src/js/main.js:1243 | Open |
| AUD-011 | Medium | A failed application module leaves prerendered content visually hidden | src/layout.mjs:75; src/css/premium.css:76; src/js/main.js:1279 | Open |
| AUD-016 | Medium | Browser QA cannot select an installed Linux Chrome | src/check.mjs:28 | Open |
| AUD-017 | Medium | Browser regressions are printed rather than enforced and coverage is incomplete | src/check.mjs:30; src/check.mjs:47; .github/workflows/check.yml:25 | Open |

Evidence, root causes, reproduction, business/technical impacts, dependencies, estimates and acceptance tests for these IDs are in the [complete register](COMPLETE_ISSUE_REGISTER.md). Repeated references across reports describe the same issue, not additional entries. AUD-002 describes an initial finding resolved by a concurrent external edit; it is not an open production blocker.

Positive findings: shared main landmark and skip link, visible form labels, native FAQ details/summary, a mobile menu expanded state and Escape handler, explicit image dimensions/alt checks, and reduced-motion handling. At 1366 px every tested indexable route had zero page overflow. At 390 px the 11 non-service indexable routes also had zero page overflow; all seven service-detail pages overflowed by 148 px.

The mobile grid root cause is a min-content width inherited from a table. Keep intentional table scrolling inside its wrapper instead of clipping body overflow to conceal it (AUD-004). Test 320/360/390 px after the fix; these extra widths are acceptance targets, not measurements already performed.

At the mobile contact menu, keyboard focus traversed seven menu links and then moved to background Home/email/phone/name while the drawer was open. A modal presentation should contain focus and make background content inert; an inline disclosure can instead use a non-modal model. [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Follow the chosen interaction model rather than adding aria-modal without behavior.

Six contact error spans lacked accessible control relationships (AUD-008). Five estimator option groups exposed visual .active state without aria-pressed/checked; results lacked announcements (AUD-009). These were confirmed by DOM/keyboard inspection. Screen-reader behavior must still be manually verified after remediation. No full WCAG 2.2 AA audit, contrast certification, touchscreen usability study or assistive-device matrix was completed.

## Verification and operational controls

- Run repaired complete-route browser checks and mobile/table/keyboard regressions; ensure the QA job fails on known injected failures (AUD-016/AUD-017).
- Repeat compressed Lighthouse measurements at least three times per representative route; compare medians under a fixed tool/browser profile. Keep JSON artifacts with the reviewed commit. A single lab sample is useful evidence, not a service-level guarantee.
- Test the server request schema and rate transaction with fake transport and isolated storage before any approved real mail test. Test invalid types, missing values, oversize input, origin scheme/port and concurrency; preserve generic error handling without suppressing operational failures.
- Check real deployment TLS, compression, CSP, HSTS, denied config/vendor URLs and 404s. Do not treat the Node/PHP development server as equivalent to Apache `.htaccess` enforcement.
- Verify one approved real enquiry, delivery logs and DNS mail authentication; confirm proxy header trust from actual infrastructure. Keep .env outside the web root and rotate a password if historic exposure is established.

The roadmap contains per-ID implementation steps, dependencies, estimates and verification procedures. All fixes remain subject to owner approval.

## Final snapshot reconciliation and validation

A final file-hash comparison detected concurrent edits outside the audit to `src/layout.mjs`, `src/lighthouse-check.mjs`, `SEO-REPORT.md` and generated HTML. Those edits were preserved. The two changed source files were copied into the temporary audit workspace and the actual updated commands were rerun: full prerendered build (20 pages/18 sitemap URLs), `verify: 20 pages OK`, and `lighthouse-check: OK` (exit 0). All four updated-gate pages scored performance 99, accessibility 100, best-practices 100 and SEO 100; LCP was home 2,179 ms, contact 1,953 ms, SaaS 1,954 ms, estimator 1,953 ms; all CLS values were 0.000. These are a separate local gate run, not field metrics or a multi-run median.

AUD-002 is therefore **Resolved (external change; rechecked)** and is excluded from the 22 open issues. The audit itself wrote only the six Markdown reports; it did not implement the external correction or overwrite application files. The detailed independent lab table is explicitly labeled as the earlier snapshot. Removal of the optional single-language hreflang pair does not create an indexing defect; source references affected by that removal were rebased.
