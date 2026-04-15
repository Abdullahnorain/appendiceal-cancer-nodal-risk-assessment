import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

import { PUBLICATION_URL } from "../config/links"

export function AppFooter() {
  return (
    <footer className="mt-auto flex flex-col gap-4 border-t border-border py-6 text-sm text-muted-foreground lg:flex-row lg:items-start lg:justify-between lg:gap-8">
      <div className="max-w-3xl space-y-3 leading-6">
        <p>
          This site is a <span className="font-medium text-foreground">draft educational tool</span>. It
          is not a medical device, is not FDA-cleared, and must not replace clinical judgment. Outputs
          here use the configured model implementation; confirm behavior against the primary publication
          before any clinical use.
        </p>
        <p>
          Patient selection, variable definitions, and performance of the original model are described
          only in the linked manuscript—use that source to judge whether a given patient lies inside the
          studied populations.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Button
          variant="link"
          size="sm"
          className="h-auto justify-start px-0"
          nativeButton={false}
          render={<a href={PUBLICATION_URL} target="_blank" rel="noopener noreferrer" />}
        >
          Primary publication and cohort definitions
          <ExternalLink data-icon="inline-end" aria-hidden />
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Developed by Drs. Wasif and Norain.
        </p>
      </div>
    </footer>
  )
}
