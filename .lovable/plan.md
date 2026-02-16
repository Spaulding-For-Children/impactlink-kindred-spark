

## Fix Hero Section Buttons and Action Cards

All interactive elements in the Hero section currently have no working navigation. Here is what needs to be connected:

### Buttons (CTA area)

| Button | Target Route | Reason |
|---|---|---|
| **Get Started** | `/auth` | Takes new users to the sign-in / registration page |
| **Explore Directory** | `/directory` | Takes users to the unified directory |

### Action Cards

| Card | Target Route | Reason |
|---|---|---|
| **Explore Research** | `/collaboration` | The Collaboration page hosts research questions and partner matching |
| **Connect with Agencies** | `/agencies` | Dedicated agencies listing page |
| **Access Data & Tools** | `/data-tools` | Dedicated Data & Tools page |
| **Submit Your Idea** | `/collaboration` | The Collaboration page includes forums and research question submission |

### Technical Changes

**File:** `src/components/sections/Hero.tsx`

1. Add `import { useNavigate } from "react-router-dom"` (or use `Link` from react-router-dom).
2. Add a `href` field to each item in the `actionCards` array mapping to the routes above.
3. Convert the action cards from `<motion.a href="#">` to use proper React Router navigation (either wrapping in `Link` or using `useNavigate` on click) so the app does client-side routing instead of full-page reloads.
4. Convert the "Get Started" button to navigate to `/auth` and the "Explore Directory" button to navigate to `/directory`, using React Router `Link` (via the `asChild` pattern already used elsewhere in the app).

No new files, database changes, or Edge Functions are needed -- this is purely a UI wiring fix.
