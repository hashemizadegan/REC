# Trade & Communication Protocols

This directory outlines operational protocols, RFQ lifecycles, Incoterms rules, and language localization standards for the REC platform.

---

## 1. Tri-Lingual Localization Standard (FA / RU / EN)

The REC platform operates across three primary languages to ensure frictionless communication between Iranian exporters, Russian importers, and international settlement operators:
- **Persian (فارسی - FA):** Primary interface for Iranian suppliers, Chamber of Commerce document submission, and local compliance verification.
- **Russian (Русский - RU):** Primary interface for Russian buyers, customs declarations (FTS Russia), logistics coordination, and 152-FZ compliance.
- **English (EN):** Global trade terminology, international banking references, SWIFT/Alternative settlement protocols, and standard contract framing.

---

## 2. RFQ & Trade Workflow

1. **Buyer Inquiry (RFQ Submission):**
   - Russian or international buyer submits product requirements (e.g., Mazafati Dates or Fandoghi Pistachios) specifying quantity, destination port (Astrakhan/Novorossiysk), and target price.
2. **Specialized Translation & Validation:**
   - The platform auto-translates and structures specifications across FA/RU/EN.
   - AI/n8n automation verifies HS codes and preliminary compliance requirements.
3. **Supplier Offer & Incoterms Assignment:**
   - Verified Iranian supplier provides commercial offer under agreed Incoterms 2020 (e.g., FOB Bandar Abbas, CFR Astrakhan, or CPT Moscow).
4. **Contract & Settlement Execution:**
   - Generation of bilingual/trilingual sales contract, proforma invoice, and dual-currency clearing instructions via BRICS Pay / authorized banking channels.
