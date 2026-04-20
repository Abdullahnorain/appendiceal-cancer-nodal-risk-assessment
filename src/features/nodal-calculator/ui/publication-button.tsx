import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Button that points to the primary publication for the calculator.
 *
 * Currently in a pending state — disabled outline button labelled
 * "Publication pending" — because the publication has not been released.
 * See `src/features/nodal-calculator/config/links.ts` for the restoration
 * path. When the URL lands, this component becomes the single place to
 * wire it up; both the header and footer call sites inherit the change.
 *
 * `className` is merged in so call sites can apply layout-specific
 * alignment (e.g. `self-start`) without fighting the base styles.
 */
export function PublicationButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("shrink-0", className)}
      disabled
    >
      Publication pending
    </Button>
  )
}
