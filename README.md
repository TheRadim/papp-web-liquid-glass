# Papp Mobility website

Marketing site for [Papp Mobility](https://www.pappmobility.com), built with Next.js (App Router), React, Bootstrap/Sass and a Three.js city scene. English and Danish.

Live preview: https://theradim.github.io/papp-web-liquid-glass/

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build (server output) |
| `npm run pages:build` | Static export for GitHub Pages into `out/` |
| `npm run lint` | ESLint (Next.js core-web-vitals rules) |
| `npm test` | Unit tests (Vitest) |

`patch-package` looks unused but must stay: `@ybouane/liquidglass` (the glass effect) runs it when it installs, and `npm ci` fails without it.

## Deployment

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/pages.yml` (`npm ci` → `npm run pages:build` → upload `out/`). With `GITHUB_PAGES=1` the site is exported statically under the `/papp-web-liquid-glass` base path (see `next.config.mjs`).

### Build-time settings

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Access key for meeting-request emails (see `src/config/meeting.ts`) |
| `NEXT_PUBLIC_HUBSPOT_MEETINGS_URL` | HubSpot booking page; defaults to the value in `src/config/meeting.ts` |
| `NEXT_PUBLIC_DEBUG_MOBILITY_CITY` | `true` keeps orbit controls on in 3D close-ups (debugging only) |

## Project structure

```
src/
  app/[locale]/      Pages (en, da): home, solutions, products, services, projects, app, about, contact, privacy
  components/        UI by area (hero, offerings, projects, layout, …)
  content/           All page copy and data, English + Danish
  config/            Site settings: meeting/booking, 3D city scene
  lib/               Helpers: i18n, SEO metadata, booking, validation
  styles/            Sass: tokens, Bootstrap overrides, globals, glass surfaces, refinements
public/
  images/            Photos, logos, illustrations
  models/            3D models (city scene, parking sensor)
tests/               Vitest unit tests
docs/                Open items before replacing the current site
```

### Editing content

Text lives in `src/content/` as typed objects with `en` and `da` fields, e.g. projects in `src/content/projects/projects.ts`. Images are referenced by their path under `public/`.

### 3D city scene (Solutions page)

- Model: `public/models/papp-city.glb`, exported from Blender and compressed with gltf-transform.
- Positions, camera views, the live dashboard texts and the FREE sign live in `src/config/mobility-city.ts`.
- Scene code is in `src/components/hero/MobilityCity*.tsx`.
- Blender opacity animations don't survive glTF export, so the +1 / −1 counters are faded in code (`CITY_COUNTER_FADES`, seconds = frame ÷ 24).
- Before re-exporting from Blender, run *Mesh → Normals → Recalculate Outside* on the ground pieces, or they will shadow themselves.
