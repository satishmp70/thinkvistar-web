# Complete issue register

Audit date: 22 October 2026 (Asia/Kolkata). Scope: current working-tree snapshot at base commit `8662ddb`, including existing staged, unstaged and untracked application changes. This is not an audit of the base commit alone. The register contains **22 Open / Confirmed items and one confirmed-then-resolved item (AUD-002)**. Confirmation applies at the code or local runtime level stated in evidence; production exploitation, indexing and field performance are not implied. No application fixes were implemented by this audit.

Related reports: [Summary](WEBSITE_AUDIT_SUMMARY.md), [Architecture](ARCHITECTURE_ISSUES.md), [Search](SEO_AEO_GEO_AUDIT.md), [Security/performance](SECURITY_PERFORMANCE_REPORT.md), [Issue register](COMPLETE_ISSUE_REGISTER.md), [Roadmap](WEBSITE_IMPROVEMENT_ROADMAP.md).

**23 confirmed issues: 0 Critical, 4 High, 13 Medium, 6 Low.** Of these, 22 remain open (3 High, 13 Medium, 6 Low) and AUD-002 is resolved (High). Counts represent independent remediation units; affected pages and inherited advisory entries are not counted separately. Severity describes impact; priority describes implementation sequence. P0 includes release/privacy blockers even when severity is High.

| ID | Category | Severity | File / Page | Issue | Impact | Recommended Fix | Status |
|---|---|---|---|---|---|---|---|
| AUD-001 | Security | High | src/pages/contact.html:47;<br> src/js/main.js:304 | Contact form submits personal details by GET when JavaScript is unavailable | An enquiry can be lost and personal/project information can enter browser history and host access logs. | Define a deliberate POST fallback with native constraints and an accessible response, or disable submission until the handler is ready and provide a clear email alternative. Preserve normal AJAX operation. | Open |
| AUD-002 | Delivery & QA | High | src/lighthouse-check.mjs:21;<br> src/lighthouse-check.mjs:37;<br> .github/workflows/check.yml:32 | Initial Lighthouse gate server deadlock — resolved during audit | In the initial snapshot, the CI step could not complete a valid audit; the concurrent asynchronous-launch fix removed that release blocker and passed revalidation. | The asynchronous-launch correction is already present from an external workspace edit. Retain it and verify the updated gate; no implementation of the original deadlock fix remains. Version pinning, cleanup and timeouts are follow-up hardening rather than evidence the deadlock persists. | Resolved (external change; rechecked) |
| AUD-003 | Security | High | src/package-lock.json:212;<br> src/package-lock.json:424;<br> src/package-lock.json:684;<br> src/package.json:13 | Development dependency graph contains known high advisories | Developer/CI tooling carries avoidable supply-chain exposure and can fail security review. | Review supported Puppeteer upgrades and transitive fixes in an isolated branch; audit proposed versions and rerun prerender/browser compatibility checks. npm suggested 25.15.0, a major upgrade; treat that as a candidate to validate, not an automatic safe fix. | Open |
| AUD-004 | Mobile responsiveness | High | src/css/additions.css:61;<br> src/css/additions.css:186;<br> src/service-pages.mjs:317 | All seven service detail pages overflow the mobile viewport | Service landing pages are harder to read and use for mobile visitors arriving from commercial searches. | Allow the mobile grid and its children to shrink (for example minmax(0,1fr) and min-width:0), retain scrolling inside the table wrapper, and check long technology labels. | Open |
| AUD-005 | Security | Medium | static/api/contact.php:78 | Rate limiting does not lock its read/check/write transaction | Spam can exceed the configured budget, increasing mailbox noise and SMTP resource use. | Acquire flock before reading and hold it through pruning, validation of the limit, increment and persistence; check errors. Place buckets in an application-private directory and define cleanup and storage-failure behavior. | Open |
| AUD-006 | Security | Medium | static/api/contact.php:150;<br> static/api/contact.php:173;<br> src/js/main.js:296 | Server accepts enquiries that bypass the actual field contract | Incomplete or forged enquiries waste sales time and reduce confidence in the lead channel. | Define accepted fields, scalar types, per-field lengths, required values and scope/timeline enums. Select Reply-To only from clientEmail and reject malformed structures before allocating or sending mail. | Open |
| AUD-007 | Security | Low | static/api/contact.php:47 | Same-origin guard compares hostnames rather than complete origins | A stated abuse-prevention boundary is weaker than operators are led to expect. | Build a configured set of complete production/staging origins, normalize only default ports and compare exactly. Continue separate bot/rate controls; Origin headers cannot authenticate server-to-server senders. | Open |
| AUD-008 | Accessibility | Medium | src/js/main.js:67;<br> src/pages/contact.html:53 | Form errors are not programmatically linked to their controls | People using assistive technology may struggle to correct enquiries. | Associate each control with its error and any existing hint, preserve the association while clearing feedback, and verify the error summary and focus sequence. | Open |
| AUD-009 | Accessibility | Medium | src/pages/estimator.html:24;<br> src/js/main.js:596 | Estimator selections and changing results lack accessible state | Users who cannot perceive visual selection may be unable to use a lead-generation tool reliably. | Use fieldset/legend and native radios, or a complete documented button/radio pattern. Expose selected state and a concise polite result announcement without reading the whole panel repeatedly. | Open |
| AUD-010 | Accessibility | Medium | src/layout.mjs:146;<br> src/js/main.js:1243 | Open mobile drawer allows keyboard focus into obscured page content | Keyboard users can lose their place and interact with controls hidden by the menu. | Choose a genuine modal dialog/drawer with focus containment, background inertness, initial and restored focus, or redesign it as an inline disclosure that does not obscure interactive content. | Open |
| AUD-011 | Resilience | Medium | src/layout.mjs:75;<br> src/css/premium.css:76;<br> src/js/main.js:1279 | A failed application module leaves prerendered content visually hidden | Visitors with an interrupted or blocked script request can see missing sections and calls to action. | Default content to visible and activate animation only after its observer is ready; include a recovery path and verify partial failure without forcing all users to disable animation. | Open |
| AUD-012 | Architecture | Medium | src/layout.mjs:65;<br> src/layout.mjs:175;<br> src/js/main.js:716;<br> src/js/main.js:1188 | Shared layout has duplicate build-time and browser renderers | Simple navigation/footer changes require coordinated edits and carry preventable regression risk. | Keep the static shell in the build layer and let runtime code add only active state and interaction. Share declarative data/helpers where useful and avoid rebuilding unchanged nodes. | Open |
| AUD-013 | Architecture | Medium | src/js/main.js:1;<br> src/js/case-study.js:1;<br> src/js/privacy.js:1;<br> src/build.mjs:53 | Editable JavaScript retains generated-style names and hashed source imports | Onboarding, fixes and review take longer and are more error-prone. | After approval, format modules, replace compressed names with descriptive ones, use stable source imports, and separate forms, estimator, shell behavior and motion. Keep the static architecture rather than introducing an unnecessary framework. | Open |
| AUD-014 | Performance | Low | src/build.mjs:50;<br> src/build.mjs:57;<br> src/layout.mjs:109 | Every route preloads full site data and shares the entire CSS/runtime payload | Extra mobile downloads reduce delivery efficiency; the exact conversion or ranking effect is unmeasured. | Render static content at build time, scope client data to interactive features, load estimator/forms only where needed, and extract/minify route CSS when coverage demonstrates a worthwhile benefit. | Open |
| AUD-015 | Technical SEO | Medium | src/build.mjs:70;<br> src/build.mjs:74;<br> src/build.mjs:112;<br> src/build.mjs:133 | Sitemap modification tracking excludes client-rendered content changes | Search engines receive a stale freshness hint even when customer-facing copy changes. | Compute a stable semantic content hash from page-specific rendered content and dependencies before adding date metadata; update dates once, preserve unchanged pages, and make CI behavior deterministic. | Open |
| AUD-016 | Delivery & QA | Medium | src/check.mjs:28 | Browser QA cannot select an installed Linux Chrome | The advertised browser audit is not reproducible on the delivery platform. | Share cross-platform browser resolution, honor CHROME_PATH, use try/finally cleanup and emit an actionable missing-browser error. | Open |
| AUD-017 | Delivery & QA | Medium | src/check.mjs:30;<br> src/check.mjs:47;<br> .github/workflows/check.yml:25 | Browser regressions are printed rather than enforced and coverage is incomplete | Broken mobile landing pages can pass the current static release checks. | Generate routes from pages.mjs, include intentional 404 and valid/invalid blueprint cases, aggregate actual failures, exit nonzero, and run in CI with screenshots/logs retained on failure. | Open |
| AUD-018 | Content & AEO | Medium | src/site-data.json:330;<br> src/site-data.json:397;<br> src/site-data.json:463;<br> src/site-data.json:529;<br> src/pages/projects.html:1 | Work content has no published client-specific case narratives | Buyers have less evidence to assess delivery capability; answer engines have fewer verifiable business-specific facts to cite. | With client permission publish at least one static, internally linked case narrative covering scope, delivery, constraints and attributable outcomes; keep blueprints honestly labeled. Use truthful applicable structured data only. | Open |
| AUD-019 | GEO / entity content | Low | src/pages/about.html:34 | Named team members lack role and expertise context | Prospects cannot easily assess who leads their project or corroborate specialist experience. | Add approved roles and concise, factual bios with relevant experience and opt-in professional profile links. Add Person markup only if useful and matching visible facts. | Open |
| AUD-020 | Performance | Low | static/.htaccess:67;<br> src/layout.mjs:109;<br> src/css/fonts.css:1 | Unversioned font URLs are cached immutable for a year | A future font update can remain invisible to repeat visitors for a long period. | Fingerprint font filenames and references, add a deliberate version token, or give stable font URLs a revalidation policy. | Open |
| AUD-021 | Technical SEO | Low | src/indexnow.mjs:11;<br> src/indexnow.mjs:17 | IndexNow helper succeeds even when notification is rejected | Operators can believe search-update notification succeeded when it did not. | Accept documented success/accepted statuses, fail clearly on rejection, set a timeout, and use bounded retries for retryable responses. Invoke only after the production URLs/key are reachable. | Open |
| AUD-022 | Content & AEO | Medium | src/pages/estimator.html:65;<br> src/pages/estimator.html:144;<br> src/js/main.js:495;<br> src/js/main.js:516 | Estimator presents compliance and uptime guarantees as automatic outcomes | Prospects may form expectations that the actual statement of work cannot substantiate. | Describe uptime as an indicative target subject to architecture/contract review; describe compliance as requirements needing separate assessment. Explain exclusions and ensure FAQs/AI text use the same approved terminology. | Open |
| AUD-023 | Performance | Low | src/layout.mjs:13;<br> src/js/main.js:723;<br> static/images/logo/thinkvistar-logo.webp;<br> static/images/logo/thinkvistar-logo-light.webp | Logo images lack appropriately sized responsive variants | Avoidable image bytes consume mobile bandwidth on every cold visit. | Generate appropriately compressed responsive logo variants, emit srcset/sizes consistently in build and runtime markup, preserve dimensions and visual sharpness, and retain suitable larger variants for high-density displays. | Open |

