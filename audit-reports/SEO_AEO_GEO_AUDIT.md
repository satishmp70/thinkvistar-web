# SEO, AEO and GEO audit

Audit date: 22 October 2026 (Asia/Kolkata). Audited the current working tree at base commit `8662ddb`, including existing staged, unstaged and untracked changes. Source references are relative to the repository root and include line numbers for this snapshot. No application fixes were made by this audit. During the audit, concurrent workspace edits changed the shared head, Lighthouse runner, historical SEO document and generated output. Those changes were preserved; AUD-002 was subsequently resolved and rechecked.

Related: [Summary](WEBSITE_AUDIT_SUMMARY.md) · [Architecture](ARCHITECTURE_ISSUES.md) · [Search](SEO_AEO_GEO_AUDIT.md) · [Security/performance](SECURITY_PERFORMANCE_REPORT.md) · [Complete register](COMPLETE_ISSUE_REGISTER.md) · [Roadmap](WEBSITE_IMPROVEMENT_ROADMAP.md).

## Verdict and current strengths

The generated website has a strong technical metadata baseline: 18 indexable sitemap URLs, self-referencing canonicals, unique title/description checks, one H1 on each tested indexable page, crawlable internal links, an HTML language declaration, raster social images, structured data, visible FAQs and prerendered content. The build produced 20 HTML files and passed its static verifier. These results apply to generated output; they do not establish what Google or Bing has indexed or which version is deployed.

This audit found no confirmed missing title, description, canonical, Open Graph image or JSON-LD on the 18 indexable generated pages. JSON parsing is not full schema semantic validation or rich-result eligibility. There is no need to fabricate a missing-schema issue to fill a report category. `SITE.verification` has empty optional HTML tokens (`src/pages.mjs:26`); DNS verification remains possible, so unverified ownership is **not** a confirmed defect.

## Confirmed search/content issues and shared impacts

| ID | Severity | Confirmed finding | Exact references | Status |
|---|---|---|---|---|
| AUD-004 | High | All seven service detail pages overflow the mobile viewport | src/css/additions.css:61; src/css/additions.css:186; src/service-pages.mjs:317 | Open |
| AUD-011 | Medium | A failed application module leaves prerendered content visually hidden | src/layout.mjs:75; src/css/premium.css:76; src/js/main.js:1279 | Open |
| AUD-015 | Medium | Sitemap modification tracking excludes client-rendered content changes | src/build.mjs:70; src/build.mjs:74; src/build.mjs:112; src/build.mjs:133 | Open |
| AUD-018 | Medium | Work content has no published client-specific case narratives | src/site-data.json:330; src/site-data.json:397; src/site-data.json:463; src/site-data.json:529; src/pages/projects.html:1 | Open |
| AUD-019 | Low | Named team members lack role and expertise context | src/pages/about.html:34 | Open |
| AUD-021 | Low | IndexNow helper succeeds even when notification is rejected | src/indexnow.mjs:11; src/indexnow.mjs:17 | Open |
| AUD-022 | Medium | Estimator presents compliance and uptime guarantees as automatic outcomes | src/pages/estimator.html:65; src/pages/estimator.html:144; src/js/main.js:495; src/js/main.js:516 | Open |

Evidence, root causes, reproduction, business/technical impacts, dependencies, estimates and acceptance tests for these IDs are in the [complete register](COMPLETE_ISSUE_REGISTER.md). Repeated references across reports describe the same issue, not additional entries. AUD-002 describes an initial finding resolved by a concurrent external edit; it is not an open production blocker.

AUD-004 and AUD-011 are shared mobile/availability findings, not additional SEO entries. AUD-015/AUD-021 are the two primary Technical SEO register items. AUD-018/AUD-022 concern content evidence and answer accuracy; AUD-019 concerns understandable entity expertise.

## Page-wise assessment

All URLs below use `https://thinkvistar.com`. “No additional confirmed defect” means the listed checks did not establish another issue; it does not mean ranking or complete semantic content quality was verified.

