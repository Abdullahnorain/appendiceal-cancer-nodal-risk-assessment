import type { CalculatorFormValues } from "./schema"
import { activeNodalRiskModel } from "./active-model"
import type { ModelInput, PredictionResult } from "./types"

function normalizeInput(input: CalculatorFormValues): ModelInput {
  return {
    ageYears: Number.parseInt(input.ageYears, 10),
    sex: input.sex as ModelInput["sex"],
    tStage: input.tStage as ModelInput["tStage"],
    grade: input.grade as ModelInput["grade"],
    lymphovascularInvasion:
      input.lymphovascularInvasion as ModelInput["lymphovascularInvasion"],
  }
}

function clampProbability(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

/**
 * Stable prediction boundary used by the API route.
 * Model numbers: see MODEL PARAMETER SET UP in model-parameter-setup.ts.
 * Swap `activeNodalRiskModel` in active-model.ts if the implementation changes.
 */
export function predict(input: CalculatorFormValues): PredictionResult {
  const modelInput = normalizeInput(input)
  const probability = clampProbability(
    activeNodalRiskModel.predictProbability(modelInput)
  )

  return {
    probability,
    modelVersion: activeNodalRiskModel.version,
    modelStatus: activeNodalRiskModel.status,
    computedAtIso: new Date().toISOString(),
  }
}