## Evidence and implementation specifications

Paths are relative to the repository root. Line numbers refer to the audited source snapshot. Command examples used for later verification may execute builds or tests: run them in an isolated checkout after fixes are approved. Browser/fixture procedures are explicitly identified and are not existing npm test scripts.

### AUD-001 — Contact form submits personal details by GET when JavaScript is unavailable

- **Category:** Security
- **Severity:** High
- **Priority:** P0
- **Exact references:** src/pages/contact.html:47; src/js/main.js:304
- **Status / verification:** Open / Confirmed.

**Evidence:** The form has neither method nor action and explicitly disables native validation. Browser inspection with JavaScript disabled returned method=get, action=/contact/, novalidate=true. The submit interception exists only in the module.

**Steps to reproduce:** Disable JavaScript on /contact/, enter synthetic name/company/email/message, and submit. Inspect the resulting URL. Do not use real personal information in this test.

**Root cause:** Privacy and delivery depend entirely on a JavaScript submit listener; the native form defaults were not defined.

**Business impact:** An enquiry can be lost and personal/project information can enter browser history and host access logs.

**Technical impact and evidence limits:** Native GET serializes named controls into the query string instead of POSTing to api/contact.php. This is a confirmed fallback defect; no real user disclosure was observed.

**Suggested implementation:** Define a deliberate POST fallback with native constraints and an accessible response, or disable submission until the handler is ready and provide a clear email alternative. Preserve normal AJAX operation.

**Dependencies:** Contact response UX; AUD-006 server validation

**Estimated effort:** 2–4 hours

**Tests and acceptance criteria:** With scripts disabled or the main module blocked, submission never puts any enquiry field in a URL; normal valid AJAX submits once; invalid data is rejected.

**Verification command / procedure:** php -l static/api/contact.php; browser: disable JavaScript and submit synthetic contact fields; inspect URL and Network method

### AUD-002 — Initial Lighthouse gate server deadlock — resolved during audit

- **Category:** Delivery & QA
- **Severity:** High
- **Priority:** P0
- **Exact references:** src/lighthouse-check.mjs:21; src/lighthouse-check.mjs:37; .github/workflows/check.yml:32
- **Status / verification:** Resolved (external change; rechecked) / Confirmed.

**Evidence:** In the initial snapshot, the Node process started its own server and then ran Lighthouse with execFileSync (initial lines 19/35; current equivalents 21/37 are corrected). A temporary npx replacement attempted GET against the exact supplied localhost URL and timed out after 1,500 ms. Process exited 1. The probe did not run Lighthouse and is not a Lighthouse score. A concurrent workspace edit subsequently replaced execFileSync with awaited promisified execFile (current src/lighthouse-check.mjs:37). The audit did not make that change. The updated actual gate was re-run in the temporary copy; see the final summary for its result.

