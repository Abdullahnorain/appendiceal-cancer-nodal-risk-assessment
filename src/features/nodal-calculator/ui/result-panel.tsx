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
}

export function ResultPanel({ result }: ResultPanelProps) {
  const pct = result ? (result.probability * 100).toFixed(1) : null
  const meterValue = result ? Math.round(result.probability * 100) : 0

  if (!result) {
    return (
      <Card
        aria-labelledby="result-heading"
        aria-live="polite"
        className="rounded-lg shadow-xs"
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
      aria-labelledby="result-heading"
      aria-live="polite"
      className="rounded-lg border-primary/25 shadow-sm"
    >
      <CardHeader>
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Result
        </p>
        <CardTitle id="result-heading">Estimated nodal metastasis risk</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="text-6xl font-semibold tracking-tight text-foreground tabular-nums">
            {pct}%
          </p>
          {result.modelStatus === "draft" ? (
            <Badge variant="secondary" className="mt-3">
              Draft coefficients—risk tiers not defined
            </Badge>
          ) : (
            <Badge variant="secondary" className="mt-3">
              Publication-aligned model
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Progress
            value={meterValue}
            aria-label="Estimated nodal metastasis probability"
            aria-valuetext={`${pct}% estimated probability`}
          />
          <div className="flex justify-between text-[0.7rem] font-medium text-muted-foreground tabular-nums">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <Separator />

        <dl className="grid gap-3 text-sm">
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
              {result.modelStatus === "publication_aligned"
                ? "Publication-aligned implementation"
                : "Draft implementation"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
