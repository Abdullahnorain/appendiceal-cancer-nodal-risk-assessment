/**
 * Logistic nodal risk model — equation assembly only.
 *
 * MODEL PARAMETER SET UP (numbers, manuscript alignment) lives in
 * model-weights.json. Researchers should edit that file, not this one.
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
  version: "logistic-nodal-ann-surg-2021-0.2",
  status: "specification_pending_verification",
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
