import { z } from "zod"

import {
  gradeValues,
  lviValues,
  sexValues,
  tStageValues,
} from "./options"

export const calculatorSchema = z
  .object({
    ageYears: z.string(),
    sex: z.string(),
    tStage: z.string(),
    grade: z.string(),
    lymphovascularInvasion: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.ageYears.trim()) {
      ctx.addIssue({ code: "custom", path: ["ageYears"], message: "Enter age" })
    } else if (!/^\d+$/.test(data.ageYears)) {
      ctx.addIssue({ code: "custom", path: ["ageYears"], message: "Use a whole number" })
    } else {
      const n = Number.parseInt(data.ageYears, 10)
      if (n < 18 || n > 110) {
        ctx.addIssue({
          code: "custom",
          path: ["ageYears"],
          message: "Age must be between 18 and 110",
        })
      }
    }

    if (!data.sex) {
      ctx.addIssue({ code: "custom", path: ["sex"], message: "Select sex" })
    } else if (!(sexValues as readonly string[]).includes(data.sex)) {
      ctx.addIssue({ code: "custom", path: ["sex"], message: "Select sex" })
    }

    if (!data.tStage) {
      ctx.addIssue({ code: "custom", path: ["tStage"], message: "Select T category" })
    } else if (!(tStageValues as readonly string[]).includes(data.tStage)) {
      ctx.addIssue({ code: "custom", path: ["tStage"], message: "Select T category" })
    }

    if (!data.grade) {
      ctx.addIssue({ code: "custom", path: ["grade"], message: "Select grade" })
    } else if (!(gradeValues as readonly string[]).includes(data.grade)) {
      ctx.addIssue({ code: "custom", path: ["grade"], message: "Select grade" })
    }

    if (!data.lymphovascularInvasion) {
      ctx.addIssue({
        code: "custom",
        path: ["lymphovascularInvasion"],
        message: "Select lymphovascular invasion",
      })
    } else if (!(lviValues as readonly string[]).includes(data.lymphovascularInvasion)) {
      ctx.addIssue({
        code: "custom",
        path: ["lymphovascularInvasion"],
        message: "Select lymphovascular invasion",
      })
    }
  })

export type CalculatorFormValues = z.infer<typeof calculatorSchema>

export const calculatorDefaultValues: CalculatorFormValues = {
  ageYears: "",
  sex: "",
  tStage: "",
  grade: "",
  lymphovascularInvasion: "",
}
