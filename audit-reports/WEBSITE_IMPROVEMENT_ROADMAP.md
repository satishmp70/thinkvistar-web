# Website improvement roadmap

Audit date: 22 October 2026 (Asia/Kolkata). Scope: current working-tree snapshot at base commit `8662ddb`, including existing staged, unstaged and untracked application changes. This is not an audit of the base commit alone. The register contains **22 Open / Confirmed items and one confirmed-then-resolved item (AUD-002)**. Confirmation applies at the code or local runtime level stated in evidence; production exploitation, indexing and field performance are not implied. No application fixes were implemented by this audit.

Related reports: [Summary](WEBSITE_AUDIT_SUMMARY.md), [Architecture](ARCHITECTURE_ISSUES.md), [Search](SEO_AEO_GEO_AUDIT.md), [Security/performance](SECURITY_PERFORMANCE_REPORT.md), [Issue register](COMPLETE_ISSUE_REGISTER.md), [Roadmap](WEBSITE_IMPROVEMENT_ROADMAP.md).

No implementation is authorized by this audit. Effort estimates are engineering planning ranges, not measured completion times; they exclude stakeholder waiting time, procurement and broad content approval. Sequence the privacy/release blockers first, then high-impact mobile/security work, then accessibility, maintainability and evidence content. Independent tasks within a priority can proceed concurrently after approval.

## P0 — Critical — privacy exposure and production blockers

### AUD-001 — Contact form submits personal details by GET when JavaScript is unavailable

- **Status / severity / estimate:** Open / High / 2–4 hours.
- **Dependencies:** Contact response UX; AUD-006 server validation.
- **Implementation:** Define a deliberate POST fallback with native constraints and an accessible response, or disable submission until the handler is ready and provide a clear email alternative. Preserve normal AJAX operation.
- **Acceptance criteria:** With scripts disabled or the main module blocked, submission never puts any enquiry field in a URL; normal valid AJAX submits once; invalid data is rejected.
- **Verification:** `php -l static/api/contact.php; browser: disable JavaScript and submit synthetic contact fields; inspect URL and Network method`

### AUD-002 — Initial Lighthouse gate server deadlock — resolved during audit

- **Status / severity / estimate:** Resolved (external change; rechecked) / High / Resolved externally; 1–2 hours for review/regression verification.
- **Dependencies:** Updated runner and installed Chrome/Lighthouse.
- **Implementation:** The asynchronous-launch correction is already present from an external workspace edit. Retain it and verify the updated gate; no implementation of the original deadlock fix remains. Version pinning, cleanup and timeouts are follow-up hardening rather than evidence the deadlock persists.
- **Acceptance criteria:** All four configured pages finish, threshold failures exit nonzero, server closes on error, and the CI publish step is reachable on a passing build.
- **Verification:** `cd src && npm run lighthouse`

## P1 — High — security controls, mobile conversion and resilient delivery

### AUD-003 — Development dependency graph contains known high advisories

- **Status / severity / estimate:** Open / High / 0.5–1.5 days.
- **Dependencies:** Node/Chrome compatibility; lockfile update.
- **Implementation:** Review supported Puppeteer upgrades and transitive fixes in an isolated branch; audit proposed versions and rerun prerender/browser compatibility checks. npm suggested 25.15.0, a major upgrade; treat that as a candidate to validate, not an automatic safe fix.
- **Acceptance criteria:** No affected locked versions remain, or each unresolved advisory has an explicit scoped risk decision; build, verification and browser checks pass.
- **Verification:** `cd src && npm audit --package-lock-only --json && npm run build -- --keep-lastmod && npm run verify`

### AUD-004 — All seven service detail pages overflow the mobile viewport

