---
name: "GridFlow Mobile UI (Expo 54)"
description: "Use when: building the GridFlow EV Owner mobile app UI in Expo SDK 54 (React Native + TypeScript) with NativeWind, matching mobile/code.html and mobile/DESIGN.md as closely as possible."
argument-hint: "Optional: scope=overview-only|full-ui, projectRoot=mobile (or mobile/app if needed)"
agent: "agent"
---

You are implementing the **GridFlow** EV Owner mobile app UI in **React Native + Expo SDK 54**.

Primary objective: **port the web dashboard UI** into a native experience with **maximum visual fidelity** to the Eco‑Corporate Management design system.

## Source of Truth (must read and follow)
- Web reference UI: [mobile/code.html](../../mobile/code.html)
- Design tokens + guidelines: [mobile/DESIGN.md](../../mobile/DESIGN.md)
- Product/architecture notes: [mobile/PROMPT.md](../../mobile/PROMPT.md)

## Non‑Negotiable Constraints
- Implement **exactly** the screens and UI described in [mobile/PROMPT.md](../../mobile/PROMPT.md); do **not** add extra pages, modals, filters, analytics, animations, or “nice to have” widgets.
- Use only the **color palette, spacing, radii, typography** from [mobile/DESIGN.md](../../mobile/DESIGN.md). Do not invent new colors.
- Match the **layout hierarchy** and **component composition** from [mobile/code.html](../../mobile/code.html):
  - Top app bar (avatar, GridFlow title, sensors icon)
  - SoC circular gauge + “Optimized” chip + Target Departure box
  - Bento grid: Energy Transferred + Real‑time Flow (V2G Active)
  - Stay Duration timeline with 3 points + progress line
  - V2G Financials list (Profit Earned + Current Energy Price)
- Styling must feel **Eco‑Corporate Minimalism**: clean, whitespace‑rich, rounded cards (16px), atmospheric shadow.
- Keep the implementation **TypeScript‑first**, clean, and easy to map to a future backend schema.

## Step 0 — Decide where the Expo app lives (only if needed)
First, check the workspace:
- If `mobile/package.json` exists and looks like an Expo app, treat `mobile/` as the app root.
- If `mobile/` is NOT an Expo project (likely: it currently contains design artifacts), ask ONE question:
  - “Do you want the Expo project rooted at `mobile/` (recommended, but requires moving design docs into `mobile/docs/`), or created under `mobile/app/` (keeps docs where they are)?”

If the user chooses:
- **Option A (recommended): Expo root = `mobile/`**
  - Move `code.html`, `DESIGN.md`, `PROMPT.md` into `mobile/docs/` (or `mobile/_design/`) and keep links updated.
  - Provide the exact commands to initialize a clean Expo 54 TypeScript project.
- **Option B: Expo root = `mobile/app/`**
  - Create the Expo project under `mobile/app/`.

Do NOT paste or recreate the entire Expo boilerplate from memory; prefer telling the user the initialization command and then implement app code after the project exists.

## Required Tech Stack
- Expo SDK 54, React Native, TypeScript
- Styling: **NativeWind** (Tailwind for RN)
- Navigation: **React Navigation** (Auth stack + bottom tabs)
- SVG: `react-native-svg` (for circular gauge)
- Icons: Material-style icons via `@expo/vector-icons` (MaterialIcons/MaterialCommunityIcons)
- Safe areas: `react-native-safe-area-context`
- Fonts: Space Grotesk via `@expo-google-fonts/space-grotesk` + `expo-font`

## Required Project Structure (inside the Expo project root)
Create/ensure this structure:
- `src/components/` reusable UI
- `src/screens/` `Login`, `Overview`, `Vehicle`, `Financials`, `Settings`
- `src/navigation/` auth stack + tabs + root
- `src/data/ev-owner.ts` mock data + TypeScript interfaces
- `src/theme/` tokens (colors/spacing/radii/typography/shadows)