**Steps to reproduce:** The original defect requires the initial synchronous-runner snapshot; it no longer reproduces on the corrected current runner. For a deterministic isolated diagnostic of the original version, substitute an npx executable that requests the provided URL with a short timeout. Independent asynchronous serving works.

**Root cause:** Synchronous child execution blocks the parent event loop, preventing its server request handler from executing until the child exits.

**Business impact:** In the initial snapshot, the CI step could not complete a valid audit; the concurrent asynchronous-launch fix removed that release blocker and passed revalidation.

**Technical impact and evidence limits:** Original audit navigation stalled. That deadlock is resolved; timeout/cleanup hardening remains optional follow-up and is not counted as another confirmed release blocker.

**Suggested implementation:** The asynchronous-launch correction is already present from an external workspace edit. Retain it and verify the updated gate; no implementation of the original deadlock fix remains. Version pinning, cleanup and timeouts are follow-up hardening rather than evidence the deadlock persists.

**Dependencies:** Updated runner and installed Chrome/Lighthouse

**Estimated effort:** Resolved externally; 1–2 hours for review/regression verification

**Tests and acceptance criteria:** All four configured pages finish, threshold failures exit nonzero, server closes on error, and the CI publish step is reachable on a passing build.

**Verification command / procedure:** cd src && npm run lighthouse

### AUD-003 — Development dependency graph contains known high advisories

- **Category:** Security
- **Severity:** High
- **Priority:** P1
- **Exact references:** src/package-lock.json:212; src/package-lock.json:424; src/package-lock.json:684; src/package.json:13
- **Status / verification:** Open / Confirmed.

**Evidence:** npm audit --package-lock-only returned seven high package entries, zero critical. Root advisory packages include basic-ftp 5.3.1 (GHSA-c475-qrg2-pj4r) and extract-zip 2.0.1 (GHSA-jmr9-qjv8-65gv, GHSA-7pqw-9j4j-h8q3). Other entries propagate through get-uri, pac-proxy-agent, proxy-agent, @puppeteer/browsers and puppeteer-core 24.43.1.

**Steps to reproduce:** Run npm audit --package-lock-only --json from src and inspect the locked versions and dependency paths.

**Root cause:** The locked Puppeteer dependency chain still resolves affected archive/proxy libraries.

**Business impact:** Developer/CI tooling carries avoidable supply-chain exposure and can fail security review.

**Technical impact and evidence limits:** The advisories concern archive extraction/path traversal and FTP parsing denial of service under their required inputs. Exploit reachability in the current local-Chrome build was not demonstrated. These packages are dev dependencies and are not shipped in dist.

**Suggested implementation:** Review supported Puppeteer upgrades and transitive fixes in an isolated branch; audit proposed versions and rerun prerender/browser compatibility checks. npm suggested 25.15.0, a major upgrade; treat that as a candidate to validate, not an automatic safe fix.

**Dependencies:** Node/Chrome compatibility; lockfile update

**Estimated effort:** 0.5–1.5 days

**Tests and acceptance criteria:** No affected locked versions remain, or each unresolved advisory has an explicit scoped risk decision; build, verification and browser checks pass.

**Verification command / procedure:** cd src && npm audit --package-lock-only --json && npm run build -- --keep-lastmod && npm run verify

### AUD-004 — All seven service detail pages overflow the mobile viewport

- **Category:** Mobile responsiveness
- **Severity:** High
- **Priority:** P1
- **Exact references:** src/css/additions.css:61; src/css/additions.css:186; src/service-pages.mjs:317
- **Status / verification:** Open / Confirmed.

**Evidence:** At width 390 px, each service route had document scrollWidth 538 px: 148 px horizontal overflow. The grid children and .table-wrap measured 522 px wide; the inner table has min-width:520px. At 1366 px these pages had zero page overflow.

**Steps to reproduce:** Open each /services/<slug>/ route at 390×900. Compare document.documentElement.scrollWidth to innerWidth; inspect the technology/timeline grid.

**Root cause:** The mobile 1fr grid track and auto minimum on its children inherit the table intrinsic width, so the wrapper cannot shrink to establish local scrolling.

**Business impact:** Service landing pages are harder to read and use for mobile visitors arriving from commercial searches.

**Technical impact and evidence limits:** Whole-page overflow defeats the intended horizontally scrollable table and affects surrounding content.

**Suggested implementation:** Allow the mobile grid and its children to shrink (for example minmax(0,1fr) and min-width:0), retain scrolling inside the table wrapper, and check long technology labels.

**Dependencies:** AUD-016/AUD-017 for repeatable regression checks

**Estimated effort:** 2–4 hours

**Tests and acceptance criteria:** All seven pages have scrollWidth <= innerWidth at 320, 360, 390, 768 and 1024 px; tables remain readable through local scrolling and desktop layout remains intact.

**Verification command / procedure:** cd src && npm run build -- --keep-lastmod && node check.mjs /tmp/thinkvistar-mobile-check; browser: evaluate document.documentElement.scrollWidth - innerWidth

### AUD-005 — Rate limiting does not lock its read/check/write transaction

- **Category:** Security
- **Severity:** Medium
- **Priority:** P1
- **Exact references:** static/api/contact.php:78
- **Status / verification:** Open / Confirmed.

**Evidence:** The handler reads a per-IP JSON file at line 80, checks its count at 84, and locks only the later file_put_contents at 88. Write failures are suppressed and unchecked.

**Steps to reproduce:** Review lines 78–88. In an isolated endpoint with a fake mail transport, dispatch concurrent POSTs sharing an IP and inspect admitted requests; also make the bucket unwritable. No concurrent abuse load was sent to production.

**Root cause:** LOCK_EX on the final write serializes writes but does not protect the preceding read and decision.

**Business impact:** Spam can exceed the configured budget, increasing mailbox noise and SMTP resource use.

**Technical impact and evidence limits:** Concurrent requests can read the same count and all pass. If storage fails, subsequent requests cannot enforce persistent limits. The code defect is confirmed; production bypass throughput is not measured.

**Suggested implementation:** Acquire flock before reading and hold it through pruning, validation of the limit, increment and persistence; check errors. Place buckets in an application-private directory and define cleanup and storage-failure behavior.

**Dependencies:** Writable private storage; approved test mail sink

**Estimated effort:** 4–8 hours

**Tests and acceptance criteria:** With a configured limit of five, parallel valid requests admit at most five; persistence errors produce a controlled observable outcome without silently disabling protection.

**Verification command / procedure:** php -l static/api/contact.php; isolated test harness: parallel same-IP requests and simulated unwritable rate storage

### AUD-006 — Server accepts enquiries that bypass the actual field contract

