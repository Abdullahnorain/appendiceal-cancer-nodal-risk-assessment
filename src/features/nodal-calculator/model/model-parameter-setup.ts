/**
 * MODEL PARAMETER SET UP
 *
 * What you may change: ONLY the numeric values in the single block below that is
 * marked "YOU EDIT HERE". Those are the digits after `=` and the numbers on the
 * right of `:` in the tables.
 *
 * What you must not change: the `import` line, any names (LOGISTIC_INTERCEPT,
 * tx:, g1:, no:, etc.), punctuation, or anything below the "END YOU EDIT HERE"
 * line — that region is background text only.
 *
 * Math and forms live in logistic-nodal-model.ts and predict.ts (developers).
 */

import type { ModelInput } from "./types"

// =============================================================================
// ▼▼▼ YOU EDIT HERE — numbers only ▼▼▼
//
// Change digits only. Do not rename keys (tx, t1, no, yes, …) or constant names.
// =============================================================================

/** Starting point on the log-odds scale before other factors. */
export const LOGISTIC_INTERCEPT = -1.1

/** Age is modeled as (age in years minus this) times the next line. */
export const AGE_CENTER_YEARS = 60

/** Log-odds added per one year of age after subtracting AGE_CENTER_YEARS. */
export const AGE_LOG_ODDS_PER_YEAR = 0.012

/** T stage: number on each line is extra log-odds for that stage vs reference. */
export const T_STAGE_LOG_ODDS: Record<ModelInput["tStage"], number> = {
  tx: 0,
  t1: 0,
  t2: 0.25,
  t3: 0.55,
  t4: 1.05,
}

/** Grade: number on each line is extra log-odds for that grade vs reference. */
export const GRADE_LOG_ODDS: Record<ModelInput["grade"], number> = {
  gx: 0,
  g1: 0,
  g2: 0.2,
  g3: 0.55,
  g4: 0.65,
}

/** LVI: number on each line is extra log-odds for that answer vs reference. */
export const LYMPHOVASCULAR_INVASION_LOG_ODDS: Record<
  ModelInput["lymphovascularInvasion"],
  number
> = {
  no: 0,
  yes: 1.35,
  unknown: 0.15,
}

/** Extra log-odds for male vs female (reference: female). */
export const MALE_VERSUS_FEMALE_LOG_ODDS = 0.08

// =============================================================================
// ▲▲▲ END YOU EDIT HERE ▲▲▲
// =============================================================================
//
// --- Reference (read only; does not change the app) ---
// Source: Day RW et al., Ann Surg 2021;274(1):155-161.
// DOI: 10.1097/SLA.0000000000003501 | PubMed: https://pubmed.ncbi.nlm.nih.gov/31361626/
// Fill in manuscript table/appendix when coefficients are transcribed: ___________
// New form answers need a developer to add a row above — do not invent numbers.
