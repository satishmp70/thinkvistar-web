# Legal risk audit — Thinkvistar LLP website and terms

> **UPDATE 22 Oct 2026 (second pass, on the owner's instruction):** the Terms & Conditions and Privacy Policy text in `src/site-data.json` **has now been rewritten in the working tree** using the drafts in `PROPOSED_LEGAL_REVISIONS.md`. It is **not deployed and has not been reviewed by a lawyer**. Sections of this document that describe the Terms or Privacy Policy "as published" describe the text **before** this update; see `IMPLEMENTATION_LOG.md` §5 for exactly what changed. Do not deploy the new text until counsel has reviewed it.

Prepared 22 October 2026 for review by qualified legal counsel. **This is a risk-and-drafting analysis prepared by an AI assistant. It is not legal advice, it does not replace advice from an advocate enrolled in India (and, for overseas clients, counsel in the relevant country), and nothing in it has been published to the website except the low-risk factual corrections listed in `IMPLEMENTATION_LOG.md`.**

## 1. Scope and method

Reviewed in the repository (source of truth for everything published): the Terms & Conditions (18 sections) and Privacy Policy (15 sections) in `src/site-data.json`; every page template in `src/pages/`; service pages, FAQs and metadata in `src/pages.mjs` and `src/service-pages.mjs`; company, services, process, about, clients, projects and team data; the estimator (`src/js/estimator.js`); the contact form and its server handler (`static/api/contact.php`); structured data (`src/layout.mjs`, `src/pages.mjs`); and `llms.txt` generation (`src/llms.mjs`). Each statement that could be read as a promise, guarantee, compliance claim, credential or contractual term was extracted by search and read in context.

Not available to me, and therefore **not reviewed**: any signed client agreement, SOW, NDA or proposal template; the LLP agreement and registration documents; client permissions for logos and names; team contracts; hosting and mail provider terms; insurance; the actual operational security controls. Where a statement depends on these, it is marked "needs factual verification".

## 2. Legal framework — what was verified and how

Verification was by web search of secondary sources (law-firm and policy publications), run on 22 October 2026. No primary Gazette text was opened. Items marked **Confirm** must be checked against the primary source by counsel before reliance.

| Topic | Position used in this review | Basis and confidence |
|---|---|---|
| DPDP Act, 2023 and DPDP Rules, 2025 | Rules notified 13 Nov 2025 (G.S.R. 843(E)). Phased commencement: Rules 1, 2, 17–21 (Board) immediately; Consent Manager rules (Rule 4) after 12 months (about 13 Nov 2026); core data-fiduciary duties, notice and consent, security safeguards, data-principal rights, breach duties, children's data, cross-border (Rules 3, 5–16, 22, 23) after 18 months, i.e. **13 May 2027** | Bar & Bench, S.S. Rana & Co., DLA Piper, PIB document (secondary). One source disagreed on the notification day (13 vs 14 Nov). **Confirm** against the Gazette and PIB notice |
| IT Act, 2000 s.43A and SPDI Rules, 2011 | Remain the operative framework for "sensitive personal data or information" until the DPDP Act s.44(2) omission takes effect with the substantive provisions (13 May 2027). IT Act otherwise remains (s.79 intermediary safe harbour, CERT-In powers) | King Stubb & Kasiva, Linklaters (secondary). One practitioner source disputed the omission; **Confirm** s.44 text |
| CERT-In Directions, 28 April 2022 (s.70B(6) IT Act) | Effective 27 June 2022. Report listed incidents within **6 hours** of becoming aware; keep ICT logs for a rolling **180 days** within India | Linklaters, Ankura (secondary). Exact applicability to a small software firm and any later amendment not established. **Confirm** |
| Consumer Protection Act, 2019 | A "consumer" excludes a person who obtains goods or services for a "commercial purpose" (s.2(7)). Business clients are therefore generally outside the Act, but the boundary is fact-specific (dominant purpose / direct nexus test reported) | Government PDF and commentary (secondary). **Confirm** |
| CCPA Guidelines for Prevention of Misleading Advertisements, 2022 | Apply to advertisements in any medium; no source found that carves out B2B advertising. Treat website marketing as in scope | Vikaspedia, Nishith Desai (secondary). **Confirm** |
| Indian Contract Act, 1872 | s.74 (compensation for breach where a sum is named as penalty/liquidated damages: reasonable compensation only), s.73, s.23, s.28 (restraint of legal proceedings, with arbitration exception) | Established statute; cited from general knowledge, **not** re-verified in this run. **Confirm** |
| Copyright Act, 1957 | ss.17–19: absent a written agreement, the author (or employer for employees) is first owner; an assignment must be in writing signed by the assignor and, if the period or territory is not stated, is presumed to be 5 years and India. This matters for the "ownership transfers on payment" clause | Established statute; **not** re-verified in this run. **High priority for counsel** |
| Arbitration and Conciliation Act, 1996 | Seat Mumbai; interim relief (s.9), appointment (s.11); enforcement of foreign awards (New York Convention) depends on the reciprocating-territory notifications | General knowledge, **not** re-verified. **Confirm** |
| IT Act s.10A, s.3A | Electronic contracts and electronic signatures are recognised; evidential weight of a WhatsApp "acceptance" is weaker than a signed or authenticated e-signature | General knowledge. **Confirm** |
| LLP disclosure on websites | I could not establish whether an Indian LLP must display its name/LLPIN/registered office on its website (search returned UK rules only). No requirement is asserted | **Not established. Ask counsel / check MCA** |
| GST | Fees stated exclusive of GST; export-of-services treatment, place of supply and TDS/withholding for overseas clients depend on facts | Not researched. Tax adviser |

## 3. Result in brief

| Severity | Count | Findings (IDs are used in every document in this folder) |
|---|---:|---|
| High | 7 | LR-01 no order of precedence between website text and the signed SOW; LR-02 browse-wrap acceptance and WhatsApp-as-signature; LR-03 blanket non-refundable deposits; LR-04 IP "transfer on payment" without a written assignment; LR-05 liability cap measured by the last six months' fees; LR-06 portfolio use of client names and logos on an opt-out basis; LR-15 unsupported absolute claims on marketing pages (**fixed**) |
| Medium | 15 | LR-07, 08, 09, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 25, 26 (suspension without notice, missing definitions, unilateral changes, no force majeure, confidentiality exceptions, consent wording, Grievance Officer, privacy operational promises, DPA/incident terms, dispute-resolution detail, one-sided indemnity, third-party disclaimer, payment leverage, unverified client names/logos, international-client gaps) |
| Low | 5 | LR-21 messaging-service boilerplate, LR-22 notices, LR-23 privacy policy mentions of features that do not exist, LR-24 estimator claims (**fixed** in the earlier remediation), LR-27 trademark acknowledgement |

Total 27 findings: 2 are fixed on the local site, 25 need counsel/owner action or are proposed text.

Full detail: `CLAUSE_BY_CLAUSE_REVIEW.md` (every clause), `MARKETING_CLAIMS_REVIEW.md` (every claim), `CLIENT_LIABILITY_RISK_REGISTER.md`.

## 4. What was changed and what was not

**Implemented locally (low-risk, factual, reversible; not deployed):** absolute or unsupported statements on marketing pages were narrowed to what the evidence supports (`zero data loss`, `zero-downtime`, `24/7`, `SLA-backed`, `You own 100% of the code`, sub-millisecond performance figures, a DPDP "in line with" compliance claim, an unqualified response-time promise, WCAG wording, an AI-provider data-training statement); a short privacy notice was added beside the contact form; an automated check now fails the build if these phrases return. See `IMPLEMENTATION_LOG.md`.

**Terms & Conditions and Privacy Policy (second pass, owner's instruction):** rewritten in the working tree using the drafts. **Not deployed; not lawyer-reviewed.** The rewrite addresses LR-01 to LR-14, LR-16 to LR-23 and LR-27 in text. It cannot by itself address LR-25 (client permissions), LR-26 beyond the generic clause, LR-14's operational facts, a named Grievance Officer, or the need for signed documents and insurance (see `LEGAL_APPROVAL_CHECKLIST.md`).

## 5. Principal findings

1. **The Terms are written for a messaging/SMS platform vendor, not for a software studio** (clauses 2, 4, 5, 12, 14 are largely TRAI/DLT/SMS provisions). They do not define deliverables, acceptance, defects, change requests, completion, support or force majeure, and they have no clause saying the signed SOW prevails over the website. That omission lets a client argue that general website text (or a generic estimate) is a term of the deal (LR-01, LR-08, LR-10).
2. **IP:** "will become the exclusive property of the Client" is stated in website terms. A statutory written, signed assignment stating rights, territory and duration is the safer mechanism (LR-04).
3. **Refunds and liability are drafted in a way courts may trim.** A blanket "non-refundable" deposit and a cap tied to the last six months' fees are both candidates for challenge or may leave an early-stage client with an arguably illusory remedy; both are better drafted proportionately (LR-03, LR-05).
4. **Data protection:** the Privacy Policy is detailed but promises operational things (48-hour acknowledgement, 24-month deletion, role-based access, encrypted credential storage, breach notification) that must be true in practice, names no individual Grievance Officer, and treats browsing as consent. DPDP's core duties start 13 May 2027 and the SPDI Rules apply now (LR-12, LR-13, LR-14, LR-16, LR-23).
5. **Marketing:** a small number of statements read as guarantees. These are fixed; a second group (client names, "senior" engineers, WCAG, 30-day warranty, response times) needs facts only the owner can confirm (`MARKETING_CLAIMS_REVIEW.md`).

## 6. Residual risk statement

No document can guarantee immunity from disputes. Even the revised clauses in this pack remain subject to mandatory law (for example, liability for fraud or wilful misconduct cannot be excluded, and a court may reduce a stipulated penalty under s.74), to the facts of each engagement and to a counterparty's own law. They reduce avoidable disputes; they do not remove them.