- **Category:** Security
- **Severity:** Medium
- **Priority:** P1
- **Exact references:** static/api/contact.php:150; static/api/contact.php:173; src/js/main.js:296
- **Status / verification:** Open / Confirmed.

**Evidence:** The server uses the first email-looking value in any field; it does not require name, company, project scope or message. A local PHP probe with only {"misc":"audit@example.invalid"} reached delivery and returned 500 solely because PHPMailer was absent, rather than validation 422. No email was sent.

**Steps to reproduce:** In an isolated copy without SMTP credentials, submit an unrelated field containing a syntactically valid email, and compare validation with the client-required fields.

**Root cause:** Automatic collection of arbitrary fields replaced an explicit server-side enquiry schema.

**Business impact:** Incomplete or forged enquiries waste sales time and reduce confidence in the lead channel.

**Technical impact and evidence limits:** Client limits and required fields are bypassable; arrays and arbitrary keys are normalized instead of rejected by a bounded allowlist.

**Suggested implementation:** Define accepted fields, scalar types, per-field lengths, required values and scope/timeline enums. Select Reply-To only from clientEmail and reject malformed structures before allocating or sending mail.

**Dependencies:** Approved form schema; AUD-001 fallback contract

**Estimated effort:** 4–8 hours

**Tests and acceptance criteria:** Missing required fields, array-valued inputs, invalid emails and unsupported enum values return 422 without invoking transport; valid documented fields still deliver.

**Verification command / procedure:** php -l static/api/contact.php; isolated POST fixtures: email-only, missing name/message, array email, invalid scope, valid contact payload

### AUD-007 — Same-origin guard compares hostnames rather than complete origins

- **Category:** Security
- **Severity:** Low
- **Priority:** P2
- **Exact references:** static/api/contact.php:47
- **Status / verification:** Open / Confirmed.

**Evidence:** With HTTP_HOST=thinkvistar.com, a local request using Origin=http://thinkvistar.com:9999 progressed to 422 field validation; Origin=https://evil.invalid returned 403.

**Steps to reproduce:** Run the handler in an isolated environment with the same Host and different Origin schemes/ports, using an empty payload to stop at validation.

**Root cause:** The sameOrigin branch ignores scheme and port; it bypasses the configured exact-origin allowlist for matching hostnames.

**Business impact:** A stated abuse-prevention boundary is weaker than operators are led to expect.

**Technical impact and evidence limits:** A browser origin is scheme+host+port. This endpoint is public and has no authenticated account action, so this is not evidence of an account/session CSRF exploit. Requests without Origin are intentionally accepted and are not counted separately.

**Suggested implementation:** Build a configured set of complete production/staging origins, normalize only default ports and compare exactly. Continue separate bot/rate controls; Origin headers cannot authenticate server-to-server senders.

**Dependencies:** Staging origin policy

**Estimated effort:** 1–2 hours

**Tests and acceptance criteria:** Expected HTTPS origins pass; wrong scheme/port and unknown origins fail before delivery; absent-Origin policy is explicit and tested.

**Verification command / procedure:** php -l static/api/contact.php; isolated request matrix: HTTPS origin, HTTP origin, alternate port, unknown origin, absent Origin

### AUD-008 — Form errors are not programmatically linked to their controls

- **Category:** Accessibility
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/js/main.js:67; src/pages/contact.html:53
- **Status / verification:** Open / Confirmed.

**Evidence:** The helper creates/updates error spans and aria-invalid but never aria-describedby or aria-errormessage. Browser inspection found six unassociated errors: name, company, email, phone, scope and overview.

**Steps to reproduce:** Submit an empty contact form, focus an invalid control, and inspect its accessible description; repeat with a screen reader.

**Root cause:** Visual inline feedback was implemented without an accessible error relationship.

**Business impact:** People using assistive technology may struggle to correct enquiries.

**Technical impact and evidence limits:** Focus moves to the first invalid field but its specific error may not be conveyed as a description.

**Suggested implementation:** Associate each control with its error and any existing hint, preserve the association while clearing feedback, and verify the error summary and focus sequence.

**Dependencies:** No external dependencies

**Estimated effort:** 2–4 hours

**Tests and acceptance criteria:** Every invalid control exposes its actual error to assistive technology, errors clear correctly, and a keyboard/screen-reader user can complete the form.

**Verification command / procedure:** browser: submit empty /contact/, inspect aria-describedby/aria-errormessage and accessible description; manual screen-reader correction flow

### AUD-009 — Estimator selections and changing results lack accessible state

- **Category:** Accessibility
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/pages/estimator.html:24; src/js/main.js:596
- **Status / verification:** Open / Confirmed.

**Evidence:** The five default active option buttons have neither aria-pressed nor aria-checked; group titles are label elements without associated controls. The result panel has no live region.

**Steps to reproduce:** Navigate the estimator using keyboard and a screen reader, change scale/security/type, and inspect the accessibility tree and announced result.

**Root cause:** Selection is represented by CSS .active only, and result updates are plain text mutations.

**Business impact:** Users who cannot perceive visual selection may be unable to use a lead-generation tool reliably.

**Technical impact and evidence limits:** The selected value and result changes are not programmatically conveyed.

**Suggested implementation:** Use fieldset/legend and native radios, or a complete documented button/radio pattern. Expose selected state and a concise polite result announcement without reading the whole panel repeatedly.

**Dependencies:** Estimator interaction design

**Estimated effort:** 4–8 hours

**Tests and acceptance criteria:** Each group has an accessible name and exactly one exposed selected value; keyboard interaction is consistent; changing a choice announces the resulting estimate.

**Verification command / procedure:** browser: inspect accessible tree, operate all estimator groups by keyboard, verify selected state and polite result announcements

### AUD-010 — Open mobile drawer allows keyboard focus into obscured page content

- **Category:** Accessibility
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/layout.mjs:146; src/js/main.js:1243
- **Status / verification:** Open / Confirmed.

**Evidence:** At 390 px, opening the drawer then pressing Tab traversed seven drawer links and then Home, email, phone and clientName outside it while the drawer remained open. The implementation locks body scroll but neither traps focus nor makes background content inert.

**Steps to reproduce:** At /contact/ width 390 px open the menu with the keyboard; tab past Book a Consultation and observe background controls receiving focus.

**Root cause:** The overlay behaves visually as a modal but lacks matching focus/background interaction management.

**Business impact:** Keyboard users can lose their place and interact with controls hidden by the menu.

**Technical impact and evidence limits:** Focus escapes the overlay; aria-hidden on the drawer only governs its closed state.

**Suggested implementation:** Choose a genuine modal dialog/drawer with focus containment, background inertness, initial and restored focus, or redesign it as an inline disclosure that does not obscure interactive content.

**Dependencies:** Navigation interaction decision

**Estimated effort:** 3–6 hours

**Tests and acceptance criteria:** While a modal drawer is open, Tab/Shift+Tab remain within its controls; Escape closes it and restores focus; no background controls are available.

