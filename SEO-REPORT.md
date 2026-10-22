# Thinkvistar — SEO audit, changes & content plan

Date: 28 September 2026 · Domain: https://thinkvistar.com

Nothing here guarantees rankings. The goal is a site that is crawlable, fast, trustworthy and genuinely useful, so it can compete fairly.

---

## 1. Audit findings (before)

| Area | Finding | Severity |
| --- | --- | --- |
| Crawlability | Navigation, services, projects, stats, testimonials, footer links and the full privacy/terms text were injected by JavaScript. The HTML had empty containers. | High |
| Trust / E-E-A-T | Testimonials from invented people ("Dr. Arthur Sterling", etc.), stats with no basis (99.99% uptime, 12M+ events/day, 4.9/5 rating) and case studies for fictional US/UK enterprises, on a site that says it was founded in 2026. This risks Google's spam and review policies and misleads buyers. | High |
| Domain | Canonicals, sitemap, robots and schema pointed at the wrong domain. | High |
| Contact form | The PHP endpoint did not accept submissions from thinkvistar.com. | High |
| Orphan page | /industries/ had an old, inconsistent header, no footer links, and nothing in the navigation linked to it. | Medium |
| Social previews | og:image was an SVG, which Facebook, LinkedIn and X don't render. Several pages had no og:image. | Medium |
| Favicon | favicon.svg showed "DS", from a previous brand. | Medium |
| Headings | The homepage H1 ("Software built to scale with your business") had no topic keywords. Titles were generic ("What we provide.", "Tools we build with."). Card headings skipped levels. | Medium |
| Thin content | Services had one line per service. No timelines, pricing model, engagement models or FAQs, which are the questions buyers search for. | Medium |
| Case-study URLs | One URL with `?id=` for every case study, all sharing one canonical: duplicate, thin, JS-only pages. | Medium |
| Performance | Google Fonts (2 extra origins, render-blocking CSS). A wasted request to a non-existent /data/siteData.json on every page. A 160 KB PNG logo shown at ~175 px. 80 KB client logos shown at 48 px. No caching or compression rules. | Medium |
| Technical | No custom 404 page, no HTTPS/host redirects, no `<main>` landmark on inner pages, /index.html duplicates reachable. | Low–Medium |
| Local SEO | No full postal address, no LocalBusiness schema, inconsistent location text. | Medium |
| Security | `public/api/config.php` (SMTP password) was committed in git history (commit f1d456d, pushed to GitHub). | High |

## 2. What was changed

**Architecture.** The original source had been deleted, so the deployable root was rebuilt from a new `src/` folder (see README.md). One command rebuilds every page from a shared layout, fingerprints the assets and **pre-renders all JavaScript content into the HTML**. The design, URLs and features (estimator, contact form, blueprint pages) are unchanged.

**Honesty and trust**
- Fake testimonials removed. The section stays hidden until real ones exist.
- Stats replaced with commitments backed by the Terms: 24-hour reply, weekly demos, 100% code/IP ownership on payment, 30-day warranty.
- The four case studies are relabelled as **Solution blueprints**, with a visible "SAMPLE BLUEPRINT" tag and notice. Invented results became "design targets", and fictional client locations were removed.
- Real clients (Viora Healthcare, Viva Homecare, The Walk) are shown on the homepage, About and Work pages.

**On-page.** Every indexable page has a unique title (≤ 62 characters), a unique description (≤ 160), exactly one descriptive H1, a logical H2/H3 outline and breadcrumbs. Topics per page (no cannibalisation):

| Page | Primary topic | Title |
| --- | --- | --- |
| / | custom software & SaaS development company | Custom Software & SaaS Development Company \| Thinkvistar |
| /services/ | software development services, timelines, pricing | Software Development Services: SaaS, Web & AI \| Thinkvistar |
| /industries/ | industry software (healthcare, fintech, …) | Industry Software: Healthcare, Fintech, Retail \| Thinkvistar |
| /tech-stack/ | technology stack | Tech Stack: React, Next.js, Node.js & AWS \| Thinkvistar |
| /projects/ | clients & solution blueprints | Our Work: Clients & Solution Blueprints \| Thinkvistar |
| /about/ | company, location, process | About Thinkvistar — Senior-Led Software Studio near Mumbai |
| /estimator/ | project timeline estimation | Software Project Timeline Estimator \| Thinkvistar |
| /contact/ | contact / consultation | Contact Us & Book a Consultation \| Thinkvistar |

