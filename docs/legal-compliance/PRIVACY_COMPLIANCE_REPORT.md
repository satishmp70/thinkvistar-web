# Privacy and data-protection compliance report

For review by qualified counsel. Not legal advice. Statements about what the website does come from reading the repository on 22 October 2026; statements about hosting, mail and internal procedures are **unverified** because those systems are outside the repository.

## 1. Legal framework (verified by secondary sources; see `LEGAL_RISK_AUDIT.md` §2)

| Instrument | Status relevant to this site | Key point |
|---|---|---|
| IT Act, 2000 s.43A and the SPDI Rules, 2011 | **In force now** | Apply to a body corporate that handles "sensitive personal data or information" (for example passwords, financial information, health data). Expect a published privacy policy, written consent to collect sensitive data, security practices, and a named Grievance Officer |
| Digital Personal Data Protection Act, 2023 + DPDP Rules, 2025 (notified 13 Nov 2025) | **Phased.** Board provisions in force; consent-manager rules from about 13 Nov 2026; **core duties from 13 May 2027** | Notice and consent, security safeguards, breach notification, processor contracts, data-principal rights, children's data, cross-border rules. The SPDI regime is expected to fall away when s.44(2) takes effect (to be confirmed against the Act) |
| CERT-In Directions, 28 April 2022 | In force since 27 June 2022 (applicability to Thinkvistar to be confirmed) | Report specified cyber incidents within 6 hours; keep ICT logs for 180 days in India |
| Foreign law | Depends on the client | If a client's data is subject to GDPR/UK GDPR or US state laws, those laws may require addenda irrespective of Indian governing law |

**Practical reading:** until 13 May 2027 the Privacy Policy must be accurate and the SPDI duties observed where sensitive data is handled. The policy and the contract set (R15) should be made DPDP-ready now, because contracts signed in 2026 will run past May 2027.

## 2. What the website actually does with personal data (from code)

| Item | Finding | Evidence |
|---|---|---|
| Contact form | Collects name, company, email, optional phone, scope, timeline, message. Sent by email to the company mailbox through SMTP; **not stored in a database or file by the website** | `static/api/contact.php` |
| Rate-limit record | A SHA-256 hash of the visitor's IP address plus timestamps, in a private folder, kept up to about two hours and deleted opportunistically. A hash of an IP address may still be personal data | `static/api/contact.php` (`takeRateLimitSlot`, `pruneRateLimitDir`) |
| Error logging | Server `error_log` receives a short operational message (no form content) | `contact.php` |
| Cookies and browser storage | **None set**; no `document.cookie`, `localStorage`, `sessionStorage` or IndexedDB use found in the built scripts | `grep` of `dist/assets/*.js` |
| Analytics, advertising, tag managers, chat widgets | **None** | built HTML/JS; CSP `connect-src 'self'` |
| Third-party requests on page load | **None**: fonts, scripts and images are self-hosted; the Content-Security-Policy `default-src 'self'` blocks others | `static/.htaccess` |
| Outbound links | LinkedIn, X, Facebook, Instagram, WhatsApp, Google Maps, and three client websites (links only; nothing is loaded from them) | built HTML |
| Hosting-level logs | The web host will record standard access logs (IP, URL, time, browser). **Retention and location unknown** | host not reviewed |
| Email and WhatsApp | Enquiries arrive in a mailbox; people may contact the team on WhatsApp (Meta) | operational |
| Team personal data on the site | Names, **personal mobile numbers** and LinkedIn links for three people are published on `/about/` | `src/site-data.json` (`team`) |
| Accounts / client data | The website has no login. Client data would be processed only under project work | n/a |

**Strengths:** very small data footprint; no trackers; no cookie banner needed on current facts; a hashed rather than raw IP in the rate-limit store; CSP prevents accidental third-party loading.

## 3. Gap analysis

| # | Area | Gap | Severity | Treatment |
|---|---|---|---|---|
| G1 | Consent wording | Policy §1 treats using the Site as consent (LR-12) | Medium | Reword (R21) |
| G2 | Notice at collection | The contact form had no notice. **One-line notice and link added** (implemented, awaiting counsel approval). A full DPDP-style notice is needed before 13 May 2027 | Medium → Low | Implemented / R21 |
| G3 | Accuracy of the policy | §3 mentions analytics providers, §4 mentions opt-in marketing, §5 mentions affiliates, §7 mentions embedded maps/videos: none exist (LR-23) | Low | Reword (R21) |
| G4 | Operational promises | §8 (controls), §9 (24-month deletion, eight-year records), §15 (48-hour acknowledgement) must be true in practice (LR-14) | Medium | Confirm each with the owner; delete what is not operated |
| G5 | Grievance Officer | No named individual (LR-13) | Medium | Name one, with contact details (R21) |
| G6 | Processor terms | No data processing addendum; no sub-processor list; no incident-notification period; no deletion/return terms (LR-16) | Medium | R15 + Schedule |
| G7 | Retention | No written retention schedule or routine for deleting old enquiry emails | Medium | Create schedule; add to calendar |
| G8 | Security programme | No evidence in the repository of a written information-security policy, access reviews, backups policy, incident-response plan or CERT-In procedure | Medium | Owner to confirm; see `MISSING_AGREEMENTS.md` |
| G9 | Cross-border | Hosting and mail locations unknown; policy §13 is generic | Low | Confirm provider regions; update |
| G10 | Team personal numbers | Personal mobile numbers published; consent not evidenced | Low | Written consent from each person; consider a company number |
| G11 | Data principals' requests | No documented process for access/correction/erasure requests | Low (now) / Medium (May 2027) | Short written procedure |
| G12 | Children | Policy states not directed at under-18s; B2B site | Low | None |
| G13 | Records of breach | No breach register | Low | Template and register |

## 4. Provisions drafted

`PROPOSED_LEGAL_REVISIONS.md` R15 (processing terms and incident notice for client engagements) and R21 (Privacy Policy corrections). Drafting is based on the capabilities **observed in the repository** (no cookies, no analytics, hashed rate-limit identifiers, email-only handling); anything about hosting, access control or backups is bracketed for the owner to confirm. **No compliance with DPDP, the SPDI Rules or CERT-In is asserted.**

## 5. Actions and owners

| Action | Owner | When |
|---|---|---|
| Name a Grievance Officer and confirm the 48-hour/30-day commitments are operable | Owner | Before publishing R21 |
| List hosting, email, WhatsApp, payment and any other providers with regions | Owner / IT | Before R15 Schedule |
| Confirm real security controls and complete the Security Measures schedule | Security lead | Before R15 |
| Adopt a retention schedule and delete enquiry emails older than the stated period | Owner | Ongoing |
| Written consent from each team member for published mobile number and LinkedIn link | Owner | Now |
| Counsel review of R15 and R21; decide lawful bases; align with DPDP Rules text | Counsel | Before 13 May 2027, ideally earlier |
| Check whether CERT-In directions apply and prepare a 6-hour reporting procedure | Counsel / security lead | Soon |
| Re-run the check after any change that adds analytics, forms, cookies or embeds, and update the policy first | Developer | Ongoing (a build check on third-party requests exists through the CSP) |
