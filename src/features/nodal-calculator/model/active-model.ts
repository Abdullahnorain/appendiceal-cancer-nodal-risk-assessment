import { logisticNodalRiskModel } from "./logistic-nodal-model"

/*
 * Active model implementation used by predict().
 *
 * Non-developers: all numeric inputs for the logistic model live under
 * MODEL PARAMETER SET UP in model-parameter-setup.ts — edit that file only.
 *
 * Developers: swap `logisticNodalRiskModel` here if you plug in another
 * NodalRiskModel implementation.
 */
export const activeNodalRiskModel = logisticNodalRiskModel
