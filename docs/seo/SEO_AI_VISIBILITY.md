# AI search visibility (GEO / AEO)

No tactic guarantees inclusion or citation in ChatGPT, Gemini, Perplexity, AI Overviews or Copilot. These systems mainly reuse the normal search index plus pages they can fetch, so strong classic SEO and off-site mentions matter most.

## Crawler policy (implemented in `robots.txt`; all allowed, `/api/` blocked)
| Purpose | Bots | Decision |
|---|---|---|
| Search / answer retrieval (drives citations) | OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Bingbot, Googlebot, DuckAssistBot, Applebot | **Allow** — needed to be cited |
| Model training / grounding opt-outs | GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, CCBot, Amazonbot | **Allow (owner decision)** — the content is public marketing copy and brand awareness is the goal. To opt out of training while staying searchable, change these groups to `Disallow: /`; search/citation bots are unaffected. |

Note: Google-Extended does not affect Google Search ranking or AI Overviews eligibility. No WAF/CDN rule was verified (Hostinger settings are not visible from the repo) — **check that Hostinger/Cloudflare bot protection does not block these user-agents.**

## On-site (implemented)
- Content is in server-delivered HTML; FAQ blocks + FAQPage JSON-LD; concise answers in plain language.
- Consistent entity: name, legal name, spelling variants, address, phone, email repeated identically in schema, footer, `llms.txt`.
- `llms.txt` / `llms-full.txt`: **experimental**, no major engine has confirmed using them. Low cost, no downside.

## Off-site (decides most outcomes; see SEO_OFFPAGE_PLAN.md)
Mentions on LinkedIn, Clutch, GoodFirms, Crunchbase, client sites, communities.

## Repeatable evaluation set (run monthly, record in a sheet; owner or a tool runs it — not done here)
Ask each of ChatGPT (search on), Gemini, Perplexity, Copilot, Google AI Mode:
1. What is Thinkvistar? Who runs it? Where is it based?
2. Best SaaS development company in Mumbai / India for a startup?
3. Who can migrate WordPress to a headless CMS in Mumbai?
4. How much does custom software development cost in India?
5. Who owns the source code when you hire an Indian software company?
6. AI automation / LLM integration company in India?
7. Mobile app development company near Mumbai / Vasai-Virar?
Record per query: appears? cited with link? description accurate? competitors named. Baseline today: **unknown (not tested; the site is new and unindexed data was not available).**
