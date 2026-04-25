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

const subModelSchema = z.object({
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

const weightsSchema = z.object({
  version: z.string(),
  models: z.object({
    carcinoid_tumors: subModelSchema,
    goblet_cell: subModelSchema,
    mucinous_adenocarcinoma: subModelSchema,
    nonmucinous_adenocarcinoma: subModelSchema,
    signet_cell: subModelSchema,
  }),
})

const validated = weightsSchema.parse(weights)

// ---------------------------------------------------------------------------
// Re-exports — the rest of the app imports these, not the JSON directly
// ---------------------------------------------------------------------------

export const MODEL_VERSION: string = validated.version

export type HistologySpecificModel = {
  intercept: number
  age: Record<ModelInput["ageGroup"], number>
  sex: Record<ModelInput["sex"], number>
  tStage: Record<ModelInput["tStage"], number>
  grade: Record<ModelInput["grade"], number>
  lymphovascularInvasion: Record<ModelInput["lymphovascularInvasion"], number>
}

export const MODELS_BY_HISTOLOGY: Record<
  ModelInput["histology"],
  HistologySpecificModel
> = validated.models
