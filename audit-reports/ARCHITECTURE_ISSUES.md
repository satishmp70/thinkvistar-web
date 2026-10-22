# Architecture issues and maintainability assessment

Audit date: 22 October 2026 (Asia/Kolkata). Audited the current working tree at base commit `8662ddb`, including existing staged, unstaged and untracked changes. Source references are relative to the repository root and include line numbers for this snapshot. No application fixes were made by this audit. During the audit, concurrent workspace edits changed the shared head, Lighthouse runner, historical SEO document and generated output. Those changes were preserved; AUD-002 was subsequently resolved and rechecked.

Related: [Summary](WEBSITE_AUDIT_SUMMARY.md) · [Architecture](ARCHITECTURE_ISSUES.md) · [Search](SEO_AEO_GEO_AUDIT.md) · [Security/performance](SECURITY_PERFORMANCE_REPORT.md) · [Complete register](COMPLETE_ISSUE_REGISTER.md) · [Roadmap](WEBSITE_IMPROVEMENT_ROADMAP.md).

## Current architecture and strengths

This is a small static marketing website with one PHP enquiry endpoint. A custom Node build composes content and page metadata, fingerprints CSS/JS, prerenders selected pages through Chrome, copies static assets, and writes sitemap and AI reference text. GitHub Actions adds PHPMailer to dist and publishes a deploy branch intended for Hostinger. There is no application database, authenticated dashboard or framework runtime in the reviewed site. Recommending microservices, MVC controllers or a framework migration solely for this project size would add complexity without evidence of a need.

```text
thinkvistar-web/
├── .github/workflows/check.yml    build / verify / publish
├── src/
│   ├── build.mjs                  asset output, prerender, sitemap
│   ├── layout.mjs                 shared HTML/metadata/schema shell
│   ├── pages.mjs                  page manifest, metadata, FAQ/schema
│   ├── service-pages.mjs          service copy and HTML renderer
│   ├── site-data.json             company, content, projects, legal text
│   ├── lastmod.json               content dates/hashes
│   ├── pages/*.html               body templates
│   ├── js/*.js                    inherited browser modules
│   ├── css/{fonts,site,additions,premium}.css
│   └── verify/check/lighthouse-check/llms/indexnow.mjs
├── static/
│   ├── api/{contact,config}.php
│   ├── .htaccess / robots.txt / verification key
│   └── fonts/ images/ icons
├── composer.json / composer.lock
├── deploy.bat / README.md / DEPLOYMENT.md / SEO-REPORT.md
└── dist/                          generated, git-ignored, deployment payload
```

Strengths include source/output separation, a shared page shell, page-specific metadata, explicit service routes, fixed internal origin, a locked PHP dependency, environment-based mail credentials, a small runtime surface, generated SEO assets and build verification. Existing source-to-dist relocation is useful; it is not itself an issue. The build still contains an outdated comment/package description saying output is the repository root (`src/build.mjs:1`, `src/package.json:5`), but actual output is dist; treat that as routine documentation cleanup, not an additional material issue.

## Confirmed architecture and cross-cutting issues

| ID | Severity | Confirmed finding | Exact references | Status |
|---|---|---|---|---|
| AUD-002 | High | Initial Lighthouse gate server deadlock — resolved during audit | src/lighthouse-check.mjs:21; src/lighthouse-check.mjs:37; .github/workflows/check.yml:32 | Resolved (external change; rechecked) |
| AUD-003 | High | Development dependency graph contains known high advisories | src/package-lock.json:212; src/package-lock.json:424; src/package-lock.json:684; src/package.json:13 | Open |
| AUD-012 | Medium | Shared layout has duplicate build-time and browser renderers | src/layout.mjs:65; src/layout.mjs:175; src/js/main.js:716; src/js/main.js:1188 | Open |
| AUD-013 | Medium | Editable JavaScript retains generated-style names and hashed source imports | src/js/main.js:1; src/js/case-study.js:1; src/js/privacy.js:1; src/build.mjs:53 | Open |
| AUD-014 | Low | Every route preloads full site data and shares the entire CSS/runtime payload | src/build.mjs:50; src/build.mjs:57; src/layout.mjs:109 | Open |
| AUD-015 | Medium | Sitemap modification tracking excludes client-rendered content changes | src/build.mjs:70; src/build.mjs:74; src/build.mjs:112; src/build.mjs:133 | Open |
| AUD-016 | Medium | Browser QA cannot select an installed Linux Chrome | src/check.mjs:28 | Open |
| AUD-017 | Medium | Browser regressions are printed rather than enforced and coverage is incomplete | src/check.mjs:30; src/check.mjs:47; .github/workflows/check.yml:25 | Open |

Evidence, root causes, reproduction, business/technical impacts, dependencies, estimates and acceptance tests for these IDs are in the [complete register](COMPLETE_ISSUE_REGISTER.md). Repeated references across reports describe the same issue, not additional entries. AUD-002 describes an initial finding resolved by a concurrent external edit; it is not an open production blocker.

