"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Microscope, User } from "lucide-react"
import { useRef, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

import {
  calculatorDefaultValues,
  calculatorSchema,
  type CalculatorFormValues,
} from "../model/schema"
import type { PredictionResult } from "../model/types"

import { ResultPanel } from "./result-panel"

type ButtonStatus =
  | "idle"
  | "ready"
  | "running"
  | "succeeded"
  | "stale"
  | "invalid"

// Priority order matters:
//   running beats everything (but only after the 250ms spinner-deferral)
//   invalid beats stale/succeeded (a fresh submit with errors must read as "fix these")
//   stale beats succeeded (a changed input after success must read as stale)
//   ready beats idle (any single selected field "arms" the button)
function deriveButtonStatus({
  values,
  result,
  lastSubmittedValues,
  isSubmitting,
  showSpinner,
  hasErrors,
}: {
  values: CalculatorFormValues
  result: PredictionResult | null
  lastSubmittedValues: CalculatorFormValues | null
  isSubmitting: boolean
  showSpinner: boolean
  hasErrors: boolean
}): ButtonStatus {
  if (isSubmitting && showSpinner) return "running"
  if (hasErrors) return "invalid"

  if (result && lastSubmittedValues) {
    const keys = Object.keys(lastSubmittedValues) as (keyof CalculatorFormValues)[]
    const matches = keys.every((k) => values[k] === lastSubmittedValues[k])
    return matches ? "succeeded" : "stale"
  }

  return Object.values(values).some((v) => v !== "") ? "ready" : "idle"
}

const statusLabel: Record<ButtonStatus, string> = {
  idle: "Estimate risk",
  ready: "Estimate risk",
  running: "Estimating\u2026",
  succeeded: "See results",
  stale: "Re-estimate",
  invalid: "Estimate risk",
}

const statusTracking: Record<ButtonStatus, string> = {
  idle: "tracking-wide",
  ready: "tracking-normal",
  running: "tracking-normal",
  succeeded: "tracking-tight",
  stale: "tracking-normal",
  invalid: "tracking-normal",
}

const choiceGroupClassName = "grid w-full gap-2 rounded-lg"
// When the parent ToggleGroup has aria-invalid, each unpressed item turns red.
// border-color + bg are non-layout — no shift when the flag flips.
const invalidItemClassName =
  "group-aria-invalid/toggle-group:border-destructive/55 group-aria-invalid/toggle-group:bg-destructive/[0.04] group-aria-invalid/toggle-group:text-destructive/90"
const choiceLabelClassName =
  "h-11 min-w-0 justify-center rounded-lg border-border bg-card px-5 text-sm font-medium transition-all duration-150 active:scale-[0.97] aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:text-accent-foreground aria-pressed:motion-safe:animate-[pulse-once_400ms_ease-out] data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground " +
  invalidItemClassName
const histologyLabelClassName =
  "min-h-11 h-auto min-w-0 justify-center whitespace-normal rounded-lg border-border bg-card px-5 py-2 text-sm font-medium leading-tight text-center transition-all duration-150 active:scale-[0.97] aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:text-accent-foreground aria-pressed:motion-safe:animate-[pulse-once_400ms_ease-out] data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground " +
  invalidItemClassName
const fieldLabelClassName =
  "pt-1 text-[0.8125rem] font-semibold text-foreground transition-colors duration-200"

export function NodalCalculator() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [resultKey, setResultKey] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [lastSubmittedValues, setLastSubmittedValues] =
    useState<CalculatorFormValues | null>(null)
  const [showSpinner, setShowSpinner] = useState(false)
  const spinnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: calculatorDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const { control, handleSubmit, formState, reset } = form
  const watchedValues = useWatch({ control }) as Partial<CalculatorFormValues>
  const values: CalculatorFormValues = {
    ...calculatorDefaultValues,
    ...watchedValues,
  }

  const status = deriveButtonStatus({
    values,
    result,
    lastSubmittedValues,
    isSubmitting: formState.isSubmitting,
    showSpinner,
    hasErrors: Object.keys(formState.errors).length > 0,
  })

  async function onSubmit(data: CalculatorFormValues) {
    setSubmitError(null)
    if (spinnerTimerRef.current) clearTimeout(spinnerTimerRef.current)
    spinnerTimerRef.current = setTimeout(() => setShowSpinner(true), 250)

    try {
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
      setLastSubmittedValues(data)
    } finally {
      if (spinnerTimerRef.current) {
        clearTimeout(spinnerTimerRef.current)
        spinnerTimerRef.current = null
      }
      setShowSpinner(false)
    }
  }

  function onReset() {
    reset(calculatorDefaultValues)
    setResult(null)
    setSubmitError(null)
    setLastSubmittedValues(null)
    if (spinnerTimerRef.current) {
      clearTimeout(spinnerTimerRef.current)
      spinnerTimerRef.current = null
    }
    setShowSpinner(false)
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
              <Microscope className="size-[1.125rem] text-muted-foreground" />
              Tumor Characteristics
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <fieldset className="divide-y divide-border">
              <legend className="sr-only">Tumor Characteristics</legend>

              {/* Histology */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label
                  id="histology-label"
                  className={cn(
                    fieldLabelClassName,
                    "transition-colors duration-200",
                    formState.errors.histology && "text-destructive"
                  )}
                >
                  Histology
                </Label>
                <div>
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
                        aria-errormessage={
                          formState.errors.histology ? "histology-error" : undefined
                        }
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
                    <p id="histology-error" className="sr-only" role="alert">
                      {formState.errors.histology.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* T stage */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label
                  id="tStage-label"
                  className={cn(
                    fieldLabelClassName,
                    "transition-colors duration-200",
                    formState.errors.tStage && "text-destructive"
                  )}
                >
                  Clinical T category
                </Label>
                <div>
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
                        aria-errormessage={
                          formState.errors.tStage ? "tStage-error" : undefined
                        }
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
                    <p id="tStage-error" className="sr-only" role="alert">
                      {formState.errors.tStage.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Grade */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label
                  id="grade-label"
                  className={cn(
                    fieldLabelClassName,
                    "transition-colors duration-200",
                    formState.errors.grade && "text-destructive"
                  )}
                >
                  Histologic grade
                </Label>
                <div>
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
                        aria-errormessage={
                          formState.errors.grade ? "grade-error" : undefined
                        }
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
                    <p id="grade-error" className="sr-only" role="alert">
                      {formState.errors.grade.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* LVI */}
              <div className="grid gap-2 px-5 py-5 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label
                  id="lvi-label"
                  className={cn(
                    fieldLabelClassName,
                    "transition-colors duration-200",
                    formState.errors.lymphovascularInvasion && "text-destructive"
                  )}
                >
                  Lymphovascular invasion
                </Label>
                <div>
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
                        aria-errormessage={
                          formState.errors.lymphovascularInvasion
                            ? "lvi-error"
                            : undefined
                        }
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
                    <p id="lvi-error" className="sr-only" role="alert">
                      {formState.errors.lymphovascularInvasion.message}
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
              <User className="size-[1.125rem] text-muted-foreground" />
              Demographics
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 py-5">
            <fieldset className="space-y-5">
              <legend className="sr-only">Demographics</legend>

              {/* Age group */}
              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label
                  id="age-label"
                  className={cn(
                    fieldLabelClassName,
                    "transition-colors duration-200",
                    formState.errors.ageGroup && "text-destructive"
                  )}
                >
                  Age
                </Label>
                <div>
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
                        aria-errormessage={
                          formState.errors.ageGroup ? "age-group-error" : undefined
                        }
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
                    <p id="age-group-error" className="sr-only" role="alert">
                      {formState.errors.ageGroup.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Sex */}
              <div className="grid gap-2 sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-start sm:gap-5">
                <Label
                  id="sex-label"
                  className={cn(
                    fieldLabelClassName,
                    "transition-colors duration-200",
                    formState.errors.sex && "text-destructive"
                  )}
                >
                  Sex
                </Label>
                <div>
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
                        aria-errormessage={
                          formState.errors.sex ? "sex-error" : undefined
                        }
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
                    <p id="sex-error" className="sr-only" role="alert">
                      {formState.errors.sex.message}
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
            variant={status === "idle" ? "secondary" : "default"}
            disabled={status === "running"}
            aria-live="polite"
            data-status={status}
            className={cn(
              "group/status relative h-11 w-full px-5 transition-colors duration-200 active:scale-[0.97] sm:w-[12rem]",
              statusTracking[status],
              status === "idle" && "text-muted-foreground",
              status === "succeeded" &&
                "bg-[var(--status-success)] text-white hover:bg-[var(--status-success)]/90",
              status === "stale" &&
                "bg-[var(--status-stale)] text-white hover:bg-[var(--status-stale)]/90",
              status === "invalid" &&
                "bg-destructive text-white hover:bg-destructive/90"
            )}
          >
            <span
              key={status}
              className="inline-flex items-center gap-2 motion-safe:animate-[instrument-settle_180ms_ease-out]"
            >
              <span
                aria-hidden
                className="inline-flex size-4 shrink-0 items-center justify-center"
              >
                {status === "running" ? (
                  <Spinner className="text-primary-foreground" />
                ) : (
                  <span
                    className={cn(
                      "inline-block size-2 rounded-full",
                      status === "idle" &&
                        "bg-muted-foreground/50 ring-1 ring-border",
                      status === "ready" &&
                        "bg-primary-foreground ring-1 ring-primary-foreground/30 motion-safe:animate-[led-breathe_3.2s_ease-in-out_infinite]",
                      status === "succeeded" &&
                        "bg-white ring-1 ring-white/50 shadow-[0_0_6px_0] shadow-white/60",
                      status === "stale" &&
                        "bg-white ring-1 ring-white/40 motion-safe:animate-[led-breathe-slow_2.4s_ease-in-out_infinite_alternate]",
                      status === "invalid" &&
                        "bg-white ring-1 ring-white/40 motion-safe:animate-[led-breathe_2s_ease-in-out_infinite]"
                    )}
                  />
                )}
              </span>
              <span>{statusLabel[status]}</span>
            </span>
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
