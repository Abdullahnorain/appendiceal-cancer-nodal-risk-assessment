import { z } from "zod"

import {
  ageGroupValues,
  gradeValues,
  histologyValues,
  lviValues,
  sexValues,
  tStageValues,
} from "./options"

export const calculatorSchema = z
  .object({
    ageGroup: z.string(),
    sex: z.string(),
    histology: z.string(),
    tStage: z.string(),
    grade: z.string(),
    lymphovascularInvasion: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.ageGroup) {
      ctx.addIssue({ code: "custom", path: ["ageGroup"], message: "Select age group" })
    } else if (!(ageGroupValues as readonly string[]).includes(data.ageGroup)) {
      ctx.addIssue({ code: "custom", path: ["ageGroup"], message: "Select age group" })
    }

    if (!data.sex) {
      ctx.addIssue({ code: "custom", path: ["sex"], message: "Select sex" })
    } else if (!(sexValues as readonly string[]).includes(data.sex)) {
      ctx.addIssue({ code: "custom", path: ["sex"], message: "Select sex" })
    }

    if (!data.histology) {
      ctx.addIssue({ code: "custom", path: ["histology"], message: "Select histology" })
    } else if (!(histologyValues as readonly string[]).includes(data.histology)) {
      ctx.addIssue({ code: "custom", path: ["histology"], message: "Select histology" })
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
  ageGroup: "",
  sex: "",
  histology: "",
  tStage: "",
  grade: "",
  lymphovascularInvasion: "",
}
