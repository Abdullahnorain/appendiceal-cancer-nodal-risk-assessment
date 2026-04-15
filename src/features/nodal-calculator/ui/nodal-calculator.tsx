"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

const controlClassName =
  "h-11 rounded-lg border-border bg-card px-3 text-base shadow-xs md:text-sm"
const choiceGroupClassName = "grid w-full gap-2"
const choiceLabelClassName =
  "h-11 min-w-0 rounded-lg border-border bg-card px-2 text-sm font-medium aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:text-accent-foreground data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"

export function NodalCalculator() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: calculatorDefaultValues,
    mode: "onSubmit",
  })

  const { control, handleSubmit, register, formState, reset } = form

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

    setResult((await response.json()) as PredictionResult)
  }

  function onReset() {
    reset(calculatorDefaultValues)
    setResult(null)
    setSubmitError(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 motion-safe:animate-[fade-up_520ms_ease-out_80ms_both]"
        noValidate
      >
        <Card className="gap-0 rounded-lg py-0 shadow-xs">
          <CardHeader className="border-b border-border px-5 py-4">
            <CardTitle>Patient variables</CardTitle>
          </CardHeader>

          <CardContent className="px-5 py-5">
            <fieldset className="space-y-5">
              <legend className="sr-only">Patient variables</legend>

              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <div className="space-y-1 pt-1">
                  <Label htmlFor="ageYears">Age</Label>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Whole number, 18–110 years.
                  </p>
                </div>
                <div className="space-y-2">
                  <Input
                    id="ageYears"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="62"
                    className={controlClassName}
                    aria-invalid={!!formState.errors.ageYears}
                    {...register("ageYears")}
                  />
                  {formState.errors.ageYears?.message ? (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {formState.errors.ageYears.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="sex-label" className="pt-1">
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
            <CardTitle>Tumor variables</CardTitle>
          </CardHeader>

          <CardContent className="px-5 py-5">
            <fieldset className="space-y-5">
              <legend className="sr-only">Tumor pathology variables</legend>

              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="tStage-label" className="pt-1">
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
                        className={`${choiceGroupClassName} grid-cols-3 md:grid-cols-5`}
                        aria-labelledby="tStage-label"
                        aria-invalid={!!formState.errors.tStage}
                      >
                        <ToggleGroupItem value="tx" className={choiceLabelClassName}>
                          Tx
                        </ToggleGroupItem>
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

              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="grade-label" className="pt-1">
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
                        className={`${choiceGroupClassName} grid-cols-3 md:grid-cols-5`}
                        aria-labelledby="grade-label"
                        aria-invalid={!!formState.errors.grade}
                      >
                        <ToggleGroupItem value="gx" className={choiceLabelClassName}>
                          Gx
                        </ToggleGroupItem>
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

              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label id="lvi-label" className="pt-1">
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
                        className={`${choiceGroupClassName} grid-cols-3`}
                        aria-labelledby="lvi-label"
                        aria-invalid={!!formState.errors.lymphovascularInvasion}
                      >
                        <ToggleGroupItem value="no" className={choiceLabelClassName}>
                          No
                        </ToggleGroupItem>
                        <ToggleGroupItem value="yes" className={choiceLabelClassName}>
                          Yes
                        </ToggleGroupItem>
                        <ToggleGroupItem value="unknown" className={choiceLabelClassName}>
                          Unknown
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
            className="h-11 w-full px-5 sm:w-auto"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "Estimating..." : "Estimate risk"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full px-5 sm:w-auto"
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

      <aside className="motion-safe:animate-[fade-up_520ms_ease-out_160ms_both] lg:sticky lg:top-6">
        <ResultPanel result={result} />
      </aside>
    </div>
  )
}
