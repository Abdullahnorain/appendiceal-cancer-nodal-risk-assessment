# Appendiceal Cancer — nodal risk calculator

**Description:** Web implementation of the logistic model reported by Day et al. (*Ann Surg* 2021). It yields a single estimated probability of regional nodal disease from age, sex, T category, grade, and lymphovascular invasion. Intended for teaching and multidisciplinary discussion; not a stand-alone therapeutic decision instrument.

**Status:** Model development, validation, performance, and cohort definitions are reported in the primary publication. This software is not a medical device, is not FDA-cleared, and has not undergone independent prospective validation. Tabulated coefficients in the manuscript remain the reference; confirm local implementation before clinical application.

**If you are updating the model from the manuscript:**  
One file holds the numbers: `src/features/nodal-calculator/model/model-parameter-setup.ts`. Search inside it for **MODEL PARAMETER SET UP** and change **only** the digits in the block marked **YOU EDIT HERE**. Everything else in that file is labels or background notes.

**How the project folder is laid out (Next.js — this is normal):**

| Location | Role |
| -------- | ---- |
| `src/features/nodal-calculator/` | This calculator only: forms, results, risk math wiring |
| `src/app/` | Pages users open and the small API behind "calculate" |
| `src/components/` | Shared UI pieces (buttons, cards, etc.) |
| `public/` | Static images/icons |
| `package.json`, `next.config.ts`, `eslint.config.mjs`, … | Build tools — ignore for clinical work |

Internal agent notes live in `docs/engineering/` and are not part of the product.

**Source model:** Day RW et al., *Ann Surg* 2021;274(1):155–161 — [PubMed](https://pubmed.ncbi.nlm.nih.gov/31361626/).

**Run on your machine (for staff who support the site):** in this directory, `npm install` then `npm run dev`, then open http://localhost:3000
