"use client"

import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import type { PredictionResult } from "../model/types"

type ResultPanelProps = {
  result: PredictionResult | null
  resultKey: number
}

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === prevTarget.current) return
    prevTarget.current = target

    const start = performance.now()
    const from = 0

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (target - from) * eased)

      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

export function ResultPanel({ result, resultKey }: ResultPanelProps) {
  const targetPct = result ? result.probability * 100 : 0
  const animatedPct = useCountUp(targetPct)
  const displayPct = result ? animatedPct.toFixed(1) : null
  const meterValue = result ? Math.round(animatedPct) : 0

  if (!result) {
    return (
      <Card
        aria-labelledby="result-heading"
        aria-live="polite"
        className="min-w-0 rounded-lg shadow-xs"
      >
        <CardHeader>
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Result
          </p>
          <CardTitle id="result-heading">No estimate yet</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <p className="text-5xl font-semibold tracking-tight text-muted-foreground/45 tabular-nums">
              --%
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Complete all fields, then select <span className="font-medium text-foreground">Estimate risk</span>{" "}
              to compute a probability.
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={0} aria-label="Estimated nodal metastasis probability" />
            <div className="flex justify-between text-[0.7rem] font-medium text-muted-foreground tabular-nums">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      key={resultKey}
      aria-labelledby="result-heading"
      aria-live="polite"
      className="min-w-0 rounded-lg border-primary/25 shadow-sm motion-safe:animate-[result-enter_500ms_ease-out_both]"
    >
      <CardHeader>
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Result
        </p>
        <CardTitle id="result-heading">Estimated nodal metastasis risk</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="min-w-0">
          <p className="text-6xl font-semibold tracking-tight text-foreground tabular-nums motion-safe:animate-[count-up_400ms_ease-out_200ms_both]">
            {displayPct}%
          </p>
          {result.modelStatus === "specification_pending_verification" ? (
            <Badge
              variant="secondary"
              className="mt-3 h-auto min-h-0 w-full max-w-full min-w-0 shrink whitespace-normal rounded-lg px-3.5 py-2 text-left text-balance items-start justify-start motion-safe:animate-[fade-up_400ms_ease-out_350ms_both]"
            >
              Implementation: verify coefficient correspondence with the primary publication.
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="mt-3 h-auto min-h-0 w-full max-w-full min-w-0 shrink whitespace-normal rounded-lg px-3.5 py-2 text-left text-balance items-start justify-start motion-safe:animate-[fade-up_400ms_ease-out_350ms_both]"
            >
              Coefficients per primary publication table.
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Progress
            value={meterValue}
            aria-label="Estimated nodal metastasis probability"
            aria-valuetext={`${displayPct}% estimated probability`}
          />
          <div className="flex justify-between text-[0.7rem] font-medium text-muted-foreground tabular-nums">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <Separator />

        <dl className="grid gap-3 text-sm motion-safe:animate-[fade-up_400ms_ease-out_450ms_both]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Model version</dt>
            <dd className="font-medium text-foreground">{result.modelVersion}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Computed</dt>
            <dd className="text-right font-medium text-foreground tabular-nums">
              {new Date(result.computedAtIso).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Model status</dt>
            <dd className="text-right font-medium text-foreground">
              {result.modelStatus === "manuscript_concordant"
                ? "Manuscript-concordant implementation"
                : "Pending verification against publication tables"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
