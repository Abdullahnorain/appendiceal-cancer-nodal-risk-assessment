# Appendiceal Cancer Nodal Risk Assessment Calculator

**Description:** Web calculator that estimates the probability of regional nodal metastasis in appendiceal cancer patients. It implements histology-specific multivariable **logistic regression** models using six inputs: **age group**, **sex**, **histology**, **clinical T category**, **histologic grade**, and **lymphovascular invasion**. Histology selects the model; the other inputs are scored with that model's coefficients. Intended for teaching and multidisciplinary discussion; not a stand-alone therapeutic decision instrument.

**Status:** The primary publication describing model development, validation, performance, and cohort definitions is **pending release**. Until it is available, treat numerical outputs as preliminary. This software is not a medical device, is not FDA-cleared, and has not undergone independent prospective validation.

---

## Updating model coefficients

All model weights live in one plain JSON file — **no coding knowledge required** for number updates:

**File:** `src/features/nodal-calculator/model/model-weights.json`

Open it in any text editor and change the numbers. Each histology has its own complete model. The structure looks like this:

```json
{
  "version": "appendiceal-nodal-risk-stratified-apr-2026",
  "models": {
    "goblet_cell": {
      "intercept": -2.742361,
      "age": { "<50": 0, "50-64": -0.025431, "65-79": 0.005159, "80+": 0.308734 },
      "sex": { "female": 0, "male": -0.136276 },
      "tStage": { "t1": 0, "t2": 0.838699, "t3": 0.211891, "t4": 1.697837 },
      "grade": { "g1": 0, "g2": -0.07084, "g3": 0.967701, "g4": 1.176957 },
      "lymphovascularInvasion": { "no": 0, "yes": 1.717989 }
    }
  }
}
```

**Rules for editing**

- Change only the **numbers** (values after each colon), unless a developer is intentionally changing the model version or structure.
- Do not **rename** keys (e.g. `t1`, `goblet_cell`, `no`).
- Do not **delete** keys or **add** new keys unless a developer updates the validation code (see below).
- Keep `sex.female` at **0** in each histology model (female is the reference).
- Some coefficients are intentionally duplicated because the source histology-specific models collapsed categories: mucinous and non-mucinous adenocarcinoma use the same reference coefficient for T1/T2; signet cell uses the same reference coefficient for T1/T2/T3 and G1/G2, with G3/G4 sharing one coefficient; carcinoid tumors use one shared G3/G4 coefficient.
- If the file is invalid, the app will **fail to start** and print a clear error when you run `npm run dev` or `npm run build`.

**Adding or removing categories** (e.g. a new histology type or a new T stage) **cannot** be done through JSON alone — a developer must update the code paths listed under **For developers only** below.

---

## How the calculator uses histology-specific models

The calculator does **not** use one pooled model with histology as a single added coefficient. Instead:

1. The user selects a histology.
2. The calculator chooses that histology's model.
3. The calculator adds that model's intercept plus the coefficients for age, sex, T category, grade, and lymphovascular invasion.
4. The logit is converted to a probability: `probability = 1 / (1 + e^-logit)`.

For example, if the user selects **mucinous adenocarcinoma**, the calculator uses only the mucinous adenocarcinoma intercept and mucinous adenocarcinoma coefficients for the other fields.

---

## Model variables

| Variable                | Categories                                                                                       | Reference        |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ---------------- |
| Age                     | <50, 50-64, 65-79, 80+                                                                           | <50              |
| Sex                     | Female, Male                                                                                     | Female           |
| Histology               | Carcinoid Tumors, Goblet Cell, Mucinous Adenocarcinoma, Non-mucinous Adenocarcinoma, Signet Cell | Selects sub-model |
| Clinical T category     | T1, T2, T3, T4                                                                                   | T1               |
| Histologic grade        | G1, G2, G3, G4                                                                                   | G1               |
| Lymphovascular invasion | No, Yes                                                                                          | No               |

---

## Histology-specific model coefficients

These are log-odds coefficients. A value of `0` means the selected category is the reference category for that histology-specific model.