**Verification command / procedure:** browser: at 390 px open menu, cycle Tab/Shift+Tab, press Escape and inspect document.activeElement

### AUD-011 — A failed application module leaves prerendered content visually hidden

- **Category:** Resilience
- **Severity:** Medium
- **Priority:** P1
- **Exact references:** src/layout.mjs:75; src/css/premium.css:76; src/js/main.js:1279
- **Status / verification:** Open / Confirmed.

**Evidence:** The early inline script adds .js before the module succeeds. Blocking /assets/ scripts while allowing HTML/CSS yielded js=true and 19 .reveal elements with computed opacity 0 on the homepage.

**Steps to reproduce:** Use request blocking for asset modules, load / with HTML and CSS available, and inspect computed opacity on .reveal content.

**Root cause:** Content visibility is conditional on an observer installed by a module that can fail after the .js marker has already been set.

**Business impact:** Visitors with an interrupted or blocked script request can see missing sections and calls to action.

**Technical impact and evidence limits:** Prerendering preserves the text in HTML but does not guarantee visible content under partial script failure. This is not evidence that search engines failed to index it.

**Suggested implementation:** Default content to visible and activate animation only after its observer is ready; include a recovery path and verify partial failure without forcing all users to disable animation.

**Dependencies:** Motion initialization; AUD-012 renderer ownership

**Estimated effort:** 2–4 hours

**Tests and acceptance criteria:** Blocking the main module leaves all substantive text and CTAs visible; normal motion and reduced-motion behavior still work.

**Verification command / procedure:** browser: block assets/main-*.js, reload homepage and service pages; inspect visibility; repeat with reduced motion

### AUD-012 — Shared layout has duplicate build-time and browser renderers

- **Category:** Architecture
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/layout.mjs:65; src/layout.mjs:175; src/js/main.js:716; src/js/main.js:1188
- **Status / verification:** Open / Confirmed.

**Evidence:** layout.mjs emits navigation and footer links, and main.js Z()/Me() reconstruct the same elements with innerHTML on every normal load, including already prerendered pages.

**Steps to reproduce:** Compare layout rendering with Z()/Me(); put DOM mutation breakpoints on navbarLinks and footerQuickLinks during a reload.

**Root cause:** Prerendering was added around an inherited client renderer without giving one layer ownership of static shell output.

**Business impact:** Simple navigation/footer changes require coordinated edits and carry preventable regression risk.

**Technical impact and evidence limits:** Existing nodes are replaced after load; markup semantics and future behavior can drift between render paths. This is a maintainability finding, not a claim of a large measured CPU cost.

**Suggested implementation:** Keep the static shell in the build layer and let runtime code add only active state and interaction. Share declarative data/helpers where useful and avoid rebuilding unchanged nodes.

**Dependencies:** AUD-013 readable source; no URL/design changes needed

**Estimated effort:** 0.5–1 day

**Tests and acceptance criteria:** Navigation/footer HTML has one owner; initial links remain available without JS; active states and mobile interaction work with no redundant shell replacement.

**Verification command / procedure:** cd src && npm run build -- --keep-lastmod && npm run verify; browser: compare no-JS and JS shell links, inspect mutation breakpoints

### AUD-013 — Editable JavaScript retains generated-style names and hashed source imports

- **Category:** Architecture
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/js/main.js:1; src/js/case-study.js:1; src/js/privacy.js:1; src/build.mjs:53
- **Status / verification:** Open / Confirmed.

**Evidence:** main.js is 1,385 lines/45,430 bytes but core functions are named _, Z, Me, Pe, etc.; other editable modules are densely compressed. Imports still reference dataLoader-DErINc11.js/icons-B18VjFVw.js and are repaired by build-time regex.

**Steps to reproduce:** Read the source imports and link() in build.mjs; follow the main initialization chain at main.js:634–661.

**Root cause:** Recovered distribution-like modules are being treated as long-term editable source, with a compatibility rewrite instead of stable module boundaries.

**Business impact:** Onboarding, fixes and review take longer and are more error-prone.

**Technical impact and evidence limits:** Undocumented dispatch and regex import replacement couple unrelated UI functions to build internals; there are no source maps or descriptive module boundaries for these files.

**Suggested implementation:** After approval, format modules, replace compressed names with descriptive ones, use stable source imports, and separate forms, estimator, shell behavior and motion. Keep the static architecture rather than introducing an unnecessary framework.

**Dependencies:** Behavior baseline; AUD-002 and AUD-016/AUD-017 checks

**Estimated effort:** 1–2 days

**Tests and acceptance criteria:** Source imports resolve deliberately; no inherited hashed source specifiers remain; all current routes, enquiry UX, estimator options and legal pages retain their behavior.

**Verification command / procedure:** rg -n "dataLoader-|icons-[A-Za-z0-9_-]+\.js" src/js; cd src && npm run build -- --keep-lastmod && npm run verify

### AUD-014 — Every route preloads full site data and shares the entire CSS/runtime payload

- **Category:** Performance
- **Severity:** Low
- **Priority:** P3
- **Exact references:** src/build.mjs:50; src/build.mjs:57; src/layout.mjs:109
- **Status / verification:** Open / Confirmed.

**Evidence:** Built data module is 49,822 bytes (17,274 gzip); main is 45,424 bytes (13,013 gzip); CSS is 76,559 bytes (16,169 gzip). Data includes all project narratives, legal policies and page content. Layout preloads data/icons for every page. The gzip-enabled Lighthouse sample estimated 12,595 bytes of unused CSS on contact, 12,156 on the SaaS page and 12,163 on estimator (out of a 16,247-byte CSS transfer). These are lab estimates, not guaranteed production savings.

**Steps to reproduce:** Build in a temporary copy, inspect assets sizes and route requests, and run Lighthouse unused-CSS/coverage on home, contact, service and estimator.

**Root cause:** Build emits one complete JSON module and concatenates four CSS files; main dispatches all route features.

**Business impact:** Extra mobile downloads reduce delivery efficiency; the exact conversion or ranking effect is unmeasured.

**Technical impact and evidence limits:** Unrelated page content is downloaded and parsed on simple routes. Current byte counts are confirmed; a route-splitting speedup has not been measured.

**Suggested implementation:** Render static content at build time, scope client data to interactive features, load estimator/forms only where needed, and extract/minify route CSS when coverage demonstrates a worthwhile benefit.

**Dependencies:** AUD-012/AUD-013; repaired performance gate

**Estimated effort:** 1–2 days

**Tests and acceptance criteria:** Simple contact/legal pages do not fetch unrelated project/estimator data; compare cold-load bytes and lab medians before/after with no visual or interactive regressions.

**Verification command / procedure:** cd src && npm run build -- --keep-lastmod && npm run lighthouse; browser DevTools: Network transfer totals and CSS/JS coverage per route

### AUD-015 — Sitemap modification tracking excludes client-rendered content changes