- **Status / severity / estimate:** Open / High / 2–4 hours.
- **Dependencies:** AUD-016/AUD-017 for repeatable regression checks.
- **Implementation:** Allow the mobile grid and its children to shrink (for example minmax(0,1fr) and min-width:0), retain scrolling inside the table wrapper, and check long technology labels.
- **Acceptance criteria:** All seven pages have scrollWidth <= innerWidth at 320, 360, 390, 768 and 1024 px; tables remain readable through local scrolling and desktop layout remains intact.
- **Verification:** `cd src && npm run build -- --keep-lastmod && node check.mjs /tmp/thinkvistar-mobile-check; browser: evaluate document.documentElement.scrollWidth - innerWidth`

### AUD-005 — Rate limiting does not lock its read/check/write transaction

- **Status / severity / estimate:** Open / Medium / 4–8 hours.
- **Dependencies:** Writable private storage; approved test mail sink.
- **Implementation:** Acquire flock before reading and hold it through pruning, validation of the limit, increment and persistence; check errors. Place buckets in an application-private directory and define cleanup and storage-failure behavior.
- **Acceptance criteria:** With a configured limit of five, parallel valid requests admit at most five; persistence errors produce a controlled observable outcome without silently disabling protection.
- **Verification:** `php -l static/api/contact.php; isolated test harness: parallel same-IP requests and simulated unwritable rate storage`

### AUD-006 — Server accepts enquiries that bypass the actual field contract

- **Status / severity / estimate:** Open / Medium / 4–8 hours.
- **Dependencies:** Approved form schema; AUD-001 fallback contract.
- **Implementation:** Define accepted fields, scalar types, per-field lengths, required values and scope/timeline enums. Select Reply-To only from clientEmail and reject malformed structures before allocating or sending mail.
- **Acceptance criteria:** Missing required fields, array-valued inputs, invalid emails and unsupported enum values return 422 without invoking transport; valid documented fields still deliver.
- **Verification:** `php -l static/api/contact.php; isolated POST fixtures: email-only, missing name/message, array email, invalid scope, valid contact payload`

### AUD-011 — A failed application module leaves prerendered content visually hidden

- **Status / severity / estimate:** Open / Medium / 2–4 hours.
- **Dependencies:** Motion initialization; AUD-012 renderer ownership.
- **Implementation:** Default content to visible and activate animation only after its observer is ready; include a recovery path and verify partial failure without forcing all users to disable animation.
- **Acceptance criteria:** Blocking the main module leaves all substantive text and CTAs visible; normal motion and reduced-motion behavior still work.
- **Verification:** `browser: block assets/main-*.js, reload homepage and service pages; inspect visibility; repeat with reduced motion`

## P2 — Medium — architecture, SEO freshness, accessibility and content

### AUD-007 — Same-origin guard compares hostnames rather than complete origins

- **Status / severity / estimate:** Open / Low / 1–2 hours.
- **Dependencies:** Staging origin policy.
- **Implementation:** Build a configured set of complete production/staging origins, normalize only default ports and compare exactly. Continue separate bot/rate controls; Origin headers cannot authenticate server-to-server senders.
- **Acceptance criteria:** Expected HTTPS origins pass; wrong scheme/port and unknown origins fail before delivery; absent-Origin policy is explicit and tested.
- **Verification:** `php -l static/api/contact.php; isolated request matrix: HTTPS origin, HTTP origin, alternate port, unknown origin, absent Origin`

### AUD-008 — Form errors are not programmatically linked to their controls

- **Status / severity / estimate:** Open / Medium / 2–4 hours.
- **Dependencies:** No external dependencies.
- **Implementation:** Associate each control with its error and any existing hint, preserve the association while clearing feedback, and verify the error summary and focus sequence.
- **Acceptance criteria:** Every invalid control exposes its actual error to assistive technology, errors clear correctly, and a keyboard/screen-reader user can complete the form.
- **Verification:** `browser: submit empty /contact/, inspect aria-describedby/aria-errormessage and accessible description; manual screen-reader correction flow`

### AUD-009 — Estimator selections and changing results lack accessible state