| Page | Source | Confirmed issue / assessment | Recommended focus |
|---|---|---|---|
| `/` | `src/pages/home.html:1`; `src/pages.mjs:153` | Metadata/FAQ present. AUD-011 hidden sections on module failure; AUD-015 homepage text changes escape modification hashing; illustrative work AUD-018. | Preserve visible content on partial failure; reliable freshness; publish approved delivery evidence. |
| `/services/` | `src/pages/services.html:1`; `src/pages.mjs:160` | Seven service destinations, timeline/pricing explanation, visible FAQs and ItemList exist. No additional confirmed on-page metadata defect. | Retain commercial intent differentiation; add factual pricing examples only with business approval. |
| `/services/saas-development/` | `src/service-pages.mjs`; `src/pages.mjs:226` | AUD-004 mobile overflow; page-specific Service/FAQ/Breadcrumb output present. | Fix shared mobile grid and add approved relevant proof. |
| `/services/mobile-app-development/` | same generator/manifest | AUD-004; unique page metadata exists. | Same mobile fix; specific app delivery evidence when available. |
| `/services/web-application-development/` | same generator/manifest | AUD-004; unique page metadata exists. | Same mobile fix; factual integration/delivery examples. |
| `/services/headless-cms-development/` | same generator/manifest | AUD-004; unique page metadata exists. | Same mobile fix; editor workflow/migration proof. |
| `/services/ai-automation/` | same generator/manifest | AUD-004; unique page metadata exists. | Same mobile fix; explain human review and measurable approved outcomes. |
| `/services/legacy-application-modernization/` | same generator/manifest | AUD-004; unique page metadata exists. | Same mobile fix; show migration constraints/verification with client permission. |
| `/services/cloud-support-maintenance/` | same generator/manifest | AUD-004; unique page metadata exists. | Same mobile fix; scope response/uptime targets to actual agreements. |
| `/industries/` | `src/pages/industries.html:1`; `src/pages.mjs:171` | Sector-specific content exists. No additional confirmed metadata/indexability defect. | Ensure regulated-industry wording remains scoped to project requirements, not automatic certification. |
| `/tech-stack/` | `src/pages/tech-stack.html:1`; `src/pages.mjs:177` | Crawlable technology content and FAQ present. No additional confirmed defect. | Explain actual selection tradeoffs rather than adding keyword lists. |
| `/projects/` | `src/pages/projects.html:1`; `src/site-data.json:330` | AUD-018: named clients plus four illustrative blueprints; no approved client-specific narrative routes. | Publish at least one genuine case and link it from relevant services. |
| `/about/` | `src/pages/about.html:34` | AUD-019: named team lacks expertise/role context. AboutPage and business details exist. | Add verified concise bios, roles and optional approved professional links. |
| `/estimator/` | `src/pages/estimator.html:65`; `src/pages.mjs:196` | AUD-022 guarantee/compliance wording; AUD-009 interaction semantics. FAQ and WebApplication markup exist. | Use qualified indicative outputs with accurate accessible explanations. |
| `/contact/` | `src/pages/contact.html:47`; `src/pages.mjs:208` | AUD-001 fallback privacy, AUD-008 errors; ContactPage and full address exist. | Secure no-JS behavior, accessible form correction and real delivery verification. |
| `/software-development-company-mumbai/` | `src/pages/mumbai.html:1`; `src/pages.mjs:243` | Actual Nalasopara/Palghar location is clearly contextualized as Mumbai region. No confirmed geographic doorway issue. | Maintain consistent true address and add actual local proof when approved. |
| `/privacy/`, `/terms/` | `src/pages.mjs:215`, `src/pages.mjs:221`; legal templates/modules | Prerendered policy content and metadata present; broader legal sufficiency not assessed. | Keep policy/estimator promises aligned (AUD-022); use qualified review for legal claims. |
| `/case-study/?id=…` | `src/pages.mjs:250`; `src/js/case-study.js:1` | Intentionally noindex and excluded from sitemap, with query-selected illustrative content. Noindex is appropriate to the current publishing decision. | Do not turn hypothetical samples into “real” indexed cases; publish real evidence at stable routes under AUD-018. |
| `/404.html` | `src/pages.mjs:258`; `static/.htaccess:7` | Intentionally noindex; configured custom error page. Actual deployed 404 status not verified. | Check real server status and preserve navigation back to useful pages. |

Global shell, cache/payload and responsive-image opportunities apply across routes (AUD-012/AUD-014/AUD-020/AUD-023). They are not repeated as one issue per page.

## Crawlability, indexability and metadata

