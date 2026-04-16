export const ageGroupValues = ["<50", "50-64", "65-79", "80+"] as const
export const sexValues = ["female", "male"] as const
export const histologyValues = [
  "carcinoid_tumors",
  "goblet_cell",
  "mucinous_adenocarcinoma",
  "nonmucinous_adenocarcinoma",
  "signet_cell",
] as const
export const tStageValues = ["t1", "t2", "t3", "t4"] as const
export const gradeValues = ["g1", "g2", "g3", "g4"] as const
export const lviValues = ["no", "yes"] as const

export type AgeGroupValue = (typeof ageGroupValues)[number]
export type SexValue = (typeof sexValues)[number]
export type HistologyValue = (typeof histologyValues)[number]
export type TStageValue = (typeof tStageValues)[number]
export type GradeValue = (typeof gradeValues)[number]
export type LviValue = (typeof lviValues)[number]
