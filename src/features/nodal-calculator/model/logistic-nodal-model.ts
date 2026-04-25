/**
 * Logistic nodal risk model — equation assembly only.
 *
 * Model coefficients live in model-weights.json (validated by
 * model-parameter-setup.ts). Researchers should edit that file, not this one.
 */

import {
  MODEL_VERSION,
  MODELS_BY_HISTOLOGY,
} from "./model-parameter-setup"
import type { ModelInput, NodalRiskModel } from "./types"

function logistic(logit: number) {
  return 1 / (1 + Math.exp(-logit))
}

export const logisticNodalRiskModel: NodalRiskModel = {
  version: MODEL_VERSION,
  status: "verification_pending",
  predictProbability(input: ModelInput) {
    const model = MODELS_BY_HISTOLOGY[input.histology]
    let logit = model.intercept
    logit += model.age[input.ageGroup]
    logit += model.sex[input.sex]
    logit += model.tStage[input.tStage]
    logit += model.grade[input.grade]
    logit += model.lymphovascularInvasion[input.lymphovascularInvasion]
    return logistic(logit)
  },
}
