# Website audit summary

Audit date: 22 October 2026 (Asia/Kolkata). Audited the current working tree at base commit `8662ddb`, including existing staged, unstaged and untracked changes. Source references are relative to the repository root and include line numbers for this snapshot. No application fixes were made by this audit. During the audit, concurrent workspace edits changed the shared head, Lighthouse runner, historical SEO document and generated output. Those changes were preserved; AUD-002 was subsequently resolved and rechecked.

Related: [Summary](WEBSITE_AUDIT_SUMMARY.md) · [Architecture](ARCHITECTURE_ISSUES.md) · [Search](SEO_AEO_GEO_AUDIT.md) · [Security/performance](SECURITY_PERFORMANCE_REPORT.md) · [Complete register](COMPLETE_ISSUE_REGISTER.md) · [Roadmap](WEBSITE_IMPROVEMENT_ROADMAP.md).

## Executive summary and production verdict

**Not ready for unconditional production sign-off.** The static site builds and has a strong metadata/security-header foundation, and the four compressed mobile Lighthouse samples scored 99 for performance. However, a contact-form GET fallback that can expose enquiry fields in URLs, affected development dependencies and overflow on all seven mobile service pages require attention before release approval.

The register contains **23 confirmed findings: 0 Critical, 4 High, 13 Medium and 6 Low; 22 remain open (3 High, 13 Medium, 6 Low), and one High finding (AUD-002) was resolved by a concurrent external edit and rechecked**. “Confirmed” identifies observed source/local-runtime defects or documented content gaps. It does not assert that the production site has been exploited, is offline or is not indexed. The remaining P0 privacy blocker is High severity; there is no invented Critical vulnerability.

The architecture is appropriate to a small marketing website: source templates/data and copied static assets produce a deployable dist folder, with one PHP SMTP endpoint. Preserve that simplicity. Prioritize request handling, release checks and mobile conversion over a framework rewrite. Improve maintainability by separating inherited browser responsibilities and giving static shell markup one owner.

## Existing strengths

- Separate editable source/static assets from generated deployment output; shared layout and page manifest reduce many classes of duplicate metadata.
- Successful isolated full build: 20 HTML pages and 18 sitemap URLs; static verifier passed; indexable pages have unique title/description checks, canonicals, structured data and one tested H1 each.
- Prerendered content, visible FAQs, descriptive service routes, factual business location and clearly labeled sample blueprints; no current fabricated Review/AggregateRating markup observed.
- Environment-based SMTP configuration, escaped email content, generic delivery errors, honeypot/rate guards and protective Apache configuration. PHP lint passed and Composer lock advisory scan returned no advisories at audit time.
- Self-hosted fonts, WebP logos, asset fingerprinting, intended gzip/caching, skip links, native FAQs and reduced-motion support.

## Category scores: documented rubric, not invented external rankings

These are **audit control-coverage scores**, calculated as `passed documented checks / listed checks × 100`, rounded to the nearest integer. Checks have equal weight within each row and are deliberately explicit. Failed checks do not all have equal business impact; use issue severity/priority for action. The scores are not Lighthouse scores, industry certifications, ranking forecasts or a statistically validated health index. External/unknown checks are not silently scored as passes. No aggregate score combines these different denominators.

