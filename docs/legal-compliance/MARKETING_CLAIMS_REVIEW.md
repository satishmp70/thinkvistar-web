# Marketing and website claims review

Method: every text source that feeds a public page was searched for guarantees, absolutes, compliance or credential claims, performance figures, response-time promises and ownership statements, then read in context. Pages covered: Home, About, Services (and the seven service pages), Industries, Tech stack, Projects (sample blueprints), Estimator, Contact, Mumbai page, 404, Privacy, Terms, footer, structured data, metadata, `llms.txt`. Legal basis considered: CCPA Guidelines for Prevention of Misleading Advertisements, 2022 (applies to advertising in any medium; no B2B carve-out found — to be confirmed), general law of misrepresentation, and the principle that website statements should not create commitments that conflict with signed agreements (see R1). **Not legal advice; counsel to confirm.**

Legend: **Fixed** = changed in the working tree (local only, undeployed, with an automated guard). **Verify** = the statement may be true but only the owner can prove it; the site is unchanged and the item is on `LEGAL_APPROVAL_CHECKLIST.md`.

> **Owner decision 22 Oct 2026:** the owner does not want disclaimer-style wording in short marketing labels. The hero chip "Code ownership on full payment" was removed from the home page by the owner, and M-02/M-03 (the two statistics tiles and the "Reply to every enquiry" chip) were **reverted to the original wording**. These originals are accepted risks: "100% — Code & IP ownership on full payment" is broader than Terms §11 (Thinkvistar keeps its pre-existing tools and licenses them), and "Reply to every enquiry" is an unqualified response promise. The Terms (§3, §11) still control, and counsel can decide whether to keep them. The build guard no longer checks these particular labels.

## A. Statements corrected (implemented)

| ID | Where | Original | Problem | Now | Status |
|---|---|---|---|---|---|
| M-01 | Home hero chip (`src/pages/home.html`) | "You own 100% of the code" | Unconditional; contradicts Terms §10 (payment condition; Thinkvistar keeps pre-existing tools) | "Code ownership on full payment" | Fixed |
| M-02 | Home statistics tile (`site-data.json` `company.stats`) | "100% — Code & IP ownership on full payment" | Same contradiction | "Yours — Bespoke code & IP, on full payment" | Fixed |
| M-03 | Home hero chip and stats tile | "24h — Reply to every enquiry"; "24 hrs — Reply to every enquiry" | Absolute service promise ("every") | "Target reply: 24h, business days"; "Target reply time, business days" | Fixed |
| M-04 | Legacy modernization data (`site-data.json` services[2]) | "…with zero data loss" | Absolute data guarantee | "…with validated, reconciled data migration" | Fixed |
| M-05 | Same, deliverable | "Zero-downtime cutover" | Absolute availability promise | "Staged cutover with a rollback plan" | Fixed |
| M-06 | Process step 5 (`site-data.json`) | "Zero-downtime deployment, load testing…" | Absolute | "Staged deployment with rollback plans, load testing…" | Fixed |
| M-07 | Service page FAQs (`service-pages.mjs`) | "validation and zero data loss"; "We plan for zero downtime" | Absolute | "validation and reconciliation checks to protect data integrity"; "We plan to minimise downtime" | Fixed |
| M-08 | Services page (`services.html`) | "zero-downtime deploys" | Absolute | "staged deploys with rollback plans" | Fixed |
| M-09 | Service card title and text (`site-data.json` services[6]) and an FAQ link (`pages.mjs`) | "Cloud & 24/7 Support"; "SLA-backed support" | Implies round-the-clock cover and a service level that no document in the repository provides | "Cloud Support & Maintenance"; "…support after launch, under an agreed service plan" | Fixed |
| M-10 | Estimator results (`estimator.js`, `estimator.html`) | "sub-100ms API response times"; "sub-40ms global edge delivery"; "zero-downtime data migration" | Performance figures stated as outcomes | Designed-for/target wording; "staged data migration, rollback planning" | Fixed |
| M-11 | Blueprint feature (`site-data.json` project 0) | "Live telemetry charts with sub-100ms updates" | Number as outcome (page already says blueprint metrics are design targets) | "…low-latency updates (design target: under 100 ms)" | Fixed |
| M-12 | Estimator compliance/uptime outputs | "Guaranteed SLA Uptime", "SOC 2 & GDPR Ready", "HIPAA / PCI-DSS Level 1" | Guarantee and achieved-compliance impressions | Indicative targets; "aligned controls, assessed separately"; disclaimer panel | Fixed (earlier remediation) |
| M-13 | Mumbai page (`mumbai.html`) | "Data handled in line with India's DPDP Act, 2023" | A statement of compliance, when the Act's core duties start only on 13 May 2027 and compliance is unproven | "Privacy-by-design practices informed by India's DPDP Act, 2023" | Fixed |
| M-14 | Industries page (`industries.html`) | "Privacy by design under India's DPDP Act" | Same | "Privacy-by-design practices informed by India's DPDP Act" | Fixed |
| M-15 | Web-app service page (`service-pages.mjs`) | "accessible front end (WCAG 2.1 AA)" | A conformance claim that would need an audit | "built to WCAG 2.1 AA guidelines" | Fixed |
| M-16 | AI service FAQ | "We use enterprise API terms where providers do not train on your data" | A factual claim about third-party terms that change | "…according to the provider's current published terms…we confirm them for your project" | Fixed |
| M-17 | About 15 places: contact page, CTAs, FAQs, 404, meta description | "within 24 hours" / "24 business hours" / "one business day" (inconsistent, unqualified) | A response-time commitment that could be quoted back; inconsistent wording | One consistent, qualified wording: "we aim to reply within 24 hours on business days" | Fixed |
| M-18 | `llms.txt` (`llms.mjs`) | "Clients own 100% of the bespoke source code…"; "Replies…within one business day" | Same issues, in text read by AI systems | Ownership condition and retained tools stated; "Aims to reply…" | Fixed |
| M-19 | Form success message (`contact.php`) | "We will respond within one business day." | Promise | "We aim to respond within one business day." | Fixed |
| M-20 | Contact form | No notice where data is collected | Privacy transparency gap (LR-12) | Notice and Privacy Policy link added | Fixed (counsel to approve wording) |

