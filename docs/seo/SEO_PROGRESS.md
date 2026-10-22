# SEO progress

## Done (verified in repo)
Source restored and restructured; CI build + verify + Lighthouse gate; robots/AI crawler policy; llms.txt; entity schema; contrast fixes; privacy text corrected; dead images removed; CSP; rate-limit hardening; 9 SEO docs.

## Added since
Audit remediation (AUD-001 to AUD-023) implemented and verified locally; see `audit-reports/REMEDIATION_STATUS.md`. LinkedIn links added to the team section.

## Needs owner (blocked on access or decisions)
- [ ] Team roles and short bios (`team` in `src/site-data.json`)
- [ ] Client permission and approved facts for a first real case study
- [ ] Rotate Hostinger mailbox password; create `.env` above `public_html`
- [ ] Switch Hostinger Git to `deploy` branch (steps in DEPLOYMENT.md)
- [ ] Verify Google Search Console + Bing Webmaster; paste tokens into `SITE.verification` (`src/pages.mjs`); submit sitemap
- [ ] Create Google Business Profile, LinkedIn page, directory listings
- [ ] Choose analytics (GA4 or Plausible); then update privacy text + CSP
- [ ] Confirm hosting/CDN does not block AI/search bots
- [ ] Decide AI-training opt-in/out (SEO_AI_VISIBILITY.md)
- [ ] Provide real case-study facts, team bios, testimonials
- [ ] Approve content calendar

## Pending after deploy
Rich Results Test on live URLs; `curl -I` header/redirect check; first AI evaluation baseline.