- **Status / severity / estimate:** Open / Medium / 4–8 hours.
- **Dependencies:** Estimator interaction design.
- **Implementation:** Use fieldset/legend and native radios, or a complete documented button/radio pattern. Expose selected state and a concise polite result announcement without reading the whole panel repeatedly.
- **Acceptance criteria:** Each group has an accessible name and exactly one exposed selected value; keyboard interaction is consistent; changing a choice announces the resulting estimate.
- **Verification:** `browser: inspect accessible tree, operate all estimator groups by keyboard, verify selected state and polite result announcements`

### AUD-010 — Open mobile drawer allows keyboard focus into obscured page content

- **Status / severity / estimate:** Open / Medium / 3–6 hours.
- **Dependencies:** Navigation interaction decision.
- **Implementation:** Choose a genuine modal dialog/drawer with focus containment, background inertness, initial and restored focus, or redesign it as an inline disclosure that does not obscure interactive content.
- **Acceptance criteria:** While a modal drawer is open, Tab/Shift+Tab remain within its controls; Escape closes it and restores focus; no background controls are available.
- **Verification:** `browser: at 390 px open menu, cycle Tab/Shift+Tab, press Escape and inspect document.activeElement`

### AUD-012 — Shared layout has duplicate build-time and browser renderers

- **Status / severity / estimate:** Open / Medium / 0.5–1 day.
- **Dependencies:** AUD-013 readable source; no URL/design changes needed.
- **Implementation:** Keep the static shell in the build layer and let runtime code add only active state and interaction. Share declarative data/helpers where useful and avoid rebuilding unchanged nodes.
- **Acceptance criteria:** Navigation/footer HTML has one owner; initial links remain available without JS; active states and mobile interaction work with no redundant shell replacement.
- **Verification:** `cd src && npm run build -- --keep-lastmod && npm run verify; browser: compare no-JS and JS shell links, inspect mutation breakpoints`

### AUD-013 — Editable JavaScript retains generated-style names and hashed source imports

- **Status / severity / estimate:** Open / Medium / 1–2 days.
- **Dependencies:** Behavior baseline; AUD-002 and AUD-016/AUD-017 checks.
- **Implementation:** After approval, format modules, replace compressed names with descriptive ones, use stable source imports, and separate forms, estimator, shell behavior and motion. Keep the static architecture rather than introducing an unnecessary framework.
- **Acceptance criteria:** Source imports resolve deliberately; no inherited hashed source specifiers remain; all current routes, enquiry UX, estimator options and legal pages retain their behavior.
- **Verification:** `rg -n "dataLoader-|icons-[A-Za-z0-9_-]+\.js" src/js; cd src && npm run build -- --keep-lastmod && npm run verify`

### AUD-015 — Sitemap modification tracking excludes client-rendered content changes

- **Status / severity / estimate:** Open / Medium / 4–8 hours.
- **Dependencies:** Content dependency model; AUD-012.
- **Implementation:** Compute a stable semantic content hash from page-specific rendered content and dependencies before adding date metadata; update dates once, preserve unchanged pages, and make CI behavior deterministic.
- **Acceptance criteria:** Changing homepage-only copy changes only its modification date; unchanged builds preserve dates; emitted HTML dateModified matches sitemap lastmod.
- **Verification:** `cd src && npm run build -- --keep-lastmod && npm run verify; isolated content-change fixture: compare lastmod.json, sitemap.xml and WebPage.dateModified`

### AUD-016 — Browser QA cannot select an installed Linux Chrome

- **Status / severity / estimate:** Open / Medium / 2–4 hours.
- **Dependencies:** Installed Chrome; AUD-003 compatibility.
- **Implementation:** Share cross-platform browser resolution, honor CHROME_PATH, use try/finally cleanup and emit an actionable missing-browser error.
- **Acceptance criteria:** QA executes on Linux with CHROME_PATH and on supported Windows/macOS paths; missing executable errors are clear and resources close.
- **Verification:** `cd src && CHROME_PATH=/usr/bin/google-chrome node check.mjs /tmp/thinkvistar-qa`

