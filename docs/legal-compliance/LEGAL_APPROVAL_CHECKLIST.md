# Legal approval checklist

Nothing below has been approved. Tick items only when the named person has actually confirmed them. Do not publish any proposed legal text (`PROPOSED_LEGAL_REVISIONS.md`) until the items it depends on are ticked.

> **UPDATE 22 Oct 2026:** the proposed Terms and Privacy Policy text is now in the working tree (`src/site-data.json`), undeployed. Section 3 below therefore becomes: **counsel reviews the exact text on the site before it is deployed.** The templates in `templates/` also need counsel and your signature process.

## 1. Facts only the owner can confirm (no document in the repository proves them)

- [ ] Legal name, LLPIN and registered office of Thinkvistar LLP match the incorporation documents; "founded in 2026" is correct
- [ ] Whether the website must or should show LLPIN / GSTIN / registered office (ask counsel; not established here)
- [ ] Written permission from **Viora Healthcare, Viva Homecare and The Walk** to show their names, logos and links, and to say "Trusted by…" (or change to "Our clients include")
- [ ] Each team member (Rahul Dubey, Satish Mishra, Chandan Yadav) consents to the published mobile number and LinkedIn link
- [ ] "Senior-led / senior engineers / principal engineers": define what "senior" means and confirm it is true for every engagement, or change the wording
- [ ] Weekly demos, written updates, "no account-manager layer" and the "30-minute architecture review" are really practised
- [ ] The 30-day warranty is actually honoured for every project in the way the Terms describe
- [ ] The target reply time (24 hours on business days) is achievable; who monitors the mailbox
- [ ] Whether any 24/7, on-call or service-level support is actually offered (if yes, write the Support Schedule first)
- [ ] The security controls named in the Privacy Policy §8 are in operation (TLS, encrypted credential storage, role-based access, "strict internal access policies")
- [ ] Hosting, email and any other provider names and regions (for the sub-processor list and international-transfer statement)
- [ ] A real retention routine exists for enquiry emails (24 months) and the record-keeping periods are right
- [ ] Insurance: professional indemnity / technology E&O and cyber cover (type, limit)
- [ ] A named Grievance Officer who can act (the policy currently names the role only; add the person's name when known)
- [ ] Every SOW you issue actually refers to Part B of the Terms (use the SOW template) — otherwise the protective terms do not bind that client
- [ ] Choose or confirm the defaults listed in `IMPLEMENTATION_LOG.md` §5
- [ ] Mailbox password rotated; `.env` kept out of the web folder (from the earlier security work)

## 2. Decisions for the owner (commercial)

- [ ] Accepted risk: home page tile "100% — Code & IP ownership on full payment" and "Reply to every enquiry" (reverted to original at the owner's instruction; counsel to confirm they are acceptable)

- [ ] Payment terms, interest rate, notice and suspension periods (R6)
- [ ] Refund and deposit rules (R7)
- [ ] Revision rounds and acceptance period (R3)
- [ ] Liability cap level and floor, optional super-cap (R11)
- [ ] Whether to give an IP-infringement indemnity for bespoke work (R12.2)
- [ ] Warranty period and what counts as Completion (R10)
- [ ] Preferred forum for overseas clients (R16/R17)
- [ ] Whether to include non-solicitation of staff (R18)

## 3. Counsel review (qualified Indian advocate; local counsel for overseas clients)

- [ ] Confirm the legal framework table in `LEGAL_RISK_AUDIT.md` against primary sources (DPDP Act and Rules dates and text of s.44; CERT-In applicability; CPA 2019 and CCPA guidelines; Contract Act ss.28, 73, 74; Copyright Act ss.17–19; Arbitration Act; IT Act ss.3A, 10A, 43A)
- [ ] **High priority:** R8 IP assignment (form of deed, stamping/registration, territory and duration)
- [ ] **High priority:** R1/R2 precedence and electronic acceptance
- [ ] **High priority:** R7 refunds/termination and R11 liability cap
- [ ] R9, R10, R12–R14, R16–R18, R20
- [ ] R15 data processing terms and the Security Measures / sub-processor schedules (with the person who runs security)
- [ ] R19 Website Terms of Use and R21 Privacy Policy changes
- [ ] The contact-form privacy notice already added (wording) and the corrected "Cookies & Analytics" sentence
- [ ] Whether the marketing wording changes in `MARKETING_CLAIMS_REVIEW.md` §A are acceptable and whether other statements need qualification
- [ ] Trademark acknowledgement (R22) and whether to file the Thinkvistar mark
- [ ] Tax adviser: GST on exports, place of supply, withholding tax and gross-up (R17.4)

## 4. After approval (developer)

- [ ] Replace the Terms and Privacy text in `src/site-data.json` with the approved wording; set the "Last Updated" date
- [ ] Update FAQs and metadata that restate the Terms (confidentiality period, payment days, warranty period)
- [ ] Run `npm test` and `npm run verify`; deploy only after the owner approves
- [ ] Keep the signed documents, permissions and this checklist in a records folder