**Content added** (from search-intent research: buyers look for timelines, cost, engagement models, IP ownership, NDAs and time zones, and competitors rarely answer these)
- Services: fuller copy per service, with "Best for" and "Typical timeline"; a timelines table matching the estimator's logic; how pricing works and the factors that affect cost; three engagement models; and 5 FAQs.
- Industries: six detailed sectors with typical projects, plus a "how we handle regulated data" section (DPDP Act, HIPAA).
- About: a location section and a "who we work with" section. Contact: full address, map link, remote-working details, 4 FAQs. Estimator: how the estimate is calculated, 4 FAQs. Tech stack: 3 FAQs. Homepage: 5 FAQs.
- FAQ answers quote your actual Terms (IP clause, 30-day warranty, milestone invoicing, confidentiality).

**Internal linking.** Industries is now in the footer and linked from the homepage and services. Footer service links go to each service's section (`/services/#…`). Contextual links connect services ↔ estimator ↔ pricing ↔ terms ↔ industries ↔ blueprints. Every indexable page has 11+ internal inbound links.

**Technical**
- `.htaccess`: HTTPS and non-www redirects, /index.html → /, custom 404 page, gzip, 1-year immutable caching for fingerprinted assets, security headers, and `src/`, `vendor/` and `.md` files blocked from the web.
- `robots.txt` and `sitemap.xml` point to thinkvistar.com. The sitemap lists 10 indexable URLs.
- Canonical tags on all indexable pages. `/case-study/` and `404.html` are `noindex, follow`.
- `<main>` landmark, skip link, semantic breadcrumbs and correct heading levels on every page.
- Contact form now accepts thinkvistar.com.

**Structured data** (JSON-LD, generated from the same data as the visible page): ProfessionalService (LocalBusiness) with address, contact point, areaServed and sameAs; WebSite; WebPage/AboutPage/ContactPage/CollectionPage; BreadcrumbList; Service ×6; FAQPage on the 5 pages with visible FAQs; WebApplication for the estimator. There are no Review or AggregateRating markups, because there are no genuine reviews yet.

**Images & performance**
- Logo is now a 34 KB WebP (was 160 KB PNG). Client logos are 5–8 KB WebP (were 51–83 KB PNG). There's a 1200×630 PNG share image and a new favicon set (ico, png, apple-touch) from the "V" mark.
- Explicit width/height on all images, `fetchpriority="high"` on the hero image, lazy loading below the fold.
- Inter font is self-hosted and preloaded, removing Google Fonts. Module preloading removes the JS waterfall, and the wasted /data/siteData.json request is gone.
- Measured locally (mobile viewport, 4× CPU slowdown, throttled network): LCP 1.2–1.9 s, CLS 0.000, ~110–150 KB transferred per page. These are lab numbers; check real-user data in Search Console after launch.

## 3. Final audit (after)

- 10 indexable pages: all titles and descriptions unique; exactly one H1 each; no heading-level skips; canonicals self-referencing on thinkvistar.com.
- 0 broken internal links; 0 orphan pages; all images have alt text and dimensions.
- All JSON-LD parses. FAQPage content matches the visible FAQ text (same source).
- 0 console errors and 0 failed requests on desktop (1366 px) and mobile (390 px), with no horizontal overflow (`src/check.mjs`).
- Not verified: indexing status. Nothing can be checked in Google until the domain is live and added to Search Console.

## 4. Needs your action

1. **Rotate the SMTP mailbox password** (it is in public git history). Then consider purging `public/api/config.php` from history.
2. Point thinkvistar.com at the hosting, enable SSL, then enable the HSTS line in `.htaccess`. Set up Search Console, the sitemap and Change of Address (see DEPLOYMENT.md).
3. **Confirm the postal code 401203** and the address format; they appear in the footer, contact page and schema.
4. Review the FAQ answers, especially "we're happy to sign your NDA", response times and the timeline ranges. They are commitments.
5. Create a **Google Business Profile** with the same name, address and phone number, and ask your three clients for genuine Google reviews.
6. Biggest trust wins still missing: **real case studies** for Viora Healthcare, Viva Homecare and The Walk (what you built, and outcomes they agree to publish), **founder/team bios** with LinkedIn links, and real testimonials. Add them to `src/site-data.json` (`projects` with `isPlaceholder: false`, `testimonials.items`).
7. Optional: publish your own **price ranges** on /services/#pricing. Competitors rarely do, and buyers search for it heavily. Only you can set them.
8. Update the Facebook link in `site-data.json` if there is a Thinkvistar page.

## 5. Content plan (new pages worth creating)

