# Appendiceal Cancer Nodal Risk Assessment Calculator

**Description:** Web calculator that estimates the probability of regional nodal metastasis in appendiceal cancer patients. It uses a logistic regression model with six input variables: age group, sex, histology, T category, histologic grade, and lymphovascular invasion. Intended for teaching and multidisciplinary discussion; not a stand-alone therapeutic decision instrument.

**Status:** This software is not a medical device, is not FDA-cleared, and has not undergone independent prospective validation. Confirm numerical outputs against the primary publication prior to clinical use.

---

## Updating model coefficients

All model weights live in one plain JSON file — no coding knowledge required:

**File:** `src/features/nodal-calculator/model/model-weights.json`

Open it in any text editor and change the numbers. The current contents look like this:

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

**Rules for editing:**
- Change only the numbers (the values after each colon).
- Do not rename keys (e.g., `t1`, `goblet_cell`, `no`).
- Do not delete any keys or add new ones.
- If you make a mistake, the app will show a clear error message at build time telling you exactly what went wrong.

**Adding or removing categories** (e.g., a new histology subtype) requires a developer to update the code. The JSON file alone cannot add new form options.

---

## Model variables

| Variable | Categories | Reference |
|----------|-----------|-----------|
| Age | <50, 50-64, 65-79, 80+ | <50 |
| Sex | Female, Male | Female |
| Histology | Carcinoid Tumors, Goblet Cell, Mucinous Adenocarcinoma, Non-mucinous Adenocarcinoma, Signet Cell | Carcinoid Tumors |
| Clinical T category | T1, T2, T3, T4 | T1 |
| Histologic grade | G1, G2, G3, G4 | G1 |
| Lymphovascular invasion | No, Yes | No |

The model computes: `probability = 1 / (1 + e^-logit)` where `logit = intercept + sum of all applicable coefficients`.

---

## Project layout

| Location | Role |
| -------- | ---- |
| `src/features/nodal-calculator/model/model-weights.json` | **Coefficients — edit this file to update the model** |
| `src/features/nodal-calculator/model/` | Model logic: validation, equation, prediction |
| `src/features/nodal-calculator/ui/` | Form and result display |
| `src/app/` | Pages and the API endpoint behind "Estimate risk" |
| `src/components/` | Shared UI pieces (buttons, cards, toggles) |
| `public/` | Static images/icons |
| `docs/engineering/` | Internal development notes |

---

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

---

**Source model:** Day RW et al., *Ann Surg* 2021;274(1):155-161 | [PubMed](https://pubmed.ncbi.nlm.nih.gov/31361626/)

Developed by Drs. Wasif and Norain.