- `static/robots.txt` allows public pages/assets and blocks `/api/`, including explicit AI crawler groups. Sitemap points at the canonical origin. Crawlers can still ignore robots; robots directives are not access control.
- `src/layout.mjs:77–115` emits title, description, canonical, Open Graph/Twitter and JSON-LD. A concurrent edit removed the optional single-language hreflang pair; this is not an indexing defect for this English-only site.
- `src/pages.mjs:39` defines a ProfessionalService entity with address, contact, sameAs and service catalog. `src/layout.mjs:17` adds page/breadcrumb/FAQ nodes. Service routes add Service; the estimator adds WebApplication. No fake review score was observed in current output.
- Prerendering provides indexable content in HTML, but source-only fast builds skip it. The production workflow uses the full prerendered build. `build:fast` existence is not a production SEO defect.
- Lastmod is a freshness hint and should reflect substantive changes; the demonstrated hash gap is AUD-015. [Google documents accurate sitemap modification dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Deployment redirects, TLS, actual robots/sitemap delivery, canonical selection and genuine HTTP 404 behavior need server checks. The configured rules were reviewed, not certified as active.

## AEO and AI-assisted search

The site already answers buyer questions with visible FAQs and structured content. `src/llms.mjs` generates a curated URL index and a longer reference from shared facts and page FAQs. This is a useful optional publication format, not a prerequisite or guarantee for AI citations. Do not spend effort inventing special AI schema or treating explicit training-bot permissions as proof of search discovery. Google's AI search guidance relies on ordinary SEO eligibility and does not require special AI files or markup. [Google Search Central: AI features](https://developers.google.com/search/docs/appearance/ai-features).

The largest actionable answer-quality gaps are concrete delivery evidence (AUD-018), team-role context (AUD-019), and preventing estimator labels from becoming misleading standalone answers (AUD-022). Keep concise direct answers with qualifications beside them. Retain native FAQ disclosures; ensure schema describes content actually visible. FAQ JSON-LD is not a promised search-result enhancement; search feature support/eligibility must be checked at release time.

## GEO / entity clarity and local discovery

Name, legal entity, canonical origin, address and contact data are present in visible footer/contact content and organization markup. Alternative brand spellings help disambiguation, but actual citations depend on crawl/index availability and corroborating information. Business Profile, directory NAP accuracy, verified social ownership and third-party coverage cannot be established from this repository alone. Do not label absent HTML verification tokens, a new business or lack of a blog as a confirmed ranking failure.

With owner access, confirm Google/Bing property ownership, Business Profile and directory facts; correct inconsistencies if evidence establishes them. Obtain real client reviews and case permissions. Client relationships do not automatically authorize adding promotional footer backlinks; obtain permission and use descriptive natural links. No outreach or external editing was performed.

## Keyword and content opportunities (not invented ranking research)

| Intent | Existing destination | Evidence-based next step |
|---|---|---|
| Custom software / SaaS partner | `/`, `/services/saas-development/` | Keep brand overview separate from the specific service; add real SaaS delivery facts when approved. |
| Mobile/web/CMS/AI/modernization/support | Seven service URLs | Fix mobile usability first (AUD-004), then deepen actual integration and delivery evidence; avoid seven near-identical generic claims. |
| Software partner near Mumbai | Mumbai page / contact / about | Use the true Mumbai-region address and actual meeting arrangements; avoid speculative city doorway pages. |
| Cost and engagement models | `/services/#pricing`, `/estimator/` | Publish qualified ranges only if the commercial owner supplies real assumptions and exclusions; no volume/rank claims were measured. |
| Delivery confidence | `/projects/`, `/about/` | Address AUD-018/AUD-019 with attributable projects and experience. |
| Planning/compliance requirements | `/estimator/`, service FAQs | Address AUD-022, distinguish project requirements and review from achieved compliance. |

## Google, Bing and AI search verification plan

After approved fixes/deployment, verify public status/headers and rendered HTML, submit the sitemap to Google/Bing owner tools, inspect representative canonical URLs, and measure actual crawl/index coverage. Google's Indexing API is not a general marketing-page submission shortcut. The current IndexNow helper needs failure handling (AUD-021); documented successful submission only acknowledges receipt, not guaranteed crawling/indexing. [IndexNow documentation](https://www.indexnow.org/documentation).

Track branded/nonbranded queries, impressions, indexed URLs, leads and attributable AI referrals where observable. Record dates and real evidence; do not promise a ranking position, indexing deadline or AI citation rate. The external verification queue in the complete register remains **Not Verified**, not part of the confirmed issue count.