- **Category:** Technical SEO
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/build.mjs:70; src/build.mjs:74; src/build.mjs:112; src/build.mjs:133
- **Status / verification:** Open / Confirmed.

**Evidence:** Hashing occurs before prerender and strips asset fingerprints. A source-only diagnostic changed data.hero.headline; the exact pre-prerender hash remained g9-XT9R5 before and after. CI always uses --keep-lastmod. Metadata is rendered before any new lastmod date is assigned.

**Steps to reproduce:** In an isolated copy change only hero.headline, build and compare the homepage snapshot with lastmod.json/sitemap. Repeat a second unchanged build.

**Root cause:** Modification dates are based on the pre-render shell and manually retained metadata rather than the final semantic page and all its content inputs.

**Business impact:** Search engines receive a stale freshness hint even when customer-facing copy changes.

**Technical impact and evidence limits:** Sitemap lastmod and WebPage dateModified can lag changes; a missing/old date does not by itself prevent crawling or indexing.

**Suggested implementation:** Compute a stable semantic content hash from page-specific rendered content and dependencies before adding date metadata; update dates once, preserve unchanged pages, and make CI behavior deterministic.

**Dependencies:** Content dependency model; AUD-012

**Estimated effort:** 4–8 hours

**Tests and acceptance criteria:** Changing homepage-only copy changes only its modification date; unchanged builds preserve dates; emitted HTML dateModified matches sitemap lastmod.

**Verification command / procedure:** cd src && npm run build -- --keep-lastmod && npm run verify; isolated content-change fixture: compare lastmod.json, sitemap.xml and WebPage.dateModified

### AUD-016 — Browser QA cannot select an installed Linux Chrome

- **Category:** Delivery & QA
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/check.mjs:28
- **Status / verification:** Open / Confirmed.

**Evidence:** After allowing its local listener, node check.mjs exited 1: An executablePath or channel must be specified for puppeteer-core. It searches only two Windows paths and ignores CHROME_PATH; /usr/bin/google-chrome is installed.

**Steps to reproduce:** Run node check.mjs /tmp/thinkvistar-qa on Linux with Chrome installed; optionally set CHROME_PATH and observe it is unused.

**Root cause:** The QA tool has different browser discovery logic from build.mjs and does not support the CI/local Linux platform.

**Business impact:** The advertised browser audit is not reproducible on the delivery platform.

**Technical impact and evidence limits:** The script fails before loading any route, so earlier documentation claims are not substitute evidence for a fresh run.

**Suggested implementation:** Share cross-platform browser resolution, honor CHROME_PATH, use try/finally cleanup and emit an actionable missing-browser error.

**Dependencies:** Installed Chrome; AUD-003 compatibility

**Estimated effort:** 2–4 hours

**Tests and acceptance criteria:** QA executes on Linux with CHROME_PATH and on supported Windows/macOS paths; missing executable errors are clear and resources close.

**Verification command / procedure:** cd src && CHROME_PATH=/usr/bin/google-chrome node check.mjs /tmp/thinkvistar-qa

### AUD-017 — Browser regressions are printed rather than enforced and coverage is incomplete

- **Category:** Delivery & QA
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/check.mjs:30; src/check.mjs:47; .github/workflows/check.yml:25
- **Status / verification:** Open / Confirmed.

**Evidence:** check.mjs stores problems per page and only console.logs them, never sets a failing exit code. It hardcodes one of seven service pages and is not invoked in CI. Fresh independent testing found overflow on all seven despite existing static verification passing.

**Steps to reproduce:** Inspect the script final control flow and CI steps; in a temporary fixture cause a console error or overflow and inspect the QA exit code after browser startup is repaired.

**Root cause:** A diagnostic screenshot script is being relied on as an acceptance check without failure aggregation or manifest-driven route coverage.

**Business impact:** Broken mobile landing pages can pass the current static release checks.

**Technical impact and evidence limits:** Runtime errors and overflow do not reliably fail CI. The current Lighthouse subset also does not check every route at mobile and desktop widths.

**Suggested implementation:** Generate routes from pages.mjs, include intentional 404 and valid/invalid blueprint cases, aggregate actual failures, exit nonzero, and run in CI with screenshots/logs retained on failure.

**Dependencies:** AUD-016 browser startup

**Estimated effort:** 4–8 hours

**Tests and acceptance criteria:** A known console-error/overflow fixture fails the job; a clean build passes all indexable routes at both widths; intentional 404s are handled separately.

**Verification command / procedure:** cd src && node check.mjs /tmp/thinkvistar-qa; isolated regression fixture: introduce overflow and assert nonzero exit; inspect CI invocation

### AUD-018 — Work content has no published client-specific case narratives

- **Category:** Content & AEO
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/site-data.json:330; src/site-data.json:397; src/site-data.json:463; src/site-data.json:529; src/pages/projects.html:1
- **Status / verification:** Open / Confirmed.

**Evidence:** All four projects are isPlaceholder=true and explicitly illustrative blueprints. Real clients are named and linked, but there is no dedicated project route or substantive approved client delivery/outcome narrative in the page manifest.

**Steps to reproduce:** Inspect projects, their isPlaceholder values, projects.html and the pages.mjs route manifest. Distinguish the three client logos from actual case-study evidence.

**Root cause:** The site documents hypothetical solution approaches but has not yet published evidence of the named client engagements.

**Business impact:** Buyers have less evidence to assess delivery capability; answer engines have fewer verifiable business-specific facts to cite.

**Technical impact and evidence limits:** Detailed blueprint query pages intentionally remain noindex. This is an evidence/content opportunity, not proof of an SEO penalty or an instruction to index samples as real work.

**Suggested implementation:** With client permission publish at least one static, internally linked case narrative covering scope, delivery, constraints and attributable outcomes; keep blueprints honestly labeled. Use truthful applicable structured data only.

**Dependencies:** Client permission, actual project facts and approved assets

**Estimated effort:** 1–3 days per approved case

**Tests and acceptance criteria:** At least one real case has its own stable URL, self-canonical, sitemap/internal links, accessible content and client-approved claims; no invented metrics/reviews.

**Verification command / procedure:** cd src && npm run build -- --keep-lastmod && npm run verify; manually verify client approval, source facts and new route HTML without JavaScript

### AUD-019 — Named team members lack role and expertise context

- **Category:** GEO / entity content
- **Severity:** Low
- **Priority:** P3
- **Exact references:** src/pages/about.html:34
- **Status / verification:** Open / Confirmed.

**Evidence:** Team cards identify Rahul Dubey, Satish Mishra and Chandan Yadav with phone/WhatsApp links; they do not describe their roles, experience, delivery responsibilities or professional profiles.

**Steps to reproduce:** Read /about/#team and its source; compare the senior-led proposition with the evidence actually supplied.

**Root cause:** The team block is a contact directory rather than an expertise description.

**Business impact:** Prospects cannot easily assess who leads their project or corroborate specialist experience.