| Predictor | Selection | Goblet cell | Carcinoid tumors | Mucinous adenocarcinoma | Non-mucinous adenocarcinoma | Signet cell |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Intercept | Model intercept | -2.742361 | -2.90883 | -3.396004 | -2.80858 | -1.89124 |
| Age | <50 | 0 | 0 | 0 | 0 | 0 |
| Age | 50-64 | -0.025431 | -0.10427 | 0.111641 | -0.07002 | 0.28838 |
| Age | 65-79 | 0.005159 | -0.48539 | 0.07749 | -0.03735 | 0.16163 |
| Age | 80+ | 0.308734 | -0.57076 | 0.001324 | -0.05673 | 0.0804 |
| Sex | Female | 0 | 0 | 0 | 0 | 0 |
| Sex | Male | -0.136276 | -0.05771 | 0.179304 | 0.10343 | -0.01064 |
| Clinical T category | T1 | 0 | 0 | 0 | 0 | 0 |
| Clinical T category | T2 | 0.838699 | 1.78873 | 0 | 0 | 0 |
| Clinical T category | T3 | 0.211891 | 1.3038 | 0.603395 | 0.75687 | 0 |
| Clinical T category | T4 | 1.697837 | 1.67134 | 0.742321 | 1.35624 | 1.7007 |
| Histologic grade | G1 | 0 | 0 | 0 | 0 | 0 |
| Histologic grade | G2 | -0.07084 | 0.71277 | 1.082166 | 0.46656 | 0 |
| Histologic grade | G3 | 0.967701 | 1.01627 | 1.635055 | 1.27118 | 0.44227 |
| Histologic grade | G4 | 1.176957 | 1.01627 | 0.970296 | 0.85084 | 0.44227 |
| Lymphovascular invasion | No | 0 | 0 | 0 | 0 | 0 |
| Lymphovascular invasion | Yes | 1.717989 | 1.66596 | 2.318926 | 1.83416 | 1.57737 |

### Collapsed categories in the source models

Some categories have the same coefficient because the source histology-specific model grouped them together:

| Histology | Grouping in source model | How it appears in the app |
| --- | --- | --- |
| Mucinous adenocarcinoma | T1/T2 reference group | T1 = 0 and T2 = 0 |
| Non-mucinous adenocarcinoma | T1/T2 reference group | T1 = 0 and T2 = 0 |
| Signet cell | T1/T2/T3 reference group | T1 = 0, T2 = 0, and T3 = 0 |
| Signet cell | G1/G2 reference group; G3/G4 shared coefficient | G1 = 0, G2 = 0, G3 = 0.44227, and G4 = 0.44227 |
| Carcinoid tumors | G3/G4 shared coefficient | G3 = 1.01627 and G4 = 1.01627 |

The user can still select the familiar granular options such as T1, T2, T3, T4 and G1, G2, G3, G4. When a source model grouped categories, the app represents that by giving the grouped categories the same coefficient.

---

## For developers only (changing structure or code)

Use this checklist if you change **which** variables exist, **allowed answers**, the **JSON shape**, or the **equation**:

1. `**model-parameter-setup.ts`** — Update the Zod schema and re-exports so `model-weights.json` stays validated.
2. `**options.ts**`, `**schema.ts**`, `**types.ts**` — Keep allowed values, form validation, and `ModelInput` in sync.
3. `**logistic-nodal-model.ts**` — Update the logit calculation if the model math changes.
4. `**nodal-calculator.tsx**` — Update the form, toggle values, and labels.
5. After coefficients are verified against the reference tables, set `status` to `internally_verified` in `logistic-nodal-model.ts` (and bump `version` if appropriate).

**Technical reference (optional):** swap implementation in `active-model.ts`; prediction boundary in `predict.ts` and `src/app/api/nodal-risk/route.ts`. Publication link is pending — see `src/features/nodal-calculator/config/links.ts` for restoration notes.

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

**Authors:** Tan P, Norain A, Chang Y-H, Wasif N.

<!-- Author list canonical source: src/features/nodal-calculator/config/authors.ts — keep in sync. -->
