# Implementation log

All changes are in the local working tree (staged/unstaged), **not committed, not deployed**. Only low-risk factual corrections and tooling were implemented. No clause of the Terms & Conditions or Privacy Policy was changed in this pass. Dates are 22 October 2026.

## 1. Changes made

| # | File | Change | Finding |
|---|---|---|---|
| 1 | `src/pages/home.html` | Hero chip "You own 100% of the code" → "Code ownership on full payment"; "Reply to every enquiry" → "Target reply: 24h, business days"; CTA reply wording qualified | M-01, M-03, M-17 / LR-15 |
| 2 | `src/site-data.json` | Stats tiles ("100%…", "Reply to every enquiry") reworded; legacy-modernization description and deliverable (zero data loss / zero-downtime); process step 5; support service title and description (24/7, SLA-backed); blueprint latency feature; CTA/contact reply wording | M-02–M-06, M-09, M-11, M-17 |
| 3 | `src/service-pages.mjs` | Zero data loss / zero downtime FAQs; WCAG wording; AI data-training FAQ; reply wording; cutover list item | M-07, M-15, M-16, M-17 |
| 4 | `src/pages/services.html` | "zero-downtime deploys"; reply wording | M-08, M-17 |
| 5 | `src/pages/estimator.html`, `src/js/estimator.js` | Latency and zero-downtime figures turned into design targets | M-10 |
| 6 | `src/pages/mumbai.html`, `src/pages/industries.html` | DPDP "in line with" / "under" claims; reply wording | M-13, M-14, M-17 |
| 7 | `src/pages/contact.html` | Reply wording ("24 business hours" → one wording); **privacy notice** beside the submit button | M-17, M-20 |
| 8 | `src/pages/404.html` | Reply wording | M-17 |
| 9 | `src/pages.mjs` | FAQ and contact-page metadata reply wording; FAQ link text "Cloud & 24/7 Support" → "Cloud Support & Maintenance"; meta description kept ≤ 160 characters | M-09, M-17 |
| 10 | `src/llms.mjs` | AI reference file: ownership condition and retained tools stated; "Aims to reply" | M-18 |
| 11 | `static/api/contact.php` | Success message "We aim to respond within one business day."; **bug fix:** a race when the rate-limit folder is first created (see §3) | M-19, AUD-005 follow-up |
| 12 | `src/css/additions.css` | Style for the form privacy note | M-20 |
| 13 | `src/verify.mjs` | New build guard: marketing pages must not contain unqualified absolute claims (list in `MARKETING_CLAIMS_REVIEW.md`); Terms and Privacy excluded | LR-15 |
| 14 | `src/lastmod.json` (generated) | Pages whose finished content changed received today's modification date automatically | AUD-015 behaviour |
| 15 | `docs/legal-compliance/` | The ten reports (new) | — |

Earlier in this project (already in the working tree before this task, listed here for completeness): the Privacy Policy "Cookies & Analytics" sentence was corrected to state that the site runs no analytics, and the estimator wording was changed from guarantees to indicative targets. Both are factual corrections awaiting counsel's confirmation.

## 2. Verification (after the changes)

| Check | Result |
|---|---|
| `npm run build` (full pre-render) | 20 pages, 18 sitemap URLs |
| `npm run verify` | OK, including the new absolute-claim guard (it first failed on structured data and a statistics tile I had missed, which were then corrected) |
| `npm run check` | 77 route checks passed |
| `npm run test:browser` | 71 checks passed |
| `npm run test:contact` | 46 checks passed, 40 consecutive clean runs after the race fix |
| `npm run test:indexnow` | 15 checks passed |
| Meta descriptions | Within 70–160 characters (enforced by `verify`) |
| Site behaviour | UI, routes, API and integrations unchanged; the form still posts and validates as before |

## 3. A defect found in my own earlier work

When the test suite was re-run after the marketing edits, the contact-endpoint test failed once; repeating it showed an intermittent failure of about one run in ten: 6 requests were admitted against a limit of 5. Cause: if the counter folder did not exist yet, two simultaneous first requests both tried to create it; the loser's `mkdir` failed, so it fell back to a different folder and used a separate counter. Fix: re-check `is_dir()` after a failed `mkdir`. 40 consecutive runs then passed. This is why the earlier remediation record for AUD-005 should be read as "fixed, with this follow-up".