Each needs real expertise to be useful. Build one at a time, starting from the top. Suggested: a `/blog/` (or `/guides/`) section with Article + BreadcrumbList schema, and link each post from the related service section.

| # | Topic & intent | Title / H1 | URL | Main questions | Links to | Schema |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Cost of custom software in India (informational → commercial) | How Much Does a Custom Web App Cost in India in 2026? | /guides/web-app-development-cost-india/ | Cost ranges by complexity; what drives cost; fixed vs T&M; hidden costs (hosting, support) | /services/#pricing, /estimator/ | Article, FAQPage |
| 2 | SaaS MVP cost & timeline (commercial) | SaaS MVP Development: Cost, Timeline and What to Build First | /guides/saas-mvp-cost-timeline/ | Which features belong in an MVP; weeks per feature; build vs no-code | /services/#custom-saas, /estimator/ | Article |
| 3 | Engagement models (informational, high question volume) | Fixed Price vs Time & Materials vs Dedicated Team | /guides/software-engagement-models/ | Pros and cons; which suits which project; how change requests work | /services/#engagement, /contact/ | Article, FAQPage |
| 4 | IP & NDAs with an Indian partner (trust, international buyers) | Who Owns the Code When You Outsource to India? | /guides/ip-ownership-outsourcing-india/ | IP assignment clauses; NDAs under Indian law; escrow and repositories | /terms/, /services/ | Article |
| 5 | Working across time zones (international buyers) | Working with an Indian Development Team from the US, UK or EU | /guides/working-with-indian-development-team/ | Overlap hours; communication cadence; demos; payments and GST | /about/, /contact/ | Article |
| 6 | Strapi vs Contentful (informational, lower competition) | Strapi vs Contentful: Which Headless CMS Fits Your Budget? | /guides/strapi-vs-contentful/ | Hosting costs; editor experience; self-hosting; migration effort | /services/#headless-cms | Article |
| 7 | WordPress → headless migration | Migrating from WordPress to a Headless CMS Without Losing SEO | /guides/wordpress-to-headless-cms-migration/ | Redirect mapping; content migration; timeline; when not to migrate | /services/#headless-cms, CMS blueprint | Article |
| 8 | Healthcare clinic websites (uses your real client experience) | Websites and Booking Systems for Clinics and Home-Care Providers | /guides/healthcare-clinic-website-booking/ | Booking flows; patient data under the DPDP Act; local SEO for clinics | /industries/#healthcare, /projects/ | Article |
| 9 | Practical AI automation (commercial, fast-growing) | 5 AI Automation Workflows That Work for Small Businesses | /guides/ai-automation-small-business/ | Document extraction; support assistants; costs; accuracy and human review | /services/#ai-automation | Article |
| 10 | Legacy modernization for SMEs | Modernising a Legacy Business System Without a Big-Bang Rewrite | /guides/legacy-system-modernization-smb/ | Strangler pattern; risk; phased budget; data migration | /services/#legacy-modernization | Article |
| 11 | Local (only if you'll serve clients in person) | Software Development Company in Vasai-Virar & Palghar | /software-development-vasai-virar/ | Who you serve locally; in-person meetings; local clients; directions | /about/#location, /contact/ | WebPage + existing LocalBusiness |
| 12 | Post-launch support buyers' checklist | What a Software Support & Maintenance Plan Should Include | /guides/software-maintenance-plan-checklist/ | SLAs; response times; what's covered; typical monthly costs | /services/#maintenance-support | Article |

Don't create one page per city. Page 11 is justified only because it's your actual location.

When real client projects exist, give each its own static URL (for example `/projects/viora-healthcare/`), indexable and with Article schema, instead of the `?id=` blueprint page.

---

## 6. Update — 29 September 2026

### Findings
- **Not indexed yet.** A web search for the exact brand name "thinkvistar" returns nothing from this site, while a similarly named company ("TechVistar") ranks. The pages themselves are crawlable (pre-rendered HTML, canonicals, sitemap, robots all correct), so the blocker is discovery and authority, not markup.
- **No page per service.** All services shared `/services/#…`. Google ranks URLs, not anchors, so nothing could rank for "mobile app development company", "SaaS development company", etc.
- **No backlinks from client sites.** viorahealthcare.in, vivahomecare.in and thewalkphysio.com don't link to Thinkvistar.
- Sitemap `<lastmod>` was set to the build date for every page on every build (Google learns to ignore that).

### Changes made
- **7 service pages** (`/services/<slug>/`), each with its own title, description, H1, use cases, deliverables, delivery steps, technology, timeline, 4 FAQs, related-service links and `Service` + `FAQPage` + `BreadcrumbList` schema: saas-development, mobile-app-development, web-application-development, headless-cms-development, ai-automation, legacy-application-modernization, cloud-support-maintenance. Content lives in `src/service-pages.mjs`.
- **Local page** `/software-development-company-mumbai/` built on the real office address, with directions, service areas and 4 FAQs. Linked from the footer on every page and from About.
- Internal links: service cards, footer, timeline table and FAQs now point to the service pages. `/services/` emits an `ItemList` of them.
- Organization schema: `alternateName` (Thinkvistar LLP / Think Vistar / ThinkVistar), `slogan`, `hasOfferCatalog` linking the services.
- Homepage title now leads with the brand: "Thinkvistar | Custom Software, SaaS & App Development Company".
- Sitemap `<lastmod>` now changes only when a page's content changes (`src/lastmod.json`).
- Search Console / Bing verification tags supported via `SITE.verification` in `src/pages.mjs`. `geo.region` meta added.
- **IndexNow** for Bing/Yandex: key file in the site root, and `node src/indexnow.mjs` pings all sitemap URLs after a deploy.
- Typography: Plus Jakarta Sans (self-hosted, 27 KB) for headings, refined Inter body text.
- Audit after the build: 18 indexable pages, all titles ≤ 62 characters and descriptions ≤ 160, all unique, one H1 each, self-canonicals, every indexable page in the sitemap, 0 broken internal links, 0 images without alt, 0 console errors (desktop and mobile).

### Off-page plan (must be done by you, in this order)
1. **Deploy** the rebuilt site to thinkvistar.com.
2. **Google Search Console**: add a Domain property for thinkvistar.com (DNS TXT record in Hostinger) → submit `sitemap.xml` → URL Inspection → "Request indexing" for the homepage, /services/, each service page and the Mumbai page.
3. **Bing Webmaster Tools**: import from Search Console, then run `node src/indexnow.mjs`.
4. **Google Business Profile** for "Thinkvistar LLP" at the exact footer address and phone, category "Software company", website link to /software-development-company-mumbai/. Ask your 3 clients for genuine Google reviews. This is the biggest single lever for local searches.
5. **Client backlinks**: add "Website by Thinkvistar" (linking to https://thinkvistar.com/) in the footers of viorahealthcare.in, vivahomecare.in and thewalkphysio.com. You built them, so this is legitimate and fast.
6. **Consistent listings (same name, address, phone everywhere)**: LinkedIn company page (website field + posts), Clutch, GoodFirms, DesignRush, Justdial, Sulekha, IndiaMART, Bing Places, Apple Business Connect.
7. **Content**: publish one useful guide every 2–3 weeks from the plan in section 5, each linking to the matching service page. Start with the cost guide, which needs your real price ranges.
8. **Measure** monthly in Search Console: pages indexed, queries, impressions, average position.

Realistic expectation: brand searches ("thinkvistar") usually start working within days to a few weeks of Search Console submission. Competitive terms like "software development company Mumbai" take months and depend mostly on steps 4–7.

## 5. Search + AI-search layer (added with the src/static restructure)

**Classic SEO (checked on every build by `npm run verify`):** unique title and description per page, one H1, canonical, Open Graph/Twitter, valid JSON-LD, alt text on every image, sitemap and canonicals in sync, and `dateModified` in WebPage schema.

**Brand name:** Organization schema now carries `alternateName` (Thinkvistar LLP, Think Vistar, ThinkVistar), a `Brand`, and a `disambiguatingDescription`, so search engines and AI models connect all spellings to one entity. Every title ends in or contains "Thinkvistar".

**AI search (ChatGPT, Gemini, Claude, Perplexity, Copilot, Apple, Meta):**
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, Google-Extended, PerplexityBot, Perplexity-User, Bingbot, Applebot(-Extended), Meta-ExternalAgent, Amazonbot, DuckAssistBot and CCBot.
- `/llms.txt` (curated index) and `/llms-full.txt` (company facts + every FAQ in plain text) are generated at build from the same data as the pages.
- Content is pre-rendered HTML with FAQ blocks and FAQPage schema, which is the format answer engines quote most easily.

**Off-site steps only you can do** (these decide whether AI tools and Google trust and cite you; see the list in the chat reply):
Search Console + Bing Webmaster Tools, Google Business Profile, a LinkedIn company page with the same name/address/phone, Clutch/GoodFirms/Crunchbase listings, real client reviews, and links from your clients' sites. Then paste the verification tokens into `SITE.verification` in `src/pages.mjs`.