**Guard:** `npm run verify` now fails the build if any marketing page contains `zero-downtime`, `zero data loss`, `own 100%`, `guarantee(d)` (outside a "not a guarantee" context), `24/7`, `SLA-backed`, `error-free`, `bug-free`, `unlimited support/revisions`, "reply to every enquiry", `in line with India's DPDP`, or "will rank". The Terms and Privacy pages are excluded because they legitimately say things like "we cannot guarantee absolute security".

## B. Statements reviewed and left unchanged

| Statement | Where | Verdict | Why |
|---|---|---|---|
| "30-day warranty" / "Post-launch defect warranty" | Home, services, FAQs, stats | Keep; **align** with R10 | Matches Terms §13 ("reproducible defects", conformance to agreed specifications). Wording in R10 counts from Completion rather than "production release" — change FAQs together with the Terms |
| "You own the code once the project is paid in full" | Service pages, FAQ | Keep | Conditional and consistent with Terms; "bespoke" is stated in the FAQ; revisit with R8 |
| Typical timelines ("4–6 weeks for a focused MVP…") | Services, estimator | Keep | Labelled typical/indicative; estimator now says estimates are not quotations |
| "Weekly demos", "written updates", "direct access", "no account-manager layer" | About, hero, FAQs | **Verify** | Process commitments: keep only if practised for every engagement |
| "Senior-led", "senior engineers", "principal engineers", "An engineer (not a salesperson) reads it" | Many | **Verify** | Cannot be verified from the repository; the company was founded in 2026 with three named people. If untrue for any engagement, change the wording |
| Client names, logos and links — Viora Healthcare, Viva Homecare, The Walk; "Trusted by growing businesses" | Home, About, Projects | **Verify** | Need written permission to use names/logos and to say clients "trust" the firm; consider "Our clients include" |
| Testimonials | Hidden (`showSection: false`) | OK | None are shown; do not add any without written consent and a genuine source |
| Sample blueprints and "design targets" | Projects, blueprint pages | OK | Visibly labelled "Sample blueprint"; metrics described as design targets; not presented as client work |
| "Founded in 2026", address, phone numbers, email | About, footer, structured data | **Verify** | Check against the LLP incorporation certificate and the registered office; whether to show LLPIN/GSTIN is not established (ask counsel / MCA) |
| Team personal mobile numbers and LinkedIn links | About | **Verify** | Consent of each person; consider a company number |
| "No commitment required. 30-minute technical architecture review with our principal engineers." | Estimator | **Verify** | A specific offer; keep only if it is honoured |
| "Proven modern stack", "Native-quality", "reliability at scale", "built to scale" | Several | Keep | Ordinary promotional puffery, not verifiable factual promises; avoid adding numbers |
| "HIPAA-aware builds"; "We are engineers, not lawyers: for formal compliance sign-off we work alongside your legal or compliance advisers" | Industries | Keep | The second sentence is a good protective disclaimer |
| Technology and AI vendor names and logos (OpenAI, Claude, Gemini, AWS, React…) | Services, tech stack, marquee | Keep; add R22 trademark note | Nominative use to identify technology; add a "trademarks belong to their owners; no affiliation implied" line |
| Structured data (Organization, Service, FAQPage, WebPage) | All pages | OK | No Review/AggregateRating; no unsupported credentials; `dateModified` follows content |
| `meta` descriptions, Open Graph, titles | All pages | OK after M-17 | Lengths and uniqueness re-verified by the build |

## C. Facts the owner must supply or confirm (nothing was invented)

See `LEGAL_APPROVAL_CHECKLIST.md`, section 1. In short: registration documents, permission for each client name/logo, how "senior" is defined, proof for any warranty/support/response-time practice, whether 24/7 or SLA support exists (if it does, document it in a Support Schedule before the words return), insurance, and team consents.
