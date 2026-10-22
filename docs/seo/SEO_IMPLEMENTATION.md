# SEO Implementation — what changed in code

| Area | Change | Files |
|---|---|---|
| Source recovery | Restored build source; layout is now `src/` (source), `static/` (images, fonts, api, robots, .htaccess), `dist/` (generated, git-ignored) | `src/`, `static/`, `.gitignore`, `.gitattributes` |
| Deploy | CI builds, verifies, runs Lighthouse, adds PHPMailer, publishes `dist/` to `deploy` branch; server needs no Node/Composer | `.github/workflows/check.yml`, `deploy.bat`, `DEPLOYMENT.md` |
| Crawl control | `robots.txt` allows search + AI crawlers explicitly, blocks only `/api/`; removed stale `/_src/` rule | `static/robots.txt` |
| AI discoverability | `/llms.txt`, `/llms-full.txt` generated from page data and FAQs (experimental, not a ranking factor) | `src/llms.mjs`, `src/build.mjs` |
| Entity/brand | Organization: alternateName variants, `Brand`, `disambiguatingDescription`, `knowsLanguage`; WebPage `dateModified`, `inLanguage: en-IN` | `src/pages.mjs`, `src/layout.mjs` |
| Head | `meta author`, `og:updated_time`, `link rel=alternate` to llms.txt. **No hreflang** (single-language site) | `src/layout.mjs` |
| Accessibility | Contrast fixes; form status `aria-live` | `src/css/additions.css`, `src/pages/contact.html` |
| Conversion | Phone number optional on contact form | `src/pages/contact.html`, `src/js/forms.js` |
| Content accuracy | Privacy text no longer claims analytics | `src/site-data.json` |
| Performance | Removed 6 unreferenced images | `static/images/` |
| Security | CSP (hash-allowed single inline script), rate limit no longer trusts `X-Forwarded-For`, `.env` outside web root | `static/.htaccess`, `static/api/*` |
| QA automation | `npm run verify` (SEO/link/schema checks), `npm run lighthouse` (gates) | `src/verify.mjs`, `src/lighthouse-check.mjs` |

Not changed: design, URLs, copy, API behaviour. Nothing deployed.

## Added during the audit remediation (see `audit-reports/REMEDIATION_STATUS.md`)

| Area | Change |
|---|---|
| Rendering | Content sections are rendered once at build time and saved (`data-prerendered`); the browser bundle only adds interaction, so crawlers and visitors get identical complete HTML and no site-data download |
| Freshness | Sitemap `lastmod` and `dateModified` follow a hash of each finished page; `lastmod.json` is committed and CI never rewrites it |
| Performance | esbuild bundles and minifies; contact-page JS 33.6 KB to 6.8 KB gz; fingerprinted fonts; responsive logo files |
| Accessibility | Linked form errors, radio-group estimator, modal drawer with focus trap, content visible if scripts fail |
| Trust | Estimator uses "indicative target" and "aligned controls, assessed separately" wording; team section is data-driven with LinkedIn links |
| QA | `npm test` (verify, route sweep, browser, endpoint, IndexNow), `test:lastmod`, pinned Lighthouse gate; all run in CI |