**Technical impact and evidence limits:** The company entity has structured data, but person-specific expertise is not explained in readable content. Absence of Person schema alone is not an indexing defect.

**Suggested implementation:** Add approved roles and concise, factual bios with relevant experience and opt-in professional profile links. Add Person markup only if useful and matching visible facts.

**Dependencies:** Team approval and verified biography details

**Estimated effort:** 0.5–1 day

**Tests and acceptance criteria:** Each published team profile states a real role and relevant experience; external links resolve and are approved; no fabricated credentials.

**Verification command / procedure:** browser: inspect /about/#team with JavaScript disabled; manually verify approved biographies and profile URLs

### AUD-020 — Unversioned font URLs are cached immutable for a year

- **Category:** Performance
- **Severity:** Low
- **Priority:** P3
- **Exact references:** static/.htaccess:67; src/layout.mjs:109; src/css/fonts.css:1
- **Status / verification:** Open / Confirmed.

**Evidence:** The Cache-Control rule applies one-year immutable caching to all .woff2 files. Font filenames such as /fonts/inter-latin.woff2 and /fonts/jakarta-latin.woff2 are stable and are not fingerprinted by the build.

**Steps to reproduce:** Compare the font filenames emitted by the build with the FilesMatch cache rule. On an Apache staging host inspect response Cache-Control and test an asset replacement.

**Root cause:** A cache policy justified for fingerprinted CSS/JS also covers mutable static font filenames.

**Business impact:** A future font update can remain invisible to repeat visitors for a long period.

**Technical impact and evidence limits:** Browsers can reuse stale bytes without revalidation; deployed header behavior has not been checked on the real host.

**Suggested implementation:** Fingerprint font filenames and references, add a deliberate version token, or give stable font URLs a revalidation policy.

**Dependencies:** Asset reference/caching policy

**Estimated effort:** 2–4 hours

**Tests and acceptance criteria:** A font-byte change changes its URL or causes timely revalidation; unchanged immutable resources stay efficiently cached.

**Verification command / procedure:** curl -I https://thinkvistar.com/fonts/inter-latin.woff2; browser: replace font in staging and compare requests with a warm cache

### AUD-021 — IndexNow helper succeeds even when notification is rejected

- **Category:** Technical SEO
- **Severity:** Low
- **Priority:** P3
- **Exact references:** src/indexnow.mjs:11; src/indexnow.mjs:17
- **Status / verification:** Open / Confirmed.

**Evidence:** A local mock fetch returning status=503 caused the existing helper to print IndexNow: HTTP 503 for 18 URLs and exit 0. The script checks no response status and has no explicit request timeout.

**Steps to reproduce:** In an isolated copy override globalThis.fetch to return {status:503}, then import indexnow.mjs and inspect the process exit status. No notification was sent during the audit.

**Root cause:** Notification status is treated as informational output rather than a success/failure contract.

**Business impact:** Operators can believe search-update notification succeeded when it did not.

**Technical impact and evidence limits:** Automation cannot distinguish accepted submissions from 403/429/5xx responses. This does not establish failed indexing; IndexNow is a discovery signal only.

**Suggested implementation:** Accept documented success/accepted statuses, fail clearly on rejection, set a timeout, and use bounded retries for retryable responses. Invoke only after the production URLs/key are reachable.

**Dependencies:** Live key/URL verification; deployment completion

**Estimated effort:** 1–3 hours

**Tests and acceptance criteria:** Mock 200/202 responses follow documented behavior; 403/429/503 and network timeout produce actionable nonzero failures or bounded retries; no Google submission claim.

**Verification command / procedure:** isolated mock-fetch status/timeout fixtures; after approved deployment: node src/indexnow.mjs

### AUD-022 — Estimator presents compliance and uptime guarantees as automatic outcomes

- **Category:** Content & AEO
- **Severity:** Medium
- **Priority:** P2
- **Exact references:** src/pages/estimator.html:65; src/pages/estimator.html:144; src/js/main.js:495; src/js/main.js:516
- **Status / verification:** Open / Confirmed.

**Evidence:** The panel labels uptime Guaranteed SLA Uptime; runtime selects fixed 99.9/99.95/99.99 percent values by scale. Security presets label SOC 2 & GDPR Ready and HIPAA / PCI-DSS Level 1 and add only one or two weeks. These outputs are calculated without assessing the customer organization, controls or an agreed SLA.

**Steps to reproduce:** Change scale and compliance tier on /estimator/; observe the guarantee/compliance text and the fixed week additions. Compare the surrounding estimate caveat and Terms scope/SOW language.

**Root cause:** Sales estimation choices conflate indicative architecture inputs with contractually agreed service targets and compliance assessment.

**Business impact:** Prospects may form expectations that the actual statement of work cannot substantiate.

**Technical impact and evidence limits:** Search snippets/AI summaries can quote unqualified output labels. This finding concerns the published wording and calculation, not a legal conclusion or proof the company lacks a certification.

**Suggested implementation:** Describe uptime as an indicative target subject to architecture/contract review; describe compliance as requirements needing separate assessment. Explain exclusions and ensure FAQs/AI text use the same approved terminology.

**Dependencies:** Engineering and commercial owner wording approval

**Estimated effort:** 3–6 hours

**Tests and acceptance criteria:** No automatic estimate asserts guaranteed uptime or achieved certification/compliance; applicable targets and assumptions are explicit in visible output and any generated summaries.

**Verification command / procedure:** browser: exercise every scale/compliance combination; rg -n "Guaranteed SLA|SOC 2|HIPAA|PCI-DSS|99\.99" src/pages/estimator.html src/js/main.js src/site-data.json

### AUD-023 — Logo images lack appropriately sized responsive variants

- **Category:** Performance
- **Severity:** Low
- **Priority:** P3
- **Exact references:** src/layout.mjs:13; src/js/main.js:723; static/images/logo/thinkvistar-logo.webp; static/images/logo/thinkvistar-logo-light.webp
- **Status / verification:** Open / Confirmed.

**Evidence:** Lighthouse 12.8.2 mobile rendered each logo at 137×36 CSS pixels (device scale factor 1.75), while the source images are 480×126. Header/footer resources were 34,310 and 17,648 bytes. Lighthouse estimated 25,741 and 13,241 bytes of potential resizing savings; the three inner-page samples reported 38,982 bytes combined. No srcset/sizes candidates are emitted.

**Steps to reproduce:** Run mobile Lighthouse and inspect uses-responsive-images or compare natural image dimensions with rendered dimensions and device scale.

**Root cause:** One full-resolution logo variant is used at all screen sizes and pixel densities.

**Business impact:** Avoidable image bytes consume mobile bandwidth on every cold visit.

**Technical impact and evidence limits:** The image-sizing opportunity is confirmed, but byte savings are tool estimates and all measured compressed lab pages still scored 99 for performance.

