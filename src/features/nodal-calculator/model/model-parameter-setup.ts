/**
 * MODEL PARAMETER SET UP
 *
 * All model weights live in model-weights.json — edit numbers there.
 * This file reads, validates, and re-exports them for the rest of the app.
 *
 * Researchers / non-developers: open model-weights.json and change numbers only.
 * Developers: if the model structure changes, update the Zod schema below.
 */

import { z } from "zod"

import type { ModelInput } from "./types"
import weights from "./model-weights.json"

// ---------------------------------------------------------------------------
// Validation — gives clear errors if model-weights.json is malformed
// ---------------------------------------------------------------------------

const weightsSchema = z.object({
  intercept: z.number(),
  age: z.object({
    "<50": z.number(),
    "50-64": z.number(),
    "65-79": z.number(),
    "80+": z.number(),
  }),
  sex: z.object({
    female: z.number(),
    male: z.number(),
  }),
  histology: z.object({
    carcinoid_tumors: z.number(),
    goblet_cell: z.number(),
    mucinous_adenocarcinoma: z.number(),
    nonmucinous_adenocarcinoma: z.number(),
    signet_cell: z.number(),
  }),
  tStage: z.object({
    t1: z.number(),
    t2: z.number(),
    t3: z.number(),
    t4: z.number(),
  }),
  grade: z.object({
    g1: z.number(),
    g2: z.number(),
    g3: z.number(),
    g4: z.number(),
  }),
  lymphovascularInvasion: z.object({
    no: z.number(),
    yes: z.number(),
  }),
})

const validated = weightsSchema.parse(weights)

// ---------------------------------------------------------------------------
// Re-exports — the rest of the app imports these, not the JSON directly
// ---------------------------------------------------------------------------

export const LOGISTIC_INTERCEPT: number = validated.intercept

export const AGE_GROUP_LOG_ODDS: Record<ModelInput["ageGroup"], number> =
  validated.age

export const HISTOLOGY_LOG_ODDS: Record<ModelInput["histology"], number> =
  validated.histology

export const T_STAGE_LOG_ODDS: Record<ModelInput["tStage"], number> =
  validated.tStage

export const GRADE_LOG_ODDS: Record<ModelInput["grade"], number> =
  validated.grade

export const LYMPHOVASCULAR_INVASION_LOG_ODDS: Record<
  ModelInput["lymphovascularInvasion"],
  number
> = validated.lymphovascularInvasion

export const MALE_VERSUS_FEMALE_LOG_ODDS: number = validated.sex.male
