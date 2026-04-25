/**
 * Canonical author list for the calculator.
 *
 * This file is the single source of truth for author names, credentials, and
 * derived citation strings. Consumers:
 *   - src/features/nodal-calculator/ui/app-footer.tsx (uses AUTHOR_CITATION_FULL)
 *   - README.md (hand-synced; see the "Authors:" line near the bottom)
 *
 * Author order mirrors the project author list. When the author list or
 * ordering changes, update this array and the README line together.
 */

export type Author = {
  firstName: string
  lastName: string
  /** AMA-style initials of the given name(s). Hyphenated names keep the hyphen (e.g. "Y-H"). */
  initials: string
  /** Post-nominal credentials joined with ", " (e.g. "PhD, MS"). `null` if none. */
  credentials: string | null
  email: string
  affiliation?: string
}

export const AUTHORS: readonly Author[] = [
  {
    firstName: "Paul",
    lastName: "Tan",
    initials: "P",
    credentials: "MBBS",
    email: "Hong.TanPo@mayo.edu",
    affiliation: "Mayo Clinic",
  },
  {
    firstName: "Abdullah",
    lastName: "Norain",
    initials: "A",
    credentials: "MD",
    email: "norain.personal@gmail.com",
    affiliation: "Mayo Clinic",
  },
  {
    firstName: "Yu-Hui H.",
    lastName: "Chang",
    initials: "Y-H",
    credentials: "PhD, MS",
    email: "Chang.YuHui@mayo.edu",
    affiliation: "Mayo Clinic",
  },
  {
    firstName: "Nabil",
    lastName: "Wasif",
    initials: "N",
    credentials: "MD",
    email: "Wasif.Nabil@mayo.edu",
    affiliation: "Mayo Clinic",
  },
] as const

/**
 * Full-name citation for the UI footer. Example:
 *   "Paul Tan, MBBS · Abdullah Norain, MD · Yu-Hui H. Chang, PhD, MS · Nabil Wasif, MD"
 */
export const AUTHOR_CITATION_FULL: string = AUTHORS
  .map((a) =>
    a.credentials
      ? `${a.firstName} ${a.lastName}, ${a.credentials}`
      : `${a.firstName} ${a.lastName}`
  )
  .join(" · ")

/**
 * AMA short-form citation for documentation and prose. Example:
 *   "Tan P, Norain A, Chang Y-H, Wasif N"
 */
export const AUTHOR_CITATION_SHORT: string = AUTHORS
  .map((a) => `${a.lastName} ${a.initials}`)
  .join(", ")