### AUD-017 — Browser regressions are printed rather than enforced and coverage is incomplete

- **Status / severity / estimate:** Open / Medium / 4–8 hours.
- **Dependencies:** AUD-016 browser startup.
- **Implementation:** Generate routes from pages.mjs, include intentional 404 and valid/invalid blueprint cases, aggregate actual failures, exit nonzero, and run in CI with screenshots/logs retained on failure.
- **Acceptance criteria:** A known console-error/overflow fixture fails the job; a clean build passes all indexable routes at both widths; intentional 404s are handled separately.
- **Verification:** `cd src && node check.mjs /tmp/thinkvistar-qa; isolated regression fixture: introduce overflow and assert nonzero exit; inspect CI invocation`

### AUD-018 — Work content has no published client-specific case narratives

- **Status / severity / estimate:** Open / Medium / 1–3 days per approved case.
- **Dependencies:** Client permission, actual project facts and approved assets.
- **Implementation:** With client permission publish at least one static, internally linked case narrative covering scope, delivery, constraints and attributable outcomes; keep blueprints honestly labeled. Use truthful applicable structured data only.
- **Acceptance criteria:** At least one real case has its own stable URL, self-canonical, sitemap/internal links, accessible content and client-approved claims; no invented metrics/reviews.
- **Verification:** `cd src && npm run build -- --keep-lastmod && npm run verify; manually verify client approval, source facts and new route HTML without JavaScript`

### AUD-022 — Estimator presents compliance and uptime guarantees as automatic outcomes

- **Status / severity / estimate:** Open / Medium / 3–6 hours.
- **Dependencies:** Engineering and commercial owner wording approval.
- **Implementation:** Describe uptime as an indicative target subject to architecture/contract review; describe compliance as requirements needing separate assessment. Explain exclusions and ensure FAQs/AI text use the same approved terminology.
- **Acceptance criteria:** No automatic estimate asserts guaranteed uptime or achieved certification/compliance; applicable targets and assumptions are explicit in visible output and any generated summaries.
- **Verification:** `browser: exercise every scale/compliance combination; rg -n "Guaranteed SLA|SOC 2|HIPAA|PCI-DSS|99\.99" src/pages/estimator.html src/js/main.js src/site-data.json`

## P3 — Low — payload, cache lifecycle, notification and expertise enhancements

### AUD-014 — Every route preloads full site data and shares the entire CSS/runtime payload

- **Status / severity / estimate:** Open / Low / 1–2 days.
- **Dependencies:** AUD-012/AUD-013; repaired performance gate.
- **Implementation:** Render static content at build time, scope client data to interactive features, load estimator/forms only where needed, and extract/minify route CSS when coverage demonstrates a worthwhile benefit.
- **Acceptance criteria:** Simple contact/legal pages do not fetch unrelated project/estimator data; compare cold-load bytes and lab medians before/after with no visual or interactive regressions.
- **Verification:** `cd src && npm run build -- --keep-lastmod && npm run lighthouse; browser DevTools: Network transfer totals and CSS/JS coverage per route`

### AUD-019 — Named team members lack role and expertise context

- **Status / severity / estimate:** Open / Low / 0.5–1 day.
- **Dependencies:** Team approval and verified biography details.
- **Implementation:** Add approved roles and concise, factual bios with relevant experience and opt-in professional profile links. Add Person markup only if useful and matching visible facts.
- **Acceptance criteria:** Each published team profile states a real role and relevant experience; external links resolve and are approved; no fabricated credentials.
- **Verification:** `browser: inspect /about/#team with JavaScript disabled; manually verify approved biographies and profile URLs`

### AUD-020 — Unversioned font URLs are cached immutable for a year

