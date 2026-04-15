export const sexValues = ["female", "male"] as const
export const tStageValues = ["tx", "t1", "t2", "t3", "t4"] as const
export const gradeValues = ["gx", "g1", "g2", "g3", "g4"] as const
export const lviValues = ["no", "yes", "unknown"] as const

export type SexValue = (typeof sexValues)[number]
export type TStageValue = (typeof tStageValues)[number]
export type GradeValue = (typeof gradeValues)[number]
export type LviValue = (typeof lviValues)[number]
