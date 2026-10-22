# SEO Audit — thinkvistar.com

Audited 2026-10-22 on the built output (`dist/`). **Verified** = measured here. **Needs live data** = cannot be known without Search Console / real traffic.

## Architecture (verified)
Static site generated from `src/` (templates + `site-data.json`) and pre-rendered with headless Chrome, so all content is in the delivered HTML (SSG, not CSR). One PHP endpoint (`api/contact.php`). Apache/LiteSpeed on Hostinger. 20 HTML files, 18 indexable.

## Findings and status
| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| 1 | High | Build source deleted from git; site could not be rebuilt/updated | commit 8662ddb | **Fixed** (restored, restructured to `src/` + `static/`, CI builds) |
| 2 | High | Past SMTP password leaked to GitHub history | SEO-REPORT.md §1 | **Blocked — owner** must rotate the password |
| 3 | Med | Contrast failures (contact hint 2.5:1, estimator chips 4.3:1) | Lighthouse a11y 95–96 | **Fixed** (all tested pages now 100) |
| 4 | Med | Privacy policy claimed analytics that do not exist | privacy text vs. no script | **Fixed** (text now matches reality) |
| 5 | Med | No AI-crawler policy, no machine-readable summary | robots.txt | **Fixed** (explicit allow list, `llms.txt`) |
| 6 | Low | 6 unreferenced image files (~400 KB) | reference scan | **Fixed** (removed) |
| 7 | Low | Sitemap `lastmod` was wrong after rebuild | sitemap diff | **Fixed** (frozen in CI via `--keep-lastmod`) |
| 8 | Med | No CSP; rate limit spoofable | code review | **Fixed** (CSP by hash; rate limit ignores spoofable header) |
| 9 | Med | `/projects/` is thin (≈260 words); case studies are placeholders (`isPlaceholder: true`) | word counts, data | **Blocked — needs real client content** |
| 10 | Med | No team/founder pages, no real reviews | content scan | **Blocked — needs real people/data; not fabricated** |
| 11 | Med | No analytics, so no conversion data | no script found | **Blocked — owner chooses tool** |
| 12 | Info | Search Console / Bing not verified | `SITE.verification` empty | **Needs owner access** |

## Verified clean
- Titles 46–61 chars, descriptions 139–160, all unique. One H1 per page, no heading-level skips.
- Canonicals self-referencing; sitemap and canonicals match exactly (18/18). `/case-study/` and `404.html` are `noindex, follow`.
- No orphan pages; every indexable page has 19 inbound internal links. No generic anchor text ("click here").
- All images have alt, width and height; JSON-LD parses on every page; no fake reviews/ratings in schema.
- Redirects in `.htaccess`: http→https, www→apex, `/index.html`→`/`. Custom 404.
- Lighthouse mobile (lab): Performance 98–99, Accessibility 100, Best Practices 100, SEO 100 on 9 pages; LCP 1.95–2.3 s, CLS 0.

## Not verifiable here (needs live data)
Real-user Core Web Vitals (INP especially), index coverage, rankings, backlinks, AI citations, HTTP behaviour on Hostinger (redirects and headers are configured but were tested only against a local server).
