/**
 * Logistic nodal risk model — equation assembly only.
 *
 * Model coefficients live in model-weights.json (validated by
 * model-parameter-setup.ts). Researchers should edit that file, not this one.
 */

import {
  AGE_GROUP_LOG_ODDS,
  GRADE_LOG_ODDS,
  HISTOLOGY_LOG_ODDS,
  LOGISTIC_INTERCEPT,
  LYMPHOVASCULAR_INVASION_LOG_ODDS,
  MALE_VERSUS_FEMALE_LOG_ODDS,
  T_STAGE_LOG_ODDS,
} from "./model-parameter-setup"
import type { ModelInput, NodalRiskModel } from "./types"

function logistic(logit: number) {
  return 1 / (1 + Math.exp(-logit))
}

export const logisticNodalRiskModel: NodalRiskModel = {
  version: "appendiceal-nodal-risk-apr-2026",
  status: "internally_verified",
  predictProbability(input: ModelInput) {
    let logit = LOGISTIC_INTERCEPT
    logit += AGE_GROUP_LOG_ODDS[input.ageGroup]
    logit += T_STAGE_LOG_ODDS[input.tStage]
    logit += GRADE_LOG_ODDS[input.grade]
    logit += HISTOLOGY_LOG_ODDS[input.histology]
    logit += LYMPHOVASCULAR_INVASION_LOG_ODDS[input.lymphovascularInvasion]
    if (input.sex === "male") logit += MALE_VERSUS_FEMALE_LOG_ODDS
    return logistic(logit)
  },
}