| Category | Score / 100 | Evidence and calculation |
|---|---:|---|
| Architecture | 60 | 3/5: source/output separation, shared shell and fingerprinted output pass; single static-shell renderer and readable/stable browser-source boundaries fail (AUD-012/AUD-013). |
| Delivery & QA | 60 | 3/5 after the concurrent fix: full build, static verifier and actual updated Lighthouse gate pass; portable QA and enforced full-route browser checks fail (AUD-016/AUD-017). Initial AUD-002 is resolved. |
| Security engineering | 33 | 2/6: current environment-secret configuration and escaped email output pass; safe no-JS form submission, authoritative enquiry schema, atomic/error-aware rate persistence and advisory-free dev dependency graph fail (AUD-001/AUD-003/AUD-005/AUD-006). |
| Technical SEO foundation | 80 | 4/5: metadata uniqueness, canonical/sitemap consistency, crawl rules and JSON-LD/visible FAQ generation pass; complete content-date change tracking fails (AUD-015). Optional notification reliability is separately recorded as AUD-021. |
| Performance delivery controls | 50 | 3/6: self-hosted fonts, fingerprinted CSS/JS and configured compression pass; scoped route payload, version-safe immutable fonts and responsive logo variants fail (AUD-014/AUD-020/AUD-023). Runtime lab scores are separately shown below. |
| Accessibility interaction checks | 40 | 2/5: skip/main navigation and visible input labels pass; associated errors, estimator selected-state/result semantics and modal drawer focus fail (AUD-008/AUD-009/AUD-010). |
| Mobile route width checks | 61 | 11/18 indexable routes have zero document overflow at 390 px; seven shared service pages fail (AUD-004). This measures width only, not complete mobile UX. |
| Partial-failure resilience | 50 | 1/2: prerendered readable content exists without JavaScript; with the inline .js marker but a blocked main module, 19 reveal elements remain hidden (AUD-011). Contact submission privacy is scored separately under Security. |
| Content & AEO evidence | 60 | 3/5: visible direct-answer FAQs, detailed service content and honest blueprint labels pass; approved client-case narratives and qualified estimator compliance/uptime outputs fail (AUD-018/AUD-022). |
| GEO / entity clarity | 80 | 4/5: organization identity, consistent visible business NAP, public crawler rules and generated AI reference text pass; understandable team expertise/role context fails (AUD-019). External citations/indexing remain unknown. |

Off-page authority, live indexability, real-user Core Web Vitals, operational SMTP delivery and legal/certification compliance are **Not Verified** and receive no numeric score.

## Measured mobile Lighthouse results

These are **single-run local mobile lab measurements** from the initial source snapshot before the concurrent removal of two optional hreflang head lines, Lighthouse **12.8.2**, Headless Chrome **144.0.0.0**, Linux, static output from the audited source. The temporary server applied gzip to HTML/CSS/JS/SVG. Lighthouse used simulated mobile throttling: 412×823 CSS pixels, DPR 1.75, 4× CPU slowdown, RTT 150 ms and throughput 1,638.4 Kbps. It did not execute Apache rewrite rules or PHP, and did not reproduce production cache/security headers. Sampled pages are home, contact, one representative service and estimator. Values are rounded in the table; scores are the tool's actual scores. No median, percentile or field INP was measured. An earlier uncompressed diagnostic was discarded for the score table because it did not model intended compression.

| Page | Performance | Accessibility | Best practices | SEO | LCP (ms) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 99 | 100 | 100 | 100 | 2180 | 0.000 | 0 |
| `/contact/` | 99 | 100 | 100 | 100 | 1954 | 0.000 | 0 |
| `/services/saas-development/` | 99 | 100 | 100 | 100 | 1954 | 0.000 | 2 |
| `/estimator/` | 99 | 100 | 100 | 100 | 1954 | 0.000 | 5 |

