# Proposed legal revisions (drafts for counsel — NOT published)

> **UPDATE 22 Oct 2026 (second pass, on the owner's instruction):** the Terms & Conditions and Privacy Policy text in `src/site-data.json` **has now been rewritten in the working tree** using the drafts in `PROPOSED_LEGAL_REVISIONS.md`. It is **not deployed and has not been reviewed by a lawyer**. Sections of this document that describe the Terms or Privacy Policy "as published" describe the text **before** this update; see `IMPLEMENTATION_LOG.md` §5 for exactly what changed. Do not deploy the new text until counsel has reviewed it.

**Status: drafts for counsel. Most of this text is now in the working tree (see the table below) but is NOT deployed and has NOT been lawyer-approved.** It is drafting for review by a qualified Indian advocate (and, for overseas clients, counsel where the client is based). Square brackets `[ ]` mark commercial choices that only Thinkvistar can make (periods, caps, rates, names). Do not publish any clause with an unfilled bracket. "Business Day" and the other capitalised terms are defined in R3.


## Where each revision now stands

| R | Status in the working tree | Differences from the draft, and what remains |
|---|---|---|
| R1 Non-offer and precedence | In Terms §2–3 | Fraud carve-out kept |
| R2 Acceptance | In Terms §3 | Authorised representatives must be named in each SOW (SOW template) |
| R3 Definitions, acceptance, revisions | In Terms §4, §8 | Defaults chosen: 5-Business-Day acceptance period, 2 revision rounds |
| R4 Change control | In Terms §6 | 3 Business Days |
| R5 Client delay | In Terms §7 | 10 Business Days / 30 days |
| R6 Fees and payment | In Terms §9 | Existing positions kept (14 days, 1.5% per month or legal maximum); added disputed-invoice process, 7+14-day suspension notices, 30-day data export |
| R7 Termination and refunds | In Terms §10 | Existing 14-day notice kept (draft said 30); 15-day cure period; cause-sensitive refunds |
| R8 Intellectual property | In Terms §11 | Written assignment on payment, deed on request, tools licence, open-source, consent-based publicity. **Counsel must confirm the deed form** (template provided) |
| R9 Confidentiality | In Terms §12 | 3 years kept, exceptions added |
| R10 Warranty and support | In Terms §14 | 30 days from Completion |
| R11 Liability | In Terms §17 | Cap = fees paid and payable under the SOW (no monetary floor chosen: owner/insurer decision still open) |
| R12 Indemnities | In Terms §18 | Includes the optional Thinkvistar IP indemnity; owner to confirm they want to give it |
| R13 Third-party services | In Terms §15 | |
| R14 Force majeure | In Terms §20 | 60 days |
| R15 Data protection | In Terms §13 and Privacy §6 | Incident notice set at 72 hours. Schedules (security measures, sub-processors) are **not** written: they need facts from the owner |
| R16 Dispute resolution | In Terms §22 | Ad hoc sole arbitrator; no institution named |
| R17 International | In Terms §21 | Currency/tax/sanctions; foreign counsel still needed per country |
| R18 General | In Terms §23 | |
| R19 Website Terms split | **Not split.** One document in two parts (Part A website; Part B standard service terms) so that clients are never left without terms if no MSA is signed | Counsel may still prefer separate documents |
| R20 Suspension | In Terms §19 | |
| R21 Privacy Policy | In Privacy §1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15 | Grievance Officer is a role, not a named person (name unknown to me); 8 and 9 reworded to claims the evidence supports |
| R22 Disclaimers | Footer note added to every page; estimator disclaimer (earlier) | |

## Recommended structure

The current `/terms/` page tries to be website terms, a master services agreement and a messaging-platform policy at once. Recommended split:

| Document | Where it lives | Binds | Contains |
|---|---|---|---|
| **Website Terms of Use** (R19) | `/terms/` (public) | Visitors | Website use only; states that services are provided only under a signed MSA/SOW and that those prevail |
| **Privacy Policy** (R21) | `/privacy/` (public) | Visitors | Corrected notice |
| **Master Services Agreement** (R1–R18, R20) | Sent with each proposal; signed | Each client | The commercial terms below |
| **Statement of Work** | One per project | Each client | Scope, deliverables, acceptance criteria, dates, fees, assumptions, exclusions, change rates, support schedule |
| **Data Processing Addendum** (R15) | Schedule to the MSA | Clients whose personal data you process | Roles, instructions, sub-processors, security, incidents, deletion |

Contractual precedence (R1) makes the signed documents win over every public statement.

Each revision below states: **Replaces** (current source), **Draft text**, **Rationale**, **Approval**. Severity and finding IDs refer to `CLAUSE_BY_CLAUSE_REVIEW.md`.

---

## R1 — Non-offer and order of precedence  *(LR-01; replaces Terms §1 last sentence, §6)*

> **1.1 No offer.** Information on the Thinkvistar website, the project estimator, preliminary proposals and estimates is provided for general information. It is not an offer capable of acceptance and does not create obligations. Obligations arise only under a Statement of Work ("SOW") agreed under this Agreement.
>
> **1.2 Precedence.** If there is a conflict, the following order applies, highest first: (a) the SOW (but only for the matters it expressly says it varies); (b) this Agreement; (c) any Schedule; (d) the Website Terms of Use. Statements on the website or in marketing material form no part of this Agreement unless the SOW expressly repeats them.
>
> **1.3 Nothing in this clause excludes or limits liability for fraud or fraudulent misrepresentation.**

*Rationale:* stops a generic estimate, FAQ or banner being relied on as a term; keeps the exclusion lawful by carving out fraud. *Approval:* counsel.

## R2 — Acceptance and electronic signature  *(LR-02; replaces Terms §1 bullet 2)*

> **2.1** A party accepts this Agreement or an SOW by (a) signing it by hand or by an electronic signature that is valid under the Information Technology Act, 2000; or (b) an email from the address of its authorised representative named in the SOW stating that it accepts the identified document.
>
> **2.2** Instant messaging (including WhatsApp) may be used for day-to-day coordination. It may not be used to accept or vary an SOW, approve a Change Request, issue an Acceptance Certificate or give notice of termination, unless the same message is confirmed by email under clause 2.1(b).
>
> **2.3** Use of the website alone does not create a services contract.

*Rationale:* gives provable assent; keeps the speed of messaging for operations. *Approval:* counsel; the owner confirms who the authorised representatives are.

## R3 — Definitions, deliverables, acceptance, revisions  *(LR-08; new, replaces Terms §2 and §13 ambiguities)*

> **Definitions (extract).** "**Deliverable**": an item expressly listed as such in an SOW. "**Acceptance Criteria**": the written, objectively testable criteria in the SOW (or, if none, the specification approved in writing by the Client). "**Defect**": a failure of a Deliverable to materially conform to its Acceptance Criteria that Thinkvistar can reproduce. A Defect does not include a change of requirement, a preference, or a feature not stated in the Acceptance Criteria. "**Change Request**": any written request to alter scope, Deliverables, timetable or assumptions. "**Completion**": the earliest of Acceptance, deemed Acceptance, or use of the Deliverable in production. "**Support**" and "**Maintenance**": services described in a Support Schedule; they do not include new features, which require a Change Request. "**Client Data**": data, content and materials supplied by or for the Client, including personal data of its users. "**Confidential Information**": see R9. "**Third-Party Services**": services, software or platforms not owned by Thinkvistar. "**Force Majeure Event**": see R14. "**Material Breach**": a breach that substantially deprives the other party of the benefit of the Agreement, or a breach of R9, R15 or the payment obligations that is not cured within the period in R7. "**Business Day**": a day other than Saturday, Sunday or a public holiday in Mumbai.
>
> **3.1 Acceptance.** Thinkvistar will notify the Client when a Deliverable or milestone is ready for review. Within [5] Business Days the Client must either (a) accept it in writing, or (b) give written notice listing each Defect with enough detail to reproduce it. Thinkvistar will correct notified Defects and resubmit. The Acceptance Period then restarts for the corrected items only.
>
> **3.2 Deemed Acceptance.** A Deliverable is deemed accepted if the Client gives no notice under 3.1(b) within the Acceptance Period, or uses it in production, whichever is earlier.
>
> **3.3 Revisions.** The SOW includes [two] consolidated rounds of revisions per milestone, limited to the approved design or specification. Further revisions, or changes to approved designs, are Change Requests (R4).

*Rationale:* "defect", "acceptance" and "completion" decide when warranty periods and payments start; ambiguity is a leading source of disputes. *Approval:* counsel; owner fixes the bracketed numbers.

## R4 — Change control  *(LR-08; replaces Terms §6 sentence 2)*

> **4.1** A Change Request must be in writing. Within [3] Business Days Thinkvistar will state the effect on fees, timetable and assumptions. No change takes effect, and Thinkvistar need not perform it, until both parties approve it in writing.
>
> **4.2** If the Client gives a written instruction by email that requires urgent work before a formal Change Request is approved, Thinkvistar may perform it and charge at the rates in the SOW [or at its then-current time-and-materials rates].

## R5 — Client dependencies and delay  *(LR-10; replaces Terms §7)*

> **5.1** The SOW lists the Client's dependencies (for example access, content, decisions, third-party approvals). Dates in the SOW assume they are met on time.
>
> **5.2** If a dependency is late, affected dates move by at least the period of delay. If the delay exceeds [10] Business Days Thinkvistar may, on written notice, reschedule resources; if it exceeds [30] days Thinkvistar may treat the affected milestone as complete to the extent of the work done and invoice for it, and may charge reasonable standby costs at the SOW rates.
>
> **5.3** Thinkvistar is not responsible for delay caused by the Client, its other suppliers or Third-Party Services outside Thinkvistar's reasonable control, except to the extent Thinkvistar caused it.

## R6 — Fees, invoicing, interest and suspension  *(LR-20; replaces Terms §8)*

> **6.1 Payment.** Invoices are payable within [14] days of receipt. Fees exclude Goods and Services Tax and other taxes, which are payable by the Client where applicable. Third-party costs are charged at cost as the SOW provides.
>
> **6.2 Disputed invoices.** If the Client disputes an invoice in good faith it must notify Thinkvistar in writing within [7] days of receipt, give reasons, and pay the undisputed part by the due date. The parties will try to resolve the dispute under R16.
>
> **6.3 Late payment.** Undisputed amounts unpaid by the due date carry interest from the due date until payment at the lower of [1.5]% per month and the highest rate permitted by applicable law. The parties acknowledge that this is a reasonable estimate of Thinkvistar's cost of late payment.
>
> **6.4 Suspension.** If an undisputed amount remains unpaid [7] days after a written reminder, Thinkvistar may suspend work. Thinkvistar may suspend hosted or live services for non-payment only after a further [14] days' written notice. During any suspension Thinkvistar will, for at least [30] days, give the Client the means to export its Client Data in a standard format, and will not delete it. Rights in unpaid Deliverables are governed by R8.
>
> **6.5** Retainers and subscriptions are invoiced in advance for the period stated in the SOW.

*Rationale:* keeps strong payment leverage while removing the "hostage data" and "no notice" features a tribunal may dislike; interest framed as compensation (see Contract Act s.74 discussion in the audit). *Approval:* counsel; tax adviser on GST wording.

## R7 — Term, termination, refunds and exit  *(LR-03, LR-07; replaces Terms §9 and §15)*

> **7.1 Termination for convenience.** Either party may terminate an SOW on [30] days' written notice. Thinkvistar's fees up to the termination date for work performed, plus non-cancellable third-party commitments made for the Client, remain payable. Work in progress that is not yet invoiced is valued by reference to the milestone percentage completed or, if none, time spent at the SOW rates.
>
> **7.2 Termination for cause.** Either party may terminate an SOW by written notice if the other commits a Material Breach and does not cure it within [15] days of notice. Either party may terminate immediately on written notice if the other becomes insolvent or if continuing would require it to act unlawfully.
>
> **7.3 Advance payments and deposits.** An advance payment is credited against fees. If the Client terminates under 7.1, advance payments are retained to the extent of the amounts due under 7.1 and the balance, if any, is refunded under 7.5. If the Client terminates under 7.2 for Thinkvistar's uncured Material Breach, or Thinkvistar terminates under 7.1, Thinkvistar will refund the part of the advance payments that exceeds the value of work properly performed and accepted (or deemed accepted).
>
> **7.4 Non-refundable items.** Third-party charges, prepaid credits and subscription fees that have been consumed or committed on the Client's behalf are not refundable, except to the extent Thinkvistar can recover them.
>
> **7.5 Final settlement and exit.** Within [15] days after termination Thinkvistar will issue a final statement, and any refund will be paid within [30] days of it. On request Thinkvistar will give reasonable handover assistance for [30] days [at the SOW rates], deliver completed Deliverables in accordance with R8, and return or delete Client Data in accordance with R15.

*Rationale:* replaces the blanket "non-refundable" with a proportionate, cause-sensitive mechanism that a tribunal is more likely to uphold. *Approval:* counsel and owner (commercial).

## R8 — Intellectual property  *(LR-04, LR-06; replaces Terms §10)*

> **8.1 Bespoke Deliverables.** "Bespoke Deliverables" means the Deliverables created specifically for the Client under an SOW, excluding Pre-Existing Materials and Third-Party Components. Subject to payment in full of the fees for a Deliverable, Thinkvistar assigns to the Client all right, title and interest in the Bespoke Deliverable, including copyright, throughout the world for the full term of the rights. The parties will sign a short assignment deed in the form of Schedule [●] on request; the assignment takes effect on receipt of payment whether or not the deed has been signed, and states the rights assigned, the territory (worldwide) and the duration (the full term of the rights).
>
> **8.2 Before payment.** Until payment in full, the Client has a non-exclusive, revocable licence to use the Deliverable for evaluation and testing.
>
> **8.3 Pre-Existing Materials and Thinkvistar Tools.** Thinkvistar keeps all rights in code, libraries, frameworks, templates, tools, documentation and know-how that it owned before the SOW or develops independently of it ("Pre-Existing Materials"). It grants the Client a non-exclusive, worldwide, perpetual, royalty-free, non-transferable (except with the Client's business) licence to use them as part of the Bespoke Deliverables.
>
> **8.4 Third-Party and open-source components.** Third-Party Components remain subject to their own licences, which Thinkvistar will list in the handover documentation. The Client must comply with them. Thinkvistar will not knowingly include a component whose licence would require disclosure of the Client's proprietary source code without telling the Client first.
>
> **8.5 Client Materials.** The Client keeps its rights in Client Data and other materials it supplies and gives Thinkvistar a licence to use them to perform the SOW. The Client confirms it has the right to supply them.
>
> **8.6 General skills.** Nothing restricts Thinkvistar from using its general skills and knowledge, provided it does not use Client Confidential Information.
>
> **8.7 Portfolio and publicity.** Thinkvistar will identify the Client by name or logo, or publish a case study, only with the Client's written consent (email is enough). The Client may withdraw consent for future uses. Without consent Thinkvistar may describe the work generically without identifying the Client or disclosing Confidential Information.
>
> **8.8 Thinkvistar marks.** The Thinkvistar name, logo and website content remain Thinkvistar's property and may not be used without permission.

*Rationale:* a signed assignment stating rights, territory and duration is the method the Copyright Act, 1957 contemplates (s.19; counsel to confirm the default period/territory rules and any registration or stamping points). Consent-based publicity avoids any suggestion of endorsement. *Approval:* **counsel (high priority)**.

## R9 — Confidentiality  *(LR-11; replaces Terms §11)*

> **9.1** "Confidential Information" is non-public information disclosed by a party that is marked confidential or would reasonably be understood to be confidential, including business processes, customer data, credentials, source code and technical specifications.
>
> **9.2** The recipient will use it only to perform or receive the services, protect it with at least reasonable care, and disclose it only to its employees, contractors and professional advisers who need to know and are bound by equivalent duties.
>
> **9.3 Exceptions.** The duty does not apply to information that (a) is or becomes public other than through breach; (b) the recipient already knew free of any duty; (c) the recipient lawfully receives from a third party; (d) the recipient develops independently without using it; or (e) must be disclosed by law, court order or regulator, in which case the recipient will, where lawful, give prompt notice and disclose only what is required.
>
> **9.4 Return.** On request or termination the recipient will return or delete Confidential Information, except for copies required by law or held in routine backups, which stay subject to this clause.
>
> **9.5 Duration.** The duties continue during the Agreement and for [three] years afterwards, and for as long as trade secrets remain secret and personal data remain in the recipient's hands.

## R10 — Warranty, support and service levels  *(LR-05, LR-08; replaces Terms §13 paragraph 1)*

> **10.1 Warranty.** For [30] days after Completion (the "Warranty Period"), Thinkvistar warrants that each Deliverable will materially conform to its Acceptance Criteria. Thinkvistar's obligation is to correct Defects notified in writing during the Warranty Period, with enough detail to reproduce them, within a reasonable time having regard to severity.
>
> **10.2 Exclusions.** The warranty does not apply to problems caused by changes made by anyone other than Thinkvistar, use contrary to the documentation, Client Data or environments outside the SOW, Third-Party Services, or requirements not in the Acceptance Criteria.
>
> **10.3 No broader promise.** To the extent permitted by applicable law, Thinkvistar does not warrant that software will be error-free or operate without interruption, and all other warranties, conditions and representations are excluded except those that the law does not allow to be excluded.
>
> **10.4 Support.** Support and Maintenance are provided only under a written Support Schedule that states hours of cover, response and target-resolution times by severity, exclusions, and the remedy (for example service credits) for missing them. Where a Support Schedule sets service levels, its remedies are the Client's remedies for missing those service levels. Uptime figures are targets unless the Support Schedule says otherwise.

## R11 — Limitation of liability  *(LR-05; replaces Terms §13 bullets 1–3)*

> **11.1 Liabilities not limited.** Nothing in this Agreement limits or excludes either party's liability for (a) fraud or fraudulent misrepresentation; (b) death or personal injury caused by negligence; (c) wilful misconduct; (d) the Client's obligation to pay fees; or (e) any other liability that cannot be limited or excluded under applicable law. [Counsel to add any further statutory carve-outs.]
>
> **11.2 Excluded loss.** Subject to 11.1 and to the extent permitted by law, neither party is liable for loss of profit, revenue, goodwill or anticipated savings, or for indirect or consequential loss.
>
> **11.3 Cap.** Subject to 11.1, each party's total liability arising out of or in connection with an SOW, whether in contract, tort (including negligence) or otherwise, is limited to the greater of (a) the fees paid and payable under that SOW and (b) [INR ●]. [Optional higher cap of [●] times those fees for breach of R9 or R15.]
>
> **11.4 Data.** Thinkvistar is responsible for backups and restoration only as the SOW or Support Schedule states. Where it is responsible, its liability for loss of data is limited to the reasonable cost of restoring the data from the most recent backup.
>
> **11.5 Mitigation and time limit.** Each party must take reasonable steps to mitigate loss. Claims must be notified in writing within [12] months of the claimant becoming aware of the facts.
>
> **11.6** The parties agree that these limits reflect the price and the allocation of risk between them.

*Rationale:* a cap tied to the contract value (and a floor) is more likely to be treated as reasonable than "last six months' fees"; carve-outs for what the law does not allow to be excluded make the rest more likely to be enforced. *Approval:* **counsel and the owner's insurer/broker** (cap interacts with any professional indemnity cover; none is documented in the repository).

## R12 — Indemnities  *(LR-18; replaces Terms §14)*

> **12.1 By the Client.** The Client will indemnify Thinkvistar against third-party claims, and resulting losses and reasonable legal costs, to the extent arising from (a) Client Data or content, or Client Materials, (b) the Client's instructions where they require Thinkvistar to act unlawfully, or (c) the Client's use of the Deliverables in breach of law or of this Agreement.
>
> **12.2 By Thinkvistar** *(optional; commercial decision)*. Thinkvistar will indemnify the Client against third-party claims that a Bespoke Deliverable, as delivered, infringes that third party's copyright or trade secret, to the extent the claim does not arise from Client Materials, Third-Party Components, modifications not made by Thinkvistar, or combination with items not supplied by Thinkvistar. If a claim is made, Thinkvistar may obtain the right to continue using the item, modify or replace it, or, if neither is reasonably practicable, refund the fees paid for it.
>
> **12.3 Procedure.** The indemnified party must give prompt written notice, let the indemnifying party control the defence and settlement (but no settlement may admit fault or impose obligations on the indemnified party without its consent), and give reasonable help at the indemnifying party's cost. Indemnities are subject to R11 [except as R11.3 provides].

## R13 — Third-party services  *(LR-19; replaces Terms §12)*

> **13.1** Third-Party Services are governed by their providers' terms, and the Client may need its own accounts or licences. Costs are as the SOW provides.
>
> **13.2** Thinkvistar will select, configure and integrate them with reasonable skill and care. It is not responsible for outages, price or policy changes or failures of Third-Party Services outside its reasonable control, except to the extent caused by its failure to exercise that care.
>
> **13.3** Where the SOW includes messaging (SMS, email, WhatsApp or push), delivery depends on carriers and platforms and cannot be guaranteed. The Client is responsible for regulatory registrations that apply to it (for example TRAI/DLT) and for lawful consent to message recipients.

## R14 — Force majeure  *(LR-10; new)*

> **14.1** Neither party is liable for failure or delay in performing an obligation (other than an obligation to pay money for work already performed) to the extent caused by an event beyond its reasonable control, including natural disaster, fire, flood, epidemic, war, terrorism, civil disturbance, governmental or regulatory action, failure of public utilities or networks, or a widespread outage of a major cloud or telecom provider that the affected party could not reasonably have avoided (a "Force Majeure Event"). Industrial action by a party's own workforce and delay by its subcontractors (unless themselves caused by a Force Majeure Event) are not Force Majeure Events.
>
> **14.2** The affected party must notify the other within [5] Business Days, use reasonable efforts to mitigate and resume performance, and the time for performance extends accordingly. If the event continues for more than [60] days either party may terminate the affected SOW by written notice, and R7.5 applies.

## R15 — Data protection and security  *(LR-14, LR-16; replaces Privacy §6 and Terms silence)*

> **15.1 Roles.** For Client Data that includes personal data, the Client is the controller (Data Fiduciary) and Thinkvistar is the processor (Data Processor). The Client is responsible for the lawful basis, notices and any consent needed for the processing it instructs.
>
> **15.2 Instructions.** Thinkvistar will process such personal data only on the Client's documented instructions, which are the SOW and this clause, unless the law requires otherwise (in which case it will tell the Client where lawful).
>
> **15.3 Security.** Thinkvistar will apply the technical and organisational measures described in Schedule [●] (Security Measures), which must list the controls Thinkvistar actually operates and must be reviewed before signature. The Client acknowledges that no system is completely secure.
>
> **15.4 Sub-processors and location.** The Client authorises the sub-processors and processing locations listed in Schedule [●]. Thinkvistar will give [14] days' notice of changes, flow down equivalent obligations, and remain responsible for them. Cross-border transfers will comply with applicable law.
>
> **15.5 Incidents.** Thinkvistar will notify the Client without undue delay, and in any event within [48] hours, after becoming aware of a personal data breach affecting Client Data, with the information then available, and will help the Client meet its own notification duties (including to the Data Protection Board of India, affected individuals and, where applicable, CERT-In).
>
> **15.6 Assistance and audit.** Thinkvistar will reasonably help the Client respond to requests from individuals and regulators, and will provide information reasonably needed to show compliance, up to once a year unless there has been an incident.
>
> **15.7 Return and deletion.** Within [30] days after the end of the services, Thinkvistar will return or delete Client Data at the Client's choice, unless law requires retention, and will confirm in writing.

*Rationale:* DPDP's core duties (notice, consent, security safeguards, breach notification, processor contracts) are scheduled from 13 May 2027; the SPDI Rules apply now; CERT-In directions may apply independently. *Approval:* **counsel (data protection)** and the person responsible for security operations, who must confirm Schedule [●] is true.

## R16 — Governing law and dispute resolution  *(LR-17; replaces Terms §17)*

> **16.1 Escalation.** The parties' designated representatives will meet within [10] Business Days of a written dispute notice; if unresolved within a further [10] Business Days it goes to senior management for [10] Business Days.
>
> **16.2 Arbitration.** A dispute not resolved under 16.1 is finally resolved by arbitration under the Arbitration and Conciliation Act, 1996 [administered by the Mumbai Centre for International Arbitration under its rules]. There will be a sole arbitrator appointed by agreement within [15] days of a request, failing which [appointed under section 11 of the Act / by the institution]. The seat is Mumbai, the language is English, and the award is reasoned and final. The proceedings are confidential, except as needed to enforce an award.
>
> **16.3 Interim relief.** Either party may apply to a competent court for urgent interim or injunctive relief, including for infringement of intellectual property or breach of confidentiality. Subject to this, the courts at Mumbai have exclusive jurisdiction over matters arising under the Act.
>
> **16.4 Continued performance.** Unless terminated, the parties will keep performing during a dispute, and the Client will pay undisputed amounts.
>
> **16.5 Governing law.** Indian law governs this Agreement, without regard to conflict-of-laws rules.

## R17 — International clients  *(LR-26; new schedule "International Terms")*

> **17.1 Law and forum.** Clause 16 applies. For contracts above [value], the parties may instead choose an international institution and seat ([SIAC / ICC / LCIA]) in the SOW. *Note to counsel:* enforceability of an award in the Client's country should be confirmed in advance (New York Convention status of the country and any reservations).
>
> **17.2 Mandatory law.** Nothing in this Agreement excludes rights that the mandatory law of the Client's country gives it and that cannot lawfully be waived by contract.
>
> **17.3 Currency and bank charges.** Fees are stated and payable in [USD / EUR / INR]. The Client bears its own bank and transfer charges and any currency conversion costs, so that Thinkvistar receives the invoiced amount.
>
> **17.4 Taxes.** Fees exclude sales, use, value-added and similar indirect taxes. If the Client must withhold tax it will tell Thinkvistar before the invoice date, pay the withheld amount to the authority and give the official certificate; [whether the Client grosses up the payment is a commercial and tax decision — tax adviser to confirm GST/export-of-services treatment and treaty position].
>
> **17.5 Export controls and sanctions.** The Client confirms that it, its owners and its end users are not subject to sanctions that would make performance unlawful, and will not use the Deliverables in breach of export control or sanctions law. Thinkvistar may suspend or end performance if continuing would breach such law.
>
> **17.6 Data transfers.** Where personal data subject to foreign law (for example EEA or UK data) is processed, the parties will sign the transfer mechanism that law requires (for example standard contractual clauses). *Counsel in the relevant jurisdiction must advise.*

## R18 — General provisions  *(LR-22; replaces Terms §18; new)*

> Entire agreement (subject to clause 1.3); amendment only in writing signed by both parties, or by email from authorised representatives for a Change Request under R4; severability; no waiver; no assignment without consent, except Thinkvistar may use subcontractors and remains responsible for them; independent contractors, no partnership or agency; **notices** by courier or registered post to the addresses in the SOW (deemed received on delivery) or by email to the notice address (deemed received on the next Business Day unless a delivery failure message is received) — not by instant messaging; counterparts and electronic signature; survival of clauses that by their nature continue; [optional: neither party will solicit the other's personnel engaged on the services for [12] months, other than through general advertising].

## R19 — Website Terms of Use (public page)  *(LR-01, LR-09, LR-21; replaces `/terms/`)*

A short document containing: who is providing the website (Thinkvistar LLP, registered address and LLPIN **[owner to supply and confirm]**); that the website and estimator are for information and do not create a contract; that services are supplied only under a signed MSA/SOW which prevails; permitted use and prohibited conduct on the site (no attack, scraping that harms service, misuse of contact form); intellectual property in site content and marks; third-party links; website provided "as available"; limitation of liability for use of the website only, to the extent permitted by law and without limiting liability the law does not allow to be limited; link to the Privacy Policy; changes (changes to the website terms apply from publication; they never alter a signed MSA/SOW); governing law India, courts at Mumbai; contact details. Remove the SMS/TRAI/DLT provisions unless Thinkvistar actually operates a messaging service (if it does, move them to an acceptable-use schedule for that service).

## R20 — Suspension for prohibited use  *(LR-07; replaces Terms §5 note)*

> Thinkvistar may suspend a service immediately, and only to the extent necessary, where continued use creates an imminent risk of unlawful activity, a security compromise, or harm to a third party; it will tell the Client as soon as practicable and restore the service once the risk is removed. In other cases Thinkvistar will give written notice and [7] days to cure before suspending. Termination for an uncured Material Breach is governed by R7.2. On termination, Thinkvistar will refund prepaid fees for periods after termination, less amounts due and costs it cannot recover, except where termination follows the Client's unlawful use [counsel to review this carve-out].

## R21 — Privacy Policy corrections  *(LR-12, LR-13, LR-14, LR-16, LR-23)*

Each item is a change to `privacyPolicy` in `src/site-data.json`, **to be made only after counsel has approved it and the operational facts in brackets have been confirmed.**

| § | Current | Proposed |
|---|---|---|
| 1 | "By using the Site or Services, you consent to the practices described in this Policy." | "By using the Site you acknowledge this Policy. Where we need your consent (for example to send you marketing) we will ask for it separately, and you may withdraw it at any time. We process the details you send in an enquiry in order to respond to you [counsel: confirm the lawful basis / DPDP s.7 position]. Contracts and legal duties are the basis for processing during an engagement." |
| 3 | Mentions "hosting or analytics providers" collecting data | "Our website host keeps standard server logs (such as IP address, browser, pages requested and time) for security and troubleshooting [confirm with host and retention period]. To limit spam, the enquiry form keeps a short-lived record of a one-way hash of your network address (for up to two hours). The Site does not currently use analytics or advertising cookies." |
| 4 | "where you have opted in" (marketing) | Keep only if a marketing list exists; otherwise delete the marketing bullet |
| 5 | Affiliates, strategic partners, analytics providers | Replace with an accurate recipient list: hosting, email, [WhatsApp/Meta when you contact us there], payment gateway when used. Add the sub-processor list from Schedule [●] |
| 7 | Mentions "maps or videos" embedded | Delete the sentence (nothing is embedded); keep the browser-controls sentence |
| 8 | Lists security controls | Keep only controls that are in operation (owner/security lead to confirm each). Add: incident response and, where applicable, notifications to affected people and authorities |
| 9 | 24-month enquiry deletion; eight years for financial records | Confirm both against actual practice and the applicable tax/LLP record rules; create and document the deletion routine for enquiry emails |
| 10 | Rights "subject to…DPDP Act, 2023"; 30-day response | "From the date the relevant provisions of the Digital Personal Data Protection Act, 2023 and the Rules made under it come into force [currently expected 13 May 2027 for most duties], you will have the rights set out in the Act. Until then we will respond to reasonable requests about your personal data. We will reply within [period permitted by the Rules]." |
| 15 | No named officer | "Grievance Officer: [full name], [designation], email, postal address. We aim to acknowledge within [48 hours]." Name an individual who can actually act |
| Form | One-line notice **implemented** | When DPDP commences, expand to a full notice at collection: what is collected, why, how to withdraw, how to complain (counsel to draft) |

*Also confirm before publication:* that each team member agrees to their personal mobile number and LinkedIn profile appearing on `/about/`; and, if a mailbox, host or payment gateway is outside India, update the international transfers statement accordingly.

## R22 — Standard website disclaimers  *(LR-24, LR-27; new, low risk)*

> "Timelines, costs, architectures, uptime figures and examples on this website and in the estimator are indicative and are not an offer, quotation or guarantee. Any commitment is made only in a signed Statement of Work." — *(partly implemented on the estimator page)*
>
> "Third-party names and logos (including OpenAI, Anthropic Claude, Google, AWS, React and others) are the property of their respective owners and are used only to identify technologies. Their use does not imply endorsement or affiliation." — *(proposed footer or technology page; counsel to approve)*