**Suggested implementation:** Generate appropriately compressed responsive logo variants, emit srcset/sizes consistently in build and runtime markup, preserve dimensions and visual sharpness, and retain suitable larger variants for high-density displays.

**Dependencies:** Approved brand assets; AUD-012 shell ownership

**Estimated effort:** 2–4 hours

**Tests and acceptance criteria:** Mobile selects an appropriate image candidate; desktop/high-density logos remain crisp; compare transferred bytes and rerun image-sizing diagnostics.

**Verification command / procedure:** cd src && npm run build -- --keep-lastmod && npm run lighthouse; browser: inspect img.currentSrc at mobile/desktop DPR 1, 1.75 and 2

## Checks requiring external evidence (not confirmed issues)

| Area | Verification status | Evidence required |
|---|---|---|
| Live availability, deployed parity, TLS, redirects, .htaccess headers, cache behavior and PHP runtime | Not Verified | Direct production/staging HTTP checks and deployment logs. The web retrieval tool could not access home/contact/robots/sitemap; that is not proof of an outage. |
| Google/Bing index status, canonical selection, crawl errors, rankings, traffic | Not Verified | Search Console / Bing Webmaster Tools property reports and URL inspections. Empty optional HTML verification tokens do not prove the property is unverified; DNS verification is supported. |
| Backlink profile, directory listings, Business Profile, social-account ownership | Not Verified | Owner-access reports and direct confirmation of listings/URLs. Historical SEO-REPORT.md claims were not accepted as fresh evidence. |
| Real-user LCP/INP/CLS and geographic performance | Not Verified | CrUX or privacy-conscious real-user measurement with representative traffic. Local Lighthouse is not field data. |
| SMTP delivery, SPF/DKIM/DMARC and mailbox credential rotation | Not Verified | Controlled approved test delivery, DNS records and owner confirmation. No live enquiry or notification was sent. |
| Historical credential exposure | Suspected, inherited allegation only | Existing SEO-REPORT.md mentions an old exposed password; that object/history was not independently established in the available checkout. No active secret was found in the reviewed current config/template. Rotate if the owner confirms exposure; do not assume current credentials are safe or compromised. |
| Legal/privacy compliance and certification status | Not Verified | Qualified review and actual contracts/control evidence. Wording inconsistency AUD-022 is confirmed; legal noncompliance is not asserted. |

These checks are excluded from issue counts and have no invented AUD IDs. No unverified allegation is labeled Confirmed.

## Final snapshot reconciliation and validation

A final file-hash comparison detected concurrent edits outside the audit to `src/layout.mjs`, `src/lighthouse-check.mjs`, `SEO-REPORT.md` and generated HTML. Those edits were preserved. The two changed source files were copied into the temporary audit workspace and the actual updated commands were rerun: full prerendered build (20 pages/18 sitemap URLs), `verify: 20 pages OK`, and `lighthouse-check: OK` (exit 0). All four updated-gate pages scored performance 99, accessibility 100, best-practices 100 and SEO 100; LCP was home 2,179 ms, contact 1,953 ms, SaaS 1,954 ms, estimator 1,953 ms; all CLS values were 0.000. These are a separate local gate run, not field metrics or a multi-run median.

AUD-002 is therefore **Resolved (external change; rechecked)** and is excluded from the 22 open issues. The audit itself wrote only the six Markdown reports; it did not implement the external correction or overwrite application files. The detailed independent lab table is explicitly labeled as the earlier snapshot. Removal of the optional single-language hreflang pair does not create an indexing defect; source references affected by that removal were rebased.

## Remediation completion notes (22 October 2026)

The findings and evidence above are historical and unchanged. Status, files changed and verification for each ID are in [REMEDIATION_STATUS.md](REMEDIATION_STATUS.md); one line each here. "Resolved" means the acceptance criteria were met on the local build; production, SMTP, search-console and owner-content checks are listed there as **not performed**.

| ID | Completion note |
|---|---|
| AUD-001 | Resolved. Native `method="post"` fallback with an HTML response page; no enquiry data reaches a URL with JavaScript off or the main module blocked (browser-tested; the old build leaks fields into the URL). |
| AUD-002 | Resolved (external change) preserved and re-verified; runner additionally pinned to Lighthouse 12.8.2, median of N runs, timeout; failure path exits 1. |
| AUD-003 | Resolved. puppeteer-core 25.15.0; `npm audit` 0 vulnerabilities; `composer audit --locked` clean. |
| AUD-004 | Resolved. Service grid shrinks (`minmax(0,1fr)`); no overflow at 320/360/390/768/1024 px on all seven pages. |
| AUD-005 | Resolved. File lock across the whole read-check-write; private counter folder; fail-closed on storage errors; 20 parallel requests admit exactly 5. |
| AUD-006 | Resolved. Explicit field allowlist, types, lengths, enums; Reply-To only from the email field; 46 endpoint checks. |
| AUD-007 | Resolved. Exact scheme+host+port origin comparison; absent-Origin policy explicit and tested. |
| AUD-008 | Resolved. Errors linked with `aria-describedby`, status summary, focus on first invalid field. |
| AUD-009 | Resolved. Radio-group semantics, roving tabindex, arrow keys, polite result announcement. |
| AUD-010 | Resolved. Drawer is a modal dialog: focus contained, page inert, Escape restores focus. |
| AUD-011 | Resolved. Content visible by default; reveal armed only for below-the-fold items after the observer exists. |
| AUD-012 | Resolved. Layout owns the shell; sections render once at build time; browser bundle does not re-render. |
| AUD-013 | Resolved. Readable modules with stable imports, bundled by esbuild; verifier forbids hashed source imports. |
| AUD-014 | Resolved against its acceptance criteria (no unrelated data downloads; contact JS 33.6 → 6.8 KB gz). Route CSS splitting evaluated and deferred (see REMEDIATION_STATUS.md). |
| AUD-015 | Resolved. Dates follow a hash of each finished page; verified by real isolated builds. |
| AUD-016 | Resolved. Shared browser resolver honouring `CHROME_PATH`; actionable error. |
| AUD-017 | Resolved. Manifest-driven, aggregated, exit-1 browser sweep plus interaction suite, run in CI. |
| AUD-018 | **Externally blocked.** Needs client permission and approved case facts; nothing invented. |
| AUD-019 | **Partially resolved.** Data-driven team section ready; LinkedIn links for all three members added (owner-supplied). Approved roles and bios still required. |
| AUD-020 | Resolved. Fingerprinted font filenames, enforced by the verifier. |
| AUD-021 | Resolved. Status checking, bounded retries, timeout, key-file pre-check, non-zero exit; 15 mocked tests. |
| AUD-022 | Resolved. Indicative-target and "aligned / assessed separately" wording with visible disclaimer; verifier guards against regression. Owner wording approval pending. |
| AUD-023 | Resolved. 240/360/480 px logo candidates with matching `sizes`; candidate selection tested at DPR 1–3. |
