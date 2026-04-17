import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"span"> & { label?: string }) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        aria-hidden
        className="size-4 motion-safe:animate-spin motion-safe:[animation-duration:900ms]"
      />
    </span>
  )
}

export { Spinner }
