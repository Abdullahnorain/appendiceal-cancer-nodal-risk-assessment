"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Microscope, User } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import {
  calculatorDefaultValues,
  calculatorSchema,
  type CalculatorFormValues,
} from "../model/schema"
import type { PredictionResult } from "../model/types"

import { ResultPanel } from "./result-panel"

const choiceGroupClassName = "grid w-full gap-2"
const choiceLabelClassName =
  "h-11 min-w-0 justify-center rounded-lg border-border bg-card px-5 text-sm font-medium transition-all duration-150 active:scale-[0.97] aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:text-accent-foreground aria-pressed:motion-safe:animate-[pulse-once_400ms_ease-out] data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
const histologyLabelClassName =
  "min-h-11 h-auto min-w-0 justify-center whitespace-normal rounded-lg border-border bg-card px-5 py-2 text-sm font-medium leading-tight text-center transition-all duration-150 active:scale-[0.97] aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:text-accent-foreground aria-pressed:motion-safe:animate-[pulse-once_400ms_ease-out] data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
const fieldLabelClassName =
  "pt-1 text-[0.8125rem] font-semibold text-foreground"

export function NodalCalculator() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [resultKey, setResultKey] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: calculatorDefaultValues,
    mode: "onSubmit",
  })

  const { control, handleSubmit, formState, reset } = form

  async function onSubmit(data: CalculatorFormValues) {
    setSubmitError(null)
    const response = await fetch("/api/nodal-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      setSubmitError("Unable to estimate risk. Check your inputs and try again.")
      return
    }

    setResultKey((k) => k + 1)
    setResult((await response.json()) as PredictionResult)
  }

  function onReset() {
    reset(calculatorDefaultValues)
    setResult(null)
    setSubmitError(null)
  }

  return (
    <div className="mx-auto grid w-full max-w-md gap-6 sm:max-w-lg md:max-w-2xl lg:max-w-4xl lg:grid-cols-[minmax(0,28rem)_22rem] lg:items-start xl:max-w-5xl xl:grid-cols-[minmax(0,30rem)_24rem]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 motion-safe:animate-[fade-up_520ms_ease-out_80ms_both]"
        noValidate
      >
        <Card className="gap-0 rounded-lg py-0 shadow-xs">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="flex items-center gap-2">
              <User className="size-[1.125rem] text-muted-foreground" />
              Patient variables
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 py-5">
            <fieldset className="space-y-5">
              <legend className="sr-only">Patient variables</legend>

              {/* Age group */}
              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="age-label" className={fieldLabelClassName}>
                  Age
                </Label>
                <div className="space-y-2">
                  <Controller
                    name="ageGroup"
                    control={control}
                    render={({ field }) => (
                      <ToggleGroup
                        value={field.value ? [field.value] : []}
                        onValueChange={(value) => field.onChange(value[0] ?? "")}
                        variant="outline"
                        size="lg"
                        spacing={2}
                        className={`${choiceGroupClassName} grid-cols-2 md:grid-cols-4`}
                        aria-labelledby="age-label"
                        aria-invalid={!!formState.errors.ageGroup}
                      >
                        <ToggleGroupItem value="<50" className={choiceLabelClassName}>
                          &lt;50
                        </ToggleGroupItem>
                        <ToggleGroupItem value="50-64" className={choiceLabelClassName}>
                          50–64
                        </ToggleGroupItem>
                        <ToggleGroupItem value="65-79" className={choiceLabelClassName}>
                          65–79
                        </ToggleGroupItem>
                        <ToggleGroupItem value="80+" className={choiceLabelClassName}>
                          80+
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {formState.errors.ageGroup?.message ? (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {formState.errors.ageGroup.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Sex */}
              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="sex-label" className={fieldLabelClassName}>
                  Sex
                </Label>
                <div className="space-y-2">
                  <Controller
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <ToggleGroup
                        value={field.value ? [field.value] : []}
                        onValueChange={(value) => field.onChange(value[0] ?? "")}
                        variant="outline"
                        size="lg"
                        spacing={2}
                        className={`${choiceGroupClassName} grid-cols-2`}
                        aria-labelledby="sex-label"
                        aria-invalid={!!formState.errors.sex}
                      >
                        <ToggleGroupItem value="female" className={choiceLabelClassName}>
                          Female
                        </ToggleGroupItem>
                        <ToggleGroupItem value="male" className={choiceLabelClassName}>
                          Male
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {formState.errors.sex?.message ? (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {formState.errors.sex.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-lg py-0 shadow-xs">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle className="flex items-center gap-2">
              <Microscope className="size-[1.125rem] text-muted-foreground" />
              Tumor variables
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <fieldset className="divide-y divide-border">
              <legend className="sr-only">Tumor pathology variables</legend>

              {/* Histology */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="histology-label" className={fieldLabelClassName}>
                  Histology
                </Label>
                <div className="space-y-2">
                  <Controller
                    name="histology"
                    control={control}
                    render={({ field }) => (
                      <ToggleGroup
                        value={field.value ? [field.value] : []}
                        onValueChange={(value) => field.onChange(value[0] ?? "")}
                        variant="outline"
                        size="lg"
                        spacing={2}
                        className={`${choiceGroupClassName} grid-cols-2`}
                        aria-labelledby="histology-label"
                        aria-invalid={!!formState.errors.histology}
                      >
                        <ToggleGroupItem
                          value="carcinoid_tumors"
                          className={histologyLabelClassName}
                        >
                          Carcinoid Tumors
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="goblet_cell"
                          className={histologyLabelClassName}
                        >
                          Goblet Cell
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="mucinous_adenocarcinoma"
                          className={`${histologyLabelClassName} col-span-2`}
                        >
                          Mucinous Adenocarcinoma
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="nonmucinous_adenocarcinoma"
                          className={`${histologyLabelClassName} col-span-2`}
                        >
                          Non-mucinous Adenocarcinoma
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="signet_cell"
                          className={histologyLabelClassName}
                        >
                          Signet Cell
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {formState.errors.histology?.message ? (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {formState.errors.histology.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* T stage */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="tStage-label" className={fieldLabelClassName}>
                  Clinical T category
                </Label>
                <div className="space-y-2">
                  <Controller
                    name="tStage"
                    control={control}
                    render={({ field }) => (
                      <ToggleGroup
                        value={field.value ? [field.value] : []}
                        onValueChange={(value) => field.onChange(value[0] ?? "")}
                        variant="outline"
                        size="lg"
                        spacing={2}
                        className={`${choiceGroupClassName} grid-cols-4`}
                        aria-labelledby="tStage-label"
                        aria-invalid={!!formState.errors.tStage}
                      >
                        <ToggleGroupItem value="t1" className={choiceLabelClassName}>
                          T1
                        </ToggleGroupItem>
                        <ToggleGroupItem value="t2" className={choiceLabelClassName}>
                          T2
                        </ToggleGroupItem>
                        <ToggleGroupItem value="t3" className={choiceLabelClassName}>
                          T3
                        </ToggleGroupItem>
                        <ToggleGroupItem value="t4" className={choiceLabelClassName}>
                          T4
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {formState.errors.tStage?.message ? (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {formState.errors.tStage.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Grade */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="grade-label" className={fieldLabelClassName}>
                  Histologic grade
                </Label>
                <div className="space-y-2">
                  <Controller
                    name="grade"
                    control={control}
                    render={({ field }) => (
                      <ToggleGroup
                        value={field.value ? [field.value] : []}
                        onValueChange={(value) => field.onChange(value[0] ?? "")}
                        variant="outline"
                        size="lg"
                        spacing={2}
                        className={`${choiceGroupClassName} grid-cols-4`}
                        aria-labelledby="grade-label"
                        aria-invalid={!!formState.errors.grade}
                      >
                        <ToggleGroupItem value="g1" className={choiceLabelClassName}>
                          G1
                        </ToggleGroupItem>
                        <ToggleGroupItem value="g2" className={choiceLabelClassName}>
                          G2
                        </ToggleGroupItem>
                        <ToggleGroupItem value="g3" className={choiceLabelClassName}>
                          G3
                        </ToggleGroupItem>
                        <ToggleGroupItem value="g4" className={choiceLabelClassName}>
                          G4
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {formState.errors.grade?.message ? (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {formState.errors.grade.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* LVI */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="lvi-label" className={fieldLabelClassName}>
                  Lymphovascular invasion
                </Label>
                <div className="space-y-2">
                  <Controller
                    name="lymphovascularInvasion"
                    control={control}
                    render={({ field }) => (
                      <ToggleGroup
                        value={field.value ? [field.value] : []}
                        onValueChange={(value) => field.onChange(value[0] ?? "")}
                        variant="outline"
                        size="lg"
                        spacing={2}
                        className={`${choiceGroupClassName} grid-cols-2`}
                        aria-labelledby="lvi-label"
                        aria-invalid={!!formState.errors.lymphovascularInvasion}
                      >
                        <ToggleGroupItem value="no" className={choiceLabelClassName}>
                          No
                        </ToggleGroupItem>
                        <ToggleGroupItem value="yes" className={choiceLabelClassName}>
                          Yes
                        </ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  />
                  {formState.errors.lymphovascularInvasion?.message ? (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {formState.errors.lymphovascularInvasion.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full px-5 transition-all duration-150 active:scale-[0.97] sm:w-auto"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "Estimating..." : "Estimate risk"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full px-5 transition-all duration-150 active:scale-[0.97] sm:w-auto"
            onClick={onReset}
            disabled={formState.isSubmitting}
          >
            Reset
          </Button>
        </div>
        {submitError ? (
          <p className="text-sm font-medium text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}
      </form>

      <aside className="min-w-0 motion-safe:animate-[fade-up_520ms_ease-out_160ms_both] lg:sticky lg:top-6">
        <ResultPanel result={result} resultKey={resultKey} />
      </aside>
    </div>
  )
}
