/**
 * Logistic nodal risk model — equation assembly only.
 *
 * MODEL PARAMETER SET UP (numbers, manuscript alignment) lives in
 * model-parameter-setup.ts. Researchers should edit that file, not this one.
 */

import {
  AGE_CENTER_YEARS,
  AGE_LOG_ODDS_PER_YEAR,
  GRADE_LOG_ODDS,
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
  version: "logistic-nodal-draft-0.1",
  status: "draft",
  predictProbability(input: ModelInput) {
    let logit = LOGISTIC_INTERCEPT
    logit += (input.ageYears - AGE_CENTER_YEARS) * AGE_LOG_ODDS_PER_YEAR
    logit += T_STAGE_LOG_ODDS[input.tStage]
    logit += GRADE_LOG_ODDS[input.grade]
    logit += LYMPHOVASCULAR_INVASION_LOG_ODDS[input.lymphovascularInvasion]
    if (input.sex === "male") logit += MALE_VERSUS_FEMALE_LOG_ODDS
    return logistic(logit)
  },
}
