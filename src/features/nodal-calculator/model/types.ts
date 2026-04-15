import type {
  GradeValue,
  LviValue,
  SexValue,
  TStageValue,
} from "./options"

/** draft: coefficients not finalized; publication_aligned: aligned with agreed manuscript table */
export type ModelStatus = "draft" | "publication_aligned"

export type ModelInput = {
  ageYears: number
  sex: SexValue
  tStage: TStageValue
  grade: GradeValue
  lymphovascularInvasion: LviValue
}

export type NodalRiskModel = {
  version: string
  status: ModelStatus
  predictProbability: (input: ModelInput) => number
}

export type PredictionResult = {
  /** 0–1 probability of nodal metastasis. */
  probability: number
  modelVersion: string
  modelStatus: ModelStatus
  computedAtIso: string
}
