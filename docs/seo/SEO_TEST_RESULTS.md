# Test results (2026-10-22)

| Test | Tool | Result |
|---|---|---|
| Build from restored source | `npm run build` | Pass; output identical to deployed site except filenames (line endings) |
| SEO/link/schema checks | `npm run verify` | Pass, 20 pages. Negative test: deliberately broken canonical + missing alt were caught |
| Lighthouse mobile, 9 pages (`/`, about, contact, estimator, industries, projects, saas, mumbai, tech-stack) | Lighthouse 12 | Perf 98–99, A11y 100, Best Practices 100, SEO 100 |
| LCP / CLS (lab) | Lighthouse | 1.95–2.3 s / 0.000 |
| Before-fix accessibility | Lighthouse | contact 96, estimator 95 (contrast) → fixed to 100 |
| CSP compatibility | headless Chrome, 6 page types | No console errors; contact form submits with phone empty (mocked endpoint) |
| Rate limit | local PHP, 7 requests, spoofed `X-Forwarded-For` | 6th/7th blocked (429) |
| JSON-LD | `JSON.parse` on all pages | Valid syntax |

## Limitations
- Lab data, desktop-class machine with simulated throttling. **INP not measured** (needs real interaction/field data; TBT 0–10 ms suggests low risk).
- JSON-LD checked for syntax, **not** run through Google's Rich Results Test (requires the live URL) — do this after launch.
- Not tested on Hostinger: redirects, headers, gzip, HSTS, CSP in production. Check with `curl -I` and securityheaders.com after deploying.
- Real SMTP delivery not tested (credentials unavailable).
- No ranking, indexing, backlink or AI-citation results exist yet.

## Update after remediation (22 October 2026, clean `npm ci`)

| Test | Result |
|---|---|
| `npm run verify` | 20 pages OK (adds output hygiene, form-schema drift, font fingerprints, date agreement) |
| `npm run check` | 77 route checks (18 routes x 2 widths, 7 service pages x 5 widths, blueprints, 404), run under the production CSP |
| `npm run test:browser` | 71 checks (no-JS and blocked-module form posts, error semantics, drawer focus, estimator, reduced motion, script-failure visibility, logo candidates) |
| `npm run test:contact` | 46 checks, fake mail transport |
| `npm run test:indexnow` / `test:lastmod` | 15 / 7 checks |
| `npm audit` / `composer audit --locked` | 0 / no advisories |
| Lighthouse 12.8.2, mobile lab, median of 3 | Performance 100, Accessibility 100, Best Practices 100, SEO 100 on `/`, `/contact/`, a service page and `/estimator/`; LCP 1.8 s; CLS 0 |

Lab data only. Still not tested: the live host (headers, redirects, `flock`), real mail delivery, Search Console / Rich Results Test, real-user Core Web Vitals, screen readers.
