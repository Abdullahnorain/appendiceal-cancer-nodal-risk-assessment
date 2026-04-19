import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppFooter } from "@/features/nodal-calculator/ui/app-footer"
import { NodalCalculator } from "@/features/nodal-calculator/ui/nodal-calculator"

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:px-8">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Appendiceal Cancer Nodal Risk Assessment Calculator</Badge>
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Nodal Metastasis Risk Assessment in Appendiceal Cancer Patients
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              Derivation, validation, and performance metrics will be available once the primary
              publication is released.
            </p>
          </div>

          <Button variant="outline" size="sm" className="shrink-0 self-start" disabled>
            Publication pending
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-7 px-4 py-7 sm:px-6 lg:px-8">
        <NodalCalculator />

        <AppFooter />
      </main>
    </div>
  )
}
