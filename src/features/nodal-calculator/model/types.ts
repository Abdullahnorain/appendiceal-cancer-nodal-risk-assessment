import type {
  AgeGroupValue,
  GradeValue,
  HistologyValue,
  LviValue,
  SexValue,
  TStageValue,
} from "./options"

/**
 * specification_pending_verification: implementation not yet audited against publication tables.
 * manuscript_concordant: coefficients verified against the primary publication.
 */
export type ModelStatus =
  | "specification_pending_verification"
  | "manuscript_concordant"

export type ModelInput = {
  ageGroup: AgeGroupValue
  sex: SexValue
  histology: HistologyValue
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