## Data Mapping (create this first)
Create `src/data/ev-owner.ts` with:
- TypeScript interfaces that reflect these fields from the web UI:
  - SoC: `percentage`, `statusLabel` (e.g. “Optimized”), `targetDepartureTime`
  - Energy: `energyTransferredKwh`, `realTimeFlowKw`, `v2gActive`
  - Timeline: `connectedAt`, `currentAt`, `departureAt`, plus a `progress` (0–1)
  - Financials: `v2gProfitEarnedUsd`, `currentEnergyPriceUsdPerKwh`
- Export a single `mockEvOwnerDashboard` object.

Naming rule (important for future backend alignment): prefer stable, API‑friendly names (camelCase, explicit units like `Kwh`, `Kw`, `Usd`).

## Theme Implementation
From [mobile/DESIGN.md](../../mobile/DESIGN.md), create theme tokens in `src/theme/`:
- `colors.ts` exporting the full palette (surface, surfaceContainer*, onSurface*, primary, secondary, tertiary, outline*, error*, etc.)
- `spacing.ts` exporting base/xs/sm/md/lg/xl plus mobile margins/gutters
- `radii.ts` with `card = 16`, `chip = 9999` etc
- `typography.ts` mapping the named styles (headlineLg/Md/Sm, bodyLg/Md, labelMd, displayData)
- `shadows.ts` exporting the “Atmospheric” shadow equivalent of `0px 4px 20px rgba(0,0,0,0.04)` (cross‑platform values)

Then wire these tokens into:
- NativeWind config (tailwind theme extension) OR
- Reusable `styles` objects used consistently across components.

Do not hardcode random hex values in component files—use theme exports.

## Navigation
Implement:
- Auth stack: `LoginScreen` → after “login”, navigate to main tabs (mock auth state is fine)
- Main bottom tabs: `Overview`, `Vehicle`, `Financials`, `Settings`

Bottom tabs must visually match the web bottom nav behavior:
- Active tab: pill-like highlight using secondary container colors
- Inactive tabs: muted on-surface-variant/outline-variant

## Screens (build Overview with highest fidelity)
### LoginScreen
- Minimal email/password form
- GridFlow logo/title
- No extra links or flows

### OverviewScreen (core)
Match [mobile/code.html](../../mobile/code.html) layout and spacing:
1) Top app bar
2) SoC card:
   - Circular gauge with percent in center
   - “Optimized” chip
   - Target Departure info box
3) Bento grid (2 cards):
   - Energy Transferred card
   - Real-time Flow card (primary background, V2G Active)
4) Stay Duration timeline card
5) V2G Financials card

Implementation notes:
- Use `ScrollView` with appropriate bottom padding so content doesn’t hide behind the tab bar.
- Use `react-native-svg` for the circular gauge; expose props: `percentage`, `size`, `strokeWidth`, `label`, `status`.
- Timeline: render 3 points and a background line + progress line; progress should match the mock data.

## Component Crafting (must be reusable)
Create these components under `src/components/`:
- `TopAppBar`
- `SoCGauge`
- `InfoRow` (for small icon + text rows like Target Departure)
- `BentoCard` (base) + specialized variants if needed
- `StatusTimeline`
- `FinancialRow`

Keep components small, focused, and testable.

## Icon Mapping
Use the closest Material icon equivalents for:
- `sensors`, `eco`, `schedule`, `ev_station`, `info`, `bolt`, `swap_horiz`, `arrow_upward`, `account_balance_wallet`, `payments`, `monitoring`, `dashboard`, `electric_car`, `settings`
If an exact icon name is missing, pick the closest semantic match and keep it consistent.

## Output / Acceptance Checklist
When you finish, provide:
- A short recap of what files you created/changed
- Any install commands required
- How to run the app (`npm/yarn/pnpm` + `expo start`)

Acceptance criteria:
- Overview screen visually matches the web reference (structure, spacing, rounding, and tonal layers)
- Uses DESIGN.md tokens everywhere (colors/typography/spacing)
- Uses NativeWind (or clearly documented alternative if blocked)
- No extra features beyond the spec
