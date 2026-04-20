import { AUTHOR_CITATION_FULL } from "../config/authors"

import { PublicationButton } from "./publication-button"

export function AppFooter() {
  return (
    <footer className="mt-auto flex flex-col gap-4 border-t border-border py-6 text-sm text-muted-foreground lg:flex-row lg:items-start lg:justify-between lg:gap-8">
      <div className="max-w-3xl space-y-3 leading-6">
        <p>
          This site is a <span className="font-medium text-foreground">computational implementation</span>{" "}
          of the underlying model. It is not a medical device, is not FDA-cleared, and must not replace
          clinical judgment.
        </p>
        <p>
          Patient selection, variable definitions, and performance characteristics will be available once
          the primary publication is released; until then, use clinical judgment to assess applicability
          to a given patient.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <PublicationButton />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {AUTHOR_CITATION_FULL}
        </p>
      </div>
    </footer>
  )
}
