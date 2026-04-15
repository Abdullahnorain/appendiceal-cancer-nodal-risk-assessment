# Main route (`/`)

This folder is the **home page** of the site: what you see at `http://localhost:3000/`.

- **`page.tsx`** — Header, publication link, and the nodal risk calculator UI.
- **`layout.tsx`** — Site-wide shell (fonts, tooltip wrapper).
- **`api/nodal-risk/`** — Server endpoint the calculator calls when estimating risk.

Calculator logic and model numbers live under `src/features/nodal-calculator/`. See **`web/README.md`** at the repo root of the `web` package for a short guide aimed at clinicians and staff.