## 4. Deliberately not changed

- **Terms & Conditions and Privacy Policy text**: material legal wording; see `PROPOSED_LEGAL_REVISIONS.md`.
- **Client names, logos, "senior", "weekly demos", "30-day warranty", "principal engineers", team phone numbers**: facts only the owner can confirm; see `LEGAL_APPROVAL_CHECKLIST.md`.
- **Footer legal identifiers (LLPIN, GSTIN, registered office)**: whether any display is required is not established; not invented.
- **Anything on the live site**: nothing was deployed or pushed.

## 5. Second pass (22 Oct 2026, on the owner's instruction): Terms, Privacy Policy and templates

The owner asked for the legal issues to be fixed. The following is in the working tree. It is **not deployed and not lawyer-reviewed**.

| # | File | Change |
|---|---|---|
| 16 | `src/site-data.json` → `termsAndConditions` | Rewritten as 24 sections in two parts: Part A website use; Part B standard services terms (precedence, acceptance, definitions, change control, client delay, acceptance and revisions, payment, termination and refunds, IP assignment, confidentiality, data protection, warranty and support, third parties and messaging, acceptable use, liability, indemnities, suspension, force majeure, international clients, law and disputes, general, changes). Last Updated set to October 22, 2026 (**change to the deployment date when it goes live**) |
| 17 | `src/site-data.json` → `privacyPolicy` | Sections 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13 and 15 corrected (consent wording, accurate technical-data description, marketing only if opted in, accurate recipient list, controller/processor terms, DPDP timing, security claims limited to what is evidenced, retention as "we aim to", Grievance Officer as a role with realistic response targets) |
| 18 | `src/pages.mjs`, `src/service-pages.mjs` | FAQ answers aligned with the new Terms (assignment of bespoke work, pre-existing tools stay Thinkvistar's, confidentiality duration, warranty counts from completion against acceptance criteria) |
| 19 | `src/layout.mjs`, `src/css/additions.css` | Footer note on every page: information is general and indicative, commitments only in a signed SOW, third-party names belong to their owners |
| 20 | `src/verify.mjs` | Build now fails if the Terms lose required clauses (precedence, change requests, acceptance, termination and refunds, IP, liability, force majeure, governing law, data protection), if the blanket non-refundable or "without notice or refund" wording returns, if consent-by-browsing returns, or if the Grievance Officer section disappears |
| 21 | `docs/legal-compliance/templates/` | Starter drafts for counsel: SOW (with Change Request and Acceptance Certificate annexes), mutual NDA, IP assignment deed, contractor agreement, publicity consent |

**Defaults I chose where the draft had brackets** (owner to confirm): acceptance period 5 Business Days; two revision rounds per milestone; change-request reply 3 Business Days; client-delay thresholds 10 Business Days and 30 days; cure period 15 days; invoice-dispute notice 7 days; suspension notices 7 + 14 days with a 30-day data-export window; warranty 30 days from Completion; confidentiality 3 years; incident notice 72 hours; force majeure termination after 60 days; claims notice 12 months; liability cap equal to fees paid and payable under the SOW (no floor). Existing positions were kept where the old Terms had one (14-day payment, 1.5% per month interest, 14-day termination notice, 30-day estimate validity, Mumbai arbitration).

**Verification after this pass:** `npm test` passes (verify, 77 route checks, 71 browser checks, 46 form-endpoint checks, 15 IndexNow checks); Lighthouse accessibility audits pass on `/`, `/terms/` and `/privacy/`; the Terms render as 24 sections and the Privacy Policy as 15.

**Things the repository cannot fix and that are still open:** a named Grievance Officer, client permissions for names and logos, signed agreements actually used with each client and contractor, security-measures and sub-processor schedules, a Support Schedule, insurance, registration identifiers, and lawyer review. See `LEGAL_APPROVAL_CHECKLIST.md`.

## 6. Owner instruction (22 Oct 2026): no disclaimer-style wording in short labels

Reverted the home-page statistics tiles and the third hero chip to the original text ("100% — Code & IP ownership on full payment", "Reply to every enquiry"). The owner had already removed the "Code ownership on full payment" chip; it was not restored. The verify guard for these specific phrases was removed; the guard for zero-downtime, zero data loss, 24/7, SLA-backed and similar promises remains. Terms and Privacy text is unchanged by this step.