- **Status / severity / estimate:** Open / Low / 2–4 hours.
- **Dependencies:** Asset reference/caching policy.
- **Implementation:** Fingerprint font filenames and references, add a deliberate version token, or give stable font URLs a revalidation policy.
- **Acceptance criteria:** A font-byte change changes its URL or causes timely revalidation; unchanged immutable resources stay efficiently cached.
- **Verification:** `curl -I https://thinkvistar.com/fonts/inter-latin.woff2; browser: replace font in staging and compare requests with a warm cache`

### AUD-021 — IndexNow helper succeeds even when notification is rejected

- **Status / severity / estimate:** Open / Low / 1–3 hours.
- **Dependencies:** Live key/URL verification; deployment completion.
- **Implementation:** Accept documented success/accepted statuses, fail clearly on rejection, set a timeout, and use bounded retries for retryable responses. Invoke only after the production URLs/key are reachable.
- **Acceptance criteria:** Mock 200/202 responses follow documented behavior; 403/429/503 and network timeout produce actionable nonzero failures or bounded retries; no Google submission claim.
- **Verification:** `isolated mock-fetch status/timeout fixtures; after approved deployment: node src/indexnow.mjs`

### AUD-023 — Logo images lack appropriately sized responsive variants

- **Status / severity / estimate:** Open / Low / 2–4 hours.
- **Dependencies:** Approved brand assets; AUD-012 shell ownership.
- **Implementation:** Generate appropriately compressed responsive logo variants, emit srcset/sizes consistently in build and runtime markup, preserve dimensions and visual sharpness, and retain suitable larger variants for high-density displays.
- **Acceptance criteria:** Mobile selects an appropriate image candidate; desktop/high-density logos remain crisp; compare transferred bytes and rerun image-sizing diagnostics.
- **Verification:** `cd src && npm run build -- --keep-lastmod && npm run lighthouse; browser: inspect img.currentSrc at mobile/desktop DPR 1, 1.75 and 2`

## Release exit criteria and operational verification

1. Resolve AUD-001 and retain/reverify the external AUD-002 correction, then verify a clean production-mode build and a functioning CI gate on the intended release commit.
2. Resolve or explicitly accept scoped dependency risk (AUD-003); validate server enquiry schema and concurrent limits (AUD-005/AUD-006). Use a local mail sink for negative tests.
3. Pass the complete mobile route checks (AUD-004/AUD-016/AUD-017) and module-failure checks (AUD-011).
4. Repeat performance runs with the repaired gate, record at least three runs per representative page, and investigate thresholds before launch. Field Core Web Vitals remain an operational follow-up.
5. On staging and then production, verify actual HTTPS/non-www/index.html redirects, genuine 404 status, CSP/security headers, compressed responses, protected configuration/vendor paths, PHP version and the installed Composer autoloader. Commands: `curl -I https://thinkvistar.com/`, `curl -I http://thinkvistar.com/`, `curl -I https://www.thinkvistar.com/`, `curl -I https://thinkvistar.com/about/index.html`, `curl -I https://thinkvistar.com/does-not-exist/`, `curl -I https://thinkvistar.com/api/config.php`, and `curl --compressed -I https://thinkvistar.com/`. These were not executed as successful production checks during this audit.
6. With approved credentials/configuration, send one controlled end-to-end enquiry and verify delivery and failure feedback. Confirm the real host proxy behavior before enabling forwarded-IP trust.
7. Check sitemap and representative URL inspection in Google/Bing. Confirm Business Profile/NAP and social ownership. Run the repaired IndexNow helper only after deployment is reachable; this is an external notification and was not sent during this audit.
8. Track real enquiries, search impressions/index status and real-user LCP/INP/CLS after sufficient traffic. Do not treat a lab SEO/accessibility score as certification or proof of discoverability.

Operational checks are release evidence tasks, not additional confirmed defects. Implement application fixes only after the owner approves the remediation scope.