## Design-pattern assessment

**Single responsibility and source readability — AUD-013.** `src/js/main.js` combines form validation/submission, estimator configuration/calculation, page content rendering, shell generation, project filtering, menu control and animation. Its generated-style names make the boundaries hard to understand. Other modules retain compressed source lines. Hash-bearing imports are converted by regex in `src/build.mjs:53`. Make imports stable and source readable before broad refactoring; preserve behavior through integration checks.

**Renderer ownership and duplication — AUD-012.** The shared layout builds navigation/footer markup, and runtime functions replace it again. In the current static model, build-time HTML should own static content; browser code should own interaction and incremental state. This also reduces global payload pressure (AUD-014) and gives future accessibility work one place to change shell semantics.

**Build metadata ordering — AUD-015.** The lastmod algorithm hashes pre-prerender HTML, strips the asset names that encode changed JSON, and injects date metadata before updating the date. This is a dependency-tracking design defect, not a reason to eliminate prerendering.

**Async process boundaries — AUD-002 (resolved externally).** The initial server and synchronous child launch shared one event loop. A concurrent edit changed the launch to awaited asynchronous execution; retain and regression-check that correction. [Node documents synchronous child-process blocking](https://nodejs.org/api/child_process.html#synchronous-process-creation).

**Stylesheet layers.** The build concatenates fonts, a 47,358-byte single-line inherited stylesheet, additions and premium overrides. Selectors such as `.site-header`, `.cta-card` and `.js .reveal` span layers. That increases cascade reasoning and contributes to global route payload, but intentional override layers are not automatically a design violation. The actual mobile defect is AUD-004; no duplicate issue is created for the same CSS root cause.

## Recommended structure (proposal only)

```text
src/
├── build/
│   ├── assets.mjs                 fingerprint/minify/reference assets
│   ├── prerender.mjs              browser/server lifecycle
│   ├── content-dates.mjs          semantic dependencies and dates
│   └── search-output.mjs          sitemap and AI reference generation
├── content/
│   ├── company.json
│   ├── services.mjs
│   ├── projects.json
│   └── legal.json
├── templates/
│   ├── layout.mjs
│   ├── partials/                  nav/footer/FAQ/breadcrumb renderers
│   └── pages/
├── browser/
│   ├── navigation.js
│   ├── contact-form.js
│   ├── estimator.js
│   ├── project-filters.js
│   └── motion.js
└── styles/
    ├── tokens.css
    ├── base.css
    ├── components/
    └── pages/
tools/
├── browser-path.mjs               shared supported-browser discovery
└── audit/                         manifest-driven checks and reports
static/api/                        retain public endpoint compatibility
  contact.php                     thin request/response entry point
# Optional private PHP helpers can sit outside the public deployment root
# if hosting/deployment support it; do not relocate configuration blindly.
```

This is a target boundary map, not a demand to split every file at once. Start with readable names/imports (AUD-013), remove duplicate shell rendering (AUD-012), then extract only modules that have distinct behavior or payload needs (AUD-014). Keep public URLs, rendered design and endpoint contract stable. Update build/deployment scripts when moving files; use exact current references in the register to guide the work.

## Scalability and dependencies

Static pages are well suited to CDN/server caching and can scale independently of the mail transport. The main constrained dynamic path is the synchronous SMTP enquiry request plus per-IP local-file rate limiting (AUD-005). Shared storage would only become necessary if there are multiple application instances; there is no evidence that the present hosting is multi-node. Avoid speculative database/queue infrastructure until traffic or delivery reliability justifies it.

The main dependency concern is the development toolchain (AUD-003), not a confirmed PHPMailer vulnerability. Centralizing Chrome discovery (AUD-016), enforcing browser failures (AUD-017), and preserving deterministic gate tooling (AUD-002) provide more immediate value than switching frameworks. The CI currently grants job-wide contents write permission; scoping write access to publishing is prudent hardening, but no unauthorized-write exploit was established and it is not counted as an additional confirmed vulnerability.

## Refactoring order and verification

1. Retain the external AUD-002 correction and stabilize release evidence with AUD-016/AUD-017.
2. Validate and update development dependencies (AUD-003).
3. Make modules readable and source imports stable (AUD-013), then give shell rendering one owner (AUD-012).
4. Correct semantic content-date tracking (AUD-015).
5. Optimize page-specific payloads after measuring coverage (AUD-014), and verify the cache/image lifecycle (AUD-020/AUD-023).

After approval, validate in an isolated checkout with `cd src && npm run build -- --keep-lastmod && npm run verify`; run the repaired browser/Lighthouse checks and compare route HTML, metadata, no-JS content, forms, estimator state, legal content and mobile navigation. No refactoring or configuration changes were performed as part of this audit.