These results are encouraging but do not cancel the manual findings: automated scores missed the tested keyboard/estimator/error semantics and 390 px service overflow. No field INP or production CWV verdict is available. Good Core Web Vitals thresholds and field percentile methodology are defined by [web.dev](https://web.dev/articles/vitals).

## Top 10 highest-priority findings

“Critical findings” here means the most important audit results, not ten Critical-severity vulnerabilities. The register has zero Critical-severity entries.

1. **AUD-001 — Contact form submits personal details by GET when JavaScript is unavailable** (P0, High). An enquiry can be lost and personal/project information can enter browser history and host access logs.
2. **AUD-003 — Development dependency graph contains known high advisories** (P1, High). Developer/CI tooling carries avoidable supply-chain exposure and can fail security review.
3. **AUD-004 — All seven service detail pages overflow the mobile viewport** (P1, High). Service landing pages are harder to read and use for mobile visitors arriving from commercial searches.
4. **AUD-005 — Rate limiting does not lock its read/check/write transaction** (P1, Medium). Spam can exceed the configured budget, increasing mailbox noise and SMTP resource use.
5. **AUD-006 — Server accepts enquiries that bypass the actual field contract** (P1, Medium). Incomplete or forged enquiries waste sales time and reduce confidence in the lead channel.
6. **AUD-011 — A failed application module leaves prerendered content visually hidden** (P1, Medium). Visitors with an interrupted or blocked script request can see missing sections and calls to action.
7. **AUD-010 — Open mobile drawer allows keyboard focus into obscured page content** (P2, Medium). Keyboard users can lose their place and interact with controls hidden by the menu.
8. **AUD-017 — Browser regressions are printed rather than enforced and coverage is incomplete** (P2, Medium). Broken mobile landing pages can pass the current static release checks.
9. **AUD-015 — Sitemap modification tracking excludes client-rendered content changes** (P2, Medium). Search engines receive a stale freshness hint even when customer-facing copy changes.
10. **AUD-008 — Form errors are not programmatically linked to their controls** (P2, Medium). People using assistive technology may struggle to correct enquiries.

## Category-wise issue counts

Counts below include the one resolved Delivery & QA finding. Open Delivery & QA count is two; all other listed counts are open.

| Category | Confirmed issues |
|---|---:|
| Security | 5 |
| Delivery & QA | 3 |
| Mobile responsiveness | 1 |
| Accessibility | 3 |
| Resilience | 1 |
| Architecture | 2 |
| Performance | 3 |
| Technical SEO | 2 |
| Content & AEO | 2 |
| GEO / entity content | 1 |

A shared issue is counted once under its primary category even when discussed in several reports. Seven affected service pages are one shared-grid issue. Seven npm high entries are one dependency remediation issue. The register is the canonical count/ID source.

## Recommended implementation order

1. **P0:** AUD-001 contact fallback privacy. Preserve/reverify the external AUD-002 gate correction; it has no remaining deadlock implementation task.
2. **P1:** AUD-003 dependency review; AUD-004 mobile grid; AUD-005/AUD-006 server abuse/schema; AUD-011 partial-failure visibility.
3. **P2:** Repair QA portability/enforcement (AUD-016/AUD-017) early to support all later work; improve accessible errors/estimator/menu (AUD-008/AUD-009/AUD-010); clarify estimator claims (AUD-022); then source/render ownership and freshness (AUD-013/AUD-012/AUD-015), exact-origin policy (AUD-007) and actual case evidence (AUD-018).
4. **P3:** Improve route payload (AUD-014), font cache lifecycle (AUD-020), responsive logos (AUD-023), IndexNow reliability (AUD-021) and team expertise context (AUD-019).
5. Complete actual-host release checks, one approved end-to-end enquiry, Google/Bing URL inspections and post-launch field measurement before declaring production readiness.

These steps are proposals only. No application code, routes, design, databases or configurations were changed; all fixes await owner approval. See the roadmap for dependencies, estimated effort, acceptance criteria and verification procedures for every ID.

## Audit method and evidence limits

- Reviewed the source/build manifest, all page templates, service definitions, shared layout, browser scripts, stylesheets, static assets, crawler rules, Apache configuration, PHP endpoint/config, manifests/lockfiles, deployment workflow and existing audit/deployment documentation.
- Created a temporary isolated copy, preserving source and configuration. Ran `npm run build -- --keep-lastmod` successfully: **20 HTML pages, 18 sitemap URLs**, prerendered content and generated AI reference files. `npm run verify` returned **verify: 20 pages OK**. This confirms only that verifier's assertions, not search eligibility or comprehensive accessibility.
- Loaded all 18 indexable routes at **390×900 and 1366×900**: 36 navigation checks, one H1 per page, no captured page errors/HTTP errors on those loads. All desktop routes had zero page overflow; 11 mobile routes had zero, seven service routes had 148 px. The script did not collect every browser-console warning or test every interaction.
- Tested contact fallback, accessible errors, mobile menu tab order, estimator state and handoff, failed-module visibility, the lastmod hash, origin handling and malformed server payloads. Lazy images initially outside the viewport were rechecked after scrolling and decoded; they are **not** reported as broken assets. CMS and legacy estimator handoff preselected the expected contact scope.
- PHP 8.5.0 CLI lint passed for both `static/api/contact.php` and `static/api/config.php`. This is not confirmation of the host's PHP version or end-to-end mail delivery. Composer lock audit returned no advisories or abandoned packages at audit time. npm lock audit returned seven high package entries; they are consolidated into AUD-003, not counted as seven website issues.
- The original browser QA failed on Linux (AUD-016), and the initial Lighthouse runner deadlock was confirmed with a short local child HTTP probe (AUD-002). A concurrent edit repaired that runner; the actual updated gate was revalidated in isolation. Independent asynchronous serving supplied the detailed lab table. No application audit scripts were repaired by this audit.
- Initial sandbox restrictions blocked localhost. Approved local execution enabled the isolated checks; sandbox errors are not application vulnerabilities. Live-site retrieval of home/contact/robots/sitemap was unsuccessful through the web tool; no claim of production downtime follows.
- Existing SEO-REPORT.md contains historical claims and historical measurements. They were used as leads and not treated as fresh proof. No live contact submission, IndexNow notification, repository push or deployment was performed.

The audit is broad within this snapshot, not a penetration-test certification or an exhaustive proof of absence of defects. Production response headers/statuses, deployment parity, email delivery, owner-only search data, backlinks, actual certifications and real-user metrics require the external checks recorded separately in the issue register.

## Generated report paths

- `audit-reports/WEBSITE_AUDIT_SUMMARY.md`
- `audit-reports/ARCHITECTURE_ISSUES.md`
- `audit-reports/SEO_AEO_GEO_AUDIT.md`
- `audit-reports/SECURITY_PERFORMANCE_REPORT.md`
- `audit-reports/COMPLETE_ISSUE_REGISTER.md`
- `audit-reports/WEBSITE_IMPROVEMENT_ROADMAP.md`

The [complete issue register](COMPLETE_ISSUE_REGISTER.md) contains the canonical per-issue evidence; the [roadmap](WEBSITE_IMPROVEMENT_ROADMAP.md) translates every ID into a proposed task. This audit does not authorize implementation.

## Final snapshot reconciliation and validation

A final file-hash comparison detected concurrent edits outside the audit to `src/layout.mjs`, `src/lighthouse-check.mjs`, `SEO-REPORT.md` and generated HTML. Those edits were preserved. The two changed source files were copied into the temporary audit workspace and the actual updated commands were rerun: full prerendered build (20 pages/18 sitemap URLs), `verify: 20 pages OK`, and `lighthouse-check: OK` (exit 0). All four updated-gate pages scored performance 99, accessibility 100, best-practices 100 and SEO 100; LCP was home 2,179 ms, contact 1,953 ms, SaaS 1,954 ms, estimator 1,953 ms; all CLS values were 0.000. These are a separate local gate run, not field metrics or a multi-run median.

AUD-002 is therefore **Resolved (external change; rechecked)** and is excluded from the 22 open issues. The audit itself wrote only the six Markdown reports; it did not implement the external correction or overwrite application files. The detailed independent lab table is explicitly labeled as the earlier snapshot. Removal of the optional single-language hreflang pair does not create an indexing defect; source references affected by that removal were rebased.
