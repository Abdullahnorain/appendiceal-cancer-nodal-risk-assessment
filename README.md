# Appendiceal Cancer Nodal Risk Assessment Calculator

**Description:** Web calculator that estimates the probability of regional nodal metastasis in appendiceal cancer patients. It implements a multivariable **logistic regression** model (Day et al., *Ann Surg* 2021) using six inputs: **age group**, **sex**, **histology**, **clinical T category**, **histologic grade**, and **lymphovascular invasion**. Intended for teaching and multidisciplinary discussion; not a stand-alone therapeutic decision instrument.

**Status:** Model development, validation, performance, and cohort definitions are reported in the **primary publication** (Day et al., *Ann Surg* 2021). This software is not a medical device, is not FDA-cleared, and has not undergone independent prospective validation. Confirm numerical outputs against the manuscript prior to clinical use.

---

## Updating model coefficients

All model weights live in one plain JSON file — **no coding knowledge required** for number updates:

**File:** `src/features/nodal-calculator/model/model-weights.json`

Open it in any text editor and change the numbers. The structure looks like this:

```json
{
  "intercept": -2.9989,
  "age":       { "<50": 0, "50-64": -0.0397, "65-79": -0.0794, "80+": -0.0710 },
  "sex":       { "female": 0, "male": 0.0297 },
  "histology": { "carcinoid_tumors": 0, "goblet_cell": -0.7251, ... },
  "tStage":    { "t1": 0, "t2": 1.2199, "t3": 1.1083, "t4": 1.8744 },
  "grade":     { "g1": 0, "g2": 0.6306, "g3": 1.3947, "g4": 1.2640 },
  "lymphovascularInvasion": { "no": 0, "yes": 1.8818 }
}
```

**Rules for editing**

- Change only the **numbers** (values after each colon).
- Do not **rename** keys (e.g. `t1`, `goblet_cell`, `no`).
- Do not **delete** keys or **add** new keys unless a developer updates the validation code (see below).
- Keep `sex.female` at **0** (female is the reference). The app uses `**sex.male`** as the extra log-odds for male vs female.
- If the file is invalid, the app will **fail to start** and print a clear error when you run `npm run dev` or `npm run build`.

**Adding or removing categories** (e.g. a new histology type or a new T stage) **cannot** be done through JSON alone — a developer must update the code paths listed under **For developers only** below.

---

## Model variables


| Variable                | Categories                                                                                       | Reference        |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ---------------- |
| Age                     | <50, 50-64, 65-79, 80+                                                                           | <50              |
| Sex                     | Female, Male                                                                                     | Female           |
| Histology               | Carcinoid Tumors, Goblet Cell, Mucinous Adenocarcinoma, Non-mucinous Adenocarcinoma, Signet Cell | Carcinoid Tumors |
| Clinical T category     | T1, T2, T3, T4                                                                                   | T1               |
| Histologic grade        | G1, G2, G3, G4                                                                                   | G1               |
| Lymphovascular invasion | No, Yes                                                                                          | No               |


The model computes: `probability = 1 / (1 + e^-logit)` where `logit = intercept + sum of all applicable coefficients` (log-odds contributions from the JSON file).

---

## For developers only (changing structure or code)

Use this checklist if you change **which** variables exist, **allowed answers**, the **JSON shape**, or the **equation**:

1. `**model-parameter-setup.ts`** — Update the Zod schema and re-exports so `model-weights.json` stays validated.
2. `**options.ts**`, `**schema.ts**`, `**types.ts**` — Keep allowed values, form validation, and `ModelInput` in sync.
3. `**logistic-nodal-model.ts**` — Update the logit calculation if the model math changes.
4. `**nodal-calculator.tsx**` — Update the form, toggle values, and labels.
5. After coefficients are verified against the publication tables, set `status` to `manuscript_concordant` in `logistic-nodal-model.ts` (and bump `version` if appropriate).

**Technical reference (optional):** swap implementation in `active-model.ts`; prediction boundary in `predict.ts` and `src/app/api/nodal-risk/route.ts`; publication URL in `src/features/nodal-calculator/config/links.ts`.

---

## Project layout


| Location                                                 | Role                                                                                                     |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/features/nodal-calculator/model/model-weights.json` | **Coefficients — edit this file to update numbers**                                                      |
| `src/features/nodal-calculator/model/`                   | Validation (`model-parameter-setup.ts`), equation (`logistic-nodal-model.ts`), prediction (`predict.ts`) |
| `src/features/nodal-calculator/ui/`                      | Form and result display                                                                                  |
| `src/app/`                                               | Pages and the API route behind “Estimate risk”                                                           |
| `src/components/`                                        | Shared UI (buttons, cards, toggles)                                                                      |
| `public/`                                                | Static images/icons                                                                                      |
| `package.json`, `next.config.ts`, `eslint.config.mjs`, … | Build and tooling — not needed for coefficient-only updates                                              |
| `docs/engineering/`                                      | Internal notes for automation / IDE agents                                                               |


---

## Run locally

```bash
npm install
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** (if that port is in use, Next.js will pick another port and print it in the terminal).

---

**Source model:** Day RW et al., *Ann Surg* 2021;274(1):155–161 | [PubMed](https://pubmed.ncbi.nlm.nih.gov/31361626/)

Developed by Drs. Wasif and Norain.