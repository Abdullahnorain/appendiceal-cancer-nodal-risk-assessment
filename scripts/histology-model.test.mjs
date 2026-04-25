import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const weights = JSON.parse(
  readFileSync(
    new URL("../src/features/nodal-calculator/model/model-weights.json", import.meta.url),
    "utf8"
  )
)

function logistic(logit) {
  return 1 / (1 + Math.exp(-logit))
}

function predict(input) {
  const model = weights.models[input.histology]
  const logit =
    model.intercept +
    model.age[input.ageGroup] +
    model.sex[input.sex] +
    model.tStage[input.tStage] +
    model.grade[input.grade] +
    model.lymphovascularInvasion[input.lymphovascularInvasion]

  return logistic(logit)
}

function assertClose(actual, expected, epsilon = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) < epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`
  )
}

test("histology-specific models produce expected representative predictions", () => {
  const cases = [
    {
      input: {
        histology: "goblet_cell",
        ageGroup: "<50",
        sex: "female",
        tStage: "t1",
        grade: "g1",
        lymphovascularInvasion: "no",
      },
      expectedLogit: -2.742361,
    },
    {
      input: {
        histology: "carcinoid_tumors",
        ageGroup: "50-64",
        sex: "male",
        tStage: "t2",
        grade: "g3",
        lymphovascularInvasion: "yes",
      },
      expectedLogit:
        -2.90883 - 0.10427 - 0.05771 + 1.78873 + 1.01627 + 1.66596,
    },
    {
      input: {
        histology: "mucinous_adenocarcinoma",
        ageGroup: "65-79",
        sex: "male",
        tStage: "t3",
        grade: "g2",
        lymphovascularInvasion: "yes",
      },
      expectedLogit:
        -3.396004 + 0.07749 + 0.179304 + 0.603395 + 1.082166 + 2.318926,
    },
    {
      input: {
        histology: "nonmucinous_adenocarcinoma",
        ageGroup: "80+",
        sex: "male",
        tStage: "t4",
        grade: "g4",
        lymphovascularInvasion: "yes",
      },
      expectedLogit:
        -2.80858 - 0.05673 + 0.10343 + 1.35624 + 0.85084 + 1.83416,
    },
    {
      input: {
        histology: "signet_cell",
        ageGroup: "50-64",
        sex: "male",
        tStage: "t4",
        grade: "g3",
        lymphovascularInvasion: "yes",
      },
      expectedLogit:
        -1.89124 + 0.28838 - 0.01064 + 1.7007 + 0.44227 + 1.57737,
    },
  ]

  for (const { input, expectedLogit } of cases) {
    assertClose(predict(input), logistic(expectedLogit))
  }
})

test("collapsed source-model categories share identical predictions", () => {
  const base = {
    ageGroup: "<50",
    sex: "female",
    grade: "g1",
    lymphovascularInvasion: "no",
  }

  assert.equal(
    predict({ ...base, histology: "mucinous_adenocarcinoma", tStage: "t1" }),
    predict({ ...base, histology: "mucinous_adenocarcinoma", tStage: "t2" })
  )
  assert.equal(
    predict({ ...base, histology: "nonmucinous_adenocarcinoma", tStage: "t1" }),
    predict({ ...base, histology: "nonmucinous_adenocarcinoma", tStage: "t2" })
  )
  assert.equal(
    predict({ ...base, histology: "signet_cell", tStage: "t1" }),
    predict({ ...base, histology: "signet_cell", tStage: "t2" })
  )
  assert.equal(
    predict({ ...base, histology: "signet_cell", tStage: "t2" }),
    predict({ ...base, histology: "signet_cell", tStage: "t3" })
  )

  const carcinoidBase = {
    histology: "carcinoid_tumors",
    ageGroup: "<50",
    sex: "female",
    tStage: "t1",
    lymphovascularInvasion: "no",
  }

  assert.equal(
    predict({ ...carcinoidBase, grade: "g3" }),
    predict({ ...carcinoidBase, grade: "g4" })
  )
})
